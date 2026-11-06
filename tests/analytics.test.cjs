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
  for (const kind of ['enquiry', 'trial']) await sendContactForm({ kind, name: 'Private Name', email: 'private@example.test', phone: '555555', message: 'Private message', source: 'Private source', startedAt: Date.now() });
  const { sendSheetForm } = load('src/lib/sheet-forms.ts');
  await sendSheetForm('/api/competition-signup', { name: 'Private Name', contact: '555555', event: 'x', role: 'supporting', guests: '0', startedAt: Date.now() });
  await sendSheetForm('/api/promotion-checkin', { name: 'Private Name', contact: 'private@example.test', event: 'x', belt: 'Blue', attending: 'yes', startedAt: Date.now() });
  assert.deepEqual(events.map(e => e[1]), ['generate_lead', 'generate_lead', 'team_support_rsvp', 'promotion_checkin']);
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

test('the site uses only the Finesse BJJ GA4 stream and loads one Google tag', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const { GA_ID } = createLoader().load('src/lib/analytics.ts');
  assert.equal(GA_ID, 'G-HZ491L13L8');
  const files = [];
  const walk = dir => { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const full = path.join(dir, entry.name); if (entry.isDirectory()) walk(full); else if (/\.(ts|tsx|js|mjs)$/.test(entry.name)) files.push(full); } };
  walk(path.join(__dirname, '..', 'src'));
  const source = files.map(file => fs.readFileSync(file, 'utf8')).join('\n');
  assert.ok(!source.includes('G-9N5EQ7RVHQ'), 'retired measurement ID must not return');
  assert.deepEqual([...new Set(source.match(/G-[A-Z0-9]{8,12}/g))], ['G-HZ491L13L8']);
  assert.equal(source.match(/googletagmanager\.com\/gtag\/js/g).length, 1);
});
