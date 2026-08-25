import { BaseModule } from './base.js';
import {
  InstanceStatusResponse,
  InstanceQRResponse,
  PairCodeResponse,
  AllowedNumbersResponse,
  SetAllowedNumbersResponse,
  CheckNumberResponse,
  PresenceOptions,
  InstanceLimitsResponse,
  UpdateLimitsPayload,
} from '../types/index.js';

export class InstancesModule extends BaseModule {
  /**
   * Retrieves the current live status of the WhatsApp instance.
   */
  public async getStatus(): Promise<InstanceStatusResponse> {
    return this.request<InstanceStatusResponse>({
      method: 'GET',
      path: this.buildPath('status'),
    });
  }

  /**
   * Fetches or generates a QR code string for device pairing.
   */
  public async getQR(): Promise<InstanceQRResponse> {
    return this.request<InstanceQRResponse>({
      method: 'GET',
      path: this.buildPath('qr'),
    });
  }

  /**
   * Generates an 8-digit phone pairing code for headless WhatsApp linking without scanning QR.
   *
   * @param phoneNumber Recipient phone number with country code (e.g. `201000000000` or `15551234567`)
   */
  public async pairWithCode(phoneNumber: string): Promise<PairCodeResponse> {
    return this.request<PairCodeResponse>({
      method: 'POST',
      path: this.buildPath('pair-code'),
      body: { phoneNumber },
    });
  }

  /**
   * Boots up the WhatsApp socket connection.
   *
   * @param force Force restart if already running
   */
  public async start(force: boolean = false): Promise<{ success: boolean; instanceId: string; status: string; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('start'),
      body: { force },
    });
  }

  /**
   * Stops the active WhatsApp socket session.
   */
  public async stop(): Promise<{ success: boolean; instanceId: string; status: string; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('stop'),
    });
  }

  /**
   * Logs out from WhatsApp and clears session keys.
   */
  public async logout(): Promise<{ success: boolean; instanceId: string; status: string; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('logout'),
    });
  }

  /**
   * Gets the list of allowed sandbox recipient phone numbers (for Dev instances).
   */
  public async getAllowedNumbers(): Promise<AllowedNumbersResponse> {
    return this.request<AllowedNumbersResponse>({
      method: 'GET',
      path: this.buildPath('allowed-numbers'),
    });
  }

  /**
   * Sets allowed sandbox phone numbers for a Dev instance.
   *
   * @param allowedNumbers Array of up to 3 phone numbers
   */
  public async setAllowedNumbers(allowedNumbers: string[]): Promise<SetAllowedNumbersResponse> {
    return this.request<SetAllowedNumbersResponse>({
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
  public async checkNumber(phoneNumber: string): Promise<CheckNumberResponse> {
    return this.request<CheckNumberResponse>({
      method: 'POST',
      path: this.buildPath('check-number'),
      body: { phone: phoneNumber },
    });
  }

  /**
   * Sets presence status (typing, recording audio, online/offline).
   */
  public async setPresence(options: PresenceOptions): Promise<{ success: boolean; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('presence'),
      body: options,
    });
  }

  /**
   * Gets the instance's daily rate limits configuration.
   */
  public async getLimits(): Promise<InstanceLimitsResponse> {
    return this.request<InstanceLimitsResponse>({
      method: 'GET',
      path: this.buildPath('limits'),
    });
  }

  /**
   * Updates safety daily message limits and new contact limits.
   *
   * @param limits Payload with daily_message_limit and/or daily_new_contacts_limit (0 disables limit)
   */
  public async updateLimits(limits: UpdateLimitsPayload): Promise<InstanceLimitsResponse & { success?: boolean; message?: string }> {
    const body: Record<string, any> = {};
    if (limits.daily_message_limit !== undefined) body.daily_message_limit = limits.daily_message_limit;
    if (limits.dailyMessageLimit !== undefined) body.daily_message_limit = limits.dailyMessageLimit;
    if (limits.daily_new_contacts_limit !== undefined) body.daily_new_contacts_limit = limits.daily_new_contacts_limit;
    if (limits.dailyNewContactsLimit !== undefined) body.daily_new_contacts_limit = limits.dailyNewContactsLimit;

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
  public async setDailyMessageLimit(limit: number): Promise<InstanceLimitsResponse & { success?: boolean; message?: string }> {
    return this.updateLimits({ daily_message_limit: limit });
  }

  /**
   * Sets the maximum number of new recipient phone numbers that can be messaged per calendar day.
   *
   * @param limit New contacts limit per day (pass `0` for unlimited).
   */
  public async setDailyNewContactsLimit(limit: number): Promise<InstanceLimitsResponse & { success?: boolean; message?: string }> {
    return this.updateLimits({ daily_new_contacts_limit: limit });
  }

  /**
   * Triggers contact & message sync from WhatsApp.
   */
  public async sync(): Promise<{ success: boolean; message: string; contactsCount?: number }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('sync'),
    });
  }
}
