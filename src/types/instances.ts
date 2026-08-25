export type InstanceStatus = 'connected' | 'disconnected' | 'connecting' | 'qr_ready' | 'stopped';
export type InstanceType = 'dev' | 'paid' | 'custom';

export interface InstanceStatusResponse {
  instanceId: string;
  name: string;
  type: InstanceType;
  status: InstanceStatus;
  phoneNumber?: string | null;
  profileName?: string | null;
  avatarUrl?: string | null;
  profilePicUrl?: string | null;
  allowedNumbers?: string[] | 'unlimited';
  hasQRCode: boolean;
  hasPairingCode: boolean;
  pairingCode?: string | null;
  uptime: number;
}

export interface InstanceQRResponse {
  status: InstanceStatus;
  qr?: string;
  message: string;
  phoneNumber?: string;
}

export interface PairCodeResponse {
  success: boolean;
  phoneNumber: string;
  pairingCode: string;
  formattedCode: string;
  instructions: string;
}

export interface AllowedNumbersResponse {
  instanceId: string;
  type: InstanceType;
  allowedNumbers: string[];
  limit: number | 'unlimited';
}

export interface SetAllowedNumbersResponse {
  success: boolean;
  message: string;
  allowedNumbers: string[];
}

export interface CheckNumberResponse {
  exists: boolean;
  phone: string;
  jid: string;
  avatarUrl?: string | null;
}

export interface PresenceOptions {
  presence: 'available' | 'unavailable' | 'composing' | 'recording' | 'paused';
  to?: string;
  phone?: string;
  recipient?: string;
}

export interface InstanceLimitsResponse {
  instanceId: string;
  daily_message_limit: number;
  daily_new_contacts_limit: number;
  is_message_limit_active: boolean;
  is_new_contacts_limit_active: boolean;
}

export interface UpdateLimitsPayload {
  daily_message_limit?: number;
  daily_new_contacts_limit?: number;
  dailyMessageLimit?: number;
  dailyNewContactsLimit?: number;
}
