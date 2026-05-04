# Dashboard Output Checklist

After producing the HTML dashboard, verify ALL of the following before delivering to the user.

---

## File and naming

- [ ] File saved as `mcaa_dashboard_v[N].html` in `/mnt/user-data/outputs/`
- [ ] N is the next integer after the most recent existing dashboard
- [ ] File is self-contained — no external dependencies except CDN-loaded fonts and Chart.js

## HTML structure

- [ ] `<!DOCTYPE html>` declaration present
- [ ] `<meta name="viewport" content="width=1280">` — DESKTOP only, never mobile
- [ ] `<title>` includes month and year
- [ ] Three Google Fonts loaded: IBM Plex Mono, Playfair Display, DM Sans
- [ ] Chart.js loaded from `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js`

## CSS conformance

- [ ] All CSS variables match the canonical set in `templates/dashboard_styles.css` exactly
- [ ] No mobile media queries
- [ ] No font substitutions
- [ ] No hardcoded colour values outside the variable system (except where the CSS itself defines them)

## Layout

- [ ] Sidebar is exactly 240px wide
- [ ] Sidebar uses `position:sticky` and `height:100vh`
- [ ] Sidebar background is `var(--ink)` (`#0f0f0f`)
- [ ] Main content has `padding:36px 40px` and `max-width:1200px`
- [ ] All seven nav buttons present in correct order: Overview, Revenue, Camera, Streets, Captains, Expenses, Data quality
- [ ] First nav button (Overview) and first panel have `class="active"` on page load
- [ ] Active nav button has `border-left:2px solid #b91c1c`

## Typography

- [ ] KPI values use Playfair Display, font-size 36px, weight 900
- [ ] Card headers use IBM Plex Mono, 11px, uppercase, letter-spacing 0.07em
- [ ] Sidebar nav buttons use IBM Plex Mono at 11px
- [ ] Page titles use Playfair Display 30px, weight 900
- [ ] Body text uses DM Sans

## Overview tab

- [ ] Four KPIs in correct order: Total residents · Unique plots · Paying residents · Not paying
- [ ] Three donut charts: Residents vs paying · Plots with payer · Captain coverage
- [ ] Each donut has cutout 68%, borderWidth 3, borderColor white
- [ ] KPI numbers match the three-tier data model definition
- [ ] Paying = rows with DO > 0 OR EFT > 0 for the current month (NOT including camera)

## Revenue tab

- [ ] DO total and EFT total shown separately
- [ ] Membership total = DO + EFT (does NOT include camera)
- [ ] Trend chart shows all available months with stacked bars (DO blue, EFT green) and total line (red)
- [ ] Chart.js tick font is `IBM Plex Mono,monospace` size 10 colour `#999`

## Camera tab

- [ ] Camera total shown in green total bar
- [ ] Camera revenue is COMPLETELY SEPARATE from membership revenue
- [ ] Member contributions section lists each paying member with name, street, plot, amount
- [ ] Sponsor section lists each sponsor (Damaskus Projects, Fifth Street, Van Niekerk, Byron Nel Street, BlgN15F) with amount
- [ ] Card backgrounds use purple variable family (`--purple-l`, `--purple-m`)

## Streets tab

- [ ] Table columns in order: Street · Plots · Residents · Paying · Not paying · Rate · Bar
- [ ] Sorted by pay rate descending by default
- [ ] Rate badge colours: red < 20%, amber 20–39%, green 40%+
- [ ] Bar fill width capped at 100% with `Math.min(rate, 100)`

## Captains tab

- [ ] Three-column grid of captain cards
- [ ] Each card shows: status tag (Recruit/Follow up/On track), street name, captain name (or "No captain assigned"), progress bar, paid/total ratio
- [ ] Bar colours: 0% = red, <25% = amber, ≥25% = green
- [ ] Tag colours match status: Recruit = red, Follow up = amber, On track = green

## Expenses tab

- [ ] Table columns: Date · Reference · Category · Amount · Notes
- [ ] Categories use the colour map: Salary=red, Maintenance=amber, Camera purchase=purple, Bank fee/Utilities=blue, Reversal=amber, Other=grey
- [ ] Total in header badge

## Data quality tab

- [ ] Grid of issue items (bad / warn / good)
- [ ] Critical badge for unmatched transactions
- [ ] Warning badge for missing plot numbers, missing addresses, missing D/O refs
- [ ] Good badge for confirmed clean checks

## Functional

- [ ] All seven tab buttons clickable and switch panels correctly
- [ ] All Chart.js charts render without console errors
- [ ] Donut centre numbers are present and accurate
- [ ] All numeric values are formatted with thousand separators (`toLocaleString()` or `R[N]k` for charts)

## Cross-validation against Excel

- [ ] Total residents matches Comprehensive list count
- [ ] Unique plots matches the deduplication of column D (after splitting commas)
- [ ] Paying residents matches the count of rows with DO > 0 OR EFT > 0 in the current month
- [ ] DO total matches sum of `[Mon-YY] DO` column
- [ ] EFT total matches sum of `[Mon-YY] EFT` column
- [ ] Camera total matches sum of camera contributions for the month (members + sponsors)

## Final visual inspection

- [ ] Open the HTML in a browser (or rendered preview) at desktop width
- [ ] All seven tabs render without layout breakage
- [ ] No mobile-style stacking or column collapse
- [ ] Sidebar stays put when scrolling
- [ ] Fonts load (no fallback serif/sans visible)
