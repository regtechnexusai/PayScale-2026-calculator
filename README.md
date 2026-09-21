# PayScale 2026 Calculator — RegTech Nexus AI

**Release:** v1.26 · **Last verified:** 21 September 2026

PayScale 2026 Calculator is a dependency-free static web tool for understanding Bangladesh pay-order transitions. It calculates potential basic-pay changes, phased implementation and the next-higher-step rule. It is prepared by **RegTech Nexus AI — Audit & Regulatory Intelligence** and runs on GitHub Pages.

## What it does

- Calculates potential new basic pay and total difference from current basic pay.
- Shows Phase 1 (July–December 2026), Phase 2 (January–June 2027) and Phase 3 (from July 2027).
- Applies the opening-step difference and next-higher-step rule described in the general gazette, then applies the 1 July 2026 Article 9(2) increment and the next annual increment included in the 1 July 2027 full-pay stage.
- Provides a grade-wise 2015 → 2026 reference table.
- Adds an optional Step 03 Gross Salary preview for the transcribed general-government allowance rules: house rent, medical, education assistance, tiffin, mobile, washing and selected conditional allowances. Separate bank/public-body/police/BGB orders and fixed-pay posts are shown without an automatic gross total until their allowance schedules are separately transcribed and verified.
- Shows source, separate pay-order numbers, privacy treatment and human-review warnings.
- Keeps Retirement Benefits on a separate `pension.html` page from the salary calculator. The dedicated page reads the 17 September 2026 retirement-benefit Gazette: gross pension rate, 50% surrender-based pensionable portion, gratuity, up to 18 months’ leave encashment and net-pension bands. A salary result passes Phase 1, Phase 2 and Phase 3 basic values to that page; the user selects the applicable retirement phase before calculation, and the two results are never added together.
- Presents two entry choices at the top of the homepage: current-employee salary recalculation or direct pension/retirement-benefits calculation without requiring current salary.
- Provides a browser print/PDF view for the salary and pension result pages.
- Includes linked About, Methodology, Privacy, Terms and Changelog pages, plus a discrepancy-report route.
- Prints/copies audit context: selected inputs, ৫০% pension-surrender assumption where applicable, Gazette reference, release version and calculation time.
- Keeps opening–maximum grade reference rows and pension tables in static HTML as a no-JavaScript/search fallback; JavaScript adds full-step expansion and calculations.
- Includes a static site smoke test that checks required files and local HTML targets before deployment.

## General calculation rules

The general government calculation follows the Bangladesh Gazette, Extra, dated 17 September 2026, **S.R.O. No. 347-Law/2026 — চাকরি (বেতন ও ভাতাদি) আদেশ, ২০২৬**:

1. Take the employee’s basic pay as of 30 June 2026.
2. Subtract the opening step of the corresponding 2015 scale.
3. Add that difference to the opening step of the corresponding 2026 scale.
4. If the result is not an exact 2026 step, use the next higher step (Article 5 pay fixation).
5. Apply one annual increment on 1 July 2026 under Article 9(2). This is the next listed increment step, not an arbitrary extra Step 5/Step 6.
6. From 1 July to 31 December 2026, add 40% for Grades 1–9 and 50% for Grades 10–20 of the difference between the current basic and the 1 July 2026 increment-inclusive transition basic.
7. From 1 January to 30 June 2027, add 70% for Grades 1–9 and 75% for Grades 10–20 of that same transition difference.
8. From 1 July 2027, the next annual increment is included and the full increment-inclusive basic pay applies. For example, the Grade 10 audit case 31,780 → 49,700 (Article 5) → 52,200 (1 July 2026 increment) → 54,800 (1 July 2027 full stage).
9. The app shows a review-support basic-pay arrears estimate as of 17 September 2026, using 30 days as one month. Official month-wise arrears may differ. The later 19 September BG Press notice-page date is not used as the arrears endpoint. It excludes allowances, deductions, tax and the authorised arrears statement.
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
python3 -m http.server 8080 --directory .
```

Open `http://localhost:8080` in a browser.

## Deploy on GitHub Pages

Upload the application files in this repository root, including `index.html`, `pension.html`, `styles.css`, `release-meta.js`, `scale-data.js`, `retirement-data.js`, `app.js`, `pension.js`, the policy pages, `robots.txt`, `sitemap.xml`, the tests, the source documents and the required image assets. Do not deploy temporary audit-render files. Run `node --check app.js`, `node --check pension.js`, `node basic-pay.test.js`, `node retirement-benefits.test.js` and `node site-smoke.test.js` before publishing. The included GitHub Actions workflow repeats the syntax, calculation and static-site checks on pushes and pull requests. Then open **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.

## Source and maintenance

The primary implementation source is the user-provided Bangladesh Gazette PDF for S.R.O. No. 347-Law/2026. Scale data is kept in the `SCALES` object in `scale-data.js`; `basic-pay.test.js` checks the opening, maximum, between-step, phased and fixed-pay cases. If a corrigendum or implementation order is issued, the official document takes precedence.

Prepared by **RegTech Nexus AI** — Audit & Regulatory Intelligence. **Version 1.26**, last verified 21 September 2026. The Gazette document is dated 17 September 2026; the BG Press notice page records 19 September as the publication date. The arrears estimate is stated as of 17 September and uses the disclosed 30-day-month convention. The non-responsive S.R.O. 349 provenance link and the non-working Official S.R.O. notice link were removed; separate scope/profile notes remain for clarity. Article 9(2) increment treatment, the 1 July 2027 full-stage increment, Article 15(1) house-rent timing, retirement-phase basic selection, net-pension input gating, the separate `pension.html` retirement-benefit page, its dedicated result button, the two-entry homepage choice, print/PDF output, static reference fallbacks, audit-ready copy context, policy pages, SEO files, accessibility live-summary and clarified salary/pension wording are documented in the current release. This is an independent educational calculator and review-support tool; it is not an official Government or Finance Division pay-fixation portal.
