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
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const pensionJs = fs.readFileSync(path.join(root, 'pension.js'), 'utf8');
assert.match(index, /release-meta\.js\?v=1/);
assert.match(pension, /release-meta\.js\?v=1/);
assert.match(index, /app\.js\?v=30/);
assert.match(pension, /pension\.js\?v=6/);
assert.match(index, /styles\.css\?v=22/);
assert.match(pension, /styles\.css\?v=22/);
assert.match(index, /object-src 'none'/);
assert.match(index, /Version 1\.29/);
assert.match(pension, /Version 1\.29/);
assert.ok(fs.existsSync(path.join(root, 'NotoSansBengali.ttf')), 'Missing bundled Bengali font');
const styles = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
assert.match(styles, /@font-face/);
assert.match(styles, /NotoSansBengali\.ttf/);
assert.match(styles, /RegTech Bengali/);
assert.match(index, /<td>গ্রেড ১<\/td>/);
assert.match(index, /<td>গ্রেড ২০<\/td>/);
assert.match(index, /id="salary-audit-summary"/);
assert.match(pension, /<option value="" selected>নির্বাচন করুন<\/option>/);
assert.match(pension, /id="retirement-audit-summary"/);
assert.match(pension, /id="retirement-phase"/);
assert.match(pension, /id="retirement-audit-phase"/);
assert.match(pension, /id="retirement-audit-net"/);
assert.match(pension, /id="retirement-audit-source"/);
assert.match(pension, /id="retirement-audit-version"/);
assert.match(pension, /id="retirement-net-card" hidden/);
assert.match(pension, /id="retirement-net-placeholder"/);
assert.match(pension, /id="retirement-commutation"/);
assert.match(pension, /সমর্পণ: ৫০% ধরে/);
assert.equal((pension.match(/id="print-pension-result"/g) || []).length, 1);
assert.match(app, /pension\.html\?basic=.*phase1=.*phase2=.*phase3=/);
assert.match(app, /as of ১৭ সেপ্টেম্বর ২০২৬/);
assert.match(app, /arrearsPeriod\.fullMonths/);
assert.match(index, /২ পূর্ণ মাস \+ ১৭ দিন/);
assert.match(index, /id="open-retirement-benefits" class="secondary-button" href="pension\.html">পেনশন হিসাব খুলুন/);
assert.match(pensionJs, /linkedPhase && !linkedBasicAvailable/);
assert.match(pensionJs, /retirementBasic\.readOnly = linked/);
assert.match(pensionJs, /surrenderedPension/);
assert.match(pensionJs, /retirementNetPlaceholder/);
assert.match(app, /document\.fonts\?\.ready/);
assert.match(pensionJs, /document\.fonts\?\.ready/);
assert.doesNotMatch(index, /id="government-housing" checked/);
assert.doesNotMatch(index, /id="medical-eligible" checked/);
assert.doesNotMatch(index, /id="mobile-eligible" checked/);
assert.match(index, /href="about\.html"/);
assert.match(index, /href="methodology\.html"/);
assert.match(index, /href="privacy\.html"/);
assert.match(index, /href="terms\.html"/);
assert.match(index, /href="changelog\.html"/);
assert.match(index, /discrepancy%20report/);
assert.doesNotMatch(index, /<section class="results"[^>]*aria-live=/);

console.log(`Passed static site smoke test across ${fs.readdirSync(root).filter((file) => file.endsWith('.html')).length} HTML pages.`);
