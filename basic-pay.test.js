/* Run with: node basic-pay.test.js */

const assert = require('node:assert/strict');
const SCALES = require('./scale-data.js');

function phaseRates(grade) {
  return grade <= 9 ? { phase1: 40, phase2: 70 } : { phase1: 50, phase2: 75 };
}

function calculate(grade, current) {
  const scale = SCALES[grade];
  const fixed = Boolean(scale.fixed);
  const candidate = fixed ? null : scale.new[0] + current - scale.old[0];
  const applied = fixed ? scale.new[0] : scale.new.find((step) => step >= candidate);
  assert.ok(applied, `No new step for Grade ${grade}, current ${current}`);
  const totalIncrease = applied - current;
  const rates = fixed ? { phase1: null, phase2: null } : phaseRates(grade);
  return {
    candidate,
    applied,
    phase1: fixed ? applied : current + Math.round(totalIncrease * rates.phase1 / 100),
    phase2: fixed ? applied : current + Math.round(totalIncrease * rates.phase2 / 100),
    phase3: applied,
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
  phase1: 61956,
  phase2: 68628,
  phase3: 75300,
});
assert.deepEqual(calculate(9, 37900), {
  candidate: 59900,
  applied: 62000,
  phase1: 47540,
  phase2: 54770,
  phase3: 62000,
});
assert.deepEqual(calculate(10, 16000), {
  candidate: 32000,
  applied: 32000,
  phase1: 24000,
  phase2: 28000,
  phase3: 32000,
});
assert.deepEqual(calculate(20, 20010), {
  candidate: 31760,
  applied: 32600,
  phase1: 26305,
  phase2: 29453,
  phase3: 32600,
});
assert.deepEqual(calculate(1, 78000), {
  candidate: null,
  applied: 156000,
  phase1: 156000,
  phase2: 156000,
  phase3: 156000,
});

console.log(`Passed ${Object.keys(SCALES).length} grade regression suites plus Grade 9/10/20 and fixed-pay cases.`);
