const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const posts = require('../src/lib/legacy-posts.json');
test('all 35 approved historical URLs retain safe local article data and media', () => {
  assert.equal(posts.length, 35);
  assert.equal(new Set(posts.map(p => p.path)).size, 35);
  function inspect(nodes) {
    for (const node of nodes) {
      if (typeof node === 'string') continue;
      assert.ok(!['script', 'iframe', 'style', 'input'].includes(node.tag));
      assert.ok(!Object.keys(node).some(k => /^on/i.test(k)));
      if (node.href) {
        assert.ok(/^(https?:\/\/|mailto:|tel:|\/(?!\/))/.test(node.href), node.href);
        assert.ok(!node.href.includes('sparkpages.io'));
        assert.ok(!node.href.startsWith('/wp-content/'));
      }
      if (node.src) {
        assert.ok(node.src.startsWith('/legacy-media/'));
        assert.ok(fs.existsSync(path.join(__dirname, '../public', node.src)));
        if (node.tag === 'img') assert.ok(node.width > 0 && node.height > 0);
      }
      inspect(node.children);
    }
  }
  for (const post of posts) {
    assert.match(post.path, /^\/(adult|kids|uncategorized)\/[a-z0-9-]+$/);
    assert.ok(post.title && post.description && post.body.length);
    if (!post.published.startsWith('2020')) assert.ok(!JSON.stringify(post.body).includes('17711'));
    inspect(post.body);
  }
});
test('the legacy cloned article redirects only to its identical original', () => {
  const redirects = require('../src/lib/legacy-redirects.json');
  const duplicate = redirects.find(r => r.source.endsWith('-cloned'));
  const source = posts.find(p => p.path === duplicate.source);
  const destination = posts.find(p => p.path === duplicate.destination);
  assert.deepEqual(source.body, destination.body);
  assert.equal(source.title, destination.title);
});
