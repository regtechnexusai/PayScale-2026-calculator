# Gross Salary module — rule map (v1.12)

This file documents the allowance rules used by the optional Step 03 module. The existing Step 01/02 basic-pay calculation is unchanged.

## Profiles and transcription status

- **S.R.O. No. 347-Law/2026** — general government service order.
- **S.R.O. No. 349-Law/2026** — bank, insurance and financial institution order, including the definition that lists Bangladesh Bank among the banks. It is selectable for scope visibility, but its allowance schedule is not yet automatically transcribed in this release.

The module does not silently apply the general allowance schedule to S.R.O. 348, 349, 350 or 351. Those orders are selectable so the user can see the scope, but their institution/unit-specific allowance schedules must be transcribed and verified separately before automatic gross calculation is enabled. Fixed-pay posts are treated the same way because the post-specific allowance package is not established by the grade table alone.

## Rules used for the automatic preview

### House rent

House rent is calculated on the phase basic pay and is zero when the user confirms that government accommodation is provided.

| 2026 grade band | Dhaka North/South City Corporation | Listed city corporations / listed municipal areas | Other places |
|---|---:|---:|---:|
| Grade 20 minimum step through Grade 16 maximum step | 60% | 50% | 45% |
| Grade 15 minimum step through Grade 10 maximum step | 50% | 40% | 35% |
| Grade 9 minimum step through Grade 5 maximum step | 45% | 35% | 30% |
| Grade 4 minimum step through Grade 1 and above | 40% | 30% | 25% |

The listed-city option covers the named city corporations and the Savar/Cox’s Bazar municipal areas described in the gazette table. The user remains responsible for selecting the correct location category.

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

The displayed amount is a conditional review-support estimate, not a universal entitlement. House rent depends on grade, duty station and government accommodation; medical and education assistance depend on eligibility; tiffin and travel are grade- and condition-specific. For example, a Grade 3 employee in Dhaka has a 40% house-rent rate under the general schedule, not a blanket 40–50% rate.

It excludes income tax, provident fund, pension, loan recovery, other deductions, arrears, festival allowance/bonus and any post/unit-specific special allowance not selected by the user. The separate basic-pay arrears estimate in Step 02 is not part of Gross Salary. The result is a review-support estimate, not an official pay-fixation statement.

## Source

Primary source: Bangladesh Gazette, Extra, 17 September 2026, Finance Division, S.R.O. Nos. 347-Law/2026 and 349-Law/2026. Always check the latest official Gazette, corrigendum, clarification and the employee’s authorised pay-fixation statement before using a result.
