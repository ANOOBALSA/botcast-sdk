# botcast-sdk

Node.js and TypeScript client for [Botcast](https://botcast.site), a multi-instance WhatsApp REST API gateway.

[![npm version](https://img.shields.io/npm/v/botcast-sdk.svg?color=blue)](https://www.npmjs.com/package/botcast-sdk)
[![npm downloads](https://img.shields.io/npm/dm/botcast-sdk.svg)](https://www.npmjs.com/package/botcast-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

## Features

- Zero runtime dependencies: built on native `fetch`.
- Full TypeScript types for every request payload, response model, and error class.
- Dual device pairing: scan a QR code string or request an 8-digit phone PIN to link without a camera.
- 42 WhatsApp REST endpoints: text messages with mentions, OTPs, images, videos, audio, voice notes (PTT), documents, stickers, locations, contact vCards, and interactive polls.
- Message controls: edit, delete for everyone, mark as read, reactions, pin messages, and forward.
- Group management: create groups, manage participants, update subjects and descriptions, configure settings, and handle join requests.
- Safety controls: configure daily caps on sent messages and new contacts.
- Built-in webhook router: parse and handle inbound messages and connection events in Express, Fastify, Next.js, or raw Node HTTP.

---

## Installation

```bash
npm install botcast-sdk
# or
pnpm add botcast-sdk
# or
yarn add botcast-sdk
# or
bun add botcast-sdk
```

---

## Quick start

```typescript
import { BotcastClient } from 'botcast-sdk';

const client = new BotcastClient({
  baseUrl: 'https://botcast.site', // or your self-hosted server URL
  instanceId: 'your_instance_id',
  instanceToken: 'your_instance_token',
});

async function main() {
  // 1. Check instance connectivity
  const status = await client.getStatus();
  console.log(`Connected phone: ${status.phoneNumber || 'Not linked'}`);

  // 2. Send a text message with user mentions
  const result = await client.messages.sendText('201012345678', 'Hello @201012345678!', {
    mentions: ['201012345678'],
  });
  console.log('Message ID:', result.messageId);

  // 3. Send a secure 6-digit OTP code
  const otp = await client.messages.sendOTP('201012345678', {
    appName: 'My App',
    expiryMinutes: 5,
  });
  console.log('Dispatched OTP:', otp.codeSent);
}

main().catch(console.error);
```

### CommonJS (require)

```javascript
const { BotcastClient } = require('botcast-sdk');

const client = new BotcastClient({
  instanceId: 'your_instance_id',
  instanceToken: 'your_instance_token',
});
```

---

## API reference

### 1. Device pairing and lifecycle (`client.instances`)

```typescript
// 1. Get live status
const status = await client.instances.getStatus();
console.log('Socket state:', status.status); // 'connected' | 'pairing' | 'disconnected'

// 2. Option A: Get QR code string for camera scanning
const qr = await client.getQR(); // or client.instances.getQR()
console.log('Scan QR:', qr.qr);

// 3. Option B: Request 8-digit phone PIN code (link without scanning)
const pair = await client.pairWithCode('201012345678'); // or client.instances.pairWithCode(...)
console.log('Enter this PIN on WhatsApp notification:', pair.code); // e.g. "8492-0193"

// 4. Start, stop, or log out
await client.instances.start(); // Boots socket connection
await client.instances.stop();  // Suspends socket session
await client.instances.logout(); // Unlinks device and deletes session

// 5. Verify phone number on WhatsApp
const check = await client.checkNumber('201012345678');
console.log('Exists on WhatsApp:', check.exists, 'JID:', check.jid);

// 6. Set presence state
await client.instances.setPresence({
  presence: 'composing', // 'available' | 'unavailable' | 'composing' | 'recording' | 'paused'
  recipient: '201012345678',
});

// 7. Manage sandbox allowed numbers (developer tier)
const allowed = await client.instances.getAllowedNumbers();
await client.instances.setAllowedNumbers(['201012345678', '966500000000']);
```

---

### 2. Message and media dispatching (`client.messages`)

```typescript
// 1. Text message with mentions and quoted replies
await client.messages.sendText('201012345678', 'Hello World', {
  mentions: ['201012345678'],
  quotedMsgId: 'MSG_ID_TO_REPLY_TO',
});

// 2. Image
await client.messages.sendImage('201012345678', {
  url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
  caption: 'Photo preview',
});

// 3. Video (or round PTV message)
await client.messages.sendVideo('201012345678', {
  url: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
  caption: 'Product tutorial video',
  ptv: false,
});

// 4. Voice note (PTT waveform) and audio
await client.messages.sendVoice('201012345678', {
  url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
});

// 5. Document, PDF, or file attachment
await client.messages.sendDocument('201012345678', {
  url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  fileName: 'Invoice_2026.pdf',
  mimetype: 'application/pdf',
  caption: 'Monthly invoice statement',
});

// 6. Sticker
await client.messages.sendSticker('201012345678', {
  url: 'https://raw.githubusercontent.com/WhatsApp/stickers/main/Android/app/src/main/assets/1/01_Cider_Happy.webp',
});

// 7. Location coordinates
await client.messages.sendLocation('201012345678', {
  latitude: 24.7136,
  longitude: 46.6753,
  name: 'Kingdom Tower',
  address: 'King Fahd Rd, Riyadh, Saudi Arabia',
});

// 8. Contact vCard
await client.messages.sendContact('201012345678', {
  displayName: 'Support Team',
  vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:Support Team\nTEL;TYPE=CELL:+201012345678\nEND:VCARD',
});

// 9. Interactive poll
await client.messages.sendPoll('201012345678', {
  name: 'How do you rate Botcast API speed?',
  values: ['Fast', 'Good', 'Needs improvement'],
  selectableCount: 1,
});

// 10. OTP verification code
const otp = await client.messages.sendOTP('201012345678', {
  appName: 'Botcast Portal',
  expiryMinutes: 5,
});
```

---

### 3. Message operations (`client.messages`)

```typescript
const msgKey = {
  remoteJid: '201012345678@s.whatsapp.net',
  fromMe: true,
  id: '3EB0ABCDEF1234567890',
};

// 1. Edit sent message (within 15 minutes)
await client.messages.edit('201012345678', msgKey, 'Corrected text content');

// 2. Delete message for everyone (revoke)
await client.messages.delete('201012345678', msgKey);

// 3. Mark message as read (blue tick)
await client.messages.markAsRead(msgKey);

// 4. Emoji reaction (pass empty string to remove)
await client.messages.react('201012345678', msgKey, '👍');

// 5. Pin message (86400 = 24h, 604800 = 7d, 2592000 = 30d)
await client.messages.pin('201012345678', msgKey, 1, 86400);

// 6. Forward message
await client.messages.forward('201012345678', { conversation: 'Forwarded message text' });
```

---

### 4. Chats, contacts, and sync (`client.chats`)

```typescript
// 1. List synced chats
const { chats, total } = await client.chats.list({ limit: 50, offset: 0 });

// 2. List synced contacts
const { contacts } = await client.chats.listContacts({ limit: 100 });

// 3. List synced messages
const { messages } = await client.chats.listMessages({ chatJid: '201012345678@s.whatsapp.net', limit: 50 });

// 4. Modify chat state (archive, mute, pin, delete)
await client.chats.archive('201012345678@s.whatsapp.net');
await client.chats.unarchive('201012345678@s.whatsapp.net');
await client.chats.mute('201012345678@s.whatsapp.net', 8 * 60 * 60 * 1000); // 8 hours
await client.chats.unmute('201012345678@s.whatsapp.net');
await client.chats.pin('201012345678@s.whatsapp.net');
await client.chats.unpin('201012345678@s.whatsapp.net');
await client.chats.deleteChat('201012345678@s.whatsapp.net');

// 5. Set disappearing messages timer
await client.chats.setDisappearing('201012345678', 86400, true);

// 6. Request older history from linked phone
await client.chats.fetchHistory({ count: 50 });

// 7. Trigger immediate sync
await client.instances.sync();
```

---

### 5. Profile, presence, and business details (`client.profile`)

```typescript
// 1. Get and update bio status
const bio = await client.profile.getStatus('201012345678');
await client.profile.setStatus('Available via Botcast API');

// 2. Update display name
await client.profile.setName('Botcast Agent');

// 3. Profile picture management
const pic = await client.profile.getPicture('201012345678', true); // High-res
await client.profile.setPicture({ url: 'https://botcast.site/logo.png' });
await client.profile.removePicture();

// 4. Inspect WhatsApp Business profile
const biz = await client.profile.getBusinessProfile('201012345678');
console.log('Business category:', biz.businessProfile.category);
```

---

### 6. Group administration (`client.groups`)

```typescript
// 1. Create a WhatsApp group
const group = await client.groups.create('VIP Customers', ['201012345678', '966500000000']);
const groupJid = group.group.id;

// 2. List groups and fetch metadata
const { groups } = await client.groups.list();
const { metadata } = await client.groups.getMetadata(groupJid);

// 3. Participant management (add, remove, promote, demote)
await client.groups.addParticipants(groupJid, ['201099999999']);
await client.groups.removeParticipants(groupJid, ['201099999999']);
await client.groups.promoteParticipants(groupJid, ['201012345678']);
await client.groups.demoteParticipants(groupJid, ['201012345678']);

// 4. Update group subject and description
await client.groups.updateSubject(groupJid, 'New Group Title');
await client.groups.updateDescription(groupJid, 'Official VIP discussion group.');

// 5. Update group settings
await client.groups.updateSettings(groupJid, 'announcement'); // Admins only send messages
await client.groups.updateSettings(groupJid, 'not_announcement'); // All members can chat
await client.groups.updateSettings(groupJid, 'locked'); // Admins only edit info
await client.groups.updateSettings(groupJid, 'unlocked');

// 6. Shareable invite codes and links
const invite = await client.groups.getInviteCode(groupJid);
console.log('Invite link:', invite.link);
await client.groups.revokeInviteCode(groupJid);
await client.groups.acceptInvite('InviteCodeString');
const info = await client.groups.getInviteInfo('InviteCodeString');

// 7. Join requests moderation (admin approval mode)
const pending = await client.groups.getJoinRequests(groupJid);
await client.groups.updateJoinRequests(groupJid, ['201012345678'], 'approve');

// 8. Ephemeral messages and member add mode
await client.groups.setEphemeral(groupJid, 86400); // 24h
await client.groups.setMemberAddMode(groupJid, 'admin_add'); // Only admins add

// 9. Leave group
await client.groups.leave(groupJid);
```

---

### 7. Privacy and blocklist (`client.profile`)

```typescript
// 1. Block and unblock contacts
await client.profile.block('201012345678');
await client.profile.unblock('201012345678');

// 2. Get blocklist
const { blocklist } = await client.profile.getBlocklist();

// 3. Get and update privacy visibility settings
const privacy = await client.profile.getPrivacySettings();
// Options: 'all' | 'contacts' | 'contact_blacklist' | 'none'
await client.profile.updatePrivacySetting('lastSeen', 'all');
await client.profile.updatePrivacySetting('online', 'all');
await client.profile.updatePrivacySetting('profilePicture', 'contacts');
await client.profile.updatePrivacySetting('status', 'contacts');
await client.profile.updatePrivacySetting('readReceipts', 'all');
```

---

### 8. 24-hour status stories and broadcasts (`client.broadcast`)

```typescript
// 1. Publish status story (text, image, video, or audio)
await client.broadcast.sendStatusStory({
  type: 'text',
  text: 'New update available on Botcast.',
  backgroundColor: '#10b981',
});

// 2. Get broadcast list info
const list = await client.broadcast.getListInfo('1234567890@broadcast');
```

---

### 9. Rate limits and safety controls (`client.instances`)

```typescript
// 1. Read current limits
const limits = await client.instances.getLimits();
console.log('Daily message limit:', limits.daily_message_limit);
console.log('Daily new contacts limit:', limits.daily_new_contacts_limit);

// 2. Update limits (pass 0 to disable)
await client.instances.setDailyMessageLimit(1000);
await client.instances.setDailyNewContactsLimit(100);

// Or update both at once
await client.instances.updateLimits({
  daily_message_limit: 500,
  daily_new_contacts_limit: 50,
});
```

---

### 10. Webhook event handling

The SDK includes an event dispatcher and middleware for handling inbound webhooks:

#### Express example

```typescript
import express from 'express';
import { BotcastClient } from 'botcast-sdk';

const app = express();
app.use(express.json());

const client = new BotcastClient({
  instanceId: 'inst_123',
  instanceToken: 'tok_abc',
});

// Listen for incoming messages
client.webhook.onMessage(async (event) => {
  console.log(`Message from ${event.pushName || event.sender}: ${event.message}`);

  if (event.message.trim().toLowerCase() === 'ping') {
    await client.messages.sendText(event.sender, 'pong');
  }
});

// Listen for connection changes
client.webhook.onConnection(async (event) => {
  console.log(`Instance state updated: ${event.status}`);
});

// Mount middleware on your webhook route
app.post('/webhook/botcast', client.webhook.middleware());

app.listen(3000, () => console.log('Webhook server running on port 3000'));
```

---

## Error handling

`botcast-sdk` maps API status codes to typed error classes:

```typescript
import {
  BotcastClient,
  BotcastAuthError,
  BotcastPaymentRequiredError,
  BotcastSubscriptionExpiredError,
  BotcastRateLimitError,
  BotcastValidationError,
  BotcastNotFoundError,
} from 'botcast-sdk';

try {
  await client.messages.sendText('201012345678', 'Hello World');
} catch (error) {
  if (error instanceof BotcastAuthError) {
    console.error('Invalid instance credentials or token.');
  } else if (error instanceof BotcastPaymentRequiredError) {
    console.error('Instance requires subscription activation.');
  } else if (error instanceof BotcastSubscriptionExpiredError) {
    console.error('Instance subscription expired on:', error.expiresAt);
  } else if (error instanceof BotcastRateLimitError) {
    console.error('Daily sending limit reached. Please wait before retrying.');
  } else if (error instanceof BotcastValidationError) {
    console.error('Validation error:', error.message, error.details);
  } else if (error instanceof BotcastNotFoundError) {
    console.error('Resource not found:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

---

## Links

- Website: [https://botcast.site](https://botcast.site)
- Documentation: [https://botcast.site/docs](https://botcast.site/docs)
- Postman collection: [https://botcast.site/botcast.postman_collection.json](https://botcast.site/botcast.postman_collection.json)
- NPM package: [https://www.npmjs.com/package/botcast-sdk](https://www.npmjs.com/package/botcast-sdk)
- GitHub repository: [https://github.com/ANOOBALSA/Botcast](https://github.com/ANOOBALSA/Botcast)

---

## License

MIT (c) [Botcast](https://botcast.site)
