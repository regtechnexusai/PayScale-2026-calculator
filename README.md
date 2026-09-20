# PayScale 2026 Calculator — RegTech Nexus AI

PayScale 2026 Calculator is a dependency-free static web tool for understanding Bangladesh pay-order transitions. It calculates potential basic-pay changes, phased implementation and the next-higher-step rule. It is prepared by **RegTech Nexus AI — Audit & Regulatory Intelligence** and runs on GitHub Pages.

## What it does

- Calculates potential new basic pay and total difference from current basic pay.
- Shows Phase 1 (July–December 2026), Phase 2 (January–June 2027) and Phase 3 (from July 2027).
- Applies the opening-step difference and next-higher-step rule described in the general gazette.
- Provides a grade-wise 2015 → 2026 reference table.
- Adds an optional Step 03 Gross Salary preview for the transcribed general-government allowance rules: house rent, medical, education assistance, tiffin, mobile, washing and selected conditional allowances. Separate bank/public-body/police/BGB orders and fixed-pay posts are shown without an automatic gross total until their allowance schedules are separately transcribed and verified.
- Shows source, separate pay-order numbers, privacy treatment and human-review warnings.

## General calculation rules

The general government calculation follows the Bangladesh Gazette, Extra, dated 17 September 2026, **S.R.O. No. 347-Law/2026 — চাকরি (বেতন ও ভাতাদি) আদেশ, ২০২৬**:

1. Take the employee’s basic pay as of 30 June 2026.
2. Subtract the opening step of the corresponding 2015 scale.
3. Add that difference to the opening step of the corresponding 2026 scale.
4. If the result is not an exact 2026 step, use the next higher step.
5. From 1 July to 31 December 2026, add 40% for Grades 1–9 and 50% for Grades 10–20.
6. From 1 January to 30 June 2027, add 70% for Grades 1–9 and 75% for Grades 10–20.
7. From 1 July 2027, the full refixed basic pay applies, subject to the Gazette and applicable annual increment rules.
8. Arrears may be payable from 1 July 2026; this app does not quantify arrears.
9. Fixed-pay cases are shown separately; interim percentages do not apply to those cases.

## Scope and separate 2026 pay orders

- General government service: **S.R.O. No. 347-Law/2026**.
- Self-governed (Public Bodies) and state-owned institutions: **S.R.O. No. 348-Law/2026**.
- Banks, insurance and financial institutions: **S.R.O. No. 349-Law/2026**. The uploaded order’s definitions include Bangladesh Bank within “bank”.
- Bangladesh Police: **S.R.O. No. 350-Law/2026**.
- Border Guard Bangladesh: **S.R.O. No. 351-Law/2026**.

The judicial service, defence-related employees, apprentices, trainees, outsourced staff, daily-wage staff, contractual staff and part-time staff may be governed by separate orders, service rules or exclusions. Do not treat them as ordinary S.R.O. 347 cases without checking the applicable instrument.

This is an **unofficial educational/review-support tool**, not a Government or Finance Division portal and not a final pay-fixation decision. The result should be checked against the service book, official pay-fixation record and later corrigendum or clarification.

## Gross Salary module

The optional Step 03 module keeps the basic-pay result unchanged and adds selected allowances to each of the three pay phases. S.R.O. 347 is the only profile with an automatic gross preview in this release. S.R.O. Nos. 348, 349, 350 and 351 can be selected for scope visibility, but their institution/unit-specific allowance schedules are not silently treated as the general schedule. Fixed-pay posts are also excluded from automatic gross estimation. See [GROSS-SALARY-RULES.md](GROSS-SALARY-RULES.md) for the exact rule map and exclusions.

## Privacy

Calculations are performed in the browser. This static app does not send or store salary inputs and contains no analytics or third-party scripts. The copy-result button only copies the displayed result to the user’s device clipboard. GitHub Pages’ normal web request logs are a separate hosting matter.

Contact: `regtechnexusai@gmail.com`

Official references: [Bangladesh Government Press](https://bgpress.dpp.gov.bd/) and [Ministry of Finance](https://mof.gov.bd/).

## Run locally

No build step is required:

```bash
python3 -m http.server 8080 --directory pay-scale-2026-calculator
```

Open `http://localhost:8080` in a browser.

## Deploy on GitHub Pages

Upload `index.html`, `styles.css`, `app.js`, `README.md`, `GROSS-SALARY-RULES.md`, the logo files, `payscale-2026-og.png` and `pay-scale-2026-gazette.pdf` to the repository root. Then open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.

## Source and maintenance

The primary implementation source is the user-provided Bangladesh Gazette PDF for S.R.O. No. 347-Law/2026. Scale data is kept in the `SCALES` object near the top of `app.js`. If a corrigendum or implementation order is issued, the official document takes precedence.

Prepared by **RegTech Nexus AI** — Audit & Regulatory Intelligence. **Version 1.10**, last verified 20 September 2026. This is an independent educational calculator and review-support tool; it is not an official Government or Finance Division pay-fixation portal.
