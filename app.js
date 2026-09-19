/*
 * PayScale 2026 Calculator
 * Source: Bangladesh Gazette, Extra, 17 September 2026, Finance Division,
 * S.R.O. No. 347-Law/2026.
 *
 * The scale steps below are transcribed from the user-provided Gazette PDF.
 * Keep this data block separate and easy to update if an official correction
 * or subsequent order changes any scale step.
 */

const SCALES = {
  1:  { old: [78000], new: [156000], rate: 40, fixed: true },
  2:  { old: [66000, 68480, 71050, 73720, 76490], new: [132000, 135700, 139400, 143200, 147200, 151200, 155000], rate: 40 },
  3:  { old: [56500, 58760, 61120, 63570, 66120, 68790, 71530, 74400], new: [113000, 117000, 121100, 125300, 129700, 134000, 139000, 143800, 148800], rate: 40 },
  4:  { old: [50000, 52000, 54080, 56250, 58500, 60840, 63280, 65820, 68460, 71200], new: [100000, 103500, 107200, 110900, 114800, 118800, 123000, 127300, 131700, 136300, 142400], rate: 40 },
  5:  { old: [43000, 44580, 46170, 47810, 49600, 51430, 53360, 55280, 57200, 59220, 61200, 63160, 65000, 66840, 68580, 69850], new: [86000, 89500, 93100, 96800, 100700, 104700, 108900, 113200, 117700, 122500, 127400, 132400, 139700], rate: 40 },
  6:  { old: [35500, 37280, 39150, 41110, 43170, 45330, 47600, 49980, 52480, 55110, 57870, 60790, 63810, 67010], new: [71000, 74600, 78300, 82200, 86400, 90700, 95200, 100000, 104900, 110200, 115700, 121500, 127600, 134000], rate: 40 },
  7:  { old: [29000, 30450, 31980, 33580, 35260, 37030, 38890, 40840, 42890, 45040, 47300, 49670, 52160, 54750, 57470, 60270, 63410], new: [58000, 60900, 64000, 67200, 70500, 74100, 77800, 81700, 85700, 90000, 94500, 99200, 104200, 109400, 114900, 120600, 126800], rate: 40 },
  8:  { old: [23000, 24150, 25360, 26630, 27970, 29370, 30840, 32390, 34010, 35710, 37500, 39380, 41350, 43420, 45590, 47870, 50270, 52790, 55470], new: [46000, 48300, 50800, 53300, 56000, 58800, 61700, 64800, 68000, 71400, 75000, 78700, 82700, 86800, 91100, 95700, 100500, 105500, 110800], rate: 40 },
  9:  { old: [22000, 23100, 24260, 25480, 26760, 28100, 29510, 30990, 32540, 34170, 35880, 37680, 39570, 41550, 43630, 45820, 48110, 50510, 53060], new: [44000, 46200, 48600, 51000, 53500, 56200, 59000, 62000, 65100, 68300, 71900, 75300, 79100, 83000, 87200, 91500, 96100, 100900, 105700], rate: 40 },
  10: { old: [16000, 16800, 17640, 18530, 19460, 20440, 21470, 22550, 23680, 24870, 26110, 27390, 28710, 30080, 31510, 33000, 34560, 36190, 37800, 38640], new: [32000, 33600, 35300, 37100, 38900, 40900, 42900, 45100, 47300, 49700, 52200, 54800, 57500, 60400, 63400, 66600, 69900, 73400, 77300], rate: 50 },
  11: { old: [12500, 13130, 13790, 14480, 15210, 15980, 16780, 17620, 18490, 19410, 20380, 21390, 22460, 23580, 24760, 26000, 27300, 28670, 30230], new: [25000, 26300, 27600, 29000, 30400, 32000, 33600, 35200, 37000, 38800, 40800, 42800, 44900, 47200, 49500, 52000, 54600, 57300, 60500], rate: 50 },
  12: { old: [11300, 11870, 12470, 13100, 13760, 14450, 15180, 15940, 16740, 17580, 18460, 19380, 20350, 21370, 22440, 23560, 24740, 26000, 27300], new: [24300, 25600, 26800, 28200, 29600, 31100, 32600, 34200, 36000, 37900, 39600, 41600, 43900, 45900, 48200, 50600, 53100, 55900, 58700], rate: 50 },
  13: { old: [11000, 11550, 12130, 12740, 13380, 14050, 14760, 15500, 16280, 17100, 17960, 18860, 19810, 20800, 21860, 22960, 24110, 25280, 26590], new: [24000, 25200, 26500, 27800, 29200, 30900, 32200, 33800, 35500, 37300, 39100, 41100, 43200, 45000, 47600, 49900, 52400, 55100, 58000], rate: 50 },
  14: { old: [10200, 10710, 11250, 11810, 12400, 13020, 13670, 14350, 15070, 15820, 16610, 17440, 18310, 19230, 20200, 21210, 22280, 23400, 24680], new: [23500, 24700, 26000, 27300, 28600, 30000, 31500, 33100, 34800, 36500, 38300, 40200, 42900, 44400, 46600, 48900, 51000, 53900, 56800], rate: 50 },
  15: { old: [9700, 10190, 10700, 11240, 11810, 12400, 13020, 13670, 14350, 15070, 15820, 16610, 17440, 18310, 19230, 20200, 21210, 22280, 23490], new: [22800, 24000, 25200, 26400, 27800, 29100, 30600, 32100, 33700, 35400, 37200, 39000, 41000, 43000, 45200, 47400, 49800, 52000, 55200], rate: 50 },
  16: { old: [9300, 9770, 10260, 10780, 11320, 11890, 12490, 13120, 13780, 14470, 15200, 15960, 16760, 17600, 18480, 19410, 20390, 21410, 22490], new: [21900, 23000, 24200, 25400, 26700, 28000, 29400, 30900, 32400, 34000, 35700, 37500, 39400, 41300, 43200, 45600, 47900, 50200, 52900], rate: 50 },
  17: { old: [9000, 9450, 9930, 10430, 10960, 11510, 12090, 12700, 13340, 14010, 14710, 15450, 16220, 17030, 17880, 18770, 19710, 20700, 21800], new: [21400, 22500, 23600, 24800, 26100, 27400, 28700, 30200, 31700, 33200, 34900, 36700, 38500, 40400, 42400, 44500, 46800, 49100, 51900], rate: 50 },
  18: { old: [8800, 9240, 9710, 10200, 10710, 11250, 11820, 12410, 13030, 13680, 14360, 15080, 15830, 16620, 17450, 18320, 19240, 20210, 21310], new: [21000, 22100, 23200, 24400, 25600, 26900, 28200, 29600, 31100, 32600, 34000, 36000, 37900, 39600, 41600, 43700, 45900, 48200, 50900], rate: 50 },
  19: { old: [8500, 8930, 9380, 9850, 10350, 10870, 11420, 12000, 12600, 13230, 13890, 14580, 15310, 16080, 16880, 17720, 18600, 19530, 20570], new: [20500, 21600, 22700, 23800, 25000, 26200, 27500, 28900, 30300, 31900, 33400, 35000, 36700, 38400, 40600, 42700, 44800, 47000, 49600], rate: 50 },
  20: { old: [8250, 8670, 9110, 9570, 10050, 10560, 11090, 11650, 12240, 12860, 13500, 14180, 14900, 15650, 16440, 17270, 18140, 19050, 20010], new: [20000, 21000, 22100, 23200, 24400, 25600, 26900, 28200, 29600, 31100, 32600, 34000, 36000, 37900, 39600, 41600, 43700, 45900, 48400], rate: 50 },
};

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
const tableBody = document.querySelector('#scale-table-body');
const validation = document.querySelector('#validation-message');
const toast = document.querySelector('#toast');
const emptyResult = document.querySelector('#empty-result');
const resultBlocks = [...document.querySelectorAll('.result-block')];

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
  }

  const totalIncrease = applied - current;
  const rates = isFixed ? { phase1: null, phase2: null } : phaseRates(grade);
  const phase1Pay = isFixed ? applied : current + Math.round(totalIncrease * rates.phase1 / 100);
  const phase2Pay = isFixed ? applied : current + Math.round(totalIncrease * rates.phase2 / 100);
  const phase1Increment = isFixed ? null : phase1Pay - current;
  const phase2Increment = isFixed ? null : phase2Pay - current;
  const phase3Pay = applied;
  const percent = current ? (totalIncrease / current) * 100 : 0;

  showResultState(true);

  setText('grade-chip', fixedMode ? 'স্থির বেতন' : ('গ্রেড ' + toBn(grade) + (isFixed ? ' · নির্ধারিত' : '')));
  setText('result-hero-label', isFixed ? 'স্থির নির্ধারিত মূল বেতন · ১ জুলাই ২০২৬ থেকে' : 'পূর্ণ নতুন মূল বেতন · ১ জুলাই ২০২৭ থেকে');
  setText('interim-rate', isFixed ? 'প্রযোজ্য নয়' : toBn(rates.phase1) + '% → ' + toBn(rates.phase2) + '% → ১০০%');
  setText('new-basic', money(applied));
  setText('total-increase', money(totalIncrease));
  setText('increase-percent', toBn(percent.toFixed(1)) + '% · বর্তমান মূল বেতনের উপর');
  setText('phase1-title', isFixed ? '১ জুলাই ২০২৬ থেকে' : '১ জুলাই – ৩১ ডিসেম্বর ২০২৬');
  setText('phase1-description', isFixed ? 'স্থির বেতন; অন্তর্বর্তী শতাংশ প্রযোজ্য নয়' : 'বর্তমান মূল বেতনের সঙ্গে পার্থক্যের ' + toBn(rates.phase1) + '% যোগ হবে');
  setText('phase1-monthly', money(phase1Pay));
  setText('phase1-amount-label', isFixed ? 'স্থির নির্ধারিত বেতন' : 'ফলিত মূল বেতন');
  setText('phase1-increment', isFixed ? 'interim শতাংশ প্রযোজ্য নয়' : 'অন্তর্বর্তী বৃদ্ধি: ' + money(phase1Increment));
  setText('phase2-title', isFixed ? '১ জানুয়ারি ২০২৭ থেকে' : '১ জানুয়ারি – ৩০ জুন ২০২৭');
  setText('phase2-description', isFixed ? 'স্থির বেতন; অন্তর্বর্তী শতাংশ প্রযোজ্য নয়' : 'বর্তমান মূল বেতনের সঙ্গে পার্থক্যের ' + toBn(rates.phase2) + '% যোগ হবে');
  setText('phase2-monthly', money(phase2Pay));
  setText('phase2-amount-label', isFixed ? 'স্থির নির্ধারিত বেতন' : 'ফলিত মূল বেতন');
  setText('phase2-increment', isFixed ? 'interim শতাংশ প্রযোজ্য নয়' : 'অন্তর্বর্তী বৃদ্ধি: ' + money(phase2Increment));
  setText('phase3-title', isFixed ? 'স্থির নির্ধারিত বেতন' : '১ জুলাই ২০২৭ থেকে');
  setText('phase3-description', isFixed ? 'গেজেটের নির্ধারিত বেতন-পদ্ধতি; পর্যায়ভিত্তিক শতাংশ প্রযোজ্য নয়' : 'পূর্ণ পুনঃনির্ধারিত মূল বেতন; প্রযোজ্য বার্ষিক বেতনবৃদ্ধি আলাদাভাবে যোগ হবে');
  setText('phase3-monthly', money(phase3Pay));
  setText('phase3-amount-label', isFixed ? 'স্থির নির্ধারিত বেতন' : 'পূর্ণ মূল বেতন');
  setText('phase3-increment', isFixed ? 'অন্তর্বর্তী শতাংশ প্রযোজ্য নয়' : 'বার্ষিক বেতনবৃদ্ধি আলাদাভাবে প্রযোজ্য হতে পারে');
  setText('arrears-note', 'গেজেট অনুযায়ী ১ জুলাই ২০২৬ থেকে আদেশ জারির তারিখ পর্যন্ত বেতন বকেয়া হিসাবে প্রাপ্য হতে পারে; এই ক্যালকুলেটর বকেয়ার পরিমাণ নির্ণয় করে না।');
  setText('old-min-label', isFixed ? 'পুরোনো স্কেলের ধাপ' : 'পুরোনো স্কেলের প্রারম্ভিক ধাপ');
  setText('difference-label', isFixed ? 'স্থির বেতন − বর্তমান মূল বেতন' : 'বর্তমান বেতন − প্রারম্ভিক ধাপ');
  setText('candidate-label', isFixed ? 'স্থির বেতন পদ' : 'নতুন প্রারম্ভিক ধাপ + পার্থক্য');
  setText('applied-step-label', isFixed ? 'প্রযোজ্য নির্ধারিত বেতন' : 'প্রযোজ্য নতুন ধাপ');
  setText('old-min', isFixed ? 'প্রযোজ্য নয়' : money(oldMinimum));
  setText('difference', money(difference));
  setText('candidate', isFixed ? fixedPosts[fixedTarget] : money(candidate));
  setText('applied-step', isFixed ? money(applied) + ' · নির্ধারিত' : money(applied) + ' · ধাপ ' + toBn(stepIndex));
  setText('new-step-label', isFixed ? 'নির্ধারিত বেতন' : 'নতুন স্কেলের ধাপ ' + toBn(stepIndex));

  window.lastCalculation = { grade, current, oldMinimum, difference, candidate, applied, totalIncrease, phase1Pay, phase2Pay, phase3Pay, phase1Increment, phase2Increment, phase1Rate: rates.phase1, phase2Rate: rates.phase2, fixed: isFixed };
}

