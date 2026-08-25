export class BotcastError extends Error {
    statusCode;
    details;
    constructor(message, statusCode, details) {
        super(message);
        this.name = 'BotcastError';
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
export class BotcastAuthError extends BotcastError {
    constructor(message = 'Unauthorized: Invalid instance credentials', details) {
        super(message, 401, details);
        this.name = 'BotcastAuthError';
    }
}
export class BotcastPaymentRequiredError extends BotcastError {
    constructor(message = 'Payment Required: Instance is awaiting payment confirmation', details) {
        super(message, 402, details);
        this.name = 'BotcastPaymentRequiredError';
    }
}
export class BotcastSubscriptionExpiredError extends BotcastError {
    expiresAt;
    constructor(message = 'Subscription Expired', expiresAt, details) {
        super(message, 403, details);
        this.name = 'BotcastSubscriptionExpiredError';
        this.expiresAt = expiresAt;
    }
}
export class BotcastRateLimitError extends BotcastError {
    constructor(message = 'Rate limit exceeded', details) {
        super(message, 429, details);
        this.name = 'BotcastRateLimitError';
    }
}
export class BotcastValidationError extends BotcastError {
    constructor(message = 'Validation Error: Invalid parameters provided', details) {
        super(message, 400, details);
        this.name = 'BotcastValidationError';
    }
}
export class BotcastNotFoundError extends BotcastError {
    constructor(message = 'Not Found: Resource or instance does not exist', details) {
        super(message, 404, details);
        this.name = 'BotcastNotFoundError';
    }
}
