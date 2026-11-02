const test = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./load-typescript.cjs');
const { load } = createLoader({ TextEncoder });
const { GET } = load('src/app/calendar/[file]/route.ts');
const { calendarLinks, eventTimes } = load('src/lib/calendar.ts');
const get = (file, query = '') => GET(new Request(`http://localhost:3067/calendar/${file}${query}`), { params: Promise.resolve({ file }) });
test('promotion .ics is an all-day event at the academy', async () => {
  const res = await get('belt-promotion-2026-11-18.ics', '?for=promotion');
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /^text\/calendar/);
  assert.match(res.headers.get('content-disposition'), /filename="belt-promotion-2026-11-18\.ics"/);
  const ics = await res.text();
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /\r\nDTSTART;VALUE=DATE:20261118\r\nDTEND;VALUE=DATE:20261119\r\n/);
  assert.match(ics, /\r\nDESCRIPTION:Belt promotion at Finesse BJJ Academy\.\r\n/);
  assert.match(ics, /\r\nLOCATION:Finesse BJJ Academy\\, /);
  assert.ok(ics.split('\r\n').every(line => new TextEncoder().encode(line).length <= 75), 'lines are folded');
});
test('an event with a start time is timed, converted from Central Time', async () => {
  const ics = await (await get('submission-hunter-pro-105-2026-11.ics', '?for=supporting')).text();
  // Nov 15 is after daylight saving ends: 1:30 PM CST is 19:30 UTC, three hours by default.
  assert.match(ics, /\r\nDTSTART:20261115T193000Z\r\nDTEND:20261115T223000Z\r\n/);
  assert.match(ics, /\r\nDESCRIPTION:Cheering on the Finesse BJJ team\.\\nDoors open 1:30 PM\r\n/);
  assert.deepEqual({ ...eventTimes({ slug: 's', name: 'n', isoDate: '2026-07-04', date: '', startTime: '13:30', endTime: '15:00' }) }, { allDay: false, start: '20260704T183000Z', end: '20260704T200000Z' });
});
test('google link and .ics link match the event', () => {
  const links = calendarLinks({ slug: 'belt-promotion-2026-11-18', name: 'Belt Promotion', isoDate: '2026-11-18', date: '' }, 'promotion');
  assert.equal(links.ics, '/calendar/belt-promotion-2026-11-18.ics?for=promotion');
  const google = new URL(links.google);
  assert.equal(google.searchParams.get('dates'), '20261118/20261119');
  assert.equal(google.searchParams.get('text'), 'Belt Promotion');
});
test('unknown events 404 and unknown notes fall back', async () => {
  assert.equal((await get('nope.ics')).status, 404);
  assert.equal((await get('belt-promotion-2026-11-18')).status, 404);
  assert.match(await (await get('belt-promotion-2026-11-18.ics', '?for=toString')).text(), /DESCRIPTION:Belt promotion/);
});
