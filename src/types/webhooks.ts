export interface WebhookMessageReceivedEvent {
  event: 'message_received';
  instanceId: string;
  sender: string;
  senderJid: string;
  pushName?: string;
  message: string;
  raw?: any;
  timestamp: string;
}

export type WebhookEvent = WebhookMessageReceivedEvent | { event: string; instanceId: string; [key: string]: any };

export type WebhookHandler<T = WebhookEvent> = (event: T) => void | Promise<void>;
