export declare class BotcastError extends Error {
    statusCode?: number;
    details?: any;
    constructor(message: string, statusCode?: number, details?: any);
}
export declare class BotcastAuthError extends BotcastError {
    constructor(message?: string, details?: any);
}
export declare class BotcastPaymentRequiredError extends BotcastError {
    constructor(message?: string, details?: any);
}
export declare class BotcastSubscriptionExpiredError extends BotcastError {
    expiresAt?: string;
    constructor(message?: string, expiresAt?: string, details?: any);
}
export declare class BotcastRateLimitError extends BotcastError {
    constructor(message?: string, details?: any);
}
export declare class BotcastValidationError extends BotcastError {
    constructor(message?: string, details?: any);
}
export declare class BotcastNotFoundError extends BotcastError {
    constructor(message?: string, details?: any);
}
//# sourceMappingURL=errors.d.ts.map