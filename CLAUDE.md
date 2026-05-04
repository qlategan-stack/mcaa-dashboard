# MCAA Monthly Reconciliation & Dashboard — Claude Code Instructions

**Project owner:** Quintus
**Organisation:** Muckleneuk & Claudius Area Association (MCAA)
**Region:** Pretoria / Walkerville, South Africa
**Bank account:** Capitec Business — 1007012625

---

## What this project does

This project automates the monthly financial workflow for MCAA. Every month, a new Capitec bank statement PDF arrives. From that single input, two outputs must be produced:

1. **An Excel reconciliation workbook** — appends a new month's processed sheet to the cumulative master file
2. **An HTML dashboard** — desktop-format report showing residents, plots, paying members, revenue, camera payments, streets, captains, expenses, and data quality

**The upload of a new bank statement PDF is the SOLE TRIGGER for both outputs.** No additional confirmation from the user is needed. As soon as a Capitec bank statement appears in the project inputs, both files must be produced and placed in the outputs directory.

---

## Critical project rules (non-negotiable)

1. **Three-tier data model — always**: Residents (every named row) / Unique plots (distinct plot numbers) / Paying residents (rows with DO or EFT > 0 in the current month)
2. **Camera income is ALWAYS separated** from membership revenue — never combine the two in any sheet, chart, or KPI
3. **Never overwrite existing data** in the master workbook — only append new monthly columns and new monthly sheets
4. **Never use mobile formatting** for dashboards — desktop only, width=1280, sticky 240px sidebar
5. **Unique plots** are counted by distinct plot numbers (split comma-multi entries like `1,3,7`; exclude `?` and blank), not by rows or people
6. **The March 2026 reconciliation is the canonical reference** — when in doubt about any matching decision, defer to how Mar 2026 was resolved
7. **Counting stops at the last named member row** — do not count beyond row 529 in Comprehensive list (rows 530–534 are standalone camera sponsors, not members)

---

## File map

This package contains everything needed to reproduce the workflow:

```
mcaa_claude_code_package/
├── CLAUDE.md                          ← YOU ARE HERE — entry point
├── README.md                          ← human-readable overview
├── WORKFLOW.md                        ← step-by-step monthly workflow
├── skills/
│   ├── MCAA_RECON_SKILL.md            ← reconciliation rules (canonical)
│   └── MCAA_DASHBOARD_SKILL.md        ← dashboard design standard (canonical)
├── reference/
│   ├── matching_rules.md              ← detailed matching engine logic
│   ├── do_reference_table.md          ← 96-entry canonical D/O ref table
│   ├── hardcoded_expenses.md          ← permanent outgoing reference list
│   ├── special_cases.md               ← resolved edge cases (don't re-flag)
│   ├── data_model.md                  ← three-tier data model definition
│   └── balance_check_baseline.md      ← Mar 2026 baseline numbers
├── templates/
│   ├── dashboard_shell.html           ← copy-paste HTML skeleton
│   ├── dashboard_styles.css           ← canonical CSS (paste into <style>)
│   └── dashboard_scripts.js           ← canonical JS patterns
└── checklists/
    ├── pre_run_checklist.md           ← before processing any month
    ├── recon_output_checklist.md      ← Excel deliverable checks
    └── dashboard_output_checklist.md  ← HTML deliverable checks
```

---

## Where the canonical rules live

Two skill files are the immutable source of truth. Read them BEFORE doing any work:

- **`skills/MCAA_RECON_SKILL.md`** — every matching rule, every hardcoded expense, every resolved special case, the entire D/O reference table, and the monthly processing workflow
- **`skills/MCAA_DASHBOARD_SKILL.md`** — every CSS variable, every component pattern, every Chart.js config, every layout rule for the HTML dashboard

If anything in this package conflicts with those two files, the skill files win.

---

## How to use this package in Claude Code

When you (Claude) are operating in a Claude Code terminal session inside a folder containing this package:

