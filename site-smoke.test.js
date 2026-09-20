/* Run with: node site-smoke.test.js */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const required = [
  'index.html', 'pension.html', 'styles.css', 'release-meta.js', 'app.js',
  'pension.js', 'scale-data.js', 'retirement-data.js', 'robots.txt', 'sitemap.xml',
  'about.html', 'methodology.html', 'privacy.html', 'terms.html', 'changelog.html'
];

required.forEach((file) => assert.ok(fs.existsSync(path.join(root, file)), `Missing required file: ${file}`));

function localTargets(file) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const targets = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  return targets
    .filter((target) => !/^(?:https?:|mailto:|#|data:)/i.test(target))
    .map((target) => target.split('?')[0].split('#')[0]);
}

for (const page of fs.readdirSync(root).filter((file) => file.endsWith('.html'))) {
  for (const target of localTargets(page)) {
    assert.ok(fs.existsSync(path.join(root, target)), `${page} points to missing local target: ${target}`);
  }
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const pension = fs.readFileSync(path.join(root, 'pension.html'), 'utf8');
assert.match(index, /release-meta\.js\?v=1/);
assert.match(pension, /release-meta\.js\?v=1/);
assert.match(index, /app\.js\?v=27/);
assert.match(pension, /pension\.js\?v=3/);
assert.match(index, /object-src 'none'/);
assert.match(index, /Version 1\.24/);
assert.match(pension, /Version 1\.24/);
assert.match(index, /href="about\.html"/);
assert.match(index, /href="methodology\.html"/);
assert.match(index, /href="privacy\.html"/);
assert.match(index, /href="terms\.html"/);
assert.match(index, /href="changelog\.html"/);
assert.match(index, /discrepancy%20report/);
assert.doesNotMatch(index, /<section class="results"[^>]*aria-live=/);

console.log(`Passed static site smoke test across ${fs.readdirSync(root).filter((file) => file.endsWith('.html')).length} HTML pages.`);
