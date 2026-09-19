# PayScale 2026 Calculator

বাংলাদেশের জাতীয় বেতনস্কেল ২০২৬ অনুযায়ী বর্তমান মূল বেতন থেকে নতুন মূল বেতন, অন্তর্বর্তী বৃদ্ধি এবং পূর্ণ পার্থক্য হিসাবের জন্য একটি dependency-free static web app। GitHub Pages-এ সরাসরি চালানো যায়।

## Included calculation rules

The calculation engine follows the uploaded Bangladesh Gazette, Extra, dated 17 September 2026:

1. Take the employee's basic pay as of 30 June 2026.
2. Subtract the opening step of the corresponding 2015 scale.
3. Add that difference to the opening step of the corresponding 2026 scale.
4. If the result is not an exact 2026 scale step, use the next higher step.
5. From 1 July to 31 December 2026, add 40% of the total difference for Grades 1-9 and 50% for Grades 10-20.
6. From 1 January 2027, the full refixed basic pay is used.

The app deliberately does not calculate house-rent, medical or other allowances, tax, deductions, pension, arrears, promotion, higher-grade entitlement, selection grade, personal pay, leave or final office pay fixation.

## Run locally

No build step is required:

```bash
python3 -m http.server 8080 --directory pay-scale-2026-calculator
```

Open `http://localhost:8080` in a browser.

## Deploy on GitHub Pages

1. Create a GitHub repository.
2. Upload `index.html`, `styles.css`, `app.js` and this `README.md` to the repository root.
3. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`.
4. Save. GitHub will provide the public Pages URL.

## Data maintenance

The old-scale range and the new-scale steps are kept at the top of `app.js` inside the `SCALES` object. If the Finance Division publishes a correction or a new implementation order, update only that data block and the source note.

## Source note

Primary source used for this implementation: user-provided `Pay Scale 2026.pdf`, Bangladesh Gazette, Extra, 17 September 2026, Finance Division, Implementation Division-1. The pay-fixation rules are stated in the Gazette's corresponding-scale and pay-determination provisions.
