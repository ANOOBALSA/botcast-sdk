import { BaseModule } from './base.js';
import {
  CreateGroupResponse,
  GroupMetadata,
  GroupParticipantAction,
  GroupSetting,
  GroupMemberAddMode,
  GroupInviteCodeResponse,
  JoinRequestItem,
} from '../types/index.js';

export class GroupsModule extends BaseModule {
  /**
   * Creates a new WhatsApp group.
   *
   * @param subject Group title / name
   * @param participants Array of participant phone numbers with country codes
   */
  public async create(subject: string, participants: string[]): Promise<CreateGroupResponse> {
    return this.request<CreateGroupResponse>({
      method: 'POST',
      path: this.buildPath('groups/create'),
      body: { subject, participants },
    });
  }

  /**
   * Fetches all WhatsApp groups that the connected instance is participating in.
   */
  public async list(): Promise<{ success: boolean; total: number; groups: Record<string, GroupMetadata> }> {
    return this.request({
      method: 'GET',
      path: this.buildPath('groups/list'),
    });
  }

  /**
   * Retrieves complete group metadata (participants, description, settings, admins).
   */
  public async getMetadata(groupJid: string): Promise<{ success: boolean; metadata: GroupMetadata }> {
    return this.request({
      method: 'GET',
      path: this.buildPath('groups/metadata'),
      query: { jid: groupJid },
    });
  }

  /**
   * Updates participants in a group (add, remove, promote to admin, demote).
   */
  public async updateParticipants(
    groupJid: string,
    participants: string[],
    action: GroupParticipantAction
  ): Promise<{ success: boolean; message: string; result?: any }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('groups/participants'),
      body: { jid: groupJid, participants, action },
    });
  }

  /**
   * Adds members to a group.
   */
  public async addParticipants(groupJid: string, participants: string[]): Promise<any> {
    return this.updateParticipants(groupJid, participants, 'add');
  }

  /**
   * Removes members from a group.
   */
  public async removeParticipants(groupJid: string, participants: string[]): Promise<any> {
    return this.updateParticipants(groupJid, participants, 'remove');
  }

  /**
   * Promotes members to group administrators.
   */
  public async promoteParticipants(groupJid: string, participants: string[]): Promise<any> {
    return this.updateParticipants(groupJid, participants, 'promote');
  }

  /**
   * Demotes group administrators back to regular members.
   */
  public async demoteParticipants(groupJid: string, participants: string[]): Promise<any> {
    return this.updateParticipants(groupJid, participants, 'demote');
  }

  /**
   * Changes the group subject / title.
   */
  public async updateSubject(groupJid: string, subject: string): Promise<{ success: boolean; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('groups/subject'),
      body: { jid: groupJid, subject },
    });
  }

  /**
   * Updates the group description.
   */
  public async updateDescription(groupJid: string, description: string): Promise<{ success: boolean; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('groups/description'),
      body: { jid: groupJid, description },
    });
  }

  /**
   * Updates group permissions / settings:
   * - `announcement`: Only admins can send messages
   * - `not_announcement`: All members can send messages
   * - `locked`: Only admins can edit group info
   * - `unlocked`: All members can edit group info
   */
  public async updateSettings(groupJid: string, setting: GroupSetting): Promise<{ success: boolean; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('groups/settings'),
      body: { jid: groupJid, setting },
    });
  }

  /**
   * Leaves a WhatsApp group.
   */
  public async leave(groupJid: string): Promise<{ success: boolean; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('groups/leave'),
      body: { jid: groupJid },
    });
  }

  /**
   * Gets the invite code and shareable invite link for a group.
   */
  public async getInviteCode(groupJid: string): Promise<GroupInviteCodeResponse> {
    return this.request({
      method: 'POST',
      path: this.buildPath('groups/invite'),
      body: { action: 'get_code', jid: groupJid },
    });
  }

  /**
   * Revokes the current invite code and creates a new one.
   */
  public async revokeInviteCode(groupJid: string): Promise<GroupInviteCodeResponse> {
    return this.request({
      method: 'POST',
      path: this.buildPath('groups/invite'),
      body: { action: 'revoke', jid: groupJid },
    });
  }

  /**
   * Joins a group using an invite code.
   */
  public async acceptInvite(code: string): Promise<{ success: boolean; message: string; result?: any }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('groups/invite'),
      body: { action: 'accept', code },
    });
  }

  /**
   * Inspects group metadata using an invite code before joining.
   */
  public async getInviteInfo(code: string): Promise<{ success: boolean; groupInfo: any }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('groups/invite'),
      body: { action: 'inspect', code },
    });
  }

  /**
   * Gets pending participant join requests (for groups with admin approval enabled).
   */
  public async getJoinRequests(groupJid: string): Promise<{ success: boolean; groupJid: string; pendingRequests: JoinRequestItem[] }> {
    return this.request({
      method: 'GET',
      path: this.buildPath('groups/join-requests'),
      query: { jid: groupJid },
    });
  }

  /**
   * Approves or rejects participant join requests.
   */
  public async updateJoinRequests(
    groupJid: string,
    participants: string[],
    action: 'approve' | 'reject'
  ): Promise<{ success: boolean; message: string; result?: any }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('groups/join-requests'),
      body: { jid: groupJid, participants, action },
    });
  }

  /**
   * Configures disappearing messages for a group.
   *
   * @param groupJid Group JID
   * @param durationSeconds 0 for off, 86400 (24h), 604800 (7d), 7776000 (90d)
   */
  public async setEphemeral(groupJid: string, durationSeconds: number): Promise<{ success: boolean; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('groups/ephemeral'),
      body: { jid: groupJid, duration: durationSeconds },
    });
  }

  /**
   * Configures member add mode (`all_member_add` or `admin_add`).
   */
  public async setMemberAddMode(groupJid: string, mode: GroupMemberAddMode): Promise<{ success: boolean; message: string }> {
    return this.request({
      method: 'POST',
      path: this.buildPath('groups/member-add-mode'),
      body: { jid: groupJid, mode },
    });
  }
}
