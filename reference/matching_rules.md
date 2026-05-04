# Matching Rules — Detailed Reference

This file expands on the matching engine described in `skills/MCAA_RECON_SKILL.md`. The rules below MUST be applied in the order listed. Higher-priority rules win.

---

## Rule 1 — Debit Order Batch (highest priority)

**Trigger:** the bank reference contains the literal string `MIDVILLECACONTRA`

**Action:** classify the transaction as a **DO Batch**. The amount is the sum of multiple individual member debit orders that Capitec collected on the association's behalf.

**Resolution:** for each batch, the individual member identification happens through the matching of the constituent DO references that follow in the bank statement detail. Each individual member's amount goes into their `[Mon-YY] DO` column.

In the March 2026 baseline, there were 14 batches totalling R19,625 across 60 individual members.

---

## Rule 2 — Hardcoded outgoing references (permanent)

These are debit transactions (money out) with permanent classifications. Always apply these first when looking at debits.

| Bank reference contains | Category | Notes |
|---|---|---|
| `MENGO SIBANDA MCAA` | Salary | Monthly staff salary |
| `LUKA MCAA FENCE` | Maintenance | Fence repair contractor |
| `TARY DESIGN MCAA` | Camera purchase | Camera equipment supplier |
| `MR SN LANGA MCAA` | Utilities | Water / utilities |
| `JLK MCAA` | Expense | RTC / other |
| `CAPITEC B MCA` | Bank fee | DO service charge |
| `MONTH S/FEE` | Bank fee | Monthly account fee |
| `001 UNPAIDS` | Reversal | Unpaid DO reversal |

New permanent references can be added as they appear. When a new recurring outgoing reference is observed for the second consecutive month, add it to this table in `reference/hardcoded_expenses.md`.

---

## Rule 3 — Camera keyword rule

**Trigger:** the bank reference contains the substring `camera` or `cam` (case-insensitive)

**Action:** the matched member's payment routes to the **Camera Payment column** (the cumulative camera column near the right end of `Comprehensive list`), NOT to the `[Mon-YY] EFT` column.

**Important:** apply this AFTER finding the member. The column destination changes; the member identification process is unchanged.

**Examples:**
- `BLG108 CAMERA` → match Nazam (BLG108), route to Camera Payment column
- `Plot 100 Nel cameras` → match Mbulelo Mbenenge (Nel St plot 100), route to Camera Payment column
- `ABSA BANK 82Blig terry+cameras` → match Terry Shapiro (plot 82), route to Camera Payment column

---

## Rule 4 — Standalone camera sponsors

These are NOT members. They are organisations/individuals who contribute to the camera fund without being part of the residential association. Their contributions still go into the camera total but never into a member row.

References that match (case-insensitive substring):
- `DAMASKUS PROJECTS`
- `FIFTH STREET`
- `VAN NIEKERK`
- `BYRON NEL ST`
- `BLGN15F`
- `PAYSHAPRECEIVED BLGN15F`

In `Comprehensive list` rows 530–534 contain placeholder sponsor entries — these are bookkeeping rows, not real members. Do not include them in resident or plot counts.

---

## Rule 5 — D/O Ref exact match (PRIMARY MEMBER MATCHING METHOD)

**Source:** column C of `Comprehensive list` — the D/O Ref field

**Process:**
1. Read column C for every member row
2. Split on commas (e.g. `EFT REF 108 BLG, BLG108, BLG108 CAMERA` → three tokens)
3. Strip whitespace from each token, lowercase for comparison
4. Skip generic/disqualifying tokens: `EFT`, `ANNUAL EFT`, `DECEASED`
5. For each remaining token, check if it appears anywhere in the bank reference (case-insensitive substring match)
6. If any token matches → confirmed match

**Confidence:** HIGH (this is the strongest identification signal short of an exact full-string match)

**Edge case:** if two different members have overlapping tokens (rare), use Rule 8 tiebreakers.

---

