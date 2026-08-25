import { BaseModule } from './base.js';
import { ChatItem, ContactItem, SyncedMessageItem, ListChatsParams, ListContactsParams, ListMessagesParams, ChatModifyOptions, FetchHistoryOptions } from '../types/index.js';
export declare class ChatsModule extends BaseModule {
    /**
     * Lists synced WhatsApp chats with optional search and pagination.
     */
    list(params?: ListChatsParams): Promise<{
        instanceId: string;
        chats: ChatItem[];
        total: number;
    }>;
    /**
     * Lists synced WhatsApp contacts.
     */
    listContacts(params?: ListContactsParams): Promise<{
        instanceId: string;
        contacts: ContactItem[];
        total: number;
    }>;
    /**
     * Lists synced chat messages.
     */
    listMessages(params?: ListMessagesParams): Promise<{
        instanceId: string;
        messages: SyncedMessageItem[];
        total: number;
    }>;
    /**
     * Modifies a chat state (archive, mute, read, pin, star, delete).
     */
    modify(options: ChatModifyOptions): Promise<{
        success: boolean;
        message: string;
        result?: any;
    }>;
    /**
     * Archives a chat.
     */
    archive(targetJid: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Unarchives a chat.
     */
    unarchive(targetJid: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Mutes chat notifications for a specified duration in milliseconds (default: 8 hours).
     */
    mute(targetJid: string, durationMs?: number): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Unmutes chat notifications.
     */
    unmute(targetJid: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Pins a chat to the top of the chat list.
     */
    pin(targetJid: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Unpins a chat from the top.
     */
    unpin(targetJid: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Deletes an entire chat conversation.
     */
    deleteChat(targetJid: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Configures disappearing messages for a chat.
     *
     * @param recipient Target chat JID or phone number
     * @param duration Duration in seconds (86400: 24h, 604800: 7d, 7776000: 90d)
     * @param enabled Whether disappearing messages is enabled (default: true)
     */
    setDisappearing(recipient: string, duration?: number, enabled?: boolean): Promise<{
        success: boolean;
        message: string;
        result?: any;
    }>;
    /**
     * Requests older chat history from the linked phone.
     */
    fetchHistory(options?: FetchHistoryOptions): Promise<{
        success: boolean;
        message: string;
        result?: any;
    }>;
}
//# sourceMappingURL=chats.d.ts.map