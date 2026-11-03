const test = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./load-typescript.cjs');
const TEST_NOW = Date.parse('2026-10-29T18:00:00Z');
function setup(options = {}) {
  const now = options.now ?? TEST_NOW;
  class TestDate extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } }
  const store = new Map(), sends = [];
  const env = { RESEND_API_KEY: 'fixture-only', CONTACT_FROM_EMAIL: 'Website <website@example.test>', CONTACT_TO_EMAIL: 'academy@example.test', UPSTASH_REDIS_REST_URL: 'https://redis.example.test', UPSTASH_REDIS_REST_TOKEN: 'fixture-only', NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'fixture-only', TURNSTILE_SECRET_KEY: 'fixture-only', ...options.env };
  const fetch = async (url, init) => {
    if (String(url).endsWith('/pipeline')) return Response.json(JSON.parse(init.body).map(([op, key]) => {
      if (op === 'INCR') { const n = (store.get(key) || 0) + 1; store.set(key, n); return { result: n }; }
      if (op === 'SET') { if (store.has(key)) return { result: null }; store.set(key, 1); return { result: 'OK' }; }
      if (op === 'DEL') { store.delete(key); return { result: 1 }; }
      return { result: 1 };
    }));
    if (String(url).includes('/siteverify')) return Response.json({ success: new URLSearchParams(init.body).get('response') === 'valid-fixture-token' });
    assert.equal(String(url), 'https://api.resend.com/emails', 'No real external requests permitted');
    sends.push(JSON.parse(init.body));
    return options.resendFailure?.(sends.length) ? Response.json({ message: 'Fixture rejection' }, { status: 500 }) : Response.json({ id: `fixture-${sends.length}` });
  };
  const { load } = createLoader({ Date: TestDate, process: { env }, fetch, console: { ...console, error() {}, warn() {} } });
  const { POST } = load('src/app/api/contact/route.ts');
  let index = 0;
  function request(patch = {}, headers = {}) {
    const payload = { kind: 'enquiry', name: 'Fixture <Visitor>', email: 'visitor@example.test', message: 'Hello <script>alert(1)</script>', source: 'Automated fixture', startedAt: now - 5000, turnstileToken: 'valid-fixture-token', ...patch };
    return POST(new Request('http://localhost:3067/api/contact', { method: 'POST', headers: { host: 'localhost:3067', origin: 'http://localhost:3067', 'content-type': 'application/json', 'x-forwarded-for': `192.0.2.${++index}`, ...headers }, body: JSON.stringify(payload) }));
  }
  return { request, sends, store, env };
}
test('all form types route correctly, escape HTML, and acknowledge only after the academy send', async () => {
  const f = setup();
  for (const kind of ['enquiry', 'trial']) {
    const start = f.sends.length;
    const res = await f.request({ kind, email: `${kind}@example.test`, trialClass: kind === 'trial' ? 'Mon 5 PM' : '' });
    assert.equal(res.status, 200);
    assert.equal(f.sends.length - start, kind === 'enquiry' ? 1 : 2);
    assert.deepEqual(f.sends[start].to, ['academy@example.test']);
    assert.equal(f.sends[start].reply_to, `${kind}@example.test`);
    assert.ok(!f.sends[start].html.includes('<script>alert(1)</script>'));
    if (kind !== 'enquiry') assert.deepEqual(f.sends[start + 1].to, [`${kind}@example.test`]);
  }
});
test('duplicate free trials never send twice; shared lock uses a hash', async () => {
  const f = setup();
  assert.equal((await f.request({ kind: 'trial' })).status, 200);
  assert.equal((await f.request({ kind: 'trial', email: 'VISITOR@example.test' })).status, 409);
  assert.equal(f.sends.length, 2);
  assert.ok([...f.store.keys()].some(k => /^trial:[a-f0-9]{64}$/.test(k)));
  assert.ok(![...f.store.keys()].some(k => k.includes('@')));
});
test('provider failure releases trial lock for retry; confirmation failure preserves success', async () => {
  const f = setup({ resendFailure: n => n === 1 || n === 3 });
  assert.equal((await f.request({ kind: 'trial' })).status, 502);
  assert.equal((await f.request({ kind: 'trial' })).status, 200);
  assert.equal((await f.request({ kind: 'trial' })).status, 409);
});
test('validation, same-origin, timing, token and honeypot guards block sends', async () => {
  const cases = [ [{ email: 'invalid' }, {}, 400], [{ startedAt: TEST_NOW }, {}, 400], [{ turnstileToken: '' }, {}, 400], [{ turnstileToken: 'bad' }, {}, 400], [{}, { origin: 'https://attacker.example' }, 403], [{ kind: 'support' }, {}, 400], [{ message: 'x'.repeat(21000) }, {}, 413], [{ website: 'bot.example' }, {}, 200] ];
  for (const [payload, headers, status] of cases) {
    const f = setup(); assert.equal((await f.request(payload, headers)).status, status); assert.equal(f.sends.length, 0);
  }
});
test('rate limiting and missing configuration do not report success', async () => {
  const f = setup();
  for (let n = 0; n < 5; n++) assert.equal((await f.request({}, { 'x-forwarded-for': '192.0.2.80' })).status, 200);
  assert.equal((await f.request({}, { 'x-forwarded-for': '192.0.2.80' })).status, 429);
  const missing = setup({ env: { RESEND_API_KEY: '' } });
  assert.equal((await missing.request()).status, 503);
  assert.equal(missing.sends.length, 0);
});
test('claiming a special emails the academy the package and confirms to the member', async () => {
  const f = setup({ now: Date.parse('2026-11-03T18:00:00Z') });
  const res = await f.request({ kind: 'special', plan: 'black-friday:jiu-jitsu-lifetime', phone: '555-123-4567', email: 'member@example.test' });
  assert.equal(res.status, 200);
  assert.equal(f.sends.length, 2);
  assert.deepEqual(f.sends[0].to, ['academy@example.test']);
  assert.match(f.sends[0].subject, /^\[BLACK FRIDAY\] Fixture <Visitor> wants Jiu-Jitsu, Lifetime$/);
  assert.ok(f.sends[0].html.includes('Jiu-Jitsu · Lifetime · $5,997'));
  assert.ok(!f.sends[0].html.includes('<Visitor>'));
  assert.deepEqual(f.sends[1].to, ['member@example.test']);
  assert.equal(f.sends[1].subject, 'We got your Black Friday Special request');
  assert.ok(f.sends[1].html.includes('Jiu-Jitsu · Lifetime · $5,997'));
});
test('a special claim needs a real package from a running special', async () => {
  for (const [now, plan] of [[Date.parse('2026-11-03T18:00:00Z'), 'black-friday:jiu-jitsu-forever'], [Date.parse('2026-11-03T18:00:00Z'), ''], [Date.parse('2026-12-02T18:00:00Z'), 'black-friday:jiu-jitsu-lifetime']]) {
    const f = setup({ now });
    assert.equal((await f.request({ kind: 'special', plan })).status, 400);
    assert.equal(f.sends.length, 0);
  }
});
