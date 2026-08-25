import { BaseModule } from './base.js';
export class BroadcastModule extends BaseModule {
    /**
     * Publishes a WhatsApp Status / Story (Text, Image, Video, or Audio).
     */
    async sendStatusStory(content, options) {
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
    async getListInfo(listJid) {
        return this.request({
            method: 'GET',
            path: this.buildPath('broadcast/list-info'),
            query: { jid: listJid },
        });
    }
}
