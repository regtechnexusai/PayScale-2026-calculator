# Gross Salary module — rule map (v1.26)

This file documents the allowance rules used by the optional Step 03 module. Step 01/02 keeps the 1 July 2026 transition basic and the 1 July 2027 full basic distinct, including the annual increment required at each applicable date.

## Profiles and transcription status

- **S.R.O. No. 347-Law/2026** — general government service order.
- **S.R.O. No. 349-Law/2026** — bank, insurance and financial institution order, including the definition that lists Bangladesh Bank among the banks. It is selectable for scope visibility, but its allowance schedule is not yet automatically transcribed in this release.

The module does not silently apply the general allowance schedule to S.R.O. 348, 349, 350 or 351. Those orders are selectable so the user can see the scope, but their institution/unit-specific allowance schedules must be transcribed and verified separately before automatic gross calculation is enabled. Fixed-pay posts are treated the same way because the post-specific allowance package is not established by the grade table alone. The Step 01 scope check stops the S.R.O. 347 calculator for users who identify a separate pay order.

## Rules used for the automatic preview

### House rent

Article 15(1) keeps the National Pay Scale 2015 house-rent rates on amounts earned or entitled to through 31 December 2027. Therefore all three displayed 2026–2027 phases use the old 2015 schedule. The 2026 house-rent table starts on 1 January 2028 and is not applied early by this preview. House rent is calculated on each phase’s basic pay and is zero when the user confirms that government accommodation is provided.

| 2015 basic-pay band | Dhaka North/South City Corporation | Listed city corporations / listed municipal areas | Other places |
|---|---:|---:|---:|
| Up to ৳৯,৭০০ (rate / minimum) | ৬৫% / ৳৫,৬০০ | ৫৫% / ৳৫,০০০ | ৫০% / ৳৪,৫০০ |
| ৳৯,৭০১–১৬,০০০ (rate / minimum) | ৬০% / ৳৬,৪০০ | ৫০% / ৳৫,৪০০ | ৪৫% / ৳৪,৮০০ |
| ৳১৬,০০১–৩৫,৫০০ (rate / minimum) | ৫৫% / ৳৯,৬০০ | ৪৫% / ৳৮,০০০ | ৪০% / ৳৭,০০০ |
| ৳৩৫,৫০১ ও তদূর্ধ্ব (rate / minimum) | ৫০% / ৳১৯,৫০০ | ৪০% / ৳১৬,০০০ | ৩৫% / ৳১৩,৮০০ |

The listed-city option covers the named city corporations and the Savar/Cox’s Bazar municipal areas described in the gazette table. The user remains responsible for selecting the correct location category and accommodation status.

### Fixed monthly allowances

- Medical: Tk 3,000 up to age 50; Tk 4,000 from age 50 years 1 day until retirement, when applicable.
- Education assistance: Tk 500 per eligible child per month, maximum two children. The gazette’s age and spouse/dual-government-employee conditions remain applicable.
- Tiffin: Tk 500 for Grades 11–20 when the institution does not provide lunch allowance or free midday food.
- Mobile: Tk 500 for Grades 1–5; Tk 150 for Grades 6–20.
- Washing: Tk 300 only where the allowance is applicable to the post/work.
- City travel: Tk 600 for Grades 11–20 when the employee works in the applicable city-corporation area.

### Conditional allowances

- Hill allowance: 20% of phase basic pay, capped at Tk 5,000 for district headquarters/sadar upazila and Tk 5,500 for other upazilas.
- Haor/island-char allowance: 20% of phase basic pay, capped at Tk 5,000.
- Training-institution allowance: 10% of phase basic pay for eligible Grades 1–9 employees on deputation for training.
- Special-needs child allowance: Tk 3,000 per eligible child, maximum two children.
- Other authorised monthly allowance: manual input only. It must not duplicate an allowance already selected.

## What “Gross Salary” means here

`Gross Salary = phase basic pay + selected allowances`.

The displayed amount is a conditional review-support estimate, not a universal entitlement. House rent depends on each displayed phase basic pay, duty station and government accommodation; medical and education assistance depend on eligibility; tiffin and travel are grade- and condition-specific. The house-rent rate is selected from the 2015 basic-pay bands above, and the statutory minimum is applied where relevant—not a blanket 40–50% rate. Allowance timing and the final payroll base must still be reconciled with the authorised accounts office before this preview is used for payroll.

It excludes income tax, provident fund, pension, loan recovery, other deductions, arrears, festival allowance/bonus and any post/unit-specific special allowance not selected by the user. The separate basic-pay arrears estimate in Step 02 is not part of Gross Salary. The result is a review-support estimate, not an official pay-fixation statement.

## Separate pension page

The salary page does not embed or combine retirement results. The separate `pension.html` page and `pension.js` use the Finance Division retirement-benefit Gazette dated 17 September 2026:

- Gross pension rate: ২১% for ৫ years, increasing by the published service-year table to ৯০% for ২৫ years or more.
- Pensionable portion: ৫০% of the calculated gross pension is shown after the standard surrender assumption.
- Gratuity: the published rate table is applied to that pensionable/surrendered portion—২৬৫ for ৫–৯ years, ২৬০ for ১০–১৪ years, ২৪৫ for ১৫–১৯ years and ২৩০ for ২০ years or more.
- Leave encashment: the user may select up to ১৮ months; the estimate is applicable basic pay × selected months.
- Net pension: the published band rate and minimum/maximum limits are shown. If a current net pension is entered, the tool applies the band rate and clamps the result within the published limits as a review estimate.

These figures do not include medical allowance, family pension, deductions, qualifying-service exceptions, PPO corrections, arrears or any office-specific sanction. The official retirement-benefit notification and authorised pension office decision take precedence.

## Source

Primary sources: [Bangladesh Gazette, Extra, 17 September 2026, S.R.O. No. 347-Law/2026](pay-scale-2026-gazette.pdf), especially Article 9(2) (annual increment) and Article 15(1) (2015 house-rent schedule through 31 December 2027), and the [separate retirement-benefit Gazette](https://www.dpp.gov.bd/upload_file/gazettes/62983_75061.pdf). The separate S.R.O. No. 349-Law/2026 profile remains visible for scope but is not automatically transcribed here. Always check the latest official Gazette, corrigendum, clarification and the employee’s authorised pay-fixation or pension statement before using a result.
