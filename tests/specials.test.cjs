const test = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./load-typescript.cjs');
const { load } = createLoader();
const { activeSpecial, formatPrice, lowestPrice, monthlyPrice, specials, timeLeftLabel } = load('src/lib/specials.ts');
const at = iso => Date.parse(iso);
const blackFriday = specials.find(special => special.slug === 'black-friday');
test('Black Friday runs all of November, Central Time', () => {
  assert.equal(activeSpecial(at('2026-10-31T23:59:59-05:00')), undefined);
  assert.equal(activeSpecial(at('2026-11-01T00:00:00-05:00'))?.slug, 'black-friday');
  assert.equal(activeSpecial(at('2026-11-30T23:59:59-06:00'))?.slug, 'black-friday');
  assert.equal(activeSpecial(at('2026-12-01T00:00:00-06:00')), undefined);
});
test('prices and monthly equivalents', () => {
  assert.equal(formatPrice(1839.2), '$1,839.20');
  assert.equal(formatPrice(5997), '$5,997');
  assert.equal(formatPrice(2988.7), '$2,988.70');
  assert.equal(monthlyPrice({ term: '1 year', price: 1839.2, months: 12 }), 153);
  assert.equal(monthlyPrice({ term: '2 years', price: 2988.7, months: 24 }), 125);
  assert.equal(monthlyPrice({ term: 'Lifetime', price: 5997 }), null);
  assert.equal(lowestPrice(blackFriday), 1598.4);
});
test('time left label', () => {
  assert.equal(timeLeftLabel(blackFriday, at('2026-11-03T09:00:00-06:00')), '27 days left');
  assert.equal(timeLeftLabel(blackFriday, at('2026-11-29T10:00:00-06:00')), 'Ends tomorrow');
  assert.equal(timeLeftLabel(blackFriday, at('2026-11-30T10:00:00-06:00')), 'Ends tonight');
});
