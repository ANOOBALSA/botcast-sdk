export class BotcastWebhook {
    handlers = new Map();
    /**
     * Registers a callback for incoming messages.
     */
    onMessage(handler) {
        return this.on('message_received', handler);
    }
    /**
     * Registers a callback for any event type.
     */
    on(event, handler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, new Set());
        }
        this.handlers.get(event).add(handler);
        return this;
    }
    /**
     * Dispatches and processes a raw webhook event body.
     */
    async handleEvent(event) {
        if (!event || !event.event)
            return;
        // Trigger specific event handlers
        const specificHandlers = this.handlers.get(event.event);
        if (specificHandlers) {
            for (const handler of specificHandlers) {
                await handler(event);
            }
        }
        // Trigger wildcard '*' handlers
        const wildcardHandlers = this.handlers.get('*');
        if (wildcardHandlers) {
            for (const handler of wildcardHandlers) {
                await handler(event);
            }
        }
    }
    /**
     * Express / Connect compatible middleware:
     *
     * @example
     * ```ts
     * app.post('/webhook', botcast.webhook.middleware());
     * ```
     */
    middleware() {
        return async (req, res, next) => {
            try {
                const body = req.body;
                if (body && body.event) {
                    await this.handleEvent(body);
                }
                res.status(200).json({ received: true });
            }
            catch (err) {
                if (typeof next === 'function') {
                    next(err);
                }
                else {
                    res.status(500).json({ error: 'Webhook processing failed', message: err.message });
                }
            }
        };
    }
}
