const test = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./load-typescript.cjs');
const TEST_NOW = Date.parse('2026-10-29T18:00:00Z');
class TestDate extends Date { constructor(...args) { super(...(args.length ? args : [TEST_NOW])); } static now() { return TEST_NOW; } }
const ROUTES = {
  competition: { file: 'src/app/api/competition-signup/route.ts', env: 'FINESSE_COMPETITION_SHEET_URL', url: 'https://script.example.test/competition/exec', payload: { event: 'naga-houston-2026-10', role: 'supporting', guests: '2' } },
  promotion: { file: 'src/app/api/promotion-checkin/route.ts', env: 'FINESSE_PROMOTION_SHEET_URL', url: 'https://script.example.test/promotion/exec', payload: { event: 'belt-promotion-2026-11-18', belt: 'Blue', stripes: '2', attending: 'yes' } },
};
function setup(which, options = {}) {
  const route = ROUTES[which], posts = [];
  const env = { [route.env]: route.url, FINESSE_SHEETS_SECRET: 'fixture-secret', ...options.env };
  const fetch = async (url, init) => {
    assert.equal(String(url), route.url, 'No real external requests permitted');
    posts.push(JSON.parse(init.body));
    return options.reply ? options.reply() : Response.json({ ok: true });
  };
  const { load } = createLoader({ Date: TestDate, process: { env }, fetch, console: { ...console, error() {}, warn() {} } });
  const { POST } = load(route.file);
  let index = 0;
  function request(patch = {}, headers = {}) {
    const payload = { name: 'Fixture Member', contact: 'member@example.test', startedAt: TEST_NOW - 5000, ...route.payload, ...patch };
    return POST(new Request(`http://localhost:3067${route.file.slice(7, -9)}`, { method: 'POST', headers: { host: 'localhost:3067', origin: 'http://localhost:3067', 'content-type': 'application/json', 'x-forwarded-for': `192.0.2.${++index}`, ...headers }, body: JSON.stringify(payload) }));
  }
  return { request, posts };
}
test('each form adds one row with the secret and the expected columns', async () => {
  const c = setup('competition');
  assert.equal((await c.request()).status, 200);
  assert.deepEqual(c.posts, [{ secret: 'fixture-secret', headers: ['Name', 'Phone or email', 'Competition', 'Event date', 'Competing or supporting', 'Guests'], values: ['Fixture Member', 'member@example.test', 'NAGA Houston Grappling Championship', '2026-10-31', 'Supporting', '2'] }]);
  assert.equal((await c.request({ role: 'competing', guests: '5', contact: '(346) 418-2999' })).status, 200);
  assert.deepEqual(c.posts[1].values.slice(4), ['Competing', '0']);
  const p = setup('promotion');
  assert.equal((await p.request({ contact: '+1 346 418 2999' })).status, 200);
  assert.deepEqual(p.posts[0].headers, ['Name', 'Phone or email', 'Promotion', 'Event date', 'Belt', 'Attending', 'Stripes']);
  assert.deepEqual(p.posts[0].values, ['Fixture Member', "'+1 346 418 2999", 'Belt Promotion', '2026-11-18', 'Blue', 'Yes', '2']);
  assert.equal((await p.request({ belt: 'Grey/Black', stripes: '0' })).status, 200);
  assert.deepEqual(p.posts[1].values.slice(4), ['Grey/Black', 'Yes', '0']);
  assert.equal((await p.request({ belt: 'Black', stripes: '6' })).status, 200);
});
test('formula-looking names are stored as plain text', async () => {
  const c = setup('competition');
  assert.equal((await c.request({ name: '=HYPERLINK("https://x.example")' })).status, 200);
  assert.equal(c.posts[0].values[0], `'=HYPERLINK("https://x.example")`);
});
test('missing env answers "not configured" without calling Google', async () => {
  for (const which of Object.keys(ROUTES)) {
    for (const env of [{ [ROUTES[which].env]: '' }, { FINESSE_SHEETS_SECRET: '' }]) {
      const f = setup(which, { env });
      const res = await f.request();
      assert.equal(res.status, 503);
      assert.equal((await res.json()).configured, false);
      assert.equal(f.posts.length, 0);
    }
  }
});
test('validation, origin, timing and honeypot guards add no row', async () => {
  const cases = {
    competition: [[{ name: '' }, 400], [{ contact: 'not contact' }, 400], [{ contact: '12345' }, 400], [{ event: 'missing' }, 400], [{ role: 'judge' }, 400], [{ event: 'submission-hunter-pro-105-2026-11', role: 'competing' }, 400], [{ guests: '21' }, 400], [{ name: 'x'.repeat(101) }, 400]],
    promotion: [[{ event: 'missing' }, 400], [{ belt: 'Red' }, 400], [{ stripes: undefined }, 400], [{ stripes: '5' }, 400], [{ stripes: '-1' }, 400], [{ stripes: 2 }, 400], [{ belt: 'Black', stripes: '7' }, 400], [{ attending: 'maybe' }, 400], [{ contact: 'a@b' }, 400]],
  };
  for (const which of Object.keys(ROUTES)) {
    for (const [payload, status] of [...cases[which], [{ startedAt: TEST_NOW }, 400], [{ website: 'bot.example' }, 200]]) {
      const f = setup(which); assert.equal((await f.request(payload)).status, status, JSON.stringify(payload)); assert.equal(f.posts.length, 0);
    }
    const f = setup(which);
    assert.equal((await f.request({}, { origin: 'https://attacker.example' })).status, 403);
    assert.equal((await f.request({}, { 'content-type': 'text/plain' })).status, 415);
    assert.equal(f.posts.length, 0);
  }
});
test('script errors and rate limits do not report success', async () => {
  for (const reply of [() => Response.json({ ok: false, error: 'unauthorized' }), () => new Response('<html>Sign in</html>'), () => { throw new Error('timeout'); }]) {
    assert.equal((await setup('promotion', { reply }).request()).status, 502);
  }
  const f = setup('competition');
  for (let n = 0; n < 5; n++) assert.equal((await f.request({}, { 'x-forwarded-for': '192.0.2.80' })).status, 200);
  assert.equal((await f.request({}, { 'x-forwarded-for': '192.0.2.80' })).status, 429);
});
