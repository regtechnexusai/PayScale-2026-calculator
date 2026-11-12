/* Run with: node retirement-benefits.test.js */

const assert = require('node:assert/strict');
const RULES = require('./retirement-data.js');

function gratuityRate(serviceYears) {
  return RULES.gratuityBands.find((band) => serviceYears >= band.min && serviceYears <= band.max)?.rate || null;
}

function netBand(currentNet) {
  return RULES.netPensionBands.find((band) => currentNet >= (band.min || 0) && currentNet <= (band.max || Infinity));
}

function calculate(basic, serviceYears, leaveMonths, currentNet = null, commutationPercent = 50) {
  const rate = RULES.grossPensionRates[Math.min(25, serviceYears)];
  const grossPension = Math.round(basic * rate / 100);
  const surrenderedPension = Math.round(grossPension * commutationPercent / 100);
  const pensionablePortion = grossPension - surrenderedPension;
  const gratuity = surrenderedPension * gratuityRate(serviceYears);
  const leaveEncashment = basic * Math.min(RULES.maximumLeaveMonths, leaveMonths);
  const band = Number.isFinite(currentNet) && currentNet > 0 ? netBand(currentNet) : null;
  const adjustedNet = band
    ? Math.min(band.maximum, Math.max(band.minimum, Math.round(currentNet * (1 + band.rate / 100))))
    : null;
  return { grossPension, surrenderedPension, pensionablePortion, gratuity, leaveEncashment, adjustedNet };
}

assert.deepEqual(RULES.grossPensionRates, {
  5: 21, 6: 24, 7: 27, 8: 30, 9: 33,
  10: 36, 11: 39, 12: 43, 13: 47, 14: 51,
  15: 54, 16: 57, 17: 63, 18: 65, 19: 69,
  20: 72, 21: 75, 22: 79, 23: 83, 24: 87, 25: 90
});
assert.equal(RULES.grossPensionRates[5], 21);
assert.equal(RULES.grossPensionRates[25], 90);
assert.equal(RULES.grossPensionRates[30], undefined);
assert.deepEqual(Object.keys(RULES.grossPensionRates).map(Number), Array.from({ length: 21 }, (_, index) => index + 5));
for (const years of Object.keys(RULES.grossPensionRates).map(Number)) {
  assert.ok(RULES.grossPensionRates[years] > 0, `Gross pension rate for ${years} years`);
  assert.ok(gratuityRate(years) > 0, `Gratuity rate for ${years} years`);
}
assert.equal(gratuityRate(9), 265);
assert.equal(gratuityRate(10), 260);
assert.equal(gratuityRate(14), 260);
assert.equal(gratuityRate(15), 245);
assert.equal(gratuityRate(19), 245);
assert.equal(gratuityRate(20), 230);
assert.equal(gratuityRate(25), 230);

assert.equal(netBand(9000).rate, 100);
assert.equal(netBand(9001).rate, 75);
assert.equal(netBand(20000).rate, 75);
assert.equal(netBand(20001).rate, 65);
assert.equal(netBand(30000).rate, 65);
assert.equal(netBand(30001).rate, 60);
assert.equal(netBand(40000).rate, 60);
assert.equal(netBand(40001).rate, 55);
assert.equal(netBand(100000).rate, 55);

assert.deepEqual(calculate(50000, 25, 18), {
  grossPension: 45000,
  surrenderedPension: 22500,
  pensionablePortion: 22500,
  gratuity: 5175000,
  leaveEncashment: 900000,
  adjustedNet: null
});
assert.equal(calculate(50000, 25, 18, 20000).adjustedNet, 35000);
assert.equal(calculate(50000, 25, 18, 30000).adjustedNet, 49000);
assert.equal(calculate(50000, 25, 24).leaveEncashment, 900000);
assert.equal(calculate(143800, 25, 18).grossPension, 129420);
assert.equal(calculate(143800, 25, 18).surrenderedPension, 64710);
assert.equal(calculate(143800, 25, 18).pensionablePortion, 64710);
assert.equal(calculate(143800, 25, 18).gratuity, 14883300);
assert.equal(calculate(143800, 25, 18).leaveEncashment, 2588400);
assert.equal(calculate(100240, 25, 18).grossPension, 90216);
assert.equal(calculate(100240, 25, 18).gratuity, 10374840);
assert.equal(calculate(100240, 25, 18).leaveEncashment, 1804320);
assert.equal(calculate(119620, 25, 18).grossPension, 107658);
assert.equal(calculate(119620, 25, 18).gratuity, 12380670);
assert.equal(calculate(50000, 25, 18, 9000).adjustedNet, 18000);
assert.equal(calculate(50000, 25, 18, 100000).adjustedNet, 70200);
assert.equal(calculate(50000, 25, 18, 0).adjustedNet, null);

assert.deepEqual(calculate(100000, 12, 18, null, 40), {
  grossPension: 43000,
  surrenderedPension: 17200,
  pensionablePortion: 25800,
  gratuity: 4472000,
  leaveEncashment: 1800000,
  adjustedNet: null
});
assert.deepEqual(calculate(100000, 12, 18, null, 60), {
  grossPension: 43000,
  surrenderedPension: 25800,
  pensionablePortion: 17200,
  gratuity: 6708000,
  leaveEncashment: 1800000,
  adjustedNet: null
});
assert.deepEqual(calculate(100000, 17, 18, null, 40), {
  grossPension: 63000,
  surrenderedPension: 25200,
  pensionablePortion: 37800,
  gratuity: 6174000,
  leaveEncashment: 1800000,
  adjustedNet: null
});
assert.deepEqual(calculate(100000, 17, 18, null, 60), {
  grossPension: 63000,
  surrenderedPension: 37800,
  pensionablePortion: 25200,
  gratuity: 9261000,
  leaveEncashment: 1800000,
  adjustedNet: null
});
assert.deepEqual(calculate(100000, 22, 18, null, 40), {
  grossPension: 79000,
  surrenderedPension: 31600,
  pensionablePortion: 47400,
  gratuity: 7268000,
  leaveEncashment: 1800000,
  adjustedNet: null
});
assert.deepEqual(calculate(100000, 22, 18, null, 60), {
  grossPension: 79000,
  surrenderedPension: 47400,
  pensionablePortion: 31600,
  gratuity: 10902000,
  leaveEncashment: 1800000,
  adjustedNet: null
});

console.log('Passed retirement-rate, gratuity, net-pension-band, leave-encashment and commutation-sensitivity tests.');
