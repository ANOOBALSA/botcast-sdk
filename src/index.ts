export { BotcastClient } from './client.js';
export { BotcastWebhook } from './webhooks/index.js';
export * from './errors.js';
export * from './types/index.js';

// Default export
import { BotcastClient } from './client.js';
export default BotcastClient;
