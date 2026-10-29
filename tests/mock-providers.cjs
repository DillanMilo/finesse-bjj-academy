// Isolated local smoke-test process only. Never imported by the application.
const fs = require('node:fs');
if (process.env.FINESSE_E2E_FIXTURES !== '1' || process.env.RESEND_API_KEY !== 'fixture-only') throw new Error('Refusing to start fixtures outside the explicit test process');
const originalFetch = global.fetch;
const store = new Map();
global.fetch = async (url, init) => {
  const target = String(url);
  if (target === 'https://redis.example.test/pipeline') return Response.json(JSON.parse(init.body).map(([op, key]) => {
    if (op === 'INCR') { const n = (store.get(key) || 0) + 1; store.set(key, n); return { result: n }; }
    if (op === 'SET') { if (store.has(key)) return { result: null }; store.set(key, 1); return { result: 'OK' }; }
    if (op === 'DEL') { store.delete(key); return { result: 1 }; }
    return { result: 1 };
  }));
  if (target === 'https://challenges.cloudflare.com/turnstile/v0/siteverify') {
    const form = new URLSearchParams(init.body);
    if (form.get('secret') !== '1x0000000000000000000000000000000AA') throw new Error('Only the documented dummy Turnstile secret may be used in smoke tests');
    const result = await originalFetch(url, init);
    const data = await result.clone().json();
    fs.appendFileSync('/private/tmp/finesse-e2e-emails.jsonl', JSON.stringify({ provider: 'turnstile-test', success: data.success === true }) + '\n');
    return result;
  }
  if (target === 'https://api.resend.com/emails') {
    const body = JSON.parse(init.body);
    if (!body.to.every(to => to.endsWith('@example.test'))) throw new Error('Fixture recipients must use example.test');
    const failed = body.reply_to === 'fail@example.test';
    fs.appendFileSync('/private/tmp/finesse-e2e-emails.jsonl', JSON.stringify({ to: body.to, subject: body.subject, replyTo: body.reply_to, failed, htmlHasMessage: body.html.includes('Browser fixture') }) + '\n');
    return Response.json(failed ? { message: 'Fixture failure' } : { id: 'fixture-only' }, { status: failed ? 500 : 200 });
  }
  // Use Cloudflare's real siteverify endpoint with its documented dummy secret.
  if (target.includes('api.resend.com') || target.includes('upstash.io')) throw new Error('Real email/storage access prohibited in smoke tests');
  return originalFetch(url, init);
};
