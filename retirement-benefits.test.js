/* Run with: node retirement-benefits.test.js */

const assert = require('node:assert/strict');
const RULES = require('./retirement-data.js');

function gratuityRate(serviceYears) {
  return RULES.gratuityBands.find((band) => serviceYears >= band.min && serviceYears <= band.max)?.rate || null;
}

function netBand(currentNet) {
  return RULES.netPensionBands.find((band) => currentNet >= (band.min || 0) && currentNet <= (band.max || Infinity));
}

function calculate(basic, serviceYears, leaveMonths, currentNet = null) {
  const rate = RULES.grossPensionRates[Math.min(25, serviceYears)];
  const grossPension = Math.round(basic * rate / 100);
  const pensionablePortion = Math.round(grossPension / 2);
  const gratuity = pensionablePortion * gratuityRate(serviceYears);
  const leaveEncashment = basic * Math.min(RULES.maximumLeaveMonths, leaveMonths);
  const band = Number.isFinite(currentNet) ? netBand(currentNet) : null;
  const adjustedNet = band
    ? Math.min(band.maximum, Math.max(band.minimum, Math.round(currentNet * (1 + band.rate / 100))))
    : null;
  return { grossPension, pensionablePortion, gratuity, leaveEncashment, adjustedNet };
}

assert.equal(RULES.grossPensionRates[5], 21);
assert.equal(RULES.grossPensionRates[25], 90);
assert.equal(RULES.grossPensionRates[30], undefined);
assert.equal(gratuityRate(9), 265);
assert.equal(gratuityRate(14), 260);
assert.equal(gratuityRate(19), 245);
assert.equal(gratuityRate(25), 230);

assert.deepEqual(calculate(50000, 25, 18), {
  grossPension: 45000,
  pensionablePortion: 22500,
  gratuity: 5175000,
  leaveEncashment: 900000,
  adjustedNet: null
});
assert.equal(calculate(50000, 25, 18, 20000).adjustedNet, 35000);
assert.equal(calculate(50000, 25, 18, 30000).adjustedNet, 49000);
assert.equal(calculate(50000, 25, 24).leaveEncashment, 900000);

console.log('Passed retirement-rate, gratuity, net-pension-band and leave-encashment tests.');
