"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastModule = void 0;
const base_js_1 = require("./base.js");
class BroadcastModule extends base_js_1.BaseModule {
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
exports.BroadcastModule = BroadcastModule;
