import { BotcastClientConfig } from './types/index.js';
import { InstancesModule } from './modules/instances.js';
import { MessagesModule } from './modules/messages.js';
import { ChatsModule } from './modules/chats.js';
import { GroupsModule } from './modules/groups.js';
import { ProfileModule } from './modules/profile.js';
import { BroadcastModule } from './modules/broadcast.js';
import { BotcastWebhook } from './webhooks/index.js';

export class BotcastClient {
  private config: Required<BotcastClientConfig>;

  /** Instance Lifecycle & Connection Management */
  public instances: InstancesModule;

  /** WhatsApp Message Dispatcher (Text, OTP, Media, Polls, Reactions, etc.) */
  public messages: MessagesModule;

  /** Chats, Contacts, History, and Chat State Management */
  public chats: ChatsModule;

  /** WhatsApp Group Operations & Administration */
  public groups: GroupsModule;

  /** Profile, Avatar, About Status, and Privacy Settings */
  public profile: ProfileModule;

  /** WhatsApp Status Stories & Broadcast Lists */
  public broadcast: BroadcastModule;

  /** Webhook Handler & Middleware */
  public webhook: BotcastWebhook;

  /**
   * Initializes a new Botcast API Client.
   *
   * @param config Client configuration options
   *
   * @example
   * ```ts
   * import { BotcastClient } from 'botcast-sdk';
   *
   * const botcast = new BotcastClient({
   *   baseUrl: 'https://botcast.site',
   *   instanceId: 'inst_abc123',
   *   instanceToken: 'token_xyz789'
   * });
   *
   * // Send a text message
   * await botcast.messages.sendText('201000000000', 'Hello from Botcast SDK!');
   * ```
   */
  constructor(config: BotcastClientConfig) {
    if (!config.instanceId) {
      throw new Error('BotcastClient requires a valid "instanceId"');
    }
    if (!config.instanceToken) {
      throw new Error('BotcastClient requires a valid "instanceToken"');
    }

    this.config = {
      baseUrl: config.baseUrl || 'https://botcast.site',
      instanceId: config.instanceId,
      instanceToken: config.instanceToken,
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries ?? 2,
      headers: config.headers || {},
    };

    this.instances = new InstancesModule(this.config);
    this.messages = new MessagesModule(this.config);
    this.chats = new ChatsModule(this.config);
    this.groups = new GroupsModule(this.config);
    this.profile = new ProfileModule(this.config);
    this.broadcast = new BroadcastModule(this.config);
    this.webhook = new BotcastWebhook();
  }

  // =========================================================================
  // Top-Level Convenience Shortcuts
  // =========================================================================

  /**
   * Shortcut to send a text message.
   */
  public async sendText(recipient: string, text: string) {
    return this.messages.sendText(recipient, text);
  }

  /**
   * Shortcut to send an automated OTP verification code.
   */
  public async sendOTP(recipient: string, options?: { code?: string; appName?: string; expiryMinutes?: number }) {
    return this.messages.sendOTP(recipient, options);
  }

  /**
   * Shortcut to check instance connectivity status.
   */
  public async getStatus() {
    return this.instances.getStatus();
  }
}
