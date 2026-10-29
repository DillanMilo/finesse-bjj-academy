const test = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./load-typescript.cjs');
test('analytics refuses local, preview, denied and unknown consent traffic', () => {
  const { analyticsAllowed } = createLoader().load('src/lib/analytics.ts');
  assert.equal(analyticsAllowed('finessebjj.com', 'granted', true), true);
  assert.equal(analyticsAllowed('www.finessebjj.com', 'granted', true), true);
  for (const [host, consent, prod] of [['localhost', 'granted', true], ['preview.vercel.app', 'granted', true], ['finessebjj.com', 'granted', false], ['finessebjj.com', null, true], ['finessebjj.com', 'denied', true]]) assert.equal(analyticsAllowed(host, consent, prod), false);
});
test('lead tracking happens only after successful requests, with categorical data only', async () => {
  const events = [];
  const window = { location: { hostname: 'finessebjj.com' }, gtag: (...args) => events.push(args), dispatchEvent() {} };
  const { load } = createLoader({ window, localStorage: { getItem: () => 'granted', setItem() {} }, Event, fetch: async () => Response.json({ ok: true }) });
  const { sendContactForm } = load('src/lib/contact-form.ts');
  for (const kind of ['enquiry', 'trial', 'support']) await sendContactForm({ kind, name: 'Private Name', email: 'private@example.test', phone: '555555', message: 'Private message', source: 'Private source', startedAt: Date.now() });
  assert.deepEqual(events.map(e => e[1]), ['generate_lead', 'generate_lead', 'team_support_rsvp']);
  assert.ok(!JSON.stringify(events).includes('Private'));
  assert.ok(!JSON.stringify(events).includes('private@example.test'));
  assert.ok(!JSON.stringify(events).includes('555555'));
});
test('failed and duplicate submissions do not create conversions', async () => {
  for (const status of [409, 502, 503]) {
    const events = [];
    const { load } = createLoader({ window: { location: { hostname: 'finessebjj.com' }, gtag: (...args) => events.push(args), dispatchEvent() {} }, localStorage: { getItem: () => 'granted', setItem() {} }, Event, fetch: async () => Response.json({}, { status }) });
    await load('src/lib/contact-form.ts').sendContactForm({ kind: 'trial' });
    assert.equal(events.length, 0);
  }
});
