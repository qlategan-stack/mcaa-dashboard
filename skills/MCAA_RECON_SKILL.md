# MCAA Bank Reconciliation Skill
**Association:** Muckleneuk & Claudius Area Association (MCAA)  
**Bank account:** Capitec Business — 1007012625  
**Established from:** March 2026 reconciliation (31 Mar 2026)  
**Status:** CANONICAL STANDARD — all future months build on this

---

## AUTOMATIC TRIGGER — READ THIS FIRST

**When a new Capitec bank statement PDF is uploaded to this project, immediately produce BOTH outputs without being asked:**

1. **Excel reconciliation workbook** — follow the Monthly Processing Workflow in this skill. Output: `MCAA_Reconciled_[Mon][YYYY].xlsx`
2. **HTML dashboard** — follow MCAA_DASHBOARD_SKILL.md exactly. Output: `mcaa_dashboard_v[N].html`

Both files go to `/mnt/user-data/outputs/`. No confirmation needed. The upload is the instruction.

---

## Overview

This skill governs how to process a Capitec bank statement for MCAA against the membership list (`Comprehensive list` sheet in the base file). The base file is the **cumulative workbook** — each month a new bank statement is processed and appended to the existing file, adding new DO/EFT/Camera columns for that month.

---

## File Structure

### Base workbook sheets (in order)
1. **Comprehensive list** — master member table (never overwrite existing data; only add new columns)
2. **Bank Statement [Mon-YY]** — one sheet per month's processed bank statement
3. **Reconciliation [Mon-YY]** — one sheet per month's recon summary
4. **Expense Register** — cumulative all-months expense log
5. **Matching Audit Log** — all matched credit transactions with full trace
6. **Street Captains** — preserved as-is
7. **Payment Summary** — preserved as-is
8. **Members Report** — preserved as-is
9. **Notes** — preserved as-is
10. **Blignautsrus North** — preserved as-is

### Comprehensive list column layout
| Col | Header | Notes |
|-----|--------|-------|
| A | Owner / Tenant | Primary member name |
| B | Address | Street name |
| C | D/O Ref | Comma-separated if multiple refs (e.g. `EFT REF 108 BLG, BLG108, BLG108 CAMERA`) |
| D | Plot | Plot number (may include letters/slashes e.g. `8a`, `148/1`, `1,3,7`) |
| E–G | Contact 1–3 | Phone numbers |
| H | Email | |
| I onward | Monthly DO/EFT pairs | Pattern: `[Mon-YY] DO`, `[Mon-YY] EFT` — two columns per month |
| Second-to-last | Comments | |
| Second-to-last | Camera Payment | Camera-specific contributions — separate from EFT |
| Rows 530–534 | Standalone camera sponsors | Damaskus Projects, Fifth Street, Van Niekerk, Byron Nel Street, BlgN15F — not real members |

---

## Matching Rules (apply in priority order)

### 1. Debit Order Batch
- Reference contains `MIDVILLECACONTRA` → **DO Batch**, goes to `[Mon-YY] DO` column
- These are Capitec-collected DOs; match to individual members via their D/O Ref

### 2. Hardcoded outgoing references (permanent)
| Bank reference | Category | Description |
|---|---|---|
| `MENGO SIBANDA MCAA` | Salary | Monthly salary — Mengo Sibanda |
| `LUKA MCAA FENCE` | Maintenance | Fence repair — Luka |
| `TARY DESIGN MCAA` | Camera purchase | Camera equipment — Tary Design |
| `MR SN LANGA MCAA` | Utilities | Water / utilities |
| `JLK MCAA` | Expense | RTC / other |
| `CAPITEC B MCA` | Bank fee | DO service charge |
| `MONTH S/FEE` | Bank fee | Monthly account fee |
| `001 UNPAIDS` | Reversal | Unpaid DO reversal |

> These references are permanent. Add new ones as they appear each month.

