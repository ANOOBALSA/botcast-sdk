import { BaseModule } from './base.js';
import { InstanceStatusResponse, InstanceQRResponse, PairCodeResponse, AllowedNumbersResponse, SetAllowedNumbersResponse, CheckNumberResponse, PresenceOptions, InstanceLimitsResponse, UpdateLimitsPayload } from '../types/index.js';
export declare class InstancesModule extends BaseModule {
    /**
     * Retrieves the current live status of the WhatsApp instance.
     */
    getStatus(): Promise<InstanceStatusResponse>;
    /**
     * Fetches or generates a QR code string for device pairing.
     */
    getQR(): Promise<InstanceQRResponse>;
    /**
     * Generates a pairing / login code for phone number authentication.
     *
     * @param phoneNumber Phone number with country code (e.g. `201000000000` or `15551234567`)
     */
    pairWithCode(phoneNumber: string): Promise<PairCodeResponse>;
    /**
     * Completes phone code verification (e.g. for Telegram login with optional 2FA password).
     */
    verifyCode(phoneNumber: string, code: string, password?: string): Promise<{
        success: boolean;
        status: string;
        user?: any;
        message?: string;
    }>;
    /**
     * Boots up the WhatsApp socket connection.
     *
     * @param force Force restart if already running
     */
    start(force?: boolean): Promise<{
        success: boolean;
        instanceId: string;
        status: string;
        message: string;
    }>;
    /**
     * Stops the active WhatsApp socket session.
     */
    stop(): Promise<{
        success: boolean;
        instanceId: string;
        status: string;
        message: string;
    }>;
    /**
     * Logs out from WhatsApp and clears session keys.
     */
    logout(): Promise<{
        success: boolean;
        instanceId: string;
        status: string;
        message: string;
    }>;
    /**
     * Gets the list of allowed sandbox recipient phone numbers (for Dev instances).
     */
    getAllowedNumbers(): Promise<AllowedNumbersResponse>;
    /**
     * Sets allowed sandbox phone numbers for a Dev instance.
     *
     * @param allowedNumbers Array of up to 3 phone numbers
     */
    setAllowedNumbers(allowedNumbers: string[]): Promise<SetAllowedNumbersResponse>;
    /**
     * Verifies if a phone number exists on WhatsApp and gets their JID / avatar.
     *
     * @param phoneNumber The phone number to check (with country code)
     */
    checkNumber(phoneNumber: string): Promise<CheckNumberResponse>;
    /**
     * Sets presence status (typing, recording audio, online/offline).
     */
    setPresence(options: PresenceOptions): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Gets the instance's daily rate limits configuration.
     */
    getLimits(): Promise<InstanceLimitsResponse>;
    /**
     * Updates safety daily message limits and new contact limits.
     *
     * @param limits Payload with daily_message_limit and/or daily_new_contacts_limit (0 disables limit)
     */
    updateLimits(limits: UpdateLimitsPayload): Promise<InstanceLimitsResponse & {
        success?: boolean;
        message?: string;
    }>;
    /**
     * Sets the maximum number of WhatsApp messages that can be dispatched per calendar day.
     *
     * @param limit Message count limit per day (pass `0` for unlimited).
     */
    setDailyMessageLimit(limit: number): Promise<InstanceLimitsResponse & {
        success?: boolean;
        message?: string;
    }>;
    /**
     * Sets the maximum number of new recipient phone numbers that can be messaged per calendar day.
     *
     * @param limit New contacts limit per day (pass `0` for unlimited).
     */
    setDailyNewContactsLimit(limit: number): Promise<InstanceLimitsResponse & {
        success?: boolean;
        message?: string;
    }>;
    /**
     * Triggers contact & message sync from WhatsApp.
     */
    sync(): Promise<{
        success: boolean;
        message: string;
        contactsCount?: number;
    }>;
}
//# sourceMappingURL=instances.d.ts.map