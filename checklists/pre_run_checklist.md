# Pre-Run Checklist

Before processing a new month's bank statement, verify ALL of the following. If any item fails, stop and resolve before proceeding.

---

## Inputs present

- [ ] New Capitec bank statement PDF is available in the upload directory
- [ ] PDF is for account number 1007012625
- [ ] PDF covers exactly one calendar month
- [ ] PDF opens cleanly (not password-protected, not corrupted)
- [ ] The cumulative master workbook from the previous month is available (or, for the very first run, the base file `MCAA_Membership_Base_File_Mar2026.xlsx`)

## Skill files readable

- [ ] `skills/MCAA_RECON_SKILL.md` exists and was read in full this session
- [ ] `skills/MCAA_DASHBOARD_SKILL.md` exists and was read in full this session

## Master workbook integrity

- [ ] Sheet `Comprehensive list` is present
- [ ] Column A (Owner / Tenant) has data
- [ ] Column B (Address) has data
- [ ] Column C (D/O Ref) has data
- [ ] Column D (Plot) has data
- [ ] At least one prior month's `[Mon-YY] DO` and `[Mon-YY] EFT` columns exist
- [ ] Camera Payment column exists (cumulative)
- [ ] No required sheets are missing: `Street Captains`, `Payment Summary`, `Members Report`, `Notes`, `Blignautsrus North`

## Environment ready

- [ ] Python with `openpyxl` and `pandas` available
- [ ] PDF text extraction tool available (`pdfplumber`, `PyPDF2`, or equivalent)
- [ ] Output directory `/mnt/user-data/outputs/` writable

## Naming conventions confirmed

- [ ] Output Excel file will be named `MCAA_Reconciled_[Mon][YYYY].xlsx` (e.g. `MCAA_Reconciled_Apr2026.xlsx`)
- [ ] Output dashboard file will be named `mcaa_dashboard_v[N].html` where N is the next integer after the most recent existing dashboard

## Sanity verification

- [ ] The month being processed is NOT already present as a sheet pair in the master workbook (prevents accidental double-processing)
- [ ] The new monthly columns to be added do NOT already exist in `Comprehensive list`
