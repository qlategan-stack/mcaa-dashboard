# MCAA Monthly Workflow

This is the operational sequence for processing one month's bank statement. Run this every time a new Capitec bank statement PDF appears in the project inputs.

---

## Stage 0 — Recognise the trigger

A new Capitec bank statement PDF has been uploaded. Indicators:
- File extension `.pdf`
- Capitec letterhead in the document
- Account number `1007012625`
- A statement period covering one calendar month

If the file matches, proceed to Stage 1. Do not ask the user for permission — the upload is the instruction.

---

## Stage 1 — Read the canonical skills

Before touching any data, read these two files in full:

```
skills/MCAA_RECON_SKILL.md
skills/MCAA_DASHBOARD_SKILL.md
```

These contain the immutable rules for matching and dashboard layout. Everything you do must conform to them.

---

## Stage 2 — Locate inputs

You need two inputs:

1. **The new Capitec bank statement PDF** — located in the project's upload directory (typically `/mnt/user-data/uploads/`)
2. **The cumulative master workbook** — the most recent `MCAA_Reconciled_[Mon][YYYY].xlsx` file. If processing the first month from scratch, use the base file `MCAA_Membership_Base_File_Mar2026.xlsx`.

Verify both exist before proceeding.

---

## Stage 3 — Read the master workbook

Load the master workbook with Python (`openpyxl` or `pandas`). Specifically:

- **Sheet `Comprehensive list`** — read all rows from row 2 down to the last named member row (in March 2026 this was row 529; future months may differ — stop at the last row with both an owner name AND an address)
- **Column A** — Owner / Tenant
- **Column B** — Address
- **Column C** — D/O Ref (may contain comma-separated multiple refs — split on commas)
- **Column D** — Plot number (may include letters/slashes/commas, e.g. `8a`, `148/1`, `1,3,7`)
- **Existing monthly columns** — find the rightmost month columns; the new month's two columns will be appended after these
- **Camera Payment column** — the second-to-last column in the existing data; cumulative across all months

Rebuild the D/O reference lookup from the actual column C contents. The canonical table in `reference/do_reference_table.md` is a starting point, but the workbook's column C always wins (the administrator may have added new refs).

---

## Stage 4 — Parse the bank statement

Extract every transaction from the PDF. For each transaction, capture:
- Date
- Reference / description text
- Money in (credit)
- Money out (debit)
- Fees
- Running balance

Verify: `closing_balance = opening_balance + total_credits - total_debits - total_fees`

If the balance does not reconcile to within R0.01, stop and flag the issue — there is a parsing error.

---

## Stage 5 — Classify each transaction

Apply the matching rules **in priority order**. Full detail is in `skills/MCAA_RECON_SKILL.md` and `reference/matching_rules.md`. Summary:

1. **Debit Order Batch** — reference contains `MIDVILLECACONTRA` → DO Batch (resolve to individual members via their D/O Ref)
2. **Hardcoded outgoing references** — `MENGO SIBANDA MCAA` (salary), `LUKA MCAA FENCE` (maintenance), `TARY DESIGN MCAA` (camera purchase), `MR SN LANGA MCAA` (utilities), `JLK MCAA` (other), `CAPITEC B MCA` (bank fee), `MONTH S/FEE` (bank fee), `001 UNPAIDS` (reversal)
3. **Camera keyword rule** — if reference contains `camera` or `cam` (case-insensitive), the payment routes to the **Camera Payment column**, NOT the EFT column. Apply AFTER finding the member — the column destination changes, not the member.
4. **Standalone camera sponsors** — references matching `DAMASKUS PROJECTS`, `FIFTH STREET`, `VAN NIEKERK`, `BYRON NEL ST`, `BLGN15F`, `PAYSHAPRECEIVED BLGN15F` → camera sponsor (not a member row)
5. **D/O Ref exact match (PRIMARY METHOD)** — split column C on commas, test each token against the bank reference (case-insensitive, whitespace-stripped). Skip generic tokens: `EFT`, `ANNUAL EFT`, `DECEASED`. Any token appearing anywhere in the reference confirms a match.
6. **Plot number + street keyword match** — extract numbers and street keywords from the reference; if both match a member, HIGH confidence
7. **Name match** — extract surnames from the reference (excluding stop words: `bank`, `absa`, `capitec`, `projects`, `street`, `road`, `ave`, `mcaa`, `cameras`, `camera`, `cam`, `the`, `and`, `van`, `de`, `le`, `la`)
8. **Tiebreakers** — when multiple candidates, prefer the most specific signal (plot number > street > name alone)

For every credit transaction, record:
- The member row matched (if any)
- The destination column (DO / EFT / Camera)
- Confidence level
- Original bank reference (for the audit log)

---

## Stage 6 — Determine new column positions

In the `Comprehensive list` sheet:
- Identify the rightmost existing month columns
- Add two new columns immediately after: `[Mon-YY] DO` and `[Mon-YY] EFT` (e.g. `Apr-26 DO` and `Apr-26 EFT`)
- The Camera Payment column stays where it is — do NOT add a per-month camera column

