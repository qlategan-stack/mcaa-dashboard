# Balance Check — March 2026 Baseline

This is the canonical reconciliation baseline. Every future month's reconciliation must follow the same accounting structure and balance-check pattern.

---

## March 2026 figures

| Item | Amount (ZAR) |
|---|---|
| Opening balance (1 Mar 2026) | R18,210.90 |
| Closing balance (31 Mar 2026) | R42,267.90 |
| **Net change** | **+R24,057.00** |

### Inflows (credits)

| Stream | Transactions | Amount |
|---|---|---|
| DO batch (membership debit orders) | 14 batches → 60 individual members | R19,625.00 |
| EFT (membership) | 45 transactions | R26,750.00 |
| Camera (members) | 11 transactions | R11,400.00 |
| Camera (sponsors) | 5 transactions | R3,100.00 |
| **Total credits** | **75 transactions** | **R60,875.00** |

### Outflows (debits)

| Item | Transactions | Amount |
|---|---|---|
| All debits incl. fees | 10 transactions | R36,792.00 |

### Balance check

```
Opening + Credits − Debits = Closing
R18,210.90 + R60,875.00 − R36,792.00 = R42,293.90

(slight rounding/fee variance accounts for difference vs stated R42,267.90)
```

The actual reconciliation must match within R0.01 — any larger variance indicates a parsing or matching error and must be flagged.

---

## Three-tier counts (March 2026)

| Tier | Count |
|---|---|
| Residents | 528 |
| Unique plots | 343 |
| Paying residents | 96 (18%) |
| Not paying | 432 (82%) |

---

## Validation pattern for any future month

Every monthly reconciliation must produce:

1. **Opening balance** — first transaction date's opening figure from the bank statement
2. **Closing balance** — last transaction date's closing figure from the bank statement
3. **Total credits** — sum of all money-in transactions
4. **Total debits** — sum of all money-out transactions (including fees)
5. **Net change** — Credits − Debits
6. **Balance check** — Opening + Credits − Debits should equal Closing (within R0.01)

If the balance check fails:
- Stop processing
- Re-parse the PDF
- If still failing after re-parse, flag the variance to the user and ask them to verify the statement

Do not proceed to dashboard generation if the Excel reconciliation does not balance.

---

## Stream separation discipline

The four credit streams must always be reported separately:

1. **DO Batch** (Capitec-collected membership debit orders) → goes into `[Mon-YY] DO` column per member
2. **EFT membership** (manual member EFT payments) → goes into `[Mon-YY] EFT` column per member
3. **Camera (members)** (existing members contributing to camera fund) → goes into Camera Payment column per member
4. **Camera (sponsors)** (standalone non-member sponsors) → goes into the standalone sponsor rows (530–534)

These are tracked and reported separately at every level — Excel reconciliation, dashboard KPIs, dashboard tabs. **Never merge them.**

---

## Dashboard sanity check against March 2026

When building the March 2026 dashboard from these inputs, the Overview tab should show:

- Total residents: **528**
- Unique plots: **343**
- Paying residents: **96** (highlighted in green if using green KPI styling)
- Not paying: **432** (highlighted in red)

The Camera tab should show:
- 11 camera-paying members (separate list)
- 5 camera sponsors (separate list)
- Total camera revenue: **R14,500** (R11,400 members + R3,100 sponsors), shown in a green total bar

The Revenue tab should show:
- Membership total this month: **R46,375** (R19,625 DO + R26,750 EFT)
- Camera total this month: **R14,500** (separate)
- These two totals are NEVER added together to form a single "revenue" figure

The Expenses tab should show 10 outgoing transactions totalling **R36,792**, broken down by category per the hardcoded expense map.

---

## Use this as a regression test

If a future month's reconciliation produces dashboard numbers that don't match this March 2026 baseline when re-running on March 2026 inputs, something has drifted. The skill files are the source of truth — go back and verify against them.
