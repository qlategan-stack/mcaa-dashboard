# Hardcoded Expenses (Permanent References)

These bank reference patterns map permanently to expense categories. Apply Rule 2 in the matching engine.

---

## Permanent reference list

| Bank reference contains | Category | Sub-detail | Notes |
|---|---|---|---|
| `MENGO SIBANDA MCAA` | Salary | Mengo Sibanda | Monthly staff salary |
| `LUKA MCAA FENCE` | Maintenance | LUKA | Fence repair contractor |
| `TARY DESIGN MCAA` | Camera purchase | TARY DESIGN | Camera equipment supplier |
| `MR SN LANGA MCAA` | Utilities | SN LANGA | Water / utilities |
| `JLK MCAA` | Expense | JLK | RTC / other |
| `CAPITEC B MCA` | Bank fee | Capitec | DO service charge |
| `MONTH S/FEE` | Bank fee | Capitec | Monthly account fee |
| `001 UNPAIDS` | Reversal | — | Unpaid DO reversal |

---

## Key people

- **Mengo Sibanda** — staff member, paid monthly via salary
- **LUKA** — independent contractor for fence/maintenance work
- **TARY DESIGN** — supplier of camera equipment

---

## Adding new permanent references

When the same outgoing reference appears in two consecutive months and is clearly a recurring expense, add it to this table. Examples of patterns to watch for:
- New contractor names with `MCAA` suffix
- New utility provider references
- New regular bank fees

Do **not** add one-off transactions to this table. Genuine one-offs go in the `Expense Register` with category `Other` and a free-text note.

---

## Dashboard expense category colour map

When rendering the Expenses tab, use these colour mappings (per the dashboard skill):

| Category | CSS variable | Hex |
|---|---|---|
| Salary | `--red` | `#b91c1c` |
| Maintenance | `--amber` | `#b45309` |
| Camera purchase | `--purple` | `#7e22ce` |
| Bank fee / Utilities | `--blue` | `#1d4ed8` |
| Reversal | `--amber` | `#b45309` |
| Other | `--paper3` bg, `--ink3` text | grey |

---

## Worked example (March 2026 baseline)

The 10 outgoing transactions in March 2026 totalled R36,792 broken down as:

- Salary (Mengo Sibanda) — 1 transaction
- Maintenance (Luka fence) — 1 transaction
- Camera purchase (Tary Design) — 1 transaction
- Utilities (SN Langa) — 1 transaction
- Bank fees (Capitec, Month S/Fee) — multiple small transactions
- Other (JLK) — 1 transaction
- Reversal (Unpaids) — 1 transaction

The exact breakdown for any given month should be auto-generated from the bank statement, applying the category map above.
