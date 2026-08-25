export type GroupParticipantAction = 'add' | 'remove' | 'promote' | 'demote';
export type GroupSetting = 'announcement' | 'not_announcement' | 'locked' | 'unlocked';
export type GroupMemberAddMode = 'all_member_add' | 'admin_add';
export interface GroupParticipant {
    id: string;
    admin?: 'admin' | 'superadmin' | null;
}
export interface GroupMetadata {
    id: string;
    subject: string;
    subjectOwner?: string;
    subjectTime?: number;
    size?: number;
    creation?: number;
    owner?: string;
    desc?: string;
    descId?: string;
    descOwner?: string;
    descTime?: number;
    restrict?: boolean;
    announce?: boolean;
    participants: GroupParticipant[];
    ephemeralDuration?: number;
    inviteCode?: string;
    memberAddMode?: boolean;
}
export interface CreateGroupResponse {
    success: boolean;
    message: string;
    group: {
        id: string;
        subject: string;
        participants: GroupParticipant[];
    };
}
export interface GroupInviteCodeResponse {
    success: boolean;
    code?: string;
    link?: string;
    inviteCode?: string;
    inviteLink?: string;
}
export interface JoinRequestItem {
    jid: string;
    requested_at: number;
}
//# sourceMappingURL=groups.d.ts.map