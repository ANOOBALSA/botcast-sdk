import {
  BotcastError,
  BotcastAuthError,
  BotcastPaymentRequiredError,
  BotcastSubscriptionExpiredError,
  BotcastRateLimitError,
  BotcastValidationError,
  BotcastNotFoundError,
} from '../errors.js';
import { BotcastClientConfig } from '../types/index.js';

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
  path: string;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: any;
  headers?: Record<string, string>;
}

export class BaseModule {
  protected config: Required<BotcastClientConfig>;

  constructor(config: Required<BotcastClientConfig>) {
    this.config = config;
  }

  /**
   * Builds the instance-specific URL path prefix: `/:platform/:instanceId/:instanceToken/...`
   */
  protected buildPath(subPath: string): string {
    const platform = this.config.platform || 'whatsapp';
    const cleanSubPath = subPath.startsWith('/') ? subPath.slice(1) : subPath;
    return `/${platform}/${encodeURIComponent(this.config.instanceId)}/${encodeURIComponent(this.config.instanceToken)}/${cleanSubPath}`;
  }

  /**
   * Executes an HTTP request against the Botcast API Gateway with retry & error translation.
   */
  public async request<T = any>(options: RequestOptions): Promise<T> {
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

    const fetchHeaders: Record<string, string> = {
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

        let responseData: any;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json().catch(() => null);
        } else {
          responseData = await response.text().catch(() => '');
        }

        if (!response.ok) {
          this.handleHttpError(response.status, responseData);
        }

        return responseData as T;
      } catch (err: any) {
        clearTimeout(timeoutId);

        // Don't retry client-side errors or authentication failures
        if (
          err instanceof BotcastAuthError ||
          err instanceof BotcastPaymentRequiredError ||
          err instanceof BotcastSubscriptionExpiredError ||
          err instanceof BotcastValidationError ||
          err instanceof BotcastNotFoundError
        ) {
          throw err;
        }

        if (attempts >= maxAttempts) {
          if (err instanceof BotcastError) {
            throw err;
          }
          throw new BotcastError(
            err.name === 'AbortError'
              ? `Request timed out after ${this.config.timeout}ms`
              : `HTTP Request failed: ${err.message || 'Unknown network error'}`,
            undefined,
            err
          );
        }

        // Exponential backoff before retry (e.g. 500ms, 1000ms)
        const delay = Math.min(500 * Math.pow(2, attempts - 1), 3000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new BotcastError('Request failed after max retry attempts');
  }

  private handleHttpError(status: number, data: any): never {
    const message = data?.message || data?.error || (typeof data === 'string' ? data : `HTTP ${status}`);

    switch (status) {
      case 400:
        throw new BotcastValidationError(message, data);
      case 401:
        throw new BotcastAuthError(message, data);
      case 402:
        throw new BotcastPaymentRequiredError(message, data);
      case 403:
        if (data?.expired) {
          throw new BotcastSubscriptionExpiredError(message, data.expires_at, data);
        }
        throw new BotcastError(message, 403, data);
      case 404:
        throw new BotcastNotFoundError(message, data);
      case 429:
        throw new BotcastRateLimitError(message, data);
      default:
        throw new BotcastError(message, status, data);
    }
  }
}
