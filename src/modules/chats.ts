import { BaseModule } from './base.js';
import {
  ChatItem,
  ContactItem,
  SyncedMessageItem,
  ListChatsParams,
  ListContactsParams,
  ListMessagesParams,
  ChatModifyOptions,
  FetchHistoryOptions,
} from '../types/index.js';

export class ChatsModule extends BaseModule {
  /**
   * Lists synced WhatsApp chats with optional search and pagination.
   */
  public async list(params?: ListChatsParams): Promise<{ instanceId: string; chats: ChatItem[]; total: number }> {
    return this.request({
      method: 'GET',
      path: this.buildPath('chats'),
      query: params as any,
    });
  }

  /**
   * Lists synced WhatsApp contacts.
   */
  public async listContacts(params?: ListContactsParams): Promise<{ instanceId: string; contacts: ContactItem[]; total: number }> {
    return this.request({
      method: 'GET',
      path: this.buildPath('contacts'),
      query: params as any,
    });
  }

  /**
   * Lists synced chat messages.
   */
  public async listMessages(params?: ListMessagesParams): Promise<{ instanceId: string; messages: SyncedMessageItem[]; total: number }> {
    return this.request({
      method: 'GET',
      path: this.buildPath('messages'),
      query: params as any,
    });
  }

  /**
   * Modifies a chat state (archive, mute, read, pin, star, delete).
   */
  public async modify(options: ChatModifyOptions): Promise<{ success: boolean; message: string; result?: any }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('chats/modify'),
      body: options,
    });
  }

  /**
   * Archives a chat.
   */
  public async archive(targetJid: string): Promise<{ success: boolean; message: string }> {
    return this.modify({ jid: targetJid, action: 'archive' });
  }

  /**
   * Unarchives a chat.
   */
  public async unarchive(targetJid: string): Promise<{ success: boolean; message: string }> {
    return this.modify({ jid: targetJid, action: 'unarchive' });
  }

  /**
   * Mutes chat notifications for a specified duration in milliseconds (default: 8 hours).
   */
  public async mute(targetJid: string, durationMs: number = 8 * 60 * 60 * 1000): Promise<{ success: boolean; message: string }> {
    return this.modify({ jid: targetJid, action: 'mute', duration: durationMs });
  }

  /**
   * Unmutes chat notifications.
   */
  public async unmute(targetJid: string): Promise<{ success: boolean; message: string }> {
    return this.modify({ jid: targetJid, action: 'unmute' });
  }

  /**
   * Pins a chat to the top of the chat list.
   */
  public async pin(targetJid: string): Promise<{ success: boolean; message: string }> {
    return this.modify({ jid: targetJid, action: 'pin', isPin: true });
  }

  /**
   * Unpins a chat from the top.
   */
  public async unpin(targetJid: string): Promise<{ success: boolean; message: string }> {
    return this.modify({ jid: targetJid, action: 'unpin' });
  }

  /**
   * Deletes an entire chat conversation.
   */
  public async deleteChat(targetJid: string): Promise<{ success: boolean; message: string }> {
    return this.modify({ jid: targetJid, action: 'delete_chat' });
  }

  /**
   * Configures disappearing messages for a chat.
   *
   * @param recipient Target chat JID or phone number
   * @param duration Duration in seconds (86400: 24h, 604800: 7d, 7776000: 90d)
   * @param enabled Whether disappearing messages is enabled (default: true)
   */
  public async setDisappearing(
    recipient: string,
    duration: number = 86400,
    enabled: boolean = true
  ): Promise<{ success: boolean; message: string; result?: any }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('chats/disappearing'),
      body: { recipient, duration, enabled },
    });
  }

  /**
   * Requests older chat history from the linked phone.
   */
  public async fetchHistory(options?: FetchHistoryOptions): Promise<{ success: boolean; message: string; result?: any }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('chats/fetch-history'),
      body: options || {},
    });
  }
}
