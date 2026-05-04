# MCAA Claude Code Instruction Package

This folder contains the complete instructions for an AI coding assistant (Claude Code, or any compatible agent) to automate the monthly MCAA bank reconciliation and dashboard reporting workflow.

## What MCAA is

The Muckleneuk & Claudius Area Association is a residential area association in the Pretoria/Walkerville region of South Africa. The administrator (Quintus) maintains a membership list and processes monthly Capitec Business Account bank statements to track who has paid their levy contributions and camera-system contributions.

## What this package does

It encodes the canonical March 2026 reconciliation as a reusable, automatable standard. Every subsequent month — April 2026, May 2026, and so on — follows exactly the same rules, builds on the same cumulative master workbook, and produces a dashboard in exactly the same desktop format.

## How to use it

1. Drop this entire folder into your Claude Code project root (or wherever your AI assistant looks for project instructions).
2. Make sure the master Excel workbook from the previous month is accessible (typically in `/mnt/user-data/uploads/` or the equivalent input location).
3. When a new Capitec bank statement PDF is uploaded, the assistant should read `CLAUDE.md` first, then follow the workflow.

## File structure

- **`CLAUDE.md`** — primary entry point for the AI assistant
- **`WORKFLOW.md`** — step-by-step monthly workflow
- **`skills/`** — the two canonical skill files (reconciliation rules + dashboard design)
- **`reference/`** — focused reference files for matching logic, the D/O reference table, hardcoded expenses, special cases, the data model, and balance baseline numbers
- **`templates/`** — copy-paste HTML/CSS/JS for the dashboard
- **`checklists/`** — pre-run and post-run validation checks

## Trigger condition

A new Capitec bank statement PDF arriving in the project inputs is the **sole trigger**. The assistant should produce both deliverables — the updated Excel workbook and the new HTML dashboard — without further prompting.

## Outputs produced every month

1. `MCAA_Reconciled_[Mon][YYYY].xlsx` — cumulative workbook (e.g. `MCAA_Reconciled_Apr2026.xlsx`)
2. `mcaa_dashboard_v[N].html` — desktop dashboard (increment N each month)

Both go to `/mnt/user-data/outputs/`.

## Important constraints

- **Never use mobile formatting** for the dashboard. Desktop only.
- **Never combine camera income with membership revenue** in any view.
- **Never overwrite existing data** in the cumulative workbook.
- **The March 2026 reconciliation is the canonical reference.**

For full operational detail, the AI assistant should read `CLAUDE.md` and the two skill files in `skills/`.
