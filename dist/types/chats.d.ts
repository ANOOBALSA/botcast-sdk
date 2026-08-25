import { MessageKey } from './messages.js';
export interface ChatItem {
    id: string;
    name?: string;
    unreadCount?: number;
    readOnly?: boolean;
    ephemeralExpiration?: number;
    lastMessageTimestamp?: number;
}
export interface ContactItem {
    id: string;
    jid: string;
    phoneNumber: string;
    name?: string;
    notify?: string;
    updated_at?: string;
}
export interface SyncedMessageItem {
    id: string;
    instance_id: string;
    chat_jid: string;
    sender_jid: string;
    from_me: number;
    message_type: string;
    body: string;
    timestamp: number;
}
export interface ListChatsParams {
    search?: string;
    limit?: number;
    offset?: number;
}
export interface ListContactsParams {
    search?: string;
    limit?: number;
    offset?: number;
}
export interface ListMessagesParams {
    chatJid?: string;
    limit?: number;
    offset?: number;
}
export type ChatAction = 'archive' | 'unarchive' | 'mute' | 'unmute' | 'mark_read' | 'mark_unread' | 'delete_chat' | 'delete_for_me' | 'clear' | 'pin' | 'unpin' | 'star';
export interface ChatModifyOptions {
    jid?: string;
    chatJid?: string;
    recipient?: string;
    phone?: string;
    action?: ChatAction;
    modification?: any;
    duration?: number;
    isPin?: boolean;
    isStar?: boolean;
    lastMessages?: any[];
    messages?: any[];
}
export interface FetchHistoryOptions {
    count?: number;
    oldestMsgKey?: MessageKey;
    oldestMsgTimestamp?: number;
}
//# sourceMappingURL=chats.d.ts.map