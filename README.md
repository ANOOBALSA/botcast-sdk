# botcast-sdk

Node.js and TypeScript client for [Botcast](https://botcast.site), a multi-instance WhatsApp API gateway.

Connect WhatsApp numbers, send messages (text, OTP, media, documents, polls), manage group chats, and process incoming webhooks.

[![npm version](https://img.shields.io/npm/v/botcast-sdk.svg?color=blue)](https://www.npmjs.com/package/botcast-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

---

## Installation

```bash
npm install botcast-sdk
# or
yarn add botcast-sdk
# or
pnpm add botcast-sdk
```

---

## Quick start

```typescript
import { BotcastClient } from 'botcast-sdk';

const botcast = new BotcastClient({
  baseUrl: 'https://botcast.site', // or your self-hosted server URL
  instanceId: 'your_instance_id',
  instanceToken: 'your_instance_token',
});

async function main() {
  // 1. Check WhatsApp connection status
  const status = await botcast.instances.getStatus();
  console.log('Status:', status.status, 'Phone:', status.phoneNumber);

  // 2. Send a text message
  const result = await botcast.messages.sendText('201000000000', 'Hello from Botcast SDK');
  console.log('Sent message ID:', result.messageId);

  // 3. Send an OTP verification code
  const otp = await botcast.messages.sendOTP('201000000000', {
    code: '849201',
    appName: 'My SaaS App',
    expiryMinutes: 5,
  });
  console.log('OTP dispatched:', otp.codeSent);
}

main().catch(console.error);
```

---

## CommonJS usage

```javascript
const { BotcastClient } = require('botcast-sdk');

const botcast = new BotcastClient({
  instanceId: 'your_instance_id',
  instanceToken: 'your_instance_token',
});
```

---

## API reference

### 1. Instance management

```typescript
// Get status and phone profile details
const status = await botcast.instances.getStatus();

// Get QR code string for scanning
const qr = await botcast.instances.getQR();

// Generate an 8-digit phone pairing code (no camera scan needed)
const pair = await botcast.instances.pairWithCode('201000000000');
console.log('Enter this code in WhatsApp:', pair.formattedCode); // e.g. 1234-5678

// Start, stop, or log out
await botcast.instances.start();
await botcast.instances.stop();
await botcast.instances.logout();

// Check whether a phone number is on WhatsApp
const check = await botcast.instances.checkNumber('201000000000');
console.log('Exists:', check.exists, 'JID:', check.jid);

// Set presence (typing, recording audio, online/offline)
await botcast.instances.setPresence({
  presence: 'composing', // 'available' | 'unavailable' | 'composing' | 'recording' | 'paused'
  recipient: '201000000000',
});
```

---

### 2. Messaging

```typescript
// 1. Text message with mentions
await botcast.messages.sendText('201000000000', 'Hello @user', {
  mentions: ['201000000000'],
});

// 2. Image with caption
await botcast.messages.sendImage('201000000000', {
  url: 'https://example.com/invoice.png',
  caption: 'Here is your monthly invoice.',
});

// 3. Document / PDF
await botcast.messages.sendDocument('201000000000', {
  url: 'https://example.com/statement.pdf',
  fileName: 'Statement_August.pdf',
  mimetype: 'application/pdf',
});

// 4. Voice note (PTT waveform)
await botcast.messages.sendVoice('201000000000', {
  url: 'https://example.com/audio-note.mp3',
});

// 5. Interactive poll
await botcast.messages.sendPoll('201000000000', {
  name: 'How was our service?',
  values: ['Great', 'Average', 'Needs work'],
  selectableCount: 1,
});

// 6. Contact card (vCard)
await botcast.messages.sendContact('201000000000', {
  displayName: 'Customer Support',
  vcard: 'BEGIN:VCARD\nVERSION:3.0\nFN:Customer Support\nTEL;TYPE=CELL:+201000000000\nEND:VCARD',
});

// 7. Message actions: react, pin, edit, delete for everyone
await botcast.messages.react('201000000000', msgKey, '👍');
await botcast.messages.pin('201000000000', msgKey, 1, 86400); // pin for 24 hours
await botcast.messages.edit('201000000000', msgKey, 'Updated text message');
await botcast.messages.delete('201000000000', msgKey); // Revoke for everyone
```

---

### 3. Group administration

```typescript
// Create a group
const newGroup = await botcast.groups.create('VIP Customers', ['201000000000', '201111111111']);

// List joined groups
const groups = await botcast.groups.list();

// Add or remove participants
await botcast.groups.addParticipants('group-jid@g.us', ['201222222222']);
await botcast.groups.removeParticipants('group-jid@g.us', ['201222222222']);

// Promote or demote admins
await botcast.groups.promoteParticipants('group-jid@g.us', ['201000000000']);

// Update permissions and settings
await botcast.groups.updateSettings('group-jid@g.us', 'announcement'); // Only admins can send messages
await botcast.groups.updateSubject('group-jid@g.us', 'New Group Name');
await botcast.groups.updateDescription('group-jid@g.us', 'Official VIP group discussion.');

// Get invite link
const invite = await botcast.groups.getInviteCode('group-jid@g.us');
console.log('Invite link:', invite.link);
```

---

### 4. Webhook handling

The package includes a helper for parsing incoming events in Express, Fastify, Next.js, or plain Node HTTP:

#### Express example:
```typescript
import express from 'express';
import { BotcastClient } from 'botcast-sdk';

const app = express();
app.use(express.json());

const botcast = new BotcastClient({
  instanceId: 'inst_123',
  instanceToken: 'tok_abc',
});

// Listen for incoming messages
botcast.webhook.onMessage(async (event) => {
  console.log(`Incoming message from +${event.sender}: ${event.message}`);

  if (event.message.toLowerCase() === 'ping') {
    await botcast.messages.sendText(event.sender, 'pong');
  }
});

// Mount the webhook handler
app.post('/webhook', botcast.webhook.middleware());

app.listen(3000, () => console.log('Webhook server listening on port 3000'));
```

---

### 5. Safety rate limits

You can check and update daily sending caps to control outbound message volume:

```typescript
// Read current daily limits
const limits = await botcast.instances.getLimits();
console.log('Daily message limit:', limits.daily_message_limit);
console.log('Daily new contacts limit:', limits.daily_new_contacts_limit);

// Update limits individually (pass 0 to remove the cap)
await botcast.instances.setDailyMessageLimit(500);
await botcast.instances.setDailyNewContactsLimit(50);

// Or update both at once
await botcast.instances.updateLimits({
  daily_message_limit: 1000,
  daily_new_contacts_limit: 100,
});
```

---

### 6. Error handling

The SDK maps API status codes to typed error classes:

```typescript
import {
  BotcastClient,
  BotcastAuthError,
  BotcastPaymentRequiredError,
  BotcastSubscriptionExpiredError,
  BotcastRateLimitError,
} from 'botcast-sdk';

try {
  await botcast.messages.sendText('201000000000', 'Test');
} catch (error) {
  if (error instanceof BotcastAuthError) {
    console.error('Invalid instance token or instance ID');
  } else if (error instanceof BotcastPaymentRequiredError) {
    console.error('Instance requires payment confirmation before sending messages');
  } else if (error instanceof BotcastSubscriptionExpiredError) {
    console.error('Instance subscription expired on:', error.expiresAt);
  } else if (error instanceof BotcastRateLimitError) {
    console.error('Rate limit reached. Reduce request frequency.');
  } else {
    console.error('Request error:', error.message);
  }
}
```

---

## Links

- Website: [https://botcast.site](https://botcast.site)
- Dashboard: [https://botcast.site/?lang=en](https://botcast.site/?lang=en)
- Service health: [https://botcast.site/health](https://botcast.site/health)

---

## License

MIT (c) [Botcast](https://botcast.site)
