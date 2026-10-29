const test = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./load-typescript.cjs');
function at(iso) {
  class Clock extends Date { constructor(...args) { super(...(args.length ? args : [iso])); } static now() { return Date.parse(iso); } }
  return createLoader({ Date: Clock }).load('src/lib/schedule.ts');
}
test('client-confirmed ranges participate in live class detection', () => {
  const s = at('2026-10-26T11:30:00Z'); // Monday 6:30 AM Central
  assert.equal(s.getCurrentClass().classSlot.title, 'Adults NoGi');
  assert.equal(s.isClassActive(1, '06:00 – 07:00'), true);
});
test('a listed start without an end never becomes an invented live session', () => {
  const s = at('2026-10-26T21:50:00Z'); // Monday 4:50 PM Central
  assert.equal(s.isClassActive(1, '16:45'), false);
  assert.equal(s.getCurrentClass(), null);
});
