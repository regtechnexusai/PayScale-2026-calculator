# PayScale 2026 Calculator — RegTech Nexus AI

PayScale 2026 Calculator is a clean, single-purpose, dependency-free static web tool for Bangladesh government service employees. It helps users understand the potential transition from the National Pay Scale 2015 to the National Pay Scale 2026, including the phased basic-pay increase and the next-higher-step rule. It is prepared by **RegTech Nexus AI — Audit & Regulatory Intelligence** and can run directly on GitHub Pages.

## What the website does

- **Live salary calculation:** calculates the potential new basic pay and total difference from the employee's current basic pay.
- **Phased implementation timeline:** shows Phase 1 (July–December 2026), Phase 2 (January–June 2027), and Phase 3 (from July 2027 onward).
- **Gazette-rule compliance:** uses the opening step of the old and new scales; when the calculated value does not match an exact new-scale step, it selects the next higher step.
- **Reference tables:** provides a grade-wise comparison of the 2015 and 2026 scales and the applicable Phase 1/Phase 2 rates.
- **Governance information:** displays the source S.R.O. number, official archive links, last-verified date, scope limitation, privacy treatment and human-review disclaimer.

## Included calculation rules

The calculation engine follows the uploaded Bangladesh Gazette, Extra, dated 17 September 2026, S.R.O. No. 347-Law/2026:

1. Take the employee's basic pay as of 30 June 2026.
2. Subtract the opening step of the corresponding 2015 scale.
3. Add that difference to the opening step of the corresponding 2026 scale.
4. If the result is not an exact 2026 scale step, use the next higher step.
5. From 1 July to 31 December 2026, add 40% of the total difference for Grades 1-9 and 50% for Grades 10-20.
6. From 1 January to 30 June 2027, add 70% of the total difference for Grades 1-9 and 75% for Grades 10-20.
7. From 1 July 2027, the full refixed basic pay applies, with the applicable annual increment handled under the Gazette.
8. Arrears from 1 July 2026 to the Gazette/order issue date may be payable; this app does not quantify arrears.
9. Fixed-pay treatment is shown separately for Grade 1 (৳156,000), Cabinet Secretary/Principal Secretary-level posts (৳172,000) and Senior Secretary-level posts (৳164,000). The interim percentages do not apply to these fixed-pay cases.

The app deliberately does not calculate house-rent, medical or other allowances, tax, deductions, pension, arrears, promotion, higher-grade entitlement, selection grade, personal pay, leave, annual-increment amount, or final office pay fixation. If the entered basic pay is not a listed 2015-scale step, the app shows a warning and asks the user to verify the official pay-fixation record.

## Scope, privacy and governance

- This is an **unofficial educational/review-support tool**, not a Government or Finance Division portal and not a final pay-fixation decision.
- It is intended for the Bangladesh Government National Pay Scale 2026. Do not assume that it applies to autonomous bodies, Bangladesh Bank/banks, financial institutions, private employers or organisations with their own pay scales.
- It should not be assumed to apply to the judicial service, police, BGB, civilian staff paid from defence estimates, apprentices, trainees, outsourced staff, daily-wage staff, contractual staff or part-time staff where separate rules or exclusions apply.
- Calculations are performed in the browser. This static app does not send or store salary inputs and contains no analytics or third-party scripts. The copy-result button only copies the displayed result to the user's device clipboard.
- The result should be checked against the employee's service book, office pay-fixation record and any later corrigendum or clarification. Final decisions remain with the authorised accounts office.
- Contact: `regtechnexusai@gmail.com`
- Official reference portals: [Bangladesh Government Press](https://www.dpp.gov.bd/) and [Ministry of Finance](https://mof.gov.bd/).

## Run locally

No build step is required:

```bash
python3 -m http.server 8080 --directory pay-scale-2026-calculator
```

Open `http://localhost:8080` in a browser.

## Deploy on GitHub Pages

1. Create a GitHub repository.
2. Upload `index.html`, `styles.css`, `app.js`, `README.md`, `regtech-nexus-ai-logo-wide.png`, `payscale-2026-og.png` and `pay-scale-2026-gazette.pdf` to the repository root. Do not upload the ZIP itself as the website.
3. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`.
4. Save. GitHub will provide the public Pages URL.

## Data maintenance

The old-scale range and the new-scale steps are kept at the top of `app.js` inside the `SCALES` object. If the Finance Division publishes a correction or a new implementation order, update only that data block and the source note.

## Verification coverage

The current package was checked with a dependency-free Node audit covering all 20 grades and 319 listed 2015-scale steps. The audit checks sorted/unique data, next-higher-step behavior between tiers, phase rates, fixed-pay paths and boundary handling. These tests are internal consistency checks; the official Gazette and any later corrigendum remain authoritative.

## Source note

Primary source used for this implementation: user-provided `Pay Scale 2026.pdf`, published as Bangladesh Gazette, Extra, 17 September 2026, Finance Division, Implementation Division-1, S.R.O. No. 347-Law/2026. The pay-fixation rules are stated in the Gazette's corresponding-scale and pay-determination provisions. Last verified for this package: 19 September 2026. If a corrigendum or clarification is issued, the official document takes precedence.

## Prepared by

Prepared by **RegTech Nexus AI** — Audit & Regulatory Intelligence. Version 1.5. On mobile, submitting Step 1 moves the Step 2 result panel to the top of the viewport for easier review. This is an independent educational calculator and review-support tool; it is not an official Government or Finance Division pay-fixation portal.
