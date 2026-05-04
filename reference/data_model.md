# Data Model — Three-Tier Definition

The MCAA dashboard and reconciliation use a strict three-tier hierarchy for counting. Get this wrong and every KPI on the dashboard is wrong. **Always use this exact definition.**

---

## The three tiers

### Tier 1 — Residents

**Definition:** every row in the `Comprehensive list` sheet that has BOTH an owner/tenant name (column A) AND an address value (column B), counted from row 2 down to the last named member row.

**Counting rule:**
- Start at row 2 (row 1 is the header)
- Increment for every row where column A is non-empty AND column B is non-empty
- Stop counting at the last named member row

**The boundary row:** in March 2026, the last named member row was 529. Rows 530–534 are placeholder rows for standalone camera sponsors (Damaskus Projects, Fifth Street, Van Niekerk, Byron Nel Street, BlgN15F) — these are NOT members and must not be included in resident counts.

**For future months:** detect the boundary by scanning down — the last row with both an owner name and an address that is NOT a sponsor placeholder is the cutoff. Sponsor placeholder rows can be detected by their name or by an obviously synthetic address.

**March 2026 baseline value:** 528 residents

---

### Tier 2 — Unique plots

**Definition:** the count of distinct plot numbers across all member rows (column D), with comma-separated multi-plot entries split into individual plots.

**Counting rule:**
1. For each member row, take the value in column D (Plot)
2. If the value contains commas (e.g. `1,3,7`), split on commas → 3 separate plot numbers
3. If the value is `?`, blank, or NaN → exclude
4. Collect all plot numbers from all rows into a set
5. Count the set

**Important:** plot numbers may include letters (`8a`), slashes (`148/1`, `93B`), or hyphens (`54-1`) — these are valid distinct plot identifiers and should be included as full strings.

**Why this matters:** some members own multiple adjacent plots. Gerald Bezuidenhout (row 465) owns plots 1, 3, and 7 on First Avenue. He counts as ONE resident but THREE plots. Conversely, two different members may live on plots that share a base number with different suffixes (e.g. `148` vs `148/1`) — these are TWO distinct plots.

**March 2026 baseline value:** 343 unique plots

---

### Tier 3 — Paying residents

**Definition:** the count of member rows where the current month's DO column OR EFT column has a value greater than zero.

**Counting rule:**
- For the month being reported (e.g. Mar-26), look at the two columns: `[Mon-YY] DO` and `[Mon-YY] EFT`
- A row is "paying" if `DO > 0 OR EFT > 0` for that month
- Camera Payment column does NOT factor into "paying resident" status — camera contributions are tracked separately

**Why camera is excluded:** camera contributions are voluntary and separate from the membership levy. A resident can pay camera but not membership, or vice versa. The "paying residents" KPI specifically measures membership compliance.

**March 2026 baseline value:** 96 paying residents (18% of 528)

---

## KPI relationships (Overview tab)

The Overview tab's four KPIs always reflect this hierarchy:

1. **Total residents** = Tier 1 count = 528 (Mar 2026)
2. **Unique plots** = Tier 2 count = 343 (Mar 2026)
3. **Paying residents** = Tier 3 count = 96 (Mar 2026)
4. **Not paying** = Tier 1 − Tier 3 = 528 − 96 = 432 (Mar 2026)

The three donuts on the Overview tab visualise:
- **Donut 1:** Residents vs paying (Tier 3 / Tier 1)
- **Donut 2:** Plots with at least one payer vs plots with no payer (subset analysis on Tier 2)
- **Donut 3:** Captain coverage (residents whose street has a captain assigned vs no captain)

---

## Streets tab calculation

For each street, compute:
- **Plots** = number of unique plots on that street (from Tier 2, filtered to street)
- **Residents** = number of member rows on that street
- **Paying** = number of member rows on that street with DO > 0 OR EFT > 0
- **Not paying** = Residents − Paying
- **Pay rate %** = Paying / Residents × 100

The Streets table sorts by Pay rate % descending by default.

---

## Plots tab calculation

For each unique plot:
- Street name
- Plot number
- Resident count (how many member rows reference this plot)
- Paying status (green dot if any resident on this plot paid; red dot if none did)

This is a register-level view — searchable and filterable.

---

## Camera tab calculation (separate from the three tiers)

The Camera tab is its own data view. It shows:
- **Camera-paying members** — rows where Camera Payment column > 0 in the current cumulative state, with their name, street, plot, and amount
- **Camera sponsors** — the standalone sponsor entries (Damaskus Projects, Fifth Street, Van Niekerk, Byron Nel Street, BlgN15F) and the amounts contributed
- **Total camera revenue** — members + sponsors, presented as a separate total from membership revenue

**Camera revenue is NEVER summed into membership revenue on any tab.** This is a hard rule.

---

## Counting validity rule

A row is a valid member only if:
- Column A (Owner / Tenant) is not blank
- Column B (Address) is not blank, AND not a sponsor placeholder name

If column A is blank but column B has a real address, do NOT count it as a member (it's an unoccupied or unidentified plot).
If column B is blank but column A has a name, do NOT count it as a member (it's an orphaned record).

Both fields must be present and valid for the row to count toward Tier 1.