### 3. Camera keyword rule
- If the bank reference contains `camera` or `cam` (case-insensitive) → payment goes to **Camera Payment column** (col AJ / col 36), NOT the EFT column
- Apply this AFTER matching the member; the column destination changes, not the member

### 4. Standalone camera sponsors
- Reference matches one of: `DAMASKUS PROJECTS`, `FIFTH STREET`, `VAN NIEKERK`, `BYRON NEL ST`, `BLGN15F`, `PAYSHAPRECEIVED BLGN15F` → Camera (sponsor), not a member row

### 5. D/O Ref exact match (PRIMARY MEMBER MATCHING METHOD)
- Column C in Comprehensive list may contain **comma-separated multiple refs**
- Split on commas; test each token against the bank reference
- Match is case-insensitive, strip whitespace
- Skip generic tokens: `EFT`, `ANNUAL EFT`, `DECEASED`
- If any token appears anywhere in the bank reference → match confirmed

### 6. Plot number + street keyword match
- Extract numbers from bank reference (patterns: `Plot 82`, `82`, `plot82`, standalone 1–3 digit numbers)
- Extract street keywords from bank reference (see keyword list below)
- If plot number AND street keyword both match a member → HIGH confidence
- If plot matches but multiple members on same plot → MED confidence

**Street keywords:**
`blignaut`, `blign`, `blg`, `golf`, `nel`, `eloff`, `danie theron`, `theron`, `first ave`, `1st ave`, `second ave`, `2nd ave`, `third ave`, `3rd ave`, `fourth`, `5th`, `fifth`, `green`, `nico pelser`, `nico`, `orchard`, `eeufees`, `hillside`, `hugenote`, `centre`, `angle`, `short road`, `voortrekker`, `road no 7`, `road no 8`, `ohenimuri`, `de wet`

### 7. Name match
- Extract surnames from bank reference (2+ char words, excluding stop words)
- Stop words: `bank`, `absa`, `capitec`, `projects`, `street`, `road`, `ave`, `mcaa`, `cameras`, `camera`, `cam`, `the`, `and`, `van`, `de`, `le`, `la`
- Match surnames against member owner names
- Single match → HIGH confidence; multiple → MED confidence; use tiebreakers below

### 8. Tiebreakers for name matches (apply when multiple candidates)
Always use the most specific signal available (plot number > street > name alone):
- Reference contains both a name AND a plot number → use plot to pick
- Reference contains both a name AND a street keyword → use street to narrow
- Reference starts with initial + surname (e.g. `S GROENEWALD`) → match the member whose first name starts with that initial

---

## Canonical D/O Reference Table (96 entries as of Mar 2026)

> When a new bank statement arrives, first check col C of Comprehensive list for any new/updated refs added by the administrator. These override and extend this table.

