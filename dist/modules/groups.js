import { BaseModule } from './base.js';
export class GroupsModule extends BaseModule {
    /**
     * Creates a new WhatsApp group.
     *
     * @param subject Group title / name
     * @param participants Array of participant phone numbers with country codes
     */
    async create(subject, participants) {
        return this.request({
            method: 'POST',
            path: this.buildPath('groups/create'),
            body: { subject, participants },
        });
    }
    /**
     * Fetches all WhatsApp groups that the connected instance is participating in.
     */
    async list() {
        return this.request({
            method: 'GET',
            path: this.buildPath('groups/list'),
        });
    }
    /**
     * Retrieves complete group metadata (participants, description, settings, admins).
     */
    async getMetadata(groupJid) {
        return this.request({
            method: 'GET',
            path: this.buildPath('groups/metadata'),
            query: { jid: groupJid },
        });
    }
    /**
     * Updates participants in a group (add, remove, promote to admin, demote).
     */
    async updateParticipants(groupJid, participants, action) {
        return this.request({
            method: 'POST',
            path: this.buildPath('groups/participants'),
            body: { jid: groupJid, participants, action },
        });
    }
    /**
     * Adds members to a group.
     */
    async addParticipants(groupJid, participants) {
        return this.updateParticipants(groupJid, participants, 'add');
    }
    /**
     * Removes members from a group.
     */
    async removeParticipants(groupJid, participants) {
        return this.updateParticipants(groupJid, participants, 'remove');
    }
    /**
     * Promotes members to group administrators.
     */
    async promoteParticipants(groupJid, participants) {
        return this.updateParticipants(groupJid, participants, 'promote');
    }
    /**
     * Demotes group administrators back to regular members.
     */
    async demoteParticipants(groupJid, participants) {
        return this.updateParticipants(groupJid, participants, 'demote');
    }
    /**
     * Changes the group subject / title.
     */
    async updateSubject(groupJid, subject) {
        return this.request({
            method: 'POST',
            path: this.buildPath('groups/subject'),
            body: { jid: groupJid, subject },
        });
    }
    /**
     * Updates the group description.
     */
    async updateDescription(groupJid, description) {
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
    async updateSettings(groupJid, setting) {
        return this.request({
            method: 'POST',
            path: this.buildPath('groups/settings'),
            body: { jid: groupJid, setting },
        });
    }
    /**
     * Leaves a WhatsApp group.
     */
    async leave(groupJid) {
        return this.request({
            method: 'POST',
            path: this.buildPath('groups/leave'),
            body: { jid: groupJid },
        });
    }
    /**
     * Gets the invite code and shareable invite link for a group.
     */
    async getInviteCode(groupJid) {
        return this.request({
            method: 'POST',
            path: this.buildPath('groups/invite'),
            body: { action: 'get_code', jid: groupJid },
        });
    }
    /**
     * Revokes the current invite code and creates a new one.
     */
    async revokeInviteCode(groupJid) {
        return this.request({
            method: 'POST',
            path: this.buildPath('groups/invite'),
            body: { action: 'revoke', jid: groupJid },
        });
    }
    /**
     * Joins a group using an invite code.
     */
    async acceptInvite(code) {
        return this.request({
            method: 'POST',
            path: this.buildPath('groups/invite'),
            body: { action: 'accept', code },
        });
    }
    /**
     * Inspects group metadata using an invite code before joining.
     */
    async getInviteInfo(code) {
        return this.request({
            method: 'POST',
            path: this.buildPath('groups/invite'),
            body: { action: 'inspect', code },
        });
    }
    /**
     * Gets pending participant join requests (for groups with admin approval enabled).
     */
    async getJoinRequests(groupJid) {
        return this.request({
            method: 'GET',
            path: this.buildPath('groups/join-requests'),
            query: { jid: groupJid },
        });
    }
    /**
     * Approves or rejects participant join requests.
     */
    async updateJoinRequests(groupJid, participants, action) {
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
    async setEphemeral(groupJid, durationSeconds) {
        return this.request({
            method: 'POST',
            path: this.buildPath('groups/ephemeral'),
            body: { jid: groupJid, duration: durationSeconds },
        });
    }
    /**
     * Configures member add mode (`all_member_add` or `admin_add`).
     */
    async setMemberAddMode(groupJid, mode) {
        return this.request({
            method: 'POST',
            path: this.buildPath('groups/member-add-mode'),
            body: { jid: groupJid, mode },
        });
    }
}
