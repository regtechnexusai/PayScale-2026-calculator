/*
 * Standalone pension and retirement-benefits review page. Version 1.24.
 * The salary calculator links here but does not combine salary and pension
 * results. Retirement rules live in retirement-data.js as the single source.
 */

const bnDigits = '০১২৩৪৫৬৭৮৯';
const enDigits = '0123456789';
const toBn = (value) => String(value).replace(/[0-9]/g, (digit) => bnDigits[digit]);
const parseMoney = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return NaN;
  const normalized = raw
    .replace(/[০-৯]/g, (digit) => enDigits[bnDigits.indexOf(digit)])
    .replace(/[৳,\s]/g, '');
  const number = Number(normalized);
  return Number.isInteger(number) ? number : NaN;
};
const money = (value) => '৳ ' + Math.max(0, Math.round(value)).toLocaleString('en-IN').replace(/[0-9]/g, (digit) => bnDigits[digit]);
const numberBn = (value) => Math.max(0, Math.round(value)).toLocaleString('en-IN').replace(/[0-9]/g, (digit) => bnDigits[digit]);

const retirementForm = document.querySelector('#retirement-form');
const retirementBasic = document.querySelector('#retirement-basic');
const retirementService = document.querySelector('#retirement-service-years');
const retirementLeaveMonths = document.querySelector('#retirement-leave-months');
const retirementNetPension = document.querySelector('#retirement-net-pension');
const validationBox = document.querySelector('#retirement-validation');
const copyButton = document.querySelector('#copy-pension-result');
const toast = document.querySelector('#pension-toast');
const liveSummary = document.querySelector('#retirement-live-summary');

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function gratuityRate(serviceYears) {
  return RETIREMENT_RULES.gratuityBands.find((band) => serviceYears >= band.min && serviceYears <= band.max)?.rate || null;
}

function netBand(currentNet) {
  return RETIREMENT_RULES.netPensionBands.find((band) => currentNet >= (band.min || 0) && currentNet <= (band.max || Infinity)) || null;
}

function clearOutput() {
  [
    'retirement-rate', 'retirement-gross-pension', 'retirement-pensionable',
    'retirement-gratuity-rate', 'retirement-gratuity', 'retirement-leave-encashment',
    'retirement-total-lump-sum', 'retirement-net-band', 'retirement-net-rate',
    'retirement-net-result'
  ].forEach((id) => setText(id, '—'));
  setText('retirement-net-note', 'বর্তমান net pension লিখলে সংশ্লিষ্ট band অনুযায়ী একটি সীমাবদ্ধ review estimate দেখা যাবে।');
  if (validationBox) {
    validationBox.textContent = '';
    validationBox.hidden = true;
  }
  if (liveSummary) liveSummary.textContent = '';
}

function renderReferenceTables() {
  const serviceBody = document.querySelector('#retirement-service-table-body');
  const gratuityBody = document.querySelector('#retirement-gratuity-table-body');
  const netBody = document.querySelector('#retirement-net-table-body');
  if (!serviceBody || !gratuityBody || !netBody) return;
  serviceBody.innerHTML = Object.entries(RETIREMENT_RULES.grossPensionRates)
    .map(([years, rate]) => '<tr><td>' + (years === '25' ? '২৫ বছর ও তদূর্ধ্ব' : toBn(years) + ' বছর') + '</td><td>' + toBn(rate) + '%</td></tr>')
    .join('');
  gratuityBody.innerHTML = RETIREMENT_RULES.gratuityBands
    .map((band) => '<tr><td>' + band.label + '</td><td>' + toBn(band.rate) + '</td></tr>')
    .join('');
  netBody.innerHTML = RETIREMENT_RULES.netPensionBands
    .map((band) => '<tr><td>' + band.label + '</td><td>' + toBn(band.rate) + '%</td><td>' + money(band.minimum) + '</td><td>' + money(band.maximum) + '</td></tr>')
    .join('');
}

