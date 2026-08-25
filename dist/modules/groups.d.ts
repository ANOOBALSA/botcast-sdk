import { BaseModule } from './base.js';
import { CreateGroupResponse, GroupMetadata, GroupParticipantAction, GroupSetting, GroupMemberAddMode, GroupInviteCodeResponse, JoinRequestItem } from '../types/index.js';
export declare class GroupsModule extends BaseModule {
    /**
     * Creates a new WhatsApp group.
     *
     * @param subject Group title / name
     * @param participants Array of participant phone numbers with country codes
     */
    create(subject: string, participants: string[]): Promise<CreateGroupResponse>;
    /**
     * Fetches all WhatsApp groups that the connected instance is participating in.
     */
    list(): Promise<{
        success: boolean;
        total: number;
        groups: Record<string, GroupMetadata>;
    }>;
    /**
     * Retrieves complete group metadata (participants, description, settings, admins).
     */
    getMetadata(groupJid: string): Promise<{
        success: boolean;
        metadata: GroupMetadata;
    }>;
    /**
     * Updates participants in a group (add, remove, promote to admin, demote).
     */
    updateParticipants(groupJid: string, participants: string[], action: GroupParticipantAction): Promise<{
        success: boolean;
        message: string;
        result?: any;
    }>;
    /**
     * Adds members to a group.
     */
    addParticipants(groupJid: string, participants: string[]): Promise<any>;
    /**
     * Removes members from a group.
     */
    removeParticipants(groupJid: string, participants: string[]): Promise<any>;
    /**
     * Promotes members to group administrators.
     */
    promoteParticipants(groupJid: string, participants: string[]): Promise<any>;
    /**
     * Demotes group administrators back to regular members.
     */
    demoteParticipants(groupJid: string, participants: string[]): Promise<any>;
    /**
     * Changes the group subject / title.
     */
    updateSubject(groupJid: string, subject: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Updates the group description.
     */
    updateDescription(groupJid: string, description: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Updates group permissions / settings:
     * - `announcement`: Only admins can send messages
     * - `not_announcement`: All members can send messages
     * - `locked`: Only admins can edit group info
     * - `unlocked`: All members can edit group info
     */
    updateSettings(groupJid: string, setting: GroupSetting): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Leaves a WhatsApp group.
     */
    leave(groupJid: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Gets the invite code and shareable invite link for a group.
     */
    getInviteCode(groupJid: string): Promise<GroupInviteCodeResponse>;
    /**
     * Revokes the current invite code and creates a new one.
     */
    revokeInviteCode(groupJid: string): Promise<GroupInviteCodeResponse>;
    /**
     * Joins a group using an invite code.
     */
    acceptInvite(code: string): Promise<{
        success: boolean;
        message: string;
        result?: any;
    }>;
    /**
     * Inspects group metadata using an invite code before joining.
     */
    getInviteInfo(code: string): Promise<{
        success: boolean;
        groupInfo: any;
    }>;
    /**
     * Gets pending participant join requests (for groups with admin approval enabled).
     */
    getJoinRequests(groupJid: string): Promise<{
        success: boolean;
        groupJid: string;
        pendingRequests: JoinRequestItem[];
    }>;
    /**
     * Approves or rejects participant join requests.
     */
    updateJoinRequests(groupJid: string, participants: string[], action: 'approve' | 'reject'): Promise<{
        success: boolean;
        message: string;
        result?: any;
    }>;
    /**
     * Configures disappearing messages for a group.
     *
     * @param groupJid Group JID
     * @param durationSeconds 0 for off, 86400 (24h), 604800 (7d), 7776000 (90d)
     */
    setEphemeral(groupJid: string, durationSeconds: number): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Configures member add mode (`all_member_add` or `admin_add`).
     */
    setMemberAddMode(groupJid: string, mode: GroupMemberAddMode): Promise<{
        success: boolean;
        message: string;
    }>;
}
//# sourceMappingURL=groups.d.ts.map