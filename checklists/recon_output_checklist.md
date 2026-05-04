# Reconciliation Output Checklist

After producing the Excel reconciliation workbook, verify ALL of the following before delivering to the user.

---

## Workbook structure

- [ ] File saved as `MCAA_Reconciled_[Mon][YYYY].xlsx` in `/mnt/user-data/outputs/`
- [ ] All prior months' sheets are still present and unchanged
- [ ] New sheet `Bank Statement [Mon-YY]` has been added
- [ ] New sheet `Reconciliation [Mon-YY]` has been added
- [ ] `Expense Register` has been updated with this month's outgoing transactions appended (not overwritten)
- [ ] `Matching Audit Log` has been updated with this month's matched credit transactions appended (not overwritten)
- [ ] No existing sheet has been deleted

## Comprehensive list updates

- [ ] Two new columns added: `[Mon-YY] DO` and `[Mon-YY] EFT`
- [ ] Camera Payment cells have been updated only where they were previously empty for that member (no overwrites)
- [ ] All previous month columns are still intact
- [ ] No member rows have been added, removed, or reordered
- [ ] Column A, B, C, D unchanged
- [ ] Sponsor placeholder rows (530–534 in Mar 2026) are untouched

## Bank Statement [Mon-YY] sheet

- [ ] Every transaction from the source PDF appears
- [ ] Columns: Date, Reference, Money In, Money Out, Fees, Balance, Classification, Member Row (if matched), Confidence
- [ ] Opening balance row at top
- [ ] Closing balance row at bottom

## Reconciliation [Mon-YY] sheet

- [ ] Opening balance shown
- [ ] Closing balance shown
- [ ] Total credits broken down by stream: DO Batch, EFT, Camera (members), Camera (sponsors)
- [ ] Total debits broken down by category: Salary, Maintenance, Camera purchase, Utilities, Bank fees, Reversal, Other
- [ ] Balance check: `Opening + Credits − Debits = Closing` (within R0.01)
- [ ] Per-member impact section: for each member who paid this month, the new amount written to their DO/EFT/Camera column
- [ ] Unmatched & Review section present (even if empty — explicitly state "no unmatched transactions")

## Matching quality

- [ ] Every credit transaction has been classified
- [ ] All HIGH confidence matches went through automatically
- [ ] All MED confidence matches have a note explaining the rule and tiebreakers used
- [ ] All unmatched transactions appear in the Unmatched & Review section with their bank reference and amount
- [ ] No camera-keyword transaction has been routed to an EFT column (camera column is correct destination)
- [ ] Standalone sponsor transactions (Damaskus Projects, Fifth Street, Van Niekerk, Byron Nel Street, BlgN15F) are recorded as sponsors, not against member rows

## Expense classification

- [ ] All hardcoded references applied correctly (Mengo Sibanda → Salary, Luka → Maintenance, Tary Design → Camera purchase, etc.)
- [ ] Bank fees identified
- [ ] Any new outgoing reference NOT in the hardcoded list is categorised as `Other` with a free-text note

## Data integrity verification

- [ ] Open the saved file in Python (`openpyxl.load_workbook`) and confirm all sheets load without errors
- [ ] Confirm the file size is reasonable (similar to or larger than previous month's file)
- [ ] Spot-check 3–5 random members to confirm their previous months' DO/EFT values are unchanged

## Final balance check

```
Opening balance:     R[X]
+ Total credits:     R[Y]
− Total debits:      R[Z]
= Closing balance:   R[X + Y − Z]
```

This must match the bank statement's closing balance to within R0.01. If it doesn't, **do not deliver** — investigate and fix.
