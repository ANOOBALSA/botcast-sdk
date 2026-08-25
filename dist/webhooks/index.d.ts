import { WebhookEvent, WebhookMessageReceivedEvent, WebhookHandler } from '../types/index.js';
export declare class BotcastWebhook {
    private handlers;
    /**
     * Registers a callback for incoming messages.
     */
    onMessage(handler: WebhookHandler<WebhookMessageReceivedEvent>): this;
    /**
     * Registers a callback for any event type.
     */
    on<T = WebhookEvent>(event: string, handler: WebhookHandler<T>): this;
    /**
     * Dispatches and processes a raw webhook event body.
     */
    handleEvent(event: WebhookEvent): Promise<void>;
    /**
     * Express / Connect compatible middleware:
     *
     * @example
     * ```ts
     * app.post('/webhook', botcast.webhook.middleware());
     * ```
     */
    middleware(): (req: any, res: any, next?: any) => Promise<void>;
}
//# sourceMappingURL=index.d.ts.map