form.addEventListener('submit', (event) => { event.preventDefault(); calculate(true); });
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

document.querySelector('#toggle-table').addEventListener('click', (event) => {
  const expanded = event.currentTarget.dataset.expanded === 'true';
  event.currentTarget.dataset.expanded = String(!expanded);
  event.currentTarget.innerHTML = expanded ? 'সম্পূর্ণ ধাপ দেখুন <span>＋</span>' : 'ধাপ সংক্ষিপ্ত করুন <span>−</span>';
  renderScaleTable(!expanded);
});

document.querySelector('#copy-result').addEventListener('click', async () => {
  const result = window.lastCalculation;
  if (!result) return;
  const text = [
    'PayScale 2026 Calculator',
    result.fixed ? 'ধরন: স্থির বেতন' : 'গ্রেড: ' + result.grade,
    'বর্তমান মূল বেতন: ' + money(result.current),
    'নতুন পূর্ণ মূল বেতন: ' + money(result.applied),
    'মোট বৃদ্ধি: ' + money(result.totalIncrease),
    '১ জুলাই–৩১ ডিসেম্বর ২০২৬: ' + money(result.phase1Pay),
    '১ জানুয়ারি–৩০ জুন ২০২৭: ' + money(result.phase2Pay),
    '১ জুলাই ২০২৭ থেকে: ' + money(result.phase3Pay),
    'Prepared by RegTech Nexus AI',
    'সূত্র: Bangladesh Gazette, Extra, 17 September 2026 · S.R.O. No. 347-Law/2026',
    'Demo output only. Final decisions remain with the authorised accounts office.',
  ].join('\n');
  try {
    await navigator.clipboard.writeText(text);
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1800);
  } catch {
    validation.textContent = 'কপি করা সম্ভব হয়নি; ফলাফলটি ম্যানুয়ালি কপি করুন।';
    validation.hidden = false;
  }
});

renderScaleTable(false);
fixedFields.hidden = true;
gradeFieldGroup.hidden = false;
showResultState(false);
calculate(false);
