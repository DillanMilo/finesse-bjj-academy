const test = require('node:test');
const assert = require('node:assert/strict');
const createLoader = require('./load-typescript.cjs');
test('previews and local builds remain non-indexable and advertise no sitemap', () => {
  for (const value of ['preview', 'development', undefined]) {
    const { load } = createLoader({ process: { env: { VERCEL_ENV: value } } });
    assert.equal(load('src/lib/seo.ts').IS_PRODUCTION, false);
    const robots = load('src/app/robots.ts').default();
    assert.equal(robots.rules.disallow, '/');
    assert.equal(robots.sitemap, undefined);
    assert.equal(load('src/app/sitemap.ts').default().length, 0);
  }
});
test('launch sitemap includes only the canonical host and accurate content routes', () => {
  const { load } = createLoader({ process: { env: { VERCEL_ENV: 'production' } } });
  const urls = load('src/app/sitemap.ts').default().map(p => p.url);
  assert.ok(urls.length >= 15);
  assert.equal(urls.length, new Set(urls).size);
  assert.ok(urls.every(u => u.startsWith('https://finessebjj.com/')));
  assert.ok(!urls.some(u => /^\/(privacy|terms|api)(?:\/|$)/.test(new URL(u).pathname)));
  const seo = load('src/lib/seo.ts');
  assert.equal(new Set(seo.staticPages.map(p => p[1])).size, seo.staticPages.length);
});
