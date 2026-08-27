import { BaseModule } from './base.js';
export class InstancesModule extends BaseModule {
    /**
     * Retrieves the current live status of the WhatsApp instance.
     */
    async getStatus() {
        return this.request({
            method: 'GET',
            path: this.buildPath('status'),
        });
    }
    /**
     * Fetches or generates a QR code string for device pairing.
     */
    async getQR() {
        return this.request({
            method: 'GET',
            path: this.buildPath('qr'),
        });
    }
    /**
     * Generates a pairing / login code for phone number authentication.
     *
     * @param phoneNumber Phone number with country code (e.g. `201000000000` or `15551234567`)
     */
    async pairWithCode(phoneNumber) {
        return this.request({
            method: 'POST',
            path: this.buildPath('pair-code'),
            body: { phoneNumber },
        });
    }
    /**
     * Completes phone code verification (e.g. for Telegram login with optional 2FA password).
     */
    async verifyCode(phoneNumber, code, password) {
        return this.request({
            method: 'POST',
            path: this.buildPath('verify-code'),
            body: { phoneNumber, code, password },
        });
    }
    /**
     * Boots up the WhatsApp socket connection.
     *
     * @param force Force restart if already running
     */
    async start(force = false) {
        return this.request({
            method: 'POST',
            path: this.buildPath('start'),
            body: { force },
        });
    }
    /**
     * Stops the active WhatsApp socket session.
     */
    async stop() {
        return this.request({
            method: 'POST',
            path: this.buildPath('stop'),
        });
    }
    /**
     * Logs out from WhatsApp and clears session keys.
     */
    async logout() {
        return this.request({
            method: 'POST',
            path: this.buildPath('logout'),
        });
    }
    /**
     * Gets the list of allowed sandbox recipient phone numbers (for Dev instances).
     */
    async getAllowedNumbers() {
        return this.request({
            method: 'GET',
            path: this.buildPath('allowed-numbers'),
        });
    }
    /**
     * Sets allowed sandbox phone numbers for a Dev instance.
     *
     * @param allowedNumbers Array of up to 3 phone numbers
     */
    async setAllowedNumbers(allowedNumbers) {
        return this.request({
            method: 'POST',
            path: this.buildPath('allowed-numbers'),
            body: { allowed_numbers: allowedNumbers },
        });
    }
    /**
     * Verifies if a phone number exists on WhatsApp and gets their JID / avatar.
     *
     * @param phoneNumber The phone number to check (with country code)
     */
    async checkNumber(phoneNumber) {
        return this.request({
            method: 'POST',
            path: this.buildPath('check-number'),
            body: { phone: phoneNumber },
        });
    }
    /**
     * Sets presence status (typing, recording audio, online/offline).
     */
    async setPresence(options) {
        return this.request({
            method: 'POST',
            path: this.buildPath('presence'),
            body: options,
        });
    }
    /**
     * Gets the instance's daily rate limits configuration.
     */
    async getLimits() {
        return this.request({
            method: 'GET',
            path: this.buildPath('limits'),
        });
    }
    /**
     * Updates safety daily message limits and new contact limits.
     *
     * @param limits Payload with daily_message_limit and/or daily_new_contacts_limit (0 disables limit)
     */
    async updateLimits(limits) {
        const body = {};
        if (limits.daily_message_limit !== undefined)
            body.daily_message_limit = limits.daily_message_limit;
        if (limits.dailyMessageLimit !== undefined)
            body.daily_message_limit = limits.dailyMessageLimit;
        if (limits.daily_new_contacts_limit !== undefined)
            body.daily_new_contacts_limit = limits.daily_new_contacts_limit;
        if (limits.dailyNewContactsLimit !== undefined)
            body.daily_new_contacts_limit = limits.dailyNewContactsLimit;
        return this.request({
            method: 'POST',
            path: this.buildPath('limits'),
            body,
        });
    }
    /**
     * Sets the maximum number of WhatsApp messages that can be dispatched per calendar day.
     *
     * @param limit Message count limit per day (pass `0` for unlimited).
     */
    async setDailyMessageLimit(limit) {
        return this.updateLimits({ daily_message_limit: limit });
    }
    /**
     * Sets the maximum number of new recipient phone numbers that can be messaged per calendar day.
     *
     * @param limit New contacts limit per day (pass `0` for unlimited).
     */
    async setDailyNewContactsLimit(limit) {
        return this.updateLimits({ daily_new_contacts_limit: limit });
    }
    /**
     * Triggers contact & message sync from WhatsApp.
     */
    async sync() {
        return this.request({
            method: 'POST',
            path: this.buildPath('sync'),
        });
    }
}
