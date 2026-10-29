const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.argv[2] || 'http://127.0.0.1:3067';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), 'Only a local test server is allowed');
(async () => {
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const redirects = require('../src/lib/legacy-redirects.json');
  const pages = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]).pathname);
  assert.ok(pages.length >= 15);
  pages.push('/privacy', '/terms');
  const results = [], destinations = new Set(), titles = new Set();
  for (const route of pages) {
    const res = await fetch(base + route);
    assert.equal(res.status, 200, route);
    const html = await res.text();
    const canonical = [...html.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/g)].map(m => m[1]);
    assert.deepEqual(canonical, [`https://finessebjj.com${route === '/' ? '' : route}`], `${route} canonical`);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title && !titles.has(title), `Unique title for ${route}`); titles.add(title);
    assert.ok(/name="description" content="[^"]+"/.test(html), `${route} description`);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${route} H1`);
    assert.ok(html.includes('lang="en"'));
    if (route === '/') {
      for (const id of ['programs', 'trainers', 'store']) assert.ok(html.includes(`id="${id}"`), `Initial HTML contains ${id}`);
      assert.ok(html.includes('LUIS DIAZ') && html.includes('what-your-child-learns-on-the-mat'), 'Homepage content and news links are server-rendered');
    }
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]));
    assert.ok(schemas.some(s => s['@graph']?.some(e => e.address?.streetAddress === '18300 Strack Dr, Suite 300')));
    const markup = html.replace(/<script\b[\s\S]*?<\/script>/gi, '');
    for (const m of markup.matchAll(/href="(\/[^"]*)"/g)) destinations.add(new URL(m[1].replaceAll('&amp;', '&'), base).pathname);
    const og = html.match(/property="og:image" content="([^"]+)"/)?.[1];
    assert.ok(og && fs.existsSync(path.join(process.cwd(), 'public', new URL(og).pathname)), `${route} social asset`);
    results.push({ route, status: res.status, title, canonical: canonical[0], schemas: schemas.length });
  }
  for (const route of destinations) {
    const res = await fetch(base + route); assert.equal(res.status, 200, `Internal destination ${route}`);
  }
  for (const route of ['/not-a-real-page', '/news/not-a-real-post', '/competitions/not-a-real-event']) assert.equal((await fetch(base + route)).status, 404, route);
  for (const [old, next] of [...redirects.map(r => [r.source, r.destination]), ['/contact-us', '/contact'], ['/adults-brazilian-jiu-jitsu-spring', '/programs/adult-bjj'], ['/kids-brazilian-jiu-jitsu-spring', '/programs/kids-bjj'], ['/wrestling-jiu-jitsu-spring', '/programs/wrestling'], ['/services', '/#programs'], ['/our-team', '/about']]) {
    const res = await fetch(base + old, { redirect: 'manual' }); assert.equal(res.status, 308, old); assert.equal(res.headers.get('location'), next);
  }
  const robots = await (await fetch(`${base}/robots.txt`)).text();
  assert.ok(robots.includes('Disallow: /api/') && robots.includes('Sitemap: https://finessebjj.com/sitemap.xml'));
  fs.writeFileSync('/private/tmp/finesse-local-site-check.json', JSON.stringify({ checkedAt: new Date().toISOString(), pages: results, internalDestinations: destinations.size, legacyRedirects: 6 + redirects.length, notFoundRoutes: 3 }, null, 2));
  console.log(`PASS: ${results.length} pages; metadata, schema, social assets, ${destinations.size} internal destinations, ${6 + redirects.length} redirects and 3 real 404s.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
