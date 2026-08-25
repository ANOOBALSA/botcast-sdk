import { BaseModule } from './base.js';
import { BroadcastStoryOptions } from '../types/index.js';

export class BroadcastModule extends BaseModule {
  /**
   * Publishes a WhatsApp Status / Story (Text, Image, Video, or Audio).
   */
  public async sendStatusStory(
    content: {
      text?: string;
      message?: string;
      url?: string;
      base64?: string;
      type?: 'text' | 'image' | 'video' | 'audio';
      caption?: string;
    },
    options?: BroadcastStoryOptions
  ): Promise<{ success: boolean; message: string; result?: any }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('broadcast/status'),
      body: {
        ...content,
        ...options,
      },
    });
  }

  /**
   * Retrieves info about a WhatsApp broadcast list.
   */
  public async getListInfo(listJid: string): Promise<{ success: boolean; listInfo: any }> {
    return this.request({
      method: 'GET',
      path: this.buildPath('broadcast/list-info'),
      query: { jid: listJid },
    });
  }
}