function renderRetirementBenefits() {
  const basic = parseMoney(retirementBasic?.value);
  const serviceYears = Number(retirementService?.value);
  const leaveMonths = Number(retirementLeaveMonths?.value);

  if (!Number.isFinite(basic) || basic <= 0) {
    clearOutput();
    return;
  }
  if (!Number.isFinite(serviceYears) || serviceYears < 5 || serviceYears > 25) {
    clearOutput();
    if (validationBox) {
      validationBox.textContent = 'পেনশনযোগ্য চাকরিকাল ৫ বছর থেকে ২৫ বছর বা তদূর্ধ্ব হতে হবে।';
      validationBox.hidden = false;
    }
    return;
  }

  const grossRate = RETIREMENT_RULES.grossPensionRates[Math.min(25, serviceYears)];
  const grossPension = Math.round(basic * grossRate / 100);
  const pensionablePortion = Math.round(grossPension / 2);
  const gratuityRateValue = gratuityRate(serviceYears);
  const gratuity = pensionablePortion * gratuityRateValue;
  const encashmentMonths = Math.min(RETIREMENT_RULES.maximumLeaveMonths, Math.max(0, leaveMonths));
  const leaveEncashment = basic * encashmentMonths;
  const lumpSum = gratuity + leaveEncashment;

  setText('retirement-rate', toBn(grossRate) + '%');
  setText('retirement-gross-pension', money(grossPension));
  setText('retirement-pensionable', money(pensionablePortion));
  setText('retirement-gratuity-rate', toBn(gratuityRateValue) + ' টাকা / ১ টাকা');
  setText('retirement-gratuity', money(gratuity));
  setText('retirement-leave-encashment', money(leaveEncashment));
  setText('retirement-total-lump-sum', money(lumpSum));
  setText('retirement-basic-note', 'গ্রস pension rate: ' + toBn(grossRate) + '%; ৫০% সমর্পণ ধরে pensionable portion দেখানো হয়েছে। চিকিৎসা ভাতা, কর্তন ও অফিসিয়াল PPO এতে নেই।');
  if (validationBox) validationBox.hidden = true;

  const currentNet = parseMoney(retirementNetPension?.value);
  const band = Number.isFinite(currentNet) && currentNet >= 0 ? netBand(currentNet) : null;
  if (!band) {
    setText('retirement-net-band', '—');
    setText('retirement-net-rate', '—');
    setText('retirement-net-result', '—');
    setText('retirement-net-note', 'বর্তমান net pension লিখলে সংশ্লিষ্ট band অনুযায়ী একটি সীমাবদ্ধ review estimate দেখা যাবে।');
    if (liveSummary) {
      liveSummary.textContent = 'পেনশন হিসাব সম্পন্ন। গ্রস pension ' + money(grossPension) + ', আনুতোষিক ' + money(gratuity) + ', এবং ছুটি নগদায়ন ' + money(leaveEncashment) + '।';
    }
    return;
  }
  const adjustedNet = Math.min(band.maximum, Math.max(band.minimum, Math.round(currentNet * (1 + band.rate / 100))));
  setText('retirement-net-band', band.label);
  setText('retirement-net-rate', toBn(band.rate) + '%');
  setText('retirement-net-result', money(adjustedNet));
  setText('retirement-net-note', 'সীমা: ' + money(band.minimum) + ' – ' + money(band.maximum) + '; এটি net pension-এর review estimate, final pension order নয়।');
  if (liveSummary) {
    liveSummary.textContent = 'পেনশন হিসাব সম্পন্ন। গ্রস pension ' + money(grossPension) + ', আনুতোষিক ' + money(gratuity) + ', এবং ছুটি নগদায়ন ' + money(leaveEncashment) + '।';
  }
}

function prefillFromSalaryPage() {
  const params = new URLSearchParams(window.location.search);
  const basic = parseMoney(params.get('basic'));
  const grade = params.get('grade');
  if (!Number.isFinite(basic) || basic <= 0 || !retirementBasic) return;
  retirementBasic.value = numberBn(basic);
  setText('retirement-basic-note', 'PayScale 2026-এর গ্রেড ' + toBn(grade || '') + ' result থেকে basic pay prefill করা হয়েছে; প্রয়োজন হলে পরিবর্তন করুন।');
}

async function copyPensionResult() {
  const basic = parseMoney(retirementBasic?.value);
  if (!Number.isFinite(basic) || basic <= 0 || document.querySelector('#retirement-total-lump-sum')?.textContent === '—') {
    if (validationBox) {
      validationBox.textContent = 'কপি করার আগে অবসর সুবিধার জন্য প্রযোজ্য basic pay দিন।';
      validationBox.hidden = false;
    }
    return;
  }
  const text = [
    'পেনশন ও অবসর সুবিধার হিসাব',
    'অবসর সুবিধার জন্য প্রযোজ্য মূল বেতন: ' + money(basic),
    'পেনশনযোগ্য চাকরিকাল: ' + (retirementService?.selectedOptions?.[0]?.textContent || ''),
    'গ্রস pension rate: ' + document.querySelector('#retirement-rate').textContent,
    'গ্রস pension: ' + document.querySelector('#retirement-gross-pension').textContent,
    'সমর্পণের পর pensionable অংশ: ' + document.querySelector('#retirement-pensionable').textContent,
    'আনুতোষিক: ' + document.querySelector('#retirement-gratuity').textContent,
    'ছুটি নগদায়ন: ' + document.querySelector('#retirement-leave-encashment').textContent,
    'আনুতোষিক + ছুটি নগদায়ন: ' + document.querySelector('#retirement-total-lump-sum').textContent,
    'আনুমানিক নতুন net pension: ' + document.querySelector('#retirement-net-result').textContent,
    'সূত্র: ১৭ সেপ্টেম্বর ২০২৬-এর Retirement Benefits Gazette',
    'এটি review-support estimate; official pension sanction/PPO নয়।'
  ].join('\n');
  try {
    await navigator.clipboard.writeText(text);
    if (!toast) return;
    toast.hidden = false;
    toast.classList.add('show');
    window.setTimeout(() => {
      toast.classList.remove('show');
      toast.hidden = true;
    }, 1800);
  } catch {
    if (!validationBox) return;
    validationBox.textContent = 'কপি করা সম্ভব হয়নি; ফলাফলটি ম্যানুয়ালি কপি করুন।';
    validationBox.hidden = false;
  }
}

renderReferenceTables();
prefillFromSalaryPage();
renderRetirementBenefits();

retirementForm?.addEventListener('input', renderRetirementBenefits);
retirementForm?.addEventListener('change', renderRetirementBenefits);
retirementBasic?.addEventListener('blur', () => {
  const parsed = parseMoney(retirementBasic.value);
  if (Number.isFinite(parsed)) retirementBasic.value = numberBn(parsed);
});
copyButton?.addEventListener('click', copyPensionResult);
document.querySelector('#print-pension-result')?.addEventListener('click', () => {
  if (document.querySelector('#retirement-total-lump-sum')?.textContent !== '—') window.print();
});
