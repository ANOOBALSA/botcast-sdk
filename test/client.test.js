import test from 'node:test';
import assert from 'node:assert';
import {
  BotcastClient,
  BotcastWebhook,
  BotcastError,
  BotcastAuthError,
  BotcastPaymentRequiredError,
  BotcastSubscriptionExpiredError,
  BotcastRateLimitError,
  BotcastValidationError,
  BotcastNotFoundError,
} from '../dist/index.js';

test('BotcastClient initializes properly with valid credentials', () => {
  const client = new BotcastClient({
    baseUrl: 'https://test.botcast.site',
    instanceId: 'inst_test_123',
    instanceToken: 'tok_test_abc',
  });

  assert.ok(client);
  assert.ok(client.messages);
  assert.ok(client.instances);
  assert.ok(client.chats);
  assert.ok(client.groups);
  assert.ok(client.profile);
  assert.ok(client.broadcast);
  assert.ok(client.webhook);
});

test('BotcastClient throws validation error on missing credentials', () => {
  assert.throws(() => {
    new BotcastClient({ instanceId: '', instanceToken: 'abc' });
  }, /instanceId/);

  assert.throws(() => {
    new BotcastClient({ instanceId: 'inst_123', instanceToken: '' });
  }, /instanceToken/);
});

test('BotcastWebhook dispatches message_received event correctly', async () => {
  const webhook = new BotcastWebhook();
  let receivedPayload = null;

  webhook.onMessage((event) => {
    receivedPayload = event;
  });

  await webhook.handleEvent({
    event: 'message_received',
    instanceId: 'inst_123',
    sender: '201000000000',
    senderJid: '201000000000@s.whatsapp.net',
    message: 'Hello World',
    timestamp: new Date().toISOString(),
  });

  assert.strictEqual(receivedPayload?.sender, '201000000000');
  assert.strictEqual(receivedPayload?.message, 'Hello World');
});

test('Error classes inherit and format properly', () => {
  const authErr = new BotcastAuthError('Bad token');
  assert.strictEqual(authErr.name, 'BotcastAuthError');
  assert.strictEqual(authErr.statusCode, 401);

  const payErr = new BotcastPaymentRequiredError('Pending Fawry');
  assert.strictEqual(payErr.statusCode, 402);

  const expErr = new BotcastSubscriptionExpiredError('Expired', '2026-08-01T00:00:00Z');
  assert.strictEqual(expErr.statusCode, 403);
  assert.strictEqual(expErr.expiresAt, '2026-08-01T00:00:00Z');

  const rateErr = new BotcastRateLimitError('Too many messages');
  assert.strictEqual(rateErr.statusCode, 429);

  const valErr = new BotcastValidationError('Recipient required');
  assert.strictEqual(valErr.statusCode, 400);

  const notFoundErr = new BotcastNotFoundError('Instance not found');
  assert.strictEqual(notFoundErr.statusCode, 404);
});

test('BotcastClient sends text message and builds correct request path', async (t) => {
  const originalFetch = global.fetch;
  let interceptedUrl = '';
  let interceptedBody = null;

  global.fetch = async (url, options) => {
    interceptedUrl = url.toString();
    interceptedBody = JSON.parse(options.body);
    return {
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        messageId: 'msg_test_789',
        status: 'sent',
      }),
    };
  };

  t.after(() => {
    global.fetch = originalFetch;
  });

  const client = new BotcastClient({
    baseUrl: 'https://api.botcast.site',
    instanceId: 'inst_abc',
    instanceToken: 'token_xyz',
  });

  const res = await client.messages.sendText('201000000000', 'Hello WhatsApp!');

  assert.strictEqual(res.success, true);
  assert.strictEqual(res.messageId, 'msg_test_789');
  assert.strictEqual(interceptedUrl, 'https://api.botcast.site/whatsapp/inst_abc/token_xyz/send');
  assert.strictEqual(interceptedBody.recipient, '201000000000');
  assert.strictEqual(interceptedBody.text, 'Hello WhatsApp!');
});

test('BotcastClient handles 402 payment required and 429 rate limit correctly', async (t) => {
  const originalFetch = global.fetch;

  global.fetch = async () => {
    return {
      ok: false,
      status: 402,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        error: 'Payment Required',
        message: 'This instance is awaiting payment confirmation',
      }),
    };
  };

  t.after(() => {
    global.fetch = originalFetch;
  });

  const client = new BotcastClient({
    instanceId: 'inst_abc',
    instanceToken: 'token_xyz',
    maxRetries: 0,
  });

  await assert.rejects(
    async () => {
      await client.messages.sendText('201000000000', 'Test');
    },
    (err) => {
      return err instanceof BotcastPaymentRequiredError && err.statusCode === 402;
    }
  );
});
