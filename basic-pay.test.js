/* Run with: node basic-pay.test.js */

const assert = require('node:assert/strict');
const SCALES = require('./scale-data.js');

assert.deepEqual(SCALES[5].old, [43000, 44940, 46970, 49090, 51300, 53610, 56030, 58560, 61200, 63960, 66840, 69850]);

function phaseRates(grade) {
  return grade <= 9 ? { phase1: 40, phase2: 70 } : { phase1: 50, phase2: 75 };
}

function calculate(grade, current) {
  const scale = SCALES[grade];
  const fixed = Boolean(scale.fixed);
  const candidate = fixed ? null : scale.new[0] + current - scale.old[0];
  const applied = fixed ? scale.new[0] : scale.new.find((step) => step >= candidate);
  assert.ok(applied, `No new step for Grade ${grade}, current ${current}`);
  const annualIncrementBasic = fixed
    ? applied
    : (scale.new[scale.new.indexOf(applied) + 1] || applied);
  const totalIncrease = annualIncrementBasic - current;
  const rates = fixed ? { phase1: null, phase2: null } : phaseRates(grade);
  return {
    candidate,
    applied,
    annualIncrementBasic,
    phase1: fixed ? applied : current + Math.round(totalIncrease * rates.phase1 / 100),
    phase2: fixed ? applied : current + Math.round(totalIncrease * rates.phase2 / 100),
    phase3: annualIncrementBasic,
  };
}

for (const [gradeText, scale] of Object.entries(SCALES)) {
  const grade = Number(gradeText);
  const start = calculate(grade, scale.old[0]);
  assert.equal(start.applied, scale.new[0], `Grade ${grade} opening step`);

  const maximum = calculate(grade, scale.old[scale.old.length - 1]);
  assert.ok(maximum.applied <= scale.new[scale.new.length - 1], `Grade ${grade} maximum step`);
  assert.ok(maximum.phase1 <= maximum.phase2 && maximum.phase2 <= maximum.phase3, `Grade ${grade} phase order`);

  if (!scale.fixed && scale.old.length > 1) {
    const between = Math.floor((scale.old[0] + scale.old[1]) / 2);
    const result = calculate(grade, between);
    assert.ok(result.applied >= result.candidate, `Grade ${grade} next-higher-step rule`);
  }
}

assert.deepEqual(calculate(9, 53060), {
  candidate: 75060,
  applied: 75300,
  annualIncrementBasic: 79100,
  phase1: 63476,
  phase2: 71288,
  phase3: 79100,
});
// Grade 9 audit case: the candidate 75,060 is rounded to the next listed
// Gazette step, 75,300; it is not an extra Step-5/Step-6 advance.
assert.deepEqual(calculate(9, 53060).candidate, 75060);
assert.deepEqual(calculate(9, 53060).applied, 75300);
// Grade 5 guardrail: do not apply an additional competitor-style
// "Step 5/Step 6" advance after the Gazette next-higher-step rule.
assert.deepEqual(calculate(5, 53610), {
  candidate: 96610,
  applied: 96800,
  annualIncrementBasic: 100700,
  phase1: 72446,
  phase2: 86573,
  phase3: 100700,
});
assert.deepEqual(calculate(9, 37900), {
  candidate: 59900,
  applied: 62000,
  annualIncrementBasic: 65100,
  phase1: 48780,
  phase2: 56940,
  phase3: 65100,
});
assert.deepEqual(calculate(10, 16000), {
  candidate: 32000,
  applied: 32000,
  annualIncrementBasic: 33600,
  phase1: 24800,
  phase2: 29200,
  phase3: 33600,
});
assert.deepEqual(calculate(20, 20010), {
  candidate: 31760,
  applied: 32600,
  annualIncrementBasic: 34000,
  phase1: 27005,
  phase2: 30503,
  phase3: 34000,
});
assert.deepEqual(calculate(1, 78000), {
  candidate: null,
  applied: 156000,
  annualIncrementBasic: 156000,
  phase1: 156000,
  phase2: 156000,
  phase3: 156000,
});

console.log(`Passed ${Object.keys(SCALES).length} grade regression suites plus Grade 9/10/20 and fixed-pay cases.`);
