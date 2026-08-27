"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseModule = void 0;
const errors_js_1 = require("../errors.js");
class BaseModule {
    config;
    constructor(config) {
        this.config = config;
    }
    /**
     * Builds the instance-specific URL path prefix: `/:platform/:instanceId/:instanceToken/...`
     */
    buildPath(subPath) {
        const platform = this.config.platform || 'whatsapp';
        const cleanSubPath = subPath.startsWith('/') ? subPath.slice(1) : subPath;
        return `/${platform}/${encodeURIComponent(this.config.instanceId)}/${encodeURIComponent(this.config.instanceToken)}/${cleanSubPath}`;
    }
    /**
     * Executes an HTTP request against the Botcast API Gateway with retry & error translation.
     */
    async request(options) {
        const { method = 'GET', path, query, body, headers } = options;
        let urlString = `${this.config.baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : '/' + path}`;
        if (query) {
            const url = new URL(urlString);
            for (const [key, value] of Object.entries(query)) {
                if (value !== undefined && value !== null) {
                    url.searchParams.append(key, String(value));
                }
            }
            urlString = url.toString();
        }
        const fetchHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...this.config.headers,
            ...headers,
        };
        let attempts = 0;
        const maxAttempts = (this.config.maxRetries || 0) + 1;
        while (attempts < maxAttempts) {
            attempts++;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
            try {
                const response = await fetch(urlString, {
                    method,
                    headers: fetchHeaders,
                    body: body ? JSON.stringify(body) : undefined,
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                let responseData;
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    responseData = await response.json().catch(() => null);
                }
                else {
                    responseData = await response.text().catch(() => '');
                }
                if (!response.ok) {
                    this.handleHttpError(response.status, responseData);
                }
                return responseData;
            }
            catch (err) {
                clearTimeout(timeoutId);
                // Don't retry client-side errors or authentication failures
                if (err instanceof errors_js_1.BotcastAuthError ||
                    err instanceof errors_js_1.BotcastPaymentRequiredError ||
                    err instanceof errors_js_1.BotcastSubscriptionExpiredError ||
                    err instanceof errors_js_1.BotcastValidationError ||
                    err instanceof errors_js_1.BotcastNotFoundError) {
                    throw err;
                }
                if (attempts >= maxAttempts) {
                    if (err instanceof errors_js_1.BotcastError) {
                        throw err;
                    }
                    throw new errors_js_1.BotcastError(err.name === 'AbortError'
                        ? `Request timed out after ${this.config.timeout}ms`
                        : `HTTP Request failed: ${err.message || 'Unknown network error'}`, undefined, err);
                }
                // Exponential backoff before retry (e.g. 500ms, 1000ms)
                const delay = Math.min(500 * Math.pow(2, attempts - 1), 3000);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
        throw new errors_js_1.BotcastError('Request failed after max retry attempts');
    }
    handleHttpError(status, data) {
        const message = data?.message || data?.error || (typeof data === 'string' ? data : `HTTP ${status}`);
        switch (status) {
            case 400:
                throw new errors_js_1.BotcastValidationError(message, data);
            case 401:
                throw new errors_js_1.BotcastAuthError(message, data);
            case 402:
                throw new errors_js_1.BotcastPaymentRequiredError(message, data);
            case 403:
                if (data?.expired) {
                    throw new errors_js_1.BotcastSubscriptionExpiredError(message, data.expires_at, data);
                }
                throw new errors_js_1.BotcastError(message, 403, data);
            case 404:
                throw new errors_js_1.BotcastNotFoundError(message, data);
            case 429:
                throw new errors_js_1.BotcastRateLimitError(message, data);
            default:
                throw new errors_js_1.BotcastError(message, status, data);
        }
    }
}
exports.BaseModule = BaseModule;
