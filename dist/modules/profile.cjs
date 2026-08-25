"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModule = void 0;
const base_js_1 = require("./base.js");
class ProfileModule extends base_js_1.BaseModule {
    /**
     * Fetches the bio / text status of a phone number or the current instance.
     */
    async getStatus(targetPhoneOrJid) {
        return this.request({
            method: 'GET',
            path: this.buildPath('profile/status'),
            query: targetPhoneOrJid ? { phone: targetPhoneOrJid } : undefined,
        });
    }
    /**
     * Updates the about / bio status of the connected WhatsApp instance.
     */
    async setStatus(status) {
        return this.request({
            method: 'POST',
            path: this.buildPath('profile/status'),
            body: { status },
        });
    }
    /**
     * Updates the public display name of the instance.
     */
    async setName(name) {
        return this.request({
            method: 'POST',
            path: this.buildPath('profile/name'),
            body: { name },
        });
    }
    /**
     * Fetches the profile picture URL of a contact or group.
     */
    async getPicture(targetPhoneOrJid, highRes = false) {
        return this.request({
            method: 'GET',
            path: this.buildPath('profile/picture'),
            query: {
                phone: targetPhoneOrJid,
                highRes,
            },
        });
    }
    /**
     * Updates the profile picture for the instance or a group.
     */
    async setPicture(imageSource, targetJid) {
        return this.request({
            method: 'POST',
            path: this.buildPath('profile/picture'),
            body: { jid: targetJid, ...imageSource },
        });
    }
    /**
     * Removes the profile picture.
     */
    async removePicture(targetJid) {
        return this.request({
            method: 'DELETE',
            path: this.buildPath('profile/picture'),
            body: { jid: targetJid },
        });
    }
    /**
     * Fetches WhatsApp Business profile information (category, email, hours).
     */
    async getBusinessProfile(targetPhoneOrJid) {
        return this.request({
            method: 'GET',
            path: this.buildPath('profile/business'),
            query: { phone: targetPhoneOrJid },
        });
    }
    /**
     * Blocks a user on WhatsApp.
     */
    async block(targetPhoneOrJid) {
        return this.request({
            method: 'POST',
            path: this.buildPath('privacy/block'),
            body: { phone: targetPhoneOrJid, action: 'block' },
        });
    }
    /**
     * Unblocks a previously blocked user.
     */
    async unblock(targetPhoneOrJid) {
        return this.request({
            method: 'POST',
            path: this.buildPath('privacy/block'),
            body: { phone: targetPhoneOrJid, action: 'unblock' },
        });
    }
    /**
     * Fetches the full blocklist.
     */
    async getBlocklist() {
        return this.request({
            method: 'GET',
            path: this.buildPath('privacy/blocklist'),
        });
    }
    /**
     * Fetches WhatsApp privacy settings.
     */
    async getPrivacySettings(force = false) {
        return this.request({
            method: 'GET',
            path: this.buildPath('privacy/settings'),
            query: { force },
        });
    }
    /**
     * Updates a WhatsApp privacy configuration (lastSeen, online, profilePicture, status, readReceipts).
     */
    async updatePrivacySetting(type, value) {
        return this.request({
            method: 'POST',
            path: this.buildPath('privacy/update'),
            body: { type, value },
        });
    }
}
exports.ProfileModule = ProfileModule;
