import { BaseModule } from './base.js';
export class ChatsModule extends BaseModule {
    /**
     * Lists synced WhatsApp chats with optional search and pagination.
     */
    async list(params) {
        return this.request({
            method: 'GET',
            path: this.buildPath('chats'),
            query: params,
        });
    }
    /**
     * Lists synced WhatsApp contacts.
     */
    async listContacts(params) {
        return this.request({
            method: 'GET',
            path: this.buildPath('contacts'),
            query: params,
        });
    }
    /**
     * Lists synced chat messages.
     */
    async listMessages(params) {
        return this.request({
            method: 'GET',
            path: this.buildPath('messages'),
            query: params,
        });
    }
    /**
     * Modifies a chat state (archive, mute, read, pin, star, delete).
     */
    async modify(options) {
        return this.request({
            method: 'POST',
            path: this.buildPath('chats/modify'),
            body: options,
        });
    }
    /**
     * Archives a chat.
     */
    async archive(targetJid) {
        return this.modify({ jid: targetJid, action: 'archive' });
    }
    /**
     * Unarchives a chat.
     */
    async unarchive(targetJid) {
        return this.modify({ jid: targetJid, action: 'unarchive' });
    }
    /**
     * Mutes chat notifications for a specified duration in milliseconds (default: 8 hours).
     */
    async mute(targetJid, durationMs = 8 * 60 * 60 * 1000) {
        return this.modify({ jid: targetJid, action: 'mute', duration: durationMs });
    }
    /**
     * Unmutes chat notifications.
     */
    async unmute(targetJid) {
        return this.modify({ jid: targetJid, action: 'unmute' });
    }
    /**
     * Pins a chat to the top of the chat list.
     */
    async pin(targetJid) {
        return this.modify({ jid: targetJid, action: 'pin', isPin: true });
    }
    /**
     * Unpins a chat from the top.
     */
    async unpin(targetJid) {
        return this.modify({ jid: targetJid, action: 'unpin' });
    }
    /**
     * Deletes an entire chat conversation.
     */
    async deleteChat(targetJid) {
        return this.modify({ jid: targetJid, action: 'delete_chat' });
    }
    /**
     * Configures disappearing messages for a chat.
     *
     * @param recipient Target chat JID or phone number
     * @param duration Duration in seconds (86400: 24h, 604800: 7d, 7776000: 90d)
     * @param enabled Whether disappearing messages is enabled (default: true)
     */
    async setDisappearing(recipient, duration = 86400, enabled = true) {
        return this.request({
            method: 'POST',
            path: this.buildPath('chats/disappearing'),
            body: { recipient, duration, enabled },
        });
    }
    /**
     * Requests older chat history from the linked phone.
     */
    async fetchHistory(options) {
        return this.request({
            method: 'POST',
            path: this.buildPath('chats/fetch-history'),
            body: options || {},
        });
    }
}
