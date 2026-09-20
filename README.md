# PayScale 2026 Calculator — RegTech Nexus AI

PayScale 2026 Calculator is a dependency-free static web tool for understanding Bangladesh pay-order transitions. It calculates potential basic-pay changes, phased implementation and the next-higher-step rule. It is prepared by **RegTech Nexus AI — Audit & Regulatory Intelligence** and runs on GitHub Pages.

## What it does

- Calculates potential new basic pay and total difference from current basic pay.
- Shows Phase 1 (July–December 2026), Phase 2 (January–June 2027) and Phase 3 (from July 2027).
- Applies the opening-step difference and next-higher-step rule described in the general gazette, then applies the one 1 July 2026 annual increment required by Article 9(2).
- Provides a grade-wise 2015 → 2026 reference table.
- Adds an optional Step 03 Gross Salary preview for the transcribed general-government allowance rules: house rent, medical, education assistance, tiffin, mobile, washing and selected conditional allowances. Separate bank/public-body/police/BGB orders and fixed-pay posts are shown without an automatic gross total until their allowance schedules are separately transcribed and verified.
- Shows source, separate pay-order numbers, privacy treatment and human-review warnings.
- Adds an optional Step 04 Retirement Benefits preview from the separate 17 September 2026 retirement-benefit Gazette: gross pension rate, 50% surrender-based pensionable portion, gratuity, up to 18 months’ leave encashment and net-pension bands.

## General calculation rules

The general government calculation follows the Bangladesh Gazette, Extra, dated 17 September 2026, **S.R.O. No. 347-Law/2026 — চাকরি (বেতন ও ভাতাদি) আদেশ, ২০২৬**:

1. Take the employee’s basic pay as of 30 June 2026.
2. Subtract the opening step of the corresponding 2015 scale.
3. Add that difference to the opening step of the corresponding 2026 scale.
4. If the result is not an exact 2026 step, use the next higher step (Article 5 pay fixation).
5. Apply one annual increment on 1 July 2026 under Article 9(2). This is the next listed increment step, not an arbitrary extra Step 5/Step 6.
6. From 1 July to 31 December 2026, add 40% for Grades 1–9 and 50% for Grades 10–20 of the difference between the current basic and the increment-inclusive result.
7. From 1 January to 30 June 2027, add 70% for Grades 1–9 and 75% for Grades 10–20 of that same total difference.
8. From 1 July 2027, the full increment-inclusive refixed basic pay applies.
9. The app shows a review-support basic-pay arrears estimate from 1 July to the order date of 17 September 2026, using 30 days as one month. The later 19 September BG Press notice-page date is not used as the arrears endpoint. It excludes allowances, deductions, tax and the authorised arrears statement.
10. Fixed-pay cases are shown separately; interim percentages do not apply to those cases.

## Scope and separate 2026 pay orders

- General government service: **S.R.O. No. 347-Law/2026**.
- Self-governed (Public Bodies) and state-owned institutions: **S.R.O. No. 348-Law/2026**.
- Banks, insurance and financial institutions: **S.R.O. No. 349-Law/2026**. The uploaded order’s definitions include Bangladesh Bank within “bank”.
- Bangladesh Police: **S.R.O. No. 350-Law/2026**.
- Border Guard Bangladesh: **S.R.O. No. 351-Law/2026**.

The judicial service, defence-related employees, apprentices, trainees, outsourced staff, daily-wage staff, contractual staff and part-time staff may be governed by separate orders, service rules or exclusions. Do not treat them as ordinary S.R.O. 347 cases without checking the applicable instrument.

This is an **unofficial educational/review-support tool**, not a Government or Finance Division portal and not a final pay-fixation decision. The result should be checked against the service book, official pay-fixation record and later corrigendum or clarification.

## Gross Salary module

The optional Step 03 module keeps the basic-pay result unchanged and adds selected allowances to each of the three pay phases. S.R.O. 347 is the only profile with an automatic gross preview in this release. Under Article 15(1), the 2015 house-rent rates and minimums remain in force through 31 December 2027; the 2026 house-rent schedule begins 1 January 2028 and is not applied early. S.R.O. Nos. 348, 349, 350 and 351 can be selected for scope visibility, but their institution/unit-specific allowance schedules are not silently treated as the general schedule. Fixed-pay posts are also excluded from automatic gross estimation. See [GROSS-SALARY-RULES.md](GROSS-SALARY-RULES.md) for the exact rule map and exclusions.

## Privacy

Calculations are performed in the browser. This static app does not send or store salary inputs and contains no analytics or third-party scripts. The copy-result button only copies the displayed result to the user’s device clipboard. GitHub Pages’ normal web request logs are a separate hosting matter.

Contact: `regtechnexusai@gmail.com`

Official references: [Bangladesh Government Press](https://bgpress.dpp.gov.bd/), [Ministry of Finance](https://mof.gov.bd/), the [official Pay Fixation portal](https://www.payfixation.gov.bd/) and the [Retirement Benefits Gazette PDF](https://www.dpp.gov.bd/upload_file/gazettes/62983_75061.pdf).

## Run locally

No build step is required:

```bash
python3 -m http.server 8080 --directory pay-scale-2026-calculator
```

Open `http://localhost:8080` in a browser.

## Deploy on GitHub Pages

Upload `index.html`, `styles.css`, `scale-data.js`, `retirement-data.js`, `app.js`, `basic-pay.test.js`, `retirement-benefits.test.js`, `README.md`, `GROSS-SALARY-RULES.md`, the logo files, `payscale-2026-og.png` and `pay-scale-2026-gazette.pdf` to the repository root. Run `node basic-pay.test.js` and `node retirement-benefits.test.js` before publishing. Then open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.

## Source and maintenance

The primary implementation source is the user-provided Bangladesh Gazette PDF for S.R.O. No. 347-Law/2026. Scale data is kept in the `SCALES` object in `scale-data.js`; `basic-pay.test.js` checks the opening, maximum, between-step, phased and fixed-pay cases. If a corrigendum or implementation order is issued, the official document takes precedence.

Prepared by **RegTech Nexus AI** — Audit & Regulatory Intelligence. **Version 1.20**, last verified 20 September 2026. The Gazette document is dated 17 September 2026; the BG Press notice page records 19 September as the publication date. The arrears estimate ends at the order date, not the later notice-page date. The non-responsive S.R.O. 349 provenance link and the non-working Official S.R.O. notice link were removed; separate scope/profile notes remain for clarity. Article 9(2) increment treatment, Article 15(1) house-rent timing, the separate retirement-benefit Gazette module, its dedicated result button and the clarified salary/pension wording are documented in the current release. This is an independent educational calculator and review-support tool; it is not an official Government or Finance Division pay-fixation portal.