---

## Stage 7 — Write results to workbook

**Write rules:**
- Only write to the new monthly columns and the Camera Payment cells that are currently empty for that member
- **Never overwrite** any existing cell that already has data
- Preserve all existing sheets exactly as they are

**New sheets to add:**
- `Bank Statement [Mon-YY]` — full transaction listing for the month
- `Reconciliation [Mon-YY]` — recon summary (totals, balance check, unmatched section)

**Existing sheets to update:**
- `Expense Register` — append this month's outgoing transactions (cumulative log)
- `Matching Audit Log` — append this month's matched credit transactions with full trace (date, reference, amount, member row, column, confidence)

**Sheets to leave untouched:**
- `Street Captains`, `Payment Summary`, `Members Report`, `Notes`, `Blignautsrus North`

---

## Stage 8 — Reconcile

Build the reconciliation summary for the new sheet:
- DO total (sum of all DO column values for the month)
- EFT total (sum of all EFT column values for the month)
- Camera total (sum of all camera payments matched this month — separated into members vs sponsors)
- Expense breakdown by category (salary, maintenance, camera purchase, utilities, bank fee, reversal, other)
- Opening balance / closing balance / difference

Cross-check: the totals must reconcile to the bank statement's opening + credits − debits − fees = closing.

---

## Stage 9 — Flag unmatched

Any credit transaction that could not be matched after every rule was tried goes into an `Unmatched & Review` section within the `Reconciliation [Mon-YY]` sheet. Include:
- Transaction date
- Bank reference
- Amount
- Reason no match was found

Do not guess. The administrator will review and resolve.

---

## Stage 10 — Save the Excel workbook

Save as `MCAA_Reconciled_[Mon][YYYY].xlsx` to `/mnt/user-data/outputs/`. Examples:
- `MCAA_Reconciled_Apr2026.xlsx`
- `MCAA_Reconciled_May2026.xlsx`

The saved file must contain ALL prior months' data plus the new month's additions. Never produce a workbook that only contains one month — it is always cumulative.

---

## Stage 11 — Build the HTML dashboard

Read `skills/MCAA_DASHBOARD_SKILL.md` again (or keep it in working memory from Stage 1). Build the dashboard by following its specifications EXACTLY:

- Use the canonical CSS variables — no deviations
- Use the exact HTML shell — sticky 240px sidebar + scrollable main area
- Load the three Google Fonts: IBM Plex Mono, Playfair Display, DM Sans
- Load Chart.js from cdnjs
- Build all seven tabs in this order: Overview, Revenue, Camera, Streets, Captains, Expenses, Data quality

**Data inputs for the dashboard:**
- Three-tier counts from the Comprehensive list:
  - Residents (every named row from row 2 to the last named member row)
  - Unique plots (distinct plot numbers — split commas, exclude `?` and blank)
  - Paying residents (rows where `[Mon-YY] DO > 0` OR `[Mon-YY] EFT > 0`)
- Revenue: DO total, EFT total, monthly trend across all months in the workbook
- Camera: members who paid this month (with names, streets, plots, amounts) + sponsors (Damaskus Projects, Fifth Street, Van Niekerk, Byron Nel Street, BlgN15F)
- Streets: aggregate by street — total plots, residents, paying, not paying, pay rate %
- Captains: from the `Street Captains` sheet — pair with paying-rate per street
- Expenses: from the new monthly bank statement sheet — categorise per the hardcoded rules
- Data quality: list any unmatched transactions, missing plot numbers, missing addresses, missing D/O refs

---

## Stage 12 — Save the dashboard

Save as `mcaa_dashboard_v[N].html` to `/mnt/user-data/outputs/`. Increment N each month:
- Mar 2026 → `mcaa_dashboard_v7.html` (the canonical baseline)
- Apr 2026 → `mcaa_dashboard_v8.html`
- May 2026 → `mcaa_dashboard_v9.html`

(The actual N depends on the most recent dashboard already produced. Look in `/mnt/user-data/outputs/` and pick the next integer up.)

---

## Stage 13 — Present both files

Use the `present_files` tool (or equivalent) to make both deliverables available to the user. Order:
1. The HTML dashboard first (most visual, most immediately useful)
2. The Excel workbook second

Provide a short summary of what was processed: month, totals, anything flagged for review.

---

## Stage 14 — Done

No further user prompting required. The workflow is complete when both files are saved and presented.

---

## Cross-references

- For every matching rule in detail: `skills/MCAA_RECON_SKILL.md` and `reference/matching_rules.md`
- For the D/O reference table: `reference/do_reference_table.md`
- For dashboard CSS / HTML / JS: `skills/MCAA_DASHBOARD_SKILL.md` and `templates/`
- For pre-run validation: `checklists/pre_run_checklist.md`
- For output validation: `checklists/recon_output_checklist.md` and `checklists/dashboard_output_checklist.md`
