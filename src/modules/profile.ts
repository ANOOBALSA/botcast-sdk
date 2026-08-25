import { BaseModule } from './base.js';
import {
  BusinessProfile,
  PrivacySettings,
  PrivacySettingType,
  PrivacyValue,
} from '../types/index.js';

export class ProfileModule extends BaseModule {
  /**
   * Fetches the bio / text status of a phone number or the current instance.
   */
  public async getStatus(targetPhoneOrJid?: string): Promise<{ target: string; status: string }> {
    return this.request({
      method: 'GET',
      path: this.buildPath('profile/status'),
      query: targetPhoneOrJid ? { phone: targetPhoneOrJid } : undefined,
    });
  }

  /**
   * Updates the about / bio status of the connected WhatsApp instance.
   */
  public async setStatus(status: string): Promise<{ success: boolean; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('profile/status'),
      body: { status },
    });
  }

  /**
   * Updates the public display name of the instance.
   */
  public async setName(name: string): Promise<{ success: boolean; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('profile/name'),
      body: { name },
    });
  }

  /**
   * Fetches the profile picture URL of a contact or group.
   */
  public async getPicture(targetPhoneOrJid?: string, highRes: boolean = false): Promise<{ target: string; profilePictureUrl: string | null }> {
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
  public async setPicture(
    imageSource: { url?: string; base64?: string },
    targetJid?: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('profile/picture'),
      body: { jid: targetJid, ...imageSource },
    });
  }

  /**
   * Removes the profile picture.
   */
  public async removePicture(targetJid?: string): Promise<{ success: boolean; message: string }> {
    return this.request({
      method: 'DELETE',
      path: this.buildPath('profile/picture'),
      body: { jid: targetJid },
    });
  }

  /**
   * Fetches WhatsApp Business profile information (category, email, hours).
   */
  public async getBusinessProfile(targetPhoneOrJid: string): Promise<{ target: string; businessProfile: BusinessProfile }> {
    return this.request({
      method: 'GET',
      path: this.buildPath('profile/business'),
      query: { phone: targetPhoneOrJid },
    });
  }

  /**
   * Blocks a user on WhatsApp.
   */
  public async block(targetPhoneOrJid: string): Promise<{ success: boolean; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('privacy/block'),
      body: { phone: targetPhoneOrJid, action: 'block' },
    });
  }

  /**
   * Unblocks a previously blocked user.
   */
  public async unblock(targetPhoneOrJid: string): Promise<{ success: boolean; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('privacy/block'),
      body: { phone: targetPhoneOrJid, action: 'unblock' },
    });
  }

  /**
   * Fetches the full blocklist.
   */
  public async getBlocklist(): Promise<{ success: boolean; blocklist: string[] }> {
    return this.request({
      method: 'GET',
      path: this.buildPath('privacy/blocklist'),
    });
  }

  /**
   * Fetches WhatsApp privacy settings.
   */
  public async getPrivacySettings(force: boolean = false): Promise<{ success: boolean; privacySettings: PrivacySettings }> {
    return this.request({
      method: 'GET',
      path: this.buildPath('privacy/settings'),
      query: { force },
    });
  }

  /**
   * Updates a WhatsApp privacy configuration (lastSeen, online, profilePicture, status, readReceipts).
   */
  public async updatePrivacySetting(type: PrivacySettingType, value: PrivacyValue): Promise<{ success: boolean; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('privacy/update'),
      body: { type, value },
    });
  }
}
