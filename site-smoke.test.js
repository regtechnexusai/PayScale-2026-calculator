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
    // Shared shell assets are supplied by the deployment repository root, not duplicated here.
    if (target.startsWith('/')) continue; // Root-relative links resolve against the deployment repository, not this source package.
    assert.ok(fs.existsSync(path.join(root, target)), `${page} points to missing local target: ${target}`);
  }
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const pension = fs.readFileSync(path.join(root, 'pension.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const pensionJs = fs.readFileSync(path.join(root, 'pension.js'), 'utf8');
assert.match(index, /release-meta\.js\?v=4/);
assert.match(pension, /release-meta\.js\?v=4/);
assert.match(index, /app\.js\?v=32/);
assert.ok(pension.includes('retirement-data.js?v=5'));
assert.ok(pension.includes('pension.js?v=12'));
[
  '<td>১২ বছর</td><td>৪৩%</td>',
  '<td>১৩ বছর</td><td>৪৭%</td>',
  '<td>১৭ বছর</td><td>৬৩%</td>',
  '<td>১৮ বছর</td><td>৬৫%</td>',
  '<td>১৯ বছর</td><td>৬৯%</td>',
  '<td>২২ বছর</td><td>৭৯%</td>',
  '<td>২৩ বছর</td><td>৮৩%</td>'
].forEach((row) => assert.ok(pension.includes(row), 'Missing Gazette rate row: ' + row));
assert.ok(!pension.includes('<td>২৩ বছর</td><td>৮১%</td>'), 'Stale 23-year rate remains');
assert.ok(index.includes('styles.css?v=34'), 'Main calculator must load the refreshed stylesheet');
assert.ok(pension.includes('styles.css?v=34'), 'Pension page must load the refreshed stylesheet');
assert.match(index, /object-src 'none'/);
assert.match(index, /সাম্প্রতিক হালনাগাদ/);
assert.match(index, /সংশোধনী, ব্যাখ্যা বা বাস্তবায়ন নির্দেশ/);
assert.match(index, /Version 1\.33/);
assert.match(pension, /class="pension-page"/);
assert.ok(fs.existsSync(path.join(root, 'NotoSansBengali.ttf')), 'Missing bundled Bengali font');
const styles = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
assert.ok(styles.includes('@media (max-width: 1100px)'), 'Compact viewport layout rules must be present');
assert.match(styles, /color: #e0eaf8 !important;/, 'High-contrast helper text rules must be present');
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
assert.match(pension, /id="retirement-net-uncapped"/);
assert.match(pension, /id="retirement-net-minimum"/);
assert.match(pension, /id="retirement-net-maximum"/);
assert.match(pension, /id="retirement-net-cap-status"/);
assert.match(pension, /id="retirement-net-placeholder"/);
assert.match(pension, /id="retirement-commutation"/);
assert.match(pension, /Manual verification required/);
assert.match(pension, /id="retirement-rate-table-note"/);
assert.match(pension, /retirement-reference-grid/);
assert.match(styles, /html body\.pension-page footer\.rt-shell-footer/);
assert.doesNotMatch(styles, /#retirement-form, \.retirement-reference,/);
assert.ok(pension.includes('<td>২৩ বছর</td><td>৮৩%</td>'));
assert.match(index, /id="gross-phase3-manual-other"/);
assert.match(index, /id="gross-selection-note"/);
assert.ok(index.includes('গ্রেড ১৩–২০; প্রতিষ্ঠান থেকে lunch/free meal না পেলে।'));
assert.match(index, /গ্রেড ১১–২০; সিটি কর্পোরেশন এলাকায় কর্মস্থল হলে/);
assert.match(index, /id="gross-house-rule"/);
assert.match(pension, /সমর্পণ: ৫০% ধরে/);
assert.equal((pension.match(/id="print-pension-result"/g) || []).length, 1);
assert.match(app, /pension\.html\?basic=.*phase1=.*phase2=.*phase3=/);
assert.match(app, /arrearsBreakdownToDate/);
assert.match(app, /grade >= 11 && grade <= 20 && station !== 'other'/);
assert.match(app, /tiffin\.disabled = grade < 13/);
assert.match(app, /travel\.disabled = grade < 11 \|\| grade > 20/);
assert.match(app, /grade >= 11 && grade <= 20 && station !== 'other'/);
assert.match(app, /arrearsPeriod\.phase1\.fullMonths/);
assert.ok(!index.includes('২ পূর্ণ মাস + ১৭ দিন'));
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
// The calculator now uses the main site's shared footer rather than its former local footer links.
assert.match(index, /class="rt-shell-footer"/);
assert.match(index, /href="\/privacy\.html"/);
assert.match(index, /href="\/terms\.html"/);
assert.match(index, /href="\/contact\.html"/);
assert.match(index, /href="\/student\//);
assert.doesNotMatch(index, /<section class="results"[^>]*aria-live=/);

console.log(`Passed static site smoke test across ${fs.readdirSync(root).filter((file) => file.endsWith('.html')).length} HTML pages.`);