1. **On startup or first user message**, read `CLAUDE.md` (this file). It tells you the project's purpose and the trigger condition.
2. **Check for a new Capitec bank statement PDF** in the project's input directory. The file will typically be named like `Capitec_Statement_[Month][Year].pdf` or similar — recognise it by content if needed (Capitec letterhead, account 1007012625).
3. **If a new bank statement is present and not yet processed**:
   - Read `skills/MCAA_RECON_SKILL.md` end-to-end
   - Read `skills/MCAA_DASHBOARD_SKILL.md` end-to-end
   - Read `WORKFLOW.md` for the operational sequence
   - Execute the full workflow without asking the user for permission — the upload IS the instruction
4. **If no new bank statement is present**, and the user gives a different instruction, follow that instruction normally. Do not invent work.

---

## Inputs expected

- **Capitec bank statement PDF** — for the month being processed (account 1007012625)
- **Master workbook** — `MCAA_Reconciled_[LastMon][YYYY].xlsx` (the cumulative file from the previous month). If processing March 2026 from scratch, the base file is `MCAA_Membership_Base_File_Mar2026.xlsx`.

The master workbook contains a `Comprehensive list` sheet with members, addresses, plot numbers, comma-separated D/O references, and a series of monthly DO/EFT column pairs. The administrator (Quintus) may add new D/O refs to column C between months — always re-read column C fresh each month.

---

## Outputs produced (every month, every time)

Both files go to `/mnt/user-data/outputs/` (or the configured output directory):

1. **`MCAA_Reconciled_[Mon][YYYY].xlsx`** — cumulative workbook with a new monthly sheet pair appended (`Bank Statement [Mon-YY]` + `Reconciliation [Mon-YY]`), updated `Expense Register`, updated `Matching Audit Log`, and two new columns in `Comprehensive list` (`[Mon-YY] DO` and `[Mon-YY] EFT`). Camera payments accumulate in the existing `Camera Payment` column.

2. **`mcaa_dashboard_v[N].html`** — desktop dashboard with seven tabs: Overview, Revenue, Camera, Streets, Captains, Expenses, Data quality. Increment N each month.

---

## Key people referenced

- **Mengo Sibanda** — staff member, monthly salary
- **LUKA** — fence maintenance contractor
- **TARY DESIGN** — camera equipment supplier

These names anchor the hardcoded expense classifications. See `reference/hardcoded_expenses.md`.

---

## Behavioural rules for Claude Code

- **Work autonomously.** When the trigger condition is met (new bank statement uploaded), produce both outputs without prompting the user.
- **Never overwrite existing data.** Append only.
- **Never deviate from the canonical CSS/HTML patterns** in `skills/MCAA_DASHBOARD_SKILL.md`. No mobile formatting, no font substitutions, no colour deviations.
- **Flag, don't guess.** If a transaction cannot be matched after applying every rule, list it in an `Unmatched & Review` section of the reconciliation sheet. Do not invent a member match.
- **Re-read column C every month.** The D/O reference table in `reference/do_reference_table.md` is the *starting point*; the workbook's actual column C always wins.

---

## Quick command reference

To process a new month from a Claude Code terminal, the typical commands are:

```
# 1. Read the canonical skills first (always)
view skills/MCAA_RECON_SKILL.md
view skills/MCAA_DASHBOARD_SKILL.md

# 2. Read the workflow
view WORKFLOW.md

# 3. Inspect the new bank statement
view /mnt/user-data/uploads/[bank_statement_pdf]

# 4. Inspect the current master workbook
# (use python + openpyxl to load Comprehensive list sheet)

# 5. Run the matching engine
# (apply rules in the priority order specified in MCAA_RECON_SKILL.md)

# 6. Write outputs
# - MCAA_Reconciled_[Mon][YYYY].xlsx → /mnt/user-data/outputs/
# - mcaa_dashboard_v[N].html → /mnt/user-data/outputs/
```

See `WORKFLOW.md` for the full operational sequence.