```
1ST001  → Gerald Bezuidenhout (Fuel Trailers) | First Avenue | plot 1,3,7 | row 465
1ST009  → Lesley Visser | First Avenue | plot 9 | row 524
1ST022  → Carien Abrahams | First Avenue | plot 22 | row 491
1ST025  → May Lyna/ Judith | First Avenue | plot 25 | row 72
1ST043  → Shaun Traut | First Avenue | plot 43 | row 140
1ST049  → Ratheo Molebatsi | First Avenue | plot 49 | row 171
244RD7HAO → Andre De Vries | Road No 7 | plot 244 | row 443
2ND 042 → Robert | Second Ave. | plot 42 | row 138
2ND030  → Rochelle Campbell | Second Ave. | plot 30 | row 87
2ND040  → Richard Shearer | Second Ave. | plot 40 | row 126
3RD071  → Dennis van der Merwe | Third Ave. | plot 71 | row 283
3RD073  → Melinda van der Merwe | Third Ave. | plot 73 | row 290
5TH053  → Eschelle Wathen | Fifth Street | plot 53 | row 199
8RD143  → Rachel Balthazar | Road No 8 | plot 143 | row 422
ABSA BANK PLOT82BLIGNAUTSRUS → Terry Shapiro | Danie Theron | plot 82 | row 323
BLG 016 → Abbeyfield | First Avenue | plot 16 | row 488
BLG 017 → Wayne Pettit | First Avenue | plot 17 | row 489
BLG 066 → Bradley and Sharon Bantjes | Nico Pelser | plot 66 | row 260
BLG 071 → Gareth Norton | Eeufees Street | plot 71 | row 281
BLG 086 → Gale Webb (Montage Agencies) | Nel Street | plot 86 | row 337
BLG 101 → Paul & Liz Lottreaux (Celtic Software) | De Wet Street | plot 101 | row 382
BLG 115 → Hazel Titterton | First Avenue | plot 115 | row 409
BLG010  → Ian Long | Blignaut Street | plot 10 | row 25
BLG039  → Jose Pinto | First Avenue | plot 39 | row 116
BLG044  → Nathan Cooks | Nico Pelser | plot 44 | row 142
BLG051  → Leo van Niel | Eloff Street | plot 51 | row 182
BLG057  → Dolly Lolwane (Pride Elephant) | Eloff Street | plot 57 | row 516
BLG073/1 → Shawn | Eeufees Street | plot 73 | row 288
BLG077  → Dennis and Heather Ryder | Eeufees Street | plot 77 | row 306
BLG080  → A Kennelly | Nel Street | plot 80 | row 314
BLG08A  → Anthony Byrne | Blignaut Street | plot 8a | row 523
BLG091  → Evelyn Keartland | De Wet Street | plot 91 | row 351
BLG093B → Richard & Susan Bentheim | De Wet Street | plot 93 | row 354
BLG108  → Nazam | De Wet Street | plot 108 | row 396
BLG108 CAMERA → Nazam | De Wet Street | plot 108 | row 396 (camera col)
BLG14   → Colin Blandford | Blignaut Street | plot 14 | row 39
BLI008  → Cindy Wills | Fifth Street | plot 59 | row 224
CNT054-1 → Millicent Nkosi | Centre Road | plot 54-1 | row 514
DWT104  → Aaqil Pariachi | De Wet Street | plot 104 | row 389
EEU069  → Jason and Steven Groenewald | Eeufees Street | plot 69 | row 268
EFT REF 108 BLG → Nazam | De Wet Street | plot 108 | row 396
ELO036  → Justice & Nozipho Makhado | Eloff Street | plot 36 | row 101
ELO038  → Bunty & Lindsay Coryndon-Baker | Eloff Street | plot 38 | row 112
ELO042  → Greg and Paula Peters | Eloff Street | plot 42 | row 131
ELO047  → Lidia Bukes | Eloff Street | plot 47 | row 155
ELO047/53 → DF Bukes (Niel) | Eloff Street | plot 53 | row 197
ELO059  → John & Karin Potter (Benches Direct) | Eloff Street | plot 59 | row 223
FST049  → Bruce Magill | First Avenue | plot 49 | row 172
GLV 04  → Graham and Alison Webster | Hillside Road | plot 4 | row 8
GLV007  → Sally Mulligan | Golf Course Road | plot 89 | row 346
GLV016  → Maureen Mhlongo | Centre Road | plot 16 | row 44
GLV019  → Pieter Fourie | Fifth Street | plot 19 | row 47
GLV020  → Andrew & Robyn Weeks | Fifth Street | plot 20 | row 49
GLV025  → Alan & Louise Proudfoot | Fifth Street | plot 25 | row 69
GLV030  → St. Francis Church | Green Road | plot 30 | row 506
GLV040  → Ian Yellowley | Green Road | plot 40 | row 124
GLV041  → Laurie Boycan Hoffman | Green Road | plot 41 | row 130
GLV059  → Stacey Ireland | Hillside Road | plot 59 | row 227
GLV064  → Kevin and Angela Hellyer | Golf Course Road | plot 64 | row 252
GLV066T → Martin and Yolande Taute | Golf Course Road | plot 66 | row 259
GLV073  → Sayed Zainulabidien | Hillside Road | plot 73 | row 289
GLV093  → Richard Moore-Moores Motor Spares | Golf Course Road | plot 93 | row 356
GLV12/1 → Jester Makoti | Hillside Road | plot 12/1 | row 467
GLV89   → Geraldine Peters | Golf Course Road | plot 89 | row 345
GOL032  → Mel Nkosi | Golf Course Road | plot 32 | row 95
GOL051  → Janos Herceg | Centre Road | plot 51 | row 183
GOL056  → Ramakhunou Mokhele | Golf Course Road | plot 56 | row 212
GOL070  → Darren Cornish | Golf Course Road | plot 70 | row 275
GOL074  → Andy and Sonya Delahunty | Golf Course Road | plot 74 | row 291
GOL078  → Peter & Andrea Petzer | Golf Course Road | plot 78 | row 309
GOL085  → Previn Naidoo | Golf Course Road | plot 85 | row 335
GOL087-EFT → Gareth van Jaarsveld | Golf Course Road | plot 87 | row 341
GOL091  → Nigel Wildman | Golf Course Road | plot 91 | row 352
HAO151  → HES Moorcraft | Road No 7 | plot 151 | row 431
HAO243  → Gideon and Antonette de Beer | Road No 7 | plot 243/1 | row 493
HAO245  → Rudolf & Susanna Seifert | Road No 7 | plot 245 | row 444
HAR046  → Thulani Khanyile | Eeufees Street | plot 46 | row 146
HIL69/71 → Gadatia Mustak | Hillside Road | plot 69/71 | row 518
HZB038  → Jason Batalides | Blignaut Street | plot 1 | row 2
NEL084  → Gilda & Louis Achadinha | Nico Pelser | plot 84 | row 331
NEL088  → Bheki & Nthabiseng Malinga | Nel Street | plot 88b | row 522
NEL090  → Tracey Van Niekerk | Nel Street | plot 90 | row 348
NEL092  → Isobel Van Der Motten | Nel Street | plot 92 | row 353
NEL094  → Debbie Rautenbach (Liesl Seymore) | Nel Street | plot 94 | row 360
NIC058  → Nozisi (Nono) Sibeko & Given Sibeko | Nico Pelser | plot 58 | row 222
NIC065  → Reginald Kairuz and Lucielle De Klerk | Nico Pelser | plot 65 | row 254
OHM008  → Paul Gronebaum | Ohenimuri | plot 8 | row 521
OHM151  → Henry and Catarina Moorcroft | Road No 7 | plot 151 | row 430
PLOT 100 NEL CAMERAS → Mbulelo Mbenenge | Nel Street | plot 100 | row 379
RD7150  → Hendrik Strydom | Road No 7 | plot 150 | row 429
RD7242  → Nsova Mashaba | Road No 7 | plot 242 | row 440
RD7243  → Venessa Venter | Road No 7 | plot 243 | row 441
RD7247  → Leonard and Faith Manqalaza | Road No 7 | plot 247 | row 447
RD7249  → Getruida (Ida) Vermaak | Road No 7 | plot 249/1 | row 499
WLK033  → Hugh and Charmaine Draai | Fourth Street | plot 33 | row 96
WLK069  → Christopher Leeson | Third Ave. | plot 69 | row 271
```

