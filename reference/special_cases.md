# Resolved Special Cases

These are cases that were ambiguous during the March 2026 reconciliation and have been permanently resolved. Do **not** re-flag them in any future month — apply the resolution directly.

---

## The cases

| Bank reference observed | Resolution | Member row | Notes |
|---|---|---|---|
| `BLGN11F` | John Carr | 29 | Blignaut Street, plot 11. D/O ref updated in column C to include this token. |
| `37-1ST AVE WALKERVILLE` | Peter Kairuz | 106 | First Avenue, plot 37. |
| `ABSA BANK Plot82Blignautsrus` | Terry Shapiro | 323 | Plot 82, Danie Theron. His D/O ref column C IS this full string. |
| `ABSA BANK 82Blig terry+cameras` | Terry Shapiro — Camera | 323 | Same member, but camera keyword routes to Camera Payment column. |
| `BLG108` | Nazam — EFT | 396 | De Wet Street, plot 108. Multi-ref token match. |
| `BLG108 CAMERA` | Nazam — Camera | 396 | Same member, camera keyword → Camera column. |
| `Plot 100 Nel cameras` | Mbulelo Mbenenge — Camera | 379 | Nel Street, plot 100. D/O ref includes this exact string. |
| `2ND 042` | Robert | 138 | Second Ave, plot 42. D/O ref updated. |
| `M DE VRIES 148/1` | Madelena De Vries (Lelly) | 485 | Plot 148/1 disambiguates from Andre De Vries (plot 244). |
| `244RD7HAO-ANDRE` | Andre De Vries | 443 | Road No 7, plot 244. Token `244RD7HAO`. |
| `9 D. Theron; 2026` | Miroslaw Benpkavic | 24 | Plot 9, Danie Theron. |

---

## Why these matter

In the March 2026 baseline, these were the cases that initially could not be matched cleanly through Rules 5–7 alone. After the administrator (Quintus) reviewed them, the resolutions were either:
- Encoded into column C of `Comprehensive list` as new D/O reference tokens (so future months auto-match via Rule 5)
- Documented here as canonical guidance for any close re-occurrence

If a similar reference appears in a future month and the column C lookup doesn't catch it on its own, fall back to this table before flagging as unmatched.

---

## Disambiguation patterns to remember

### Two members, same surname

When the bank reference contains a surname that two members share, the disambiguator is usually:
- A plot number (most reliable)
- A street name
- A first-name initial
- A multi-plot suffix (`148/1` vs `244`)

Worked example — De Vries:
- `M DE VRIES 148/1` → Madelena (plot 148/1, row 485)
- `244RD7HAO-ANDRE` → Andre (plot 244, row 443)
- `S DE VRIES` (hypothetical) → would need a plot or street to resolve

### Camera vs EFT for the same member

A member can have BOTH an EFT membership payment AND a separate camera contribution in the same month. They appear as two separate transactions with different references. Each routes to its own column:
- `BLG108` → EFT column
- `BLG108 CAMERA` → Camera column

This is correct and expected behaviour. Do not collapse them.

### Plot number + street ambiguity

`82` alone is too ambiguous. `Plot 82` is better. `82 Blignautsrus` is unambiguous (Terry Shapiro). Always prefer the more specific token when a member has multiple variants in column C.
