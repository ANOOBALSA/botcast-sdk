import { BotcastClientConfig } from './types/index.js';
import { InstancesModule } from './modules/instances.js';
import { MessagesModule } from './modules/messages.js';
import { ChatsModule } from './modules/chats.js';
import { GroupsModule } from './modules/groups.js';
import { ProfileModule } from './modules/profile.js';
import { BroadcastModule } from './modules/broadcast.js';
import { BotcastWebhook } from './webhooks/index.js';
export declare class BotcastClient {
    private config;
    /** Instance Lifecycle & Connection Management */
    instances: InstancesModule;
    /** WhatsApp Message Dispatcher (Text, OTP, Media, Polls, Reactions, etc.) */
    messages: MessagesModule;
    /** Chats, Contacts, History, and Chat State Management */
    chats: ChatsModule;
    /** WhatsApp Group Operations & Administration */
    groups: GroupsModule;
    /** Profile, Avatar, About Status, and Privacy Settings */
    profile: ProfileModule;
    /** WhatsApp Status Stories & Broadcast Lists */
    broadcast: BroadcastModule;
    /** Webhook Handler & Middleware */
    webhook: BotcastWebhook;
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
    constructor(config: BotcastClientConfig);
    /**
     * Shortcut to send a text message.
     */
    sendText(recipient: string, text: string): Promise<import("./types/messages.js").SendMessageResponse>;
    /**
     * Shortcut to send an automated OTP verification code.
     */
    sendOTP(recipient: string, options?: {
        code?: string;
        appName?: string;
        expiryMinutes?: number;
    }): Promise<import("./types/messages.js").SendMessageResponse & {
        codeSent: string;
    }>;
    /**
     * Shortcut to check instance connectivity status.
     */
    getStatus(): Promise<import("./types/instances.js").InstanceStatusResponse>;
}
//# sourceMappingURL=client.d.ts.map