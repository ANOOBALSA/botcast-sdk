import { BaseModule } from './base.js';
import { BusinessProfile, PrivacySettings, PrivacySettingType, PrivacyValue } from '../types/index.js';
export declare class ProfileModule extends BaseModule {
    /**
     * Fetches the bio / text status of a phone number or the current instance.
     */
    getStatus(targetPhoneOrJid?: string): Promise<{
        target: string;
        status: string;
    }>;
    /**
     * Updates the about / bio status of the connected WhatsApp instance.
     */
    setStatus(status: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Updates the public display name of the instance.
     */
    setName(name: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Fetches the profile picture URL of a contact or group.
     */
    getPicture(targetPhoneOrJid?: string, highRes?: boolean): Promise<{
        target: string;
        profilePictureUrl: string | null;
    }>;
    /**
     * Updates the profile picture for the instance or a group.
     */
    setPicture(imageSource: {
        url?: string;
        base64?: string;
    }, targetJid?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Removes the profile picture.
     */
    removePicture(targetJid?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Fetches WhatsApp Business profile information (category, email, hours).
     */
    getBusinessProfile(targetPhoneOrJid: string): Promise<{
        target: string;
        businessProfile: BusinessProfile;
    }>;
    /**
     * Blocks a user on WhatsApp.
     */
    block(targetPhoneOrJid: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Unblocks a previously blocked user.
     */
    unblock(targetPhoneOrJid: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Fetches the full blocklist.
     */
    getBlocklist(): Promise<{
        success: boolean;
        blocklist: string[];
    }>;
    /**
     * Fetches WhatsApp privacy settings.
     */
    getPrivacySettings(force?: boolean): Promise<{
        success: boolean;
        privacySettings: PrivacySettings;
    }>;
    /**
     * Updates a WhatsApp privacy configuration (lastSeen, online, profilePicture, status, readReceipts).
     */
    updatePrivacySetting(type: PrivacySettingType, value: PrivacyValue): Promise<{
        success: boolean;
        message: string;
    }>;
}
//# sourceMappingURL=profile.d.ts.map