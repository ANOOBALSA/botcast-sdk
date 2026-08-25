import { BaseModule } from './base.js';
import { BroadcastStoryOptions } from '../types/index.js';
export declare class BroadcastModule extends BaseModule {
    /**
     * Publishes a WhatsApp Status / Story (Text, Image, Video, or Audio).
     */
    sendStatusStory(content: {
        text?: string;
        message?: string;
        url?: string;
        base64?: string;
        type?: 'text' | 'image' | 'video' | 'audio';
        caption?: string;
    }, options?: BroadcastStoryOptions): Promise<{
        success: boolean;
        message: string;
        result?: any;
    }>;
    /**
     * Retrieves info about a WhatsApp broadcast list.
     */
    getListInfo(listJid: string): Promise<{
        success: boolean;
        listInfo: any;
    }>;
}
//# sourceMappingURL=broadcast.d.ts.map