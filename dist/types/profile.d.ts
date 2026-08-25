export interface BusinessProfile {
    description?: string;
    email?: string;
    websites?: string[];
    category?: string;
    business_hours?: any;
}
export type PrivacySettingType = 'lastSeen' | 'online' | 'profilePicture' | 'status' | 'readReceipts' | 'groupsAdd' | 'defaultDisappearing';
export type PrivacyValue = 'all' | 'contacts' | 'contact_blacklist' | 'match_last_seen' | 'none' | boolean | number;
export interface PrivacySettings {
    readreceipts?: string;
    profile?: string;
    status?: string;
    online?: string;
    last?: string;
    groupadd?: string;
    calladd?: string;
}
export interface BroadcastStoryOptions {
    statusJidList?: string[];
    backgroundColor?: string;
    font?: number;
    caption?: string;
}
//# sourceMappingURL=profile.d.ts.map