## Rule 6 — Plot number + street keyword match

When Rule 5 fails, attempt to identify by spatial coordinates (plot + street).

**Plot extraction from bank reference:**
- Match patterns: `Plot 82`, `82`, `plot82`, standalone 1–3 digit numbers
- Be careful of false positives — a number alone is weak evidence; always pair with a street keyword
- Plot numbers may have suffixes (e.g. `8a`, `148/1`) — match these as full strings

**Street keyword list:**
```
blignaut, blign, blg, golf, nel, eloff, danie theron, theron,
first ave, 1st ave, second ave, 2nd ave, third ave, 3rd ave, fourth, 5th, fifth,
green, nico pelser, nico, orchard, eeufees, hillside, hugenote, centre, angle,
short road, voortrekker, road no 7, road no 8, ohenimuri, de wet
```

**Confidence levels:**
- Plot + street keyword both match a unique member → HIGH
- Plot matches a unique member, no street keyword → MED
- Plot matches but multiple members on same plot, street disambiguates → HIGH
- Plot matches but multiple members, no disambiguation → MED (use Rule 8 tiebreakers)

---

## Rule 7 — Name match

When Rules 5 and 6 fail, attempt to identify by surname.

**Surname extraction from bank reference:**
- Tokenise on whitespace and punctuation
- Take 2+ character words
- Drop stop words: `bank`, `absa`, `capitec`, `projects`, `street`, `road`, `ave`, `mcaa`, `cameras`, `camera`, `cam`, `the`, `and`, `van`, `de`, `le`, `la`
- Match the remaining tokens (case-insensitive substring) against owner names in column A

**Confidence levels:**
- Single member matches → HIGH
- Multiple members match → MED (use Rule 8 tiebreakers)
- No match → leave for unmatched review

---

## Rule 8 — Tiebreakers (when multiple candidates)

Apply in order of specificity:

1. **Reference contains both a name AND a plot number** → use plot to pick
2. **Reference contains both a name AND a street keyword** → use street to narrow
3. **Reference starts with initial + surname** (e.g. `S GROENEWALD`) → match the member whose first name starts with that initial
4. **Reference contains a unique distinguishing token** (e.g. business name like "Fuel Trailers") → use it to pick
5. **No tiebreaker resolves** → mark as MED confidence and flag in audit log; if confidence too low, send to Unmatched

---

## Confidence handling

For the audit log:
- HIGH confidence matches go through automatically
- MED confidence matches are recorded with a note explaining which rule and which tiebreakers applied
- LOW / no match goes to `Unmatched & Review` in the reconciliation sheet

The administrator (Quintus) reviews the Unmatched section after each month and feeds resolutions back into column C of `Comprehensive list`. The next month's run will then auto-match through Rule 5.

---

## Multi-ref comma-split logic (worked example)

A member's column C might contain:
```
EFT REF 108 BLG, BLG108, BLG108 CAMERA
```

This splits into three independent matchable tokens:
1. `EFT REF 108 BLG`
2. `BLG108`
3. `BLG108 CAMERA`

A bank transaction with reference `BLG108` matches token 2 → member identified.
A bank transaction with reference `BLG108 CAMERA` matches tokens 2 and 3 → member identified, AND the camera keyword in Rule 3 routes the payment to the Camera column.
A bank transaction with reference `EFT REF 108 BLG WALKERVILLE` matches token 1 (substring `EFT REF 108 BLG` is contained) → member identified.

This multi-ref structure is how the administrator records all the legitimate variants of how a member's payment might appear on the bank statement.

---

## What NOT to do

- Do not infer matches from balances or amounts alone
- Do not match on partial street names without a number (too ambiguous)
- Do not auto-resolve LOW confidence cases — flag for review
- Do not modify column C of `Comprehensive list` programmatically — that's the administrator's domain
- Do not skip Rule 3 (camera keyword) and silently put camera payments in EFT — this corrupts the dashboard's separation of revenue streams
