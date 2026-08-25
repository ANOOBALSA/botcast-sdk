import { InstancesModule } from './modules/instances.js';
import { MessagesModule } from './modules/messages.js';
import { ChatsModule } from './modules/chats.js';
import { GroupsModule } from './modules/groups.js';
import { ProfileModule } from './modules/profile.js';
import { BroadcastModule } from './modules/broadcast.js';
import { BotcastWebhook } from './webhooks/index.js';
export class BotcastClient {
    config;
    /** Instance Lifecycle & Connection Management */
    instances;
    /** WhatsApp Message Dispatcher (Text, OTP, Media, Polls, Reactions, etc.) */
    messages;
    /** Chats, Contacts, History, and Chat State Management */
    chats;
    /** WhatsApp Group Operations & Administration */
    groups;
    /** Profile, Avatar, About Status, and Privacy Settings */
    profile;
    /** WhatsApp Status Stories & Broadcast Lists */
    broadcast;
    /** Webhook Handler & Middleware */
    webhook;
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
    constructor(config) {
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
    async sendText(recipient, text) {
        return this.messages.sendText(recipient, text);
    }
    /**
     * Shortcut to send an automated OTP verification code.
     */
    async sendOTP(recipient, options) {
        return this.messages.sendOTP(recipient, options);
    }
    /**
     * Shortcut to check instance connectivity status.
     */
    async getStatus() {
        return this.instances.getStatus();
    }
}