---

## Monthly Processing Workflow

### Step 1 — Receive inputs
- New Capitec bank statement PDF (account 1007012625)
- Updated base workbook (the cumulative MCAA file) — the administrator may have added new D/O refs to col C since the last month

### Step 2 — Read the base workbook
- Load `Comprehensive list` sheet
- Re-read col C (D/O Ref) for all rows — split on commas, rebuild the ref lookup table
- The canonical table above is the starting point; any additions in the file override it

### Step 3 — Parse the bank statement
- Extract all transactions: date, reference, money in, money out, fees, balance
- Opening and closing balances must reconcile: `closing = opening + total_in - total_out - fees`

### Step 4 — Classify each transaction
Apply matching rules in order (section above). For every credit:
- Determine: is this **Camera** (keyword match) or **EFT** (membership)?
- Find the member row
- Record: amount, member row, column destination (DO / EFT / Camera)

### Step 5 — Determine new column positions
- Find the rightmost month columns in Comprehensive list
- Add two new columns: `[Mon-YY] DO` and `[Mon-YY] EFT`
- Camera payments go to the existing **Camera Payment** column (do NOT create a new camera column per month — it is cumulative)

### Step 6 — Write results to workbook
**DO NOT overwrite existing cells.** Only write to:
- New `[Mon-YY] DO` and `[Mon-YY] EFT` columns for the current month
- Camera Payment column only if the cell is currently empty for that member

