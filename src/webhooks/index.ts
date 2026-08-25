import { WebhookEvent, WebhookMessageReceivedEvent, WebhookHandler } from '../types/index.js';

export class BotcastWebhook {
  private handlers: Map<string, Set<WebhookHandler<any>>> = new Map();

  /**
   * Registers a callback for incoming messages.
   */
  public onMessage(handler: WebhookHandler<WebhookMessageReceivedEvent>): this {
    return this.on('message_received', handler);
  }

  /**
   * Registers a callback for any event type.
   */
  public on<T = WebhookEvent>(event: string, handler: WebhookHandler<T>): this {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
    return this;
  }

  /**
   * Dispatches and processes a raw webhook event body.
   */
  public async handleEvent(event: WebhookEvent): Promise<void> {
    if (!event || !event.event) return;

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
  public middleware() {
    return async (req: any, res: any, next?: any) => {
      try {
        const body = req.body;
        if (body && body.event) {
          await this.handleEvent(body);
        }
        res.status(200).json({ received: true });
      } catch (err: any) {
        if (typeof next === 'function') {
          next(err);
        } else {
          res.status(500).json({ error: 'Webhook processing failed', message: err.message });
        }
      }
    };
  }
}
