/*
 * PayScale 2026 Calculator
 * Source: Bangladesh Gazette, Extra, 17 September 2026, Finance Division,
 * S.R.O. No. 347-Law/2026. Version 1.20.
 *
 * Scale steps are kept in scale-data.js as the single source of truth.
 * Update that file and run the regression tests if an official correction
 * or subsequent order changes any scale step.
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

const payTypeSelect = document.querySelector('#pay-type');
const fixedPostSelect = document.querySelector('#fixed-post');
const fixedFields = document.querySelector('#fixed-fields');
const gradeFieldGroup = document.querySelector('#grade-field-group');
const gradeSelect = document.querySelector('#grade');
const currentBasic = document.querySelector('#current-basic');
const form = document.querySelector('#calculator-form');
const scopeGateMessage = document.querySelector('#scope-gate-message');
const scopeRadios = [...document.querySelectorAll('input[name="scope-check"]')];
const resultsPanel = document.querySelector('#results-panel');
const tableBody = document.querySelector('#scale-table-body');
const validation = document.querySelector('#validation-message');
const toast = document.querySelector('#toast');
const emptyResult = document.querySelector('#empty-result');
const resultBlocks = [...document.querySelectorAll('.result-block')];
const grossSection = document.querySelector('#gross-salary-module');
const grossForm = document.querySelector('#gross-form');
const allowanceProfileSelect = document.querySelector('#allowance-profile');
const grossProfileNote = document.querySelector('#gross-profile-note');
const retirementSection = document.querySelector('#retirement-benefits-module');
const openRetirementBenefits = document.querySelector('#open-retirement-benefits');
const retirementForm = document.querySelector('#retirement-form');
const retirementBasic = document.querySelector('#retirement-basic');
const retirementService = document.querySelector('#retirement-service-years');
const retirementLeaveMonths = document.querySelector('#retirement-leave-months');
const retirementNetPension = document.querySelector('#retirement-net-pension');
let retirementOpen = false;

const ALLOWANCE_PROFILES = {
  general: {
    label: 'সাধারণ সরকারি চাকরি',
    sro: 'S.R.O. No. 347-Law/2026',
    automatic: true,
    note: 'সাধারণ সরকারি চাকরির জন্য S.R.O. No. 347-Law/2026-এর নির্বাচিত ভাতা-হার ব্যবহার করা হচ্ছে। Article 15(1) অনুযায়ী ৩১ ডিসেম্বর ২০২৭ পর্যন্ত ২০১৫ সালের বাড়িভাড়া schedule প্রযোজ্য; S.R.O. 349 সাধারণ সরকারি চাকরির জন্য নয়।'
  },
  bank: {
    label: 'ব্যাংক, বিমা ও আর্থিক প্রতিষ্ঠান',
    sro: 'S.R.O. No. 349-Law/2026',
    automatic: false,
    note: 'S.R.O. No. 349-Law/2026 নির্বাচিত হয়েছে। এই static preview-তে bank/insurance/financial-institution-এর allowance schedule আলাদাভাবে সম্পূর্ণ transcribe ও verify করা হয়নি; সাধারণ S.R.O. 347-এর হার প্রয়োগ করা হচ্ছে না।'
  },
  public: {
    label: 'Public Bodies/রাষ্ট্রায়ত্ত প্রতিষ্ঠান',
    sro: 'S.R.O. No. 348-Law/2026',
    automatic: false,
    note: 'S.R.O. No. 348-Law/2026 নির্বাচিত হয়েছে। এই আলাদা order-এর institution-specific allowance schedule এখানে এখনো স্বয়ংক্রিয়ভাবে transcribe করা হয়নি।'
  },
  police: {
    label: 'বাংলাদেশ পুলিশ',
    sro: 'S.R.O. No. 350-Law/2026',
    automatic: false,
    note: 'S.R.O. No. 350-Law/2026 নির্বাচিত হয়েছে। Police unit/post-specific special allowance ভুলভাবে যোগ না করার জন্য এই profile-এ full gross auto-calculation বন্ধ রাখা হয়েছে।'
  },
  bgb: {
    label: 'BGB',
    sro: 'S.R.O. No. 351-Law/2026',
    automatic: false,
    note: 'S.R.O. No. 351-Law/2026 নির্বাচিত হয়েছে। BGB-specific allowance schedule যাচাই না করে সাধারণ হার auto-apply করা হচ্ছে না।'
  }
};

const grossInputIds = [
  'government-housing', 'medical-eligible', 'mobile-eligible', 'washing-eligible',
  'medical-band', 'education-children', 'tiffin-eligible', 'travel-eligible',
  'haor-eligible', 'training-eligible', 'hill-allowance', 'special-child-count',
  'other-allowance', 'duty-station', 'allowance-profile'
];

const fixedPosts = {
  156000: 'গ্রেড ১ · নির্ধারিত বেতন',
  172000: 'মন্ত্রিপরিষদ সচিব/প্রধানমন্ত্রীর মুখ্য সচিব ও সমমর্যাদা',
  164000: 'সিনিয়র সচিব ও সমমর্যাদা',
};

Object.keys(SCALES).forEach((grade) => {
  const option = document.createElement('option');
  option.value = grade;
  option.textContent = 'গ্রেড ' + toBn(grade) + ' · ' + money(SCALES[grade].old[0]) + ' – ' + money(SCALES[grade].old[SCALES[grade].old.length - 1]);
  gradeSelect.appendChild(option);
});
gradeSelect.value = '9';

function scaleRange(steps) {
  return steps.length === 1 ? money(steps[0]) + ' (নির্ধারিত)' : money(steps[0]) + ' – ' + money(steps[steps.length - 1]);
}

function phaseRates(grade) {
  return grade <= 9 ? { phase1: 40, phase2: 70 } : { phase1: 50, phase2: 75 };
}

function arrearsDaysToGazetteDate() {
  const start = Date.UTC(2026, 6, 1);
  const end = Date.UTC(2026, 8, 17);
  return Math.floor((end - start) / 86400000) + 1;
}

function gradeRateLabel(grade, scale) {
  if (scale.fixed) return 'নির্ধারিত';
  const rates = phaseRates(grade);
  return toBn(rates.phase1) + '% → ' + toBn(rates.phase2) + '%';
}

function renderScaleTable(full) {
  tableBody.innerHTML = Object.entries(SCALES).map(([grade, scale]) => {
    const oldValue = scaleRange(scale.old);
    const newValue = full ? scale.new.map(money).join(' · ') : scaleRange(scale.new);
    return '<tr><td>গ্রেড ' + toBn(grade) + '</td><td>' + oldValue + '</td><td>' + newValue + '</td><td>' + gradeRateLabel(Number(grade), scale) + '</td></tr>';
  }).join('');
}

function nearestNewStep(candidate, steps) {
  return steps.find((step) => step >= candidate) || null;
}

function nextAnnualStep(applied, steps) {
  const index = steps.indexOf(applied);
  return index >= 0 && index < steps.length - 1 ? steps[index + 1] : applied;
}

function setText(id, value) { document.getElementById(id).textContent = value; }

function setValidation(message, warning = false) {
  validation.textContent = message;
  validation.classList.toggle('warning', warning);
  validation.hidden = false;
}

function clearValidation() {
  validation.textContent = '';
  validation.classList.remove('warning');
  validation.hidden = true;
}

function showResultState(hasResult) {
  emptyResult.hidden = hasResult;
  resultBlocks.forEach((block) => { block.hidden = !hasResult; });
  grossSection.hidden = !hasResult;
  if (!hasResult) retirementOpen = false;
  if (openRetirementBenefits) openRetirementBenefits.hidden = !hasResult;
  if (retirementSection) retirementSection.hidden = !hasResult || !isGeneralScopeSelected() || !retirementOpen;
  if (!hasResult) {
    clearGrossOutput();
    if (retirementBasic?.dataset.autofill === 'true') {
      retirementBasic.value = '';
      delete retirementBasic.dataset.autofill;
    }
    renderRetirementBenefits();
  }
}

function houseRentBand(basic) {
  if (basic <= 9700) return 'low';
  if (basic <= 16000) return 'mid';
  if (basic <= 35500) return 'high';
  return 'top';
}

function houseRentAllowance(basic, station) {
  // Article 15(1) keeps the 2015 house-rent schedule through 31 Dec 2027.
  // The 2026 schedule starts on 1 Jan 2028, outside these three phases.
  const stationRates = {
    dhaka: {
      low: [65, 5600], mid: [60, 6400], high: [55, 9600], top: [50, 19500]
    },
    'listed-city': {
      low: [55, 5000], mid: [50, 5400], high: [45, 8000], top: [40, 16000]
    },
    other: {
      low: [50, 4500], mid: [45, 4800], high: [40, 7000], top: [35, 13800]
    }
  };
  const rates = stationRates[station] || stationRates.dhaka;
  const [rate, minimum] = rates[houseRentBand(basic)];
  return Math.max(Math.round(basic * rate / 100), minimum);
}

function grossAssumptionSummary(grade) {
  const stationInput = grossInput('duty-station');
  const stationLabel = stationInput?.selectedOptions?.[0]?.textContent.trim() || 'নির্বাচিত duty station';
  const station = stationInput?.value || 'dhaka';
  const housing = grossInput('government-housing').checked ? 'সরকারি বাসস্থান নেই' : 'সরকারি বাসস্থান আছে';
  const medical = grossInput('medical-eligible').checked
    ? (grossInput('medical-band').value === 'over50' ? 'চিকিৎসা ৳ ৪,০০০' : 'চিকিৎসা ৳ ৩,০০০')
    : 'চিকিৎসা ০';
  const education = Math.min(2, Number(grossInput('education-children').value || 0)) * 500;
  const mobile = grossInput('mobile-eligible').checked ? (grade <= 5 ? 500 : 150) : 0;
  const fixed = [
    grossInput('tiffin-eligible').checked && grade >= 11 ? 'টিফিন ৳ ৫০০' : '',
    grossInput('travel-eligible').checked && grade >= 11 && station !== 'other' ? 'যাতায়াত ৳ ৬০০' : '',
    grossInput('washing-eligible').checked ? 'ধোলাই ৳ ৩০০' : '',
    'মোবাইল ' + money(mobile),
    medical,
    'শিক্ষা সহায়তা ' + money(education)
  ].filter(Boolean).join(', ');
  return 'বাড়িভাড়া ২০১৫ schedule-এর phase-basic অনুযায়ী rate/minimum (' + stationLabel + '), ৩১ ডিসেম্বর ২০২৭ পর্যন্ত; ' + housing + '; ' + fixed + '।';
}

function grossInput(id) {
  return document.getElementById(id);
}

function setGrossCell(id, value) {
  setText(id, money(value));
}

function clearGrossOutput() {
  const ids = [
    'gross-phase1-total', 'gross-phase2-total', 'gross-phase3-total',
    'gross-phase1-basic', 'gross-phase2-basic', 'gross-phase3-basic',
    'gross-phase1-house', 'gross-phase2-house', 'gross-phase3-house',
    'gross-phase1-medical', 'gross-phase2-medical', 'gross-phase3-medical',
    'gross-phase1-education', 'gross-phase2-education', 'gross-phase3-education',
    'gross-phase1-fixed', 'gross-phase2-fixed', 'gross-phase3-fixed',
    'gross-phase1-other', 'gross-phase2-other', 'gross-phase3-other',
    'gross-phase1-total-row', 'gross-phase2-total-row', 'gross-phase3-total-row'
  ];
  ids.forEach((id) => setText(id, '—'));
  setText('gross-phase1-meta', 'প্রথম অন্তর্বর্তী মূল বেতনসহ');
  setText('gross-phase2-meta', 'দ্বিতীয় অন্তর্বর্তী মূল বেতনসহ');
  setText('gross-phase3-meta', 'পূর্ণ নতুন মূল বেতনসহ');
  grossProfileNote.textContent = '';
  grossProfileNote.classList.remove('warning');
  setText('gross-grade-chip', 'গ্রেড অপেক্ষমাণ');
}

function updateAllowanceAvailability(grade) {
  const gradeBased = ['tiffin-eligible', 'travel-eligible'];
  gradeBased.forEach((id) => {
    const input = grossInput(id);
    const eligible = grade >= 11;
    input.disabled = !eligible;
    if (!eligible) input.checked = false;
  });
  const training = grossInput('training-eligible');
  training.disabled = grade > 9;
  if (grade > 9) training.checked = false;
}

function setGrossPhase(phase, values) {
  setGrossCell('gross-phase' + phase + '-basic', values.basic);
  setGrossCell('gross-phase' + phase + '-house', values.house);
  setGrossCell('gross-phase' + phase + '-medical', values.medical);
  setGrossCell('gross-phase' + phase + '-education', values.education);
  setGrossCell('gross-phase' + phase + '-fixed', values.fixed);
  setGrossCell('gross-phase' + phase + '-other', values.other);
  setGrossCell('gross-phase' + phase + '-total', values.total);
  setGrossCell('gross-phase' + phase + '-total-row', values.total);
}

function renderGrossSalary() {
  const result = window.lastCalculation;
  if (!result) return;

  const profile = ALLOWANCE_PROFILES[allowanceProfileSelect.value] || ALLOWANCE_PROFILES.general;
  const grade = result.fixed ? 1 : result.grade;
  setText('gross-grade-chip', result.fixed ? 'স্থির পদ · গ্রেড ১ হার' : 'গ্রেড ' + toBn(grade));
  const fixedNote = 'স্থির/বিশেষ পদের জন্য পদভিত্তিক allowance schedule আলাদাভাবে যাচাই না করে gross salary auto-calculation দেখানো হচ্ছে না।';
  grossProfileNote.textContent = result.fixed ? fixedNote : profile.note;
  grossProfileNote.classList.toggle('warning', !profile.automatic || result.fixed);
  updateAllowanceAvailability(grade);

  if (!profile.automatic || result.fixed) {
    const phases = [result.phase1Pay, result.phase2Pay, result.phase3Pay];
    phases.forEach((basic, index) => setGrossCell('gross-phase' + (index + 1) + '-basic', basic));
    ['1', '2', '3'].forEach((phase) => {
      ['house', 'medical', 'education', 'fixed', 'other', 'total', 'total-row'].forEach((part) => setText('gross-phase' + phase + '-' + part, '—'));
    });
    ['1', '2', '3'].forEach((phase) => setText('gross-phase' + phase + '-meta', result.fixed ? 'পদভিত্তিক ভাতা আলাদা করে মিলিয়ে নিন' : 'এই order-এর allowance schedule আলাদা করে মিলিয়ে নিন'));
    setText('gross-footnote', result.fixed
      ? 'স্থির/বিশেষ পদের gross salary এই preview-তে স্বয়ংক্রিয়ভাবে দেখানো হচ্ছে না। সংশ্লিষ্ট পদ, office order এবং authorised pay-fixation statement দেখে ভাতা যোগ করুন।'
      : 'এই আলাদা pay order-এর ভাতা-প্যাকেজ এখনো এই static preview-তে স্বয়ংক্রিয়ভাবে transcribe করা হয়নি। সাধারণ সরকারি হার ধরে কোনো gross salary দেখানো হচ্ছে না।');
    return;
  }

  const medicalEligible = grossInput('medical-eligible').checked;
  const medical = medicalEligible ? (grossInput('medical-band').value === 'over50' ? 4000 : 3000) : 0;
  const education = Math.min(2, Number(grossInput('education-children').value || 0)) * 500;
  const tiffin = grossInput('tiffin-eligible').checked && grade >= 11 ? 500 : 0;
  const mobile = grossInput('mobile-eligible').checked ? (grade <= 5 ? 500 : 150) : 0;
  const washing = grossInput('washing-eligible').checked ? 300 : 0;
  const station = grossInput('duty-station').value;
  const travel = grossInput('travel-eligible').checked && grade >= 11 && station !== 'other' ? 600 : 0;
  const specialChild = Math.min(2, Number(grossInput('special-child-count').value || 0)) * 3000;
  const otherManual = parseMoney(grossInput('other-allowance').value) || 0;
  const hillMode = grossInput('hill-allowance').value;
  const hasGovernmentHousing = grossInput('government-housing').checked === false;
  const phases = [result.phase1Pay, result.phase2Pay, result.phase3Pay].map((basic) => {
    const house = hasGovernmentHousing ? 0 : houseRentAllowance(basic, station);
    const hillCap = hillMode === 'other' ? 5500 : 5000;
    const hill = hillMode === 'none' ? 0 : Math.min(Math.round(basic * 20 / 100), hillCap);
    const haor = grossInput('haor-eligible').checked ? Math.min(Math.round(basic * 20 / 100), 5000) : 0;
    const training = grossInput('training-eligible').checked && grade <= 9 ? Math.round(basic * 10 / 100) : 0;
    // Keep medical and education separate in the breakdown table. They are
    // added explicitly to the total below so they are not shown twice.
    const fixed = tiffin + mobile + washing;
    const other = travel + hill + haor + training + specialChild + otherManual;
    return { basic, house, medical, education, fixed, other, total: basic + house + medical + education + fixed + other };
  });

  phases.forEach((values, index) => setGrossPhase(index + 1, values));
  setText('gross-phase1-meta', 'মূল বেতন + নির্বাচিত ভাতা');
  setText('gross-phase2-meta', 'মূল বেতন + নির্বাচিত ভাতা');
  setText('gross-phase3-meta', 'মূল বেতন + নির্বাচিত ভাতা');
  setText('gross-footnote', 'এটি official pay fixation নয়—review-support estimate। Article 15(1) অনুযায়ী ৩১ ডিসেম্বর ২০২৭ পর্যন্ত ২০১৫ সালের বাড়িভাড়া schedule ব্যবহার করা হয়েছে; ১ জানুয়ারি ২০২৮-এর নতুন হার এই preview-তে আগাম প্রয়োগ করা হয়নি। সরকারি বাসস্থান থাকলে বাড়িভাড়া বাদ। চিকিৎসা, শিক্ষা সহায়তা, টিফিন, মোবাইল ও শর্তসাপেক্ষ ভাতার checkbox-গুলি আপনার বাস্তব অবস্থা অনুযায়ী ঠিক করুন।');
}

function retirementGratuityRate(serviceYears) {
  return RETIREMENT_RULES.gratuityBands.find((band) => serviceYears >= band.min && serviceYears <= band.max)?.rate || null;
}

function retirementNetBand(currentNet) {
  return RETIREMENT_RULES.netPensionBands.find((band) => currentNet >= (band.min || 0) && currentNet <= (band.max || Infinity)) || null;
}

function clearRetirementOutput() {
  [
    'retirement-rate', 'retirement-gross-pension', 'retirement-pensionable',
    'retirement-gratuity-rate', 'retirement-gratuity', 'retirement-leave-encashment',
    'retirement-total-lump-sum', 'retirement-net-band', 'retirement-net-rate',
    'retirement-net-result'
  ].forEach((id) => setText(id, '—'));
  setText('retirement-net-note', 'বর্তমান net pension লিখলে সংশ্লিষ্ট band অনুযায়ী একটি সীমাবদ্ধ review estimate দেখা যাবে।');
  setText('retirement-basic-note', 'যে basic pay-এর ভিত্তিতে অবসর সুবিধা নির্ধারণ হবে, সেটি লিখুন। Basic Pay Calculator-এর পূর্ণ ফল থাকলে এটি স্বয়ংক্রিয়ভাবে প্রস্তাবিত হতে পারে।');
  const validationBox = document.querySelector('#retirement-validation');
  if (validationBox) {
    validationBox.textContent = '';
    validationBox.hidden = true;
  }
}

function renderRetirementReferenceTables() {
  const serviceBody = document.querySelector('#retirement-service-table-body');
  const gratuityBody = document.querySelector('#retirement-gratuity-table-body');
  const netBody = document.querySelector('#retirement-net-table-body');
  if (!serviceBody || !gratuityBody || !netBody) return;
  serviceBody.innerHTML = Object.entries(RETIREMENT_RULES.grossPensionRates).map(([years, rate]) => '<tr><td>' + (years === '25' ? '২৫ বছর ও তদূর্ধ্ব' : toBn(years) + ' বছর') + '</td><td>' + toBn(rate) + '%</td></tr>').join('');
  gratuityBody.innerHTML = RETIREMENT_RULES.gratuityBands.map((band) => '<tr><td>' + band.label + '</td><td>' + toBn(band.rate) + '</td></tr>').join('');
  netBody.innerHTML = RETIREMENT_RULES.netPensionBands.map((band) => '<tr><td>' + band.label + '</td><td>' + toBn(band.rate) + '%</td><td>' + money(band.minimum) + '</td><td>' + money(band.maximum) + '</td></tr>').join('');
}

function renderRetirementBenefits() {
  if (!retirementBasic || !retirementService || !retirementLeaveMonths) return;
  const basic = parseMoney(retirementBasic.value);
  const serviceYears = Number(retirementService.value);
  const leaveMonths = Number(retirementLeaveMonths.value);
  const validationBox = document.querySelector('#retirement-validation');
  if (!Number.isFinite(basic) || basic <= 0) {
    clearRetirementOutput();
    return;
  }
  if (!Number.isFinite(serviceYears) || serviceYears < 5 || serviceYears > 25) {
    clearRetirementOutput();
    if (validationBox) {
      validationBox.textContent = 'পেনশনযোগ্য চাকরিকাল ৫ বছর থেকে ২৫ বছর বা তদূর্ধ্ব হতে হবে।';
      validationBox.hidden = false;
    }
    return;
  }
  const grossRate = RETIREMENT_RULES.grossPensionRates[Math.min(25, serviceYears)];
  const grossPension = Math.round(basic * grossRate / 100);
  const pensionablePortion = Math.round(grossPension / 2);
  const gratuityRate = retirementGratuityRate(serviceYears);
  const gratuity = pensionablePortion * gratuityRate;
  const encashmentMonths = Math.min(RETIREMENT_RULES.maximumLeaveMonths, Math.max(0, leaveMonths));
  const leaveEncashment = basic * encashmentMonths;
  const lumpSum = gratuity + leaveEncashment;

  setText('retirement-rate', toBn(grossRate) + '%');
  setText('retirement-gross-pension', money(grossPension));
  setText('retirement-pensionable', money(pensionablePortion));
  setText('retirement-gratuity-rate', toBn(gratuityRate) + ' টাকা / ১ টাকা');
  setText('retirement-gratuity', money(gratuity));
  setText('retirement-leave-encashment', money(leaveEncashment));
  setText('retirement-total-lump-sum', money(lumpSum));
  setText('retirement-basic-note', 'গ্রস pension rate: ' + toBn(grossRate) + '%; ৫০% সমর্পণ ধরে pensionable portion দেখানো হয়েছে। চিকিৎসা ভাতা, কর্তন ও অফিসিয়াল PPO এতে নেই।');
  if (validationBox) validationBox.hidden = true;

  const currentNet = retirementNetPension ? parseMoney(retirementNetPension.value) : NaN;
  const band = Number.isFinite(currentNet) && currentNet >= 0 ? retirementNetBand(currentNet) : null;
  if (!band) {
    setText('retirement-net-band', '—');
    setText('retirement-net-rate', '—');
    setText('retirement-net-result', '—');
    setText('retirement-net-note', 'বর্তমান net pension লিখলে সংশ্লিষ্ট band অনুযায়ী একটি সীমাবদ্ধ review estimate দেখা যাবে।');
    return;
  }
  const adjustedNet = Math.min(band.maximum, Math.max(band.minimum, Math.round(currentNet * (1 + band.rate / 100))));
  setText('retirement-net-band', band.label);
  setText('retirement-net-rate', toBn(band.rate) + '%');
  setText('retirement-net-result', money(adjustedNet));
  setText('retirement-net-note', 'সীমা: ' + money(band.minimum) + ' – ' + money(band.maximum) + '; এটি net pension-এর review estimate, final pension order নয়।');
}

function calculate(showErrors = false) {
  const grade = Number(gradeSelect.value);
  const scale = SCALES[grade];
  const current = parseMoney(currentBasic.value);
  const fixedMode = payTypeSelect.value === 'fixed';
  const oldMinimum = scale.old[0];
  const oldMaximum = scale.old[scale.old.length - 1];
  let isFixed = fixedMode || Boolean(scale.fixed);
  let fixedTarget = fixedMode ? Number(fixedPostSelect.value) : scale.new[0];
  let difference;
  let candidate = null;
  let applied;
  let stepIndex = null;
  let annualIncrementBasic;
  let incrementedStepIndex = null;

  if (!Number.isFinite(current) || current <= 0) {
    window.lastCalculation = null;
    showResultState(false);
    if (showErrors) setValidation('অনুগ্রহ করে বর্তমান মূল বেতন লিখুন।');
    else clearValidation();
    return;
  }
  clearValidation();

  if (isFixed) {
    if (current > fixedTarget) {
      window.lastCalculation = null;
      showResultState(false);
      setValidation('বর্তমান মূল বেতন ' + money(current) + ' নির্ধারিত বেতন ' + money(fixedTarget) + '-এর চেয়ে বেশি। অফিসিয়াল pay fixation যাচাই করুন।');
      return;
    }
    difference = fixedTarget - current;
    applied = fixedTarget;
    annualIncrementBasic = applied;
  } else {
    if (current < oldMinimum || current > oldMaximum) {
      window.lastCalculation = null;
      showResultState(false);
      setValidation('গ্রেড ' + toBn(grade) + '-এর বর্তমান স্কেল ' + money(oldMinimum) + ' থেকে ' + money(oldMaximum) + ' পর্যন্ত। অনুগ্রহ করে এই সীমার মধ্যে মূল বেতন লিখুন।');
      return;
    }
    if (!scale.old.includes(current)) {
      setValidation('সতর্কতা: ' + money(current) + ' গ্রেড ' + toBn(grade) + '-এর ২০১৫ সালের তালিকাভুক্ত ধাপ নয়। এটি ব্যক্তিগত/সংরক্ষিত বেতন বা অন্য কোনো pay-fixation কারণে হতে পারে—চূড়ান্ত হিসাব অফিসিয়াল নথির সঙ্গে মিলিয়ে নিন।', true);
    }
    difference = current - oldMinimum;
    candidate = scale.new[0] + difference;
    applied = nearestNewStep(candidate, scale.new);
    if (!applied) {
      window.lastCalculation = null;
      showResultState(false);
      setValidation('এই ইনপুটের জন্য নতুন স্কেলের সর্বোচ্চ ধাপ অতিক্রম করছে। সংশ্লিষ্ট হিসাবরক্ষণ অফিসে pay fixation যাচাই করুন.');
      return;
    }
    stepIndex = scale.new.indexOf(applied) + 1;
    annualIncrementBasic = nextAnnualStep(applied, scale.new);
    incrementedStepIndex = scale.new.indexOf(annualIncrementBasic) + 1;
  }

  // Article 5 fixes the pay at the matched/next-higher 2026 step. Article
  // 9(2) then gives one annual increment on 1 July 2026 before the phased
  // difference is applied. This is not an arbitrary extra Step 5/Step 6.
  const totalIncrease = annualIncrementBasic - current;
  const rates = isFixed ? { phase1: null, phase2: null } : phaseRates(grade);
  const phase1Pay = isFixed ? applied : current + Math.round(totalIncrease * rates.phase1 / 100);
  const phase2Pay = isFixed ? applied : current + Math.round(totalIncrease * rates.phase2 / 100);
  const phase1Increment = isFixed ? null : phase1Pay - current;
  const phase2Increment = isFixed ? null : phase2Pay - current;
  const phase3Pay = annualIncrementBasic;
  const arrearsDays = arrearsDaysToGazetteDate();
  const arrearsMonthlyIncrease = isFixed ? totalIncrease : phase1Increment;
  const arrearsEstimate = Math.round(arrearsMonthlyIncrease * arrearsDays / 30);
  const percent = current ? (totalIncrease / current) * 100 : 0;

  showResultState(true);

  setText('grade-chip', fixedMode ? 'স্থির বেতন' : ('গ্রেড ' + toBn(grade) + (isFixed ? ' · নির্ধারিত' : '')));
  setText('result-hero-label', isFixed ? 'স্থির নির্ধারিত মূল বেতন · ১ জুলাই ২০২৬ থেকে' : 'পূর্ণ নতুন মূল বেতন · ১ জুলাই ২০২৭ থেকে');
  setText('interim-rate', isFixed ? 'প্রযোজ্য নয়' : toBn(rates.phase1) + '% → ' + toBn(rates.phase2) + '% → ১০০%');
  setText('timeline-note', isFixed ? 'এটি নির্ধারিত স্থির বেতন; interim শতাংশ প্রযোজ্য নয়।' : 'Article 5-এর pay fixation ও Article 9(2)-এর ১টি annual incrementসহ মোট পার্থক্যের নির্ধারিত অংশ বর্তমান বেতনে যোগ হয়েছে।');
  setText('new-basic', money(annualIncrementBasic));
  setText('total-increase', money(totalIncrease));
  setText('increase-percent', toBn(percent.toFixed(1)) + '% · বর্তমান মূল বেতনের উপর');
  setText('phase1-title', isFixed ? '১ জুলাই ২০২৬ থেকে' : '১ জুলাই – ৩১ ডিসেম্বর ২০২৬');
  setText('phase1-description', isFixed ? 'স্থির বেতন; অন্তর্বর্তী শতাংশ প্রযোজ্য নয়' : 'Article 5/9 অনুযায়ী মোট পার্থক্যের ' + toBn(rates.phase1) + '% বর্তমান বেতনে যোগ হবে');
  setText('phase1-monthly', money(phase1Pay));
  setText('phase1-amount-label', isFixed ? 'স্থির নির্ধারিত বেতন' : 'ফলিত প্রাপ্য মূল বেতন');
  setText('phase1-increment', isFixed ? 'interim শতাংশ প্রযোজ্য নয়' : 'অন্তর্বর্তী বৃদ্ধি: ' + money(phase1Increment));
  setText('phase2-title', isFixed ? '১ জানুয়ারি ২০২৭ থেকে' : '১ জানুয়ারি – ৩০ জুন ২০২৭');
  setText('phase2-description', isFixed ? 'স্থির বেতন; অন্তর্বর্তী শতাংশ প্রযোজ্য নয়' : 'Article 5/9 অনুযায়ী মোট পার্থক্যের ' + toBn(rates.phase2) + '% পর্যন্ত যোগ হবে');
  setText('phase2-monthly', money(phase2Pay));
  setText('phase2-amount-label', isFixed ? 'স্থির নির্ধারিত বেতন' : 'ফলিত প্রাপ্য মূল বেতন');
  setText('phase2-increment', isFixed ? 'interim শতাংশ প্রযোজ্য নয়' : 'অন্তর্বর্তী বৃদ্ধি: ' + money(phase2Increment));
  setText('phase3-title', isFixed ? 'স্থির নির্ধারিত বেতন' : '১ জুলাই ২০২৭ থেকে');
  setText('phase3-description', isFixed ? 'গেজেটের নির্ধারিত বেতন-পদ্ধতি; পর্যায়ভিত্তিক শতাংশ প্রযোজ্য নয়' : 'Article 5-এর pay fixation-এর পর Article 9(2) অনুযায়ী ১ জুলাই ২০২৬-এর ১টি annual incrementসহ পূর্ণ মূল বেতন');
  setText('phase3-monthly', money(phase3Pay));
  setText('phase3-amount-label', isFixed ? 'স্থির নির্ধারিত বেতন' : 'পূর্ণ মূল বেতন');
  setText('phase3-increment', isFixed ? 'অন্তর্বর্তী শতাংশ প্রযোজ্য নয়' : 'Article 9(2)-এর ১টি annual increment অন্তর্ভুক্ত');
  setText('arrears-note', 'গেজেটের ১৭ সেপ্টেম্বর ২০২৬ তারিখ পর্যন্ত আনুমানিক basic-pay arrears: ' + money(arrearsEstimate) + ' (' + toBn(arrearsDays) + ' দিন, ৩০ দিন = ১ মাস ধরে)। এটি allowances, কর্তন বা অফিসিয়াল arrears statement নয়।');
  setText('old-min-label', isFixed ? 'পুরোনো স্কেলের ধাপ' : 'পুরোনো স্কেলের প্রারম্ভিক ধাপ');
  setText('difference-label', isFixed ? 'স্থির বেতন − বর্তমান মূল বেতন' : 'বর্তমান বেতন − প্রারম্ভিক ধাপ');
  setText('candidate-label', isFixed ? 'স্থির বেতন পদ' : 'নতুন প্রারম্ভিক ধাপ + পার্থক্য');
  setText('applied-step-label', isFixed ? 'প্রযোজ্য নির্ধারিত বেতন' : 'Article 9 incrementসহ প্রযোজ্য নতুন মূল বেতন');
  setText('old-min', isFixed ? 'প্রযোজ্য নয়' : money(oldMinimum));
  setText('difference', money(difference));
  setText('candidate', isFixed ? fixedPosts[fixedTarget] : money(candidate));
  setText('pay-fixation-step', isFixed ? money(applied) + ' · নির্ধারিত' : money(applied) + ' · ধাপ ' + toBn(stepIndex));
  setText('applied-step', isFixed ? money(annualIncrementBasic) + ' · নির্ধারিত' : money(annualIncrementBasic) + ' · ধাপ ' + toBn(incrementedStepIndex));
  setText('new-step-label', isFixed ? 'নির্ধারিত বেতন' : 'Article 9 incrementসহ নতুন ধাপ ' + toBn(incrementedStepIndex));

  window.lastCalculation = { grade, current, oldMinimum, difference, candidate, applied, payFixationBasic: applied, annualIncrementBasic, annualIncrement: annualIncrementBasic - applied, totalIncrease, phase1Pay, phase2Pay, phase3Pay, phase1Increment, phase2Increment, arrearsDays, arrearsEstimate, phase1Rate: rates.phase1, phase2Rate: rates.phase2, fixed: isFixed };
  if (retirementBasic && (!retirementBasic.value || retirementBasic.dataset.autofill === 'true')) {
    retirementBasic.value = numberBn(annualIncrementBasic);
    retirementBasic.dataset.autofill = 'true';
  }
  renderRetirementBenefits();
  renderGrossSalary();
}

function isGeneralScopeSelected() {
  return document.querySelector('input[name="scope-check"]:checked')?.value === 'general';
}

function updateScopeGate() {
  const general = isGeneralScopeSelected();
  form.querySelectorAll('input, select, button').forEach((control) => {
    control.disabled = !general;
  });
  scopeGateMessage.hidden = general;
  if (!general) {
    retirementOpen = false;
    window.lastCalculation = null;
    showResultState(false);
    clearValidation();
    return;
  }
  calculate(false);
}

openRetirementBenefits.addEventListener('click', () => {
  if (!window.lastCalculation || !isGeneralScopeSelected()) return;
  retirementOpen = true;
  retirementSection.hidden = false;
  retirementSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.requestAnimationFrame(() => retirementBasic.focus({ preventScroll: true }));
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!isGeneralScopeSelected()) return;
  calculate(true);
  window.requestAnimationFrame(() => {
    resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    resultsPanel.focus({ preventScroll: true });
  });
});
gradeSelect.addEventListener('change', () => {
  const current = parseMoney(currentBasic.value);
  const previous = window.lastCalculation;
  if (!Number.isFinite(current) || !previous || current === previous.current) currentBasic.value = numberBn(SCALES[gradeSelect.value].old[0]);
  calculate();
});
payTypeSelect.addEventListener('change', () => {
  const current = parseMoney(currentBasic.value);
  if (payTypeSelect.value === 'grade' && (!Number.isFinite(current) || current > SCALES[gradeSelect.value].old[SCALES[gradeSelect.value].old.length - 1])) {
    currentBasic.value = numberBn(SCALES[gradeSelect.value].old[0]);
  }
  fixedFields.hidden = payTypeSelect.value !== 'fixed';
  gradeFieldGroup.hidden = payTypeSelect.value === 'fixed';
  calculate();
});
fixedPostSelect.addEventListener('change', () => calculate());
currentBasic.addEventListener('input', calculate);
currentBasic.addEventListener('blur', () => {
  const parsed = parseMoney(currentBasic.value);
  if (Number.isFinite(parsed)) currentBasic.value = numberBn(parsed);
});

grossForm.addEventListener('input', renderGrossSalary);
grossForm.addEventListener('change', renderGrossSalary);
retirementForm.addEventListener('input', (event) => {
  if (event.target === retirementBasic) delete retirementBasic.dataset.autofill;
  renderRetirementBenefits();
});
retirementForm.addEventListener('change', renderRetirementBenefits);
retirementBasic.addEventListener('blur', () => {
  const parsed = parseMoney(retirementBasic.value);
  if (Number.isFinite(parsed)) retirementBasic.value = numberBn(parsed);
});
scopeRadios.forEach((radio) => radio.addEventListener('change', updateScopeGate));

document.querySelector('#toggle-table').addEventListener('click', (event) => {
  const expanded = event.currentTarget.dataset.expanded === 'true';
  event.currentTarget.dataset.expanded = String(!expanded);
  event.currentTarget.innerHTML = expanded ? 'সম্পূর্ণ ধাপ দেখুন <span>＋</span>' : 'ধাপ সংক্ষিপ্ত করুন <span>−</span>';
  renderScaleTable(!expanded);
});

document.querySelector('#copy-result').addEventListener('click', async () => {
  const result = window.lastCalculation;
  if (!result) return;
  const profile = ALLOWANCE_PROFILES[allowanceProfileSelect.value] || ALLOWANCE_PROFILES.general;
  const grossAutomatic = profile.automatic && !result.fixed;
  const grossTotal = document.querySelector('#gross-phase3-total').textContent;
  const retirementBasicValue = parseMoney(retirementBasic?.value);
  const retirementLines = Number.isFinite(retirementBasicValue) && document.querySelector('#retirement-total-lump-sum').textContent !== '—'
    ? [
      'Retirement basic: ' + money(retirementBasicValue),
      'আনুমানিক গ্রস pension: ' + document.querySelector('#retirement-gross-pension').textContent,
      'আনুমানিক আনুতোষিক: ' + document.querySelector('#retirement-gratuity').textContent,
      'আনুমানিক ছুটি নগদায়ন: ' + document.querySelector('#retirement-leave-encashment').textContent,
      'আনুমানিক এককালীন মোট: ' + document.querySelector('#retirement-total-lump-sum').textContent
    ]
    : ['Retirement preview: basic pay না দিলে হিসাব করা হয়নি'];
  const text = [
    'PayScale 2026 Calculator',
    result.fixed ? 'ধরন: স্থির বেতন' : 'গ্রেড: ' + result.grade,
    'বর্তমান মূল বেতন: ' + money(result.current),
    'Article 5 pay-fixation basic: ' + money(result.payFixationBasic),
    'Article 9 incrementসহ নতুন পূর্ণ মূল বেতন: ' + money(result.annualIncrementBasic),
    'মোট বৃদ্ধি: ' + money(result.totalIncrease),
    '১ জুলাই–৩১ ডিসেম্বর ২০২৬: ' + money(result.phase1Pay),
    '১ জানুয়ারি–৩০ জুন ২০২৭: ' + money(result.phase2Pay),
    '১ জুলাই ২০২৭ থেকে: ' + money(result.phase3Pay),
    'আনুমানিক Basic-pay arrears (১ জুলাই–১৭ সেপ্টেম্বর ২০২৬): ' + money(result.arrearsEstimate) + ' · ৩০ দিন = ১ মাস ধরে',
    'Gross profile: ' + profile.sro,
    'আনুমানিক Gross Salary (পর্যায় ৩): ' + (grossAutomatic ? grossTotal : 'স্বয়ংক্রিয়ভাবে গণনা করা হয়নি'),
    grossAutomatic ? 'Gross assumptions: ' + grossAssumptionSummary(result.grade) : 'Gross note: সংশ্লিষ্ট pay order/স্থির পদের ভাতা আলাদা করে যাচাই করতে হবে।',
    ...retirementLines,
    'Prepared by RegTech Nexus AI',
    'সূত্র: Bangladesh Gazette, Extra, 17 September 2026 · ' + profile.sro,
    'Demo output only. Final decisions remain with the authorised accounts office.',
  ].join('\n');
  try {
    await navigator.clipboard.writeText(text);
    toast.hidden = false;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      toast.hidden = true;
    }, 1800);
  } catch {
    validation.textContent = 'কপি করা সম্ভব হয়নি; ফলাফলটি ম্যানুয়ালি কপি করুন।';
    validation.hidden = false;
  }
});

renderScaleTable(false);
renderRetirementReferenceTables();
fixedFields.hidden = true;
gradeFieldGroup.hidden = false;
showResultState(false);
toast.hidden = true;
updateScopeGate();
