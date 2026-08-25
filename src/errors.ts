export class BotcastError extends Error {
  public statusCode?: number;
  public details?: any;

  constructor(message: string, statusCode?: number, details?: any) {
    super(message);
    this.name = 'BotcastError';
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BotcastAuthError extends BotcastError {
  constructor(message: string = 'Unauthorized: Invalid instance credentials', details?: any) {
    super(message, 401, details);
    this.name = 'BotcastAuthError';
  }
}

export class BotcastPaymentRequiredError extends BotcastError {
  constructor(message: string = 'Payment Required: Instance is awaiting payment confirmation', details?: any) {
    super(message, 402, details);
    this.name = 'BotcastPaymentRequiredError';
  }
}

export class BotcastSubscriptionExpiredError extends BotcastError {
  public expiresAt?: string;

  constructor(message: string = 'Subscription Expired', expiresAt?: string, details?: any) {
    super(message, 403, details);
    this.name = 'BotcastSubscriptionExpiredError';
    this.expiresAt = expiresAt;
  }
}

export class BotcastRateLimitError extends BotcastError {
  constructor(message: string = 'Rate limit exceeded', details?: any) {
    super(message, 429, details);
    this.name = 'BotcastRateLimitError';
  }
}

export class BotcastValidationError extends BotcastError {
  constructor(message: string = 'Validation Error: Invalid parameters provided', details?: any) {
    super(message, 400, details);
    this.name = 'BotcastValidationError';
  }
}

export class BotcastNotFoundError extends BotcastError {
  constructor(message: string = 'Not Found: Resource or instance does not exist', details?: any) {
    super(message, 404, details);
    this.name = 'BotcastNotFoundError';
  }
}