Add new sheets: `Bank Statement [Mon-YY]`, `Reconciliation [Mon-YY]`
Update `Expense Register` with new month's outgoing transactions.
Update `Matching Audit Log` with new month's credit matches.

### Step 7 — Reconcile
- Per-member: compare new bank-matched amounts to any pre-existing values in those cells
- Flag differences
- Build reconciliation summary: DO total, EFT total, Camera total, expense breakdown, balance check

### Step 8 — Flag any remaining unmatched
If any credit transactions could not be matched after all rules: list them in an `Unmatched & Review` section within the reconciliation sheet. Do not guess — flag for administrator review.

---

## Resolved special cases (do not re-flag in future)

| Bank reference | Resolution | Notes |
|---|---|---|
| `BLGN11F` | John Carr, Blignaut St, plot 11, row 29 | D/O ref updated to include this |
| `37-1ST AVE WALKERVILLE` | Peter Kairuz, First Ave, plot 37, row 106 | |
| `ABSA BANK Plot82Blignautsrus` | Terry Shapiro, plot 82, row 323 | His D/O ref IS this full string |
| `ABSA BANK 82Blig terry+cameras` | Terry Shapiro, row 323 — Camera | Name + plot 82 + Blignautsrus |
| `BLG108` | Nazam, De Wet St, plot 108, row 396 — EFT | Multi-ref token match |
| `BLG108 CAMERA` | Nazam, row 396 — Camera column | Camera keyword → camera col |
| `Plot 100 Nel cameras` | Mbulelo Mbenenge, Nel St, plot 100, row 379 — Camera | D/O ref set to this exact string |
| `2ND 042` | Robert, Second Ave, plot 42, row 138 | D/O ref updated |
| `M DE VRIES 148/1` | Madelena De Vries (Lelly), row 485 | Plot 148/1 disambiguates from Andre De Vries |
| `244RD7HAO-ANDRE` | Andre De Vries, Road No 7, plot 244, row 443 | REF token 244RD7HAO |
| `9 D. Theron; 2026` | Miroslaw Benpkavic, plot 9, row 24 | Plot 9 + Danie Theron |

---

## Output file naming convention
`MCAA_Reconciled_[Mon][YYYY].xlsx`  
e.g. `MCAA_Reconciled_Mar2026.xlsx`, `MCAA_Reconciled_Apr2026.xlsx`

The April file should be built **on top of** the March file — same workbook, new sheets added.

---

## Balance check (Mar 2026 baseline)
- Opening: R18,210.90
- Closing: R42,267.90
- Total in: R60,875.00 (75 credit transactions)
- Total out: R36,792.00 (10 debit transactions, incl fees)
- DO batch: R19,625 across 14 batches (60 individual members)
- EFT membership: R26,750 across 45 transactions
- Camera (members): R11,400 across 11 transactions
- Camera (sponsors): R3,100 across 5 transactions
