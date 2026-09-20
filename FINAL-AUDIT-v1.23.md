# PayScale 2026 Calculator — final calculation audit

Version 1.23 · 20 September 2026

## Result

The calculator now keeps three values separate:

1. **Article 5 pay-fixation basic:** the next listed 2026 step after applying the opening-step difference.
2. **1 July 2026 transition basic:** the Article 9(2) one-step annual increment after fixation. Phase 1 and Phase 2 percentages are calculated from the difference between this value and the 30 June 2026 basic.
3. **1 July 2027 full basic:** the next annual increment is included in the full-pay stage, as required by the Gazette's full-pay clause.

This resolves the Grade 10 audit case:

`31,780 → 49,700 → 52,200 → 54,800`

The resulting phase values are **৳41,990**, **৳47,095** and **৳54,800**.

## Grade 1–20 regression coverage

The test suite checks all **315 listed 2015-scale inputs** across the 20 grades, plus each grade's opening step, maximum step and a between-step input. Grade 1's fixed-pay exception is tested separately. The table below records a maximum-step audit input for each grade.

| Grade | Audit current basic | Article 5 step | 1 Jul 2026 transition basic | 1 Jul 2027 full basic | Phase 1 | Phase 2 | Rates |
|---:|---:|---:|---:|---:|---:|---:|:---:|
| 1 | 78,000 | 156,000 fixed | 156,000 | 156,000 | 156,000 | 156,000 | fixed |
| 2 | 76,490 | 143,200 | 147,200 | 151,200 | 104,774 | 125,987 | 40/70 |
| 3 | 74,400 | 134,000 | 139,000 | 143,800 | 100,240 | 119,620 | 40/70 |
| 4 | 71,200 | 123,000 | 127,300 | 131,700 | 93,640 | 110,470 | 40/70 |
| 5 | 69,850 | 113,200 | 117,700 | 122,500 | 88,990 | 103,345 | 40/70 |
| 6 | 67,010 | 104,900 | 110,200 | 115,700 | 84,286 | 97,243 | 40/70 |
| 7 | 63,410 | 94,500 | 99,200 | 104,200 | 77,726 | 88,463 | 40/70 |
| 8 | 55,470 | 78,700 | 82,700 | 86,800 | 66,362 | 74,531 | 40/70 |
| 9 | 53,060 | 75,300 | 79,100 | 83,000 | 63,476 | 71,288 | 40/70 |
| 10 | 38,640 | 54,800 | 57,500 | 60,400 | 48,070 | 52,785 | 50/75 |
| 11 | 30,230 | 42,800 | 44,900 | 47,200 | 37,565 | 41,233 | 50/75 |
| 12 | 27,300 | 41,600 | 43,900 | 45,900 | 35,600 | 39,750 | 50/75 |
| 13 | 26,590 | 41,100 | 43,200 | 45,000 | 34,895 | 39,048 | 50/75 |
| 14 | 24,680 | 38,300 | 40,200 | 42,900 | 32,440 | 36,320 | 50/75 |
| 15 | 23,490 | 37,200 | 39,000 | 41,000 | 31,245 | 35,123 | 50/75 |
| 16 | 22,490 | 35,700 | 37,500 | 39,400 | 29,995 | 33,748 | 50/75 |
| 17 | 21,800 | 34,900 | 36,700 | 38,500 | 29,250 | 32,975 | 50/75 |
| 18 | 21,310 | 34,000 | 36,000 | 37,900 | 28,655 | 32,328 | 50/75 |
| 19 | 20,570 | 33,400 | 35,000 | 36,700 | 27,785 | 31,393 | 50/75 |
| 20 | 20,010 | 32,600 | 34,000 | 36,000 | 27,005 | 30,503 | 50/75 |

## Checks run

```text
node --check app.js
node --check pension.js
node basic-pay.test.js
node retirement-benefits.test.js
```

All checks pass. The optional Gross Salary preview remains explicitly conditional: it is not a universal entitlement, does not calculate deductions or tax, and does not silently apply S.R.O. 348–351 allowance schedules. The separate pension page remains independent from the salary result; the salary page only offers a full-basic prefill link.

The hosted PDF is retained as the primary local reference. Official Gazette corrections, clarifications, pay-fixation statements and authorised accounts-office decisions take priority over this independent review-support tool.
