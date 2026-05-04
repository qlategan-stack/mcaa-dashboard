# MCAA Dashboard Design Standard
**Established:** March 2026  
**Status:** CANONICAL — zero deviations permitted on any future report  
**Format:** Full desktop HTML, width=1280, sticky sidebar navigation

---

## AUTOMATIC TRIGGER — READ THIS FIRST

This dashboard is produced automatically every time a new Capitec bank statement PDF is uploaded to the project. It is always paired with the Excel reconciliation workbook. Both go to `/mnt/user-data/outputs/` together.

**Output filename:** `mcaa_dashboard_v[N].html` — increment N with each new monthly report.

---

## Data model — always use this three-tier structure

Every dashboard uses exactly these three levels, sourced from the Comprehensive list sheet:

| Concept | Definition | Mar-26 baseline |
|---------|-----------|----------------|
| **Residents** | Every row in Comprehensive list (rows 2–529) with an owner name — each is a member/dwelling unit | 528 |
| **Unique plots** | Distinct plot numbers across all rows (split comma-multi entries like `1,3,7`; exclude `?` and blank) | 343 |
| **Paying residents** | Rows where Mar-XX DO or Mar-XX EFT > 0 | 96 (18%) |

Overview KPIs always show: Total residents · Unique plots · Paying residents · Not paying  
Three donuts on Overview: Residents vs paying · Plots with payer vs none · Captain coverage  
Streets tab columns: Plots · Residents · Paying · Not paying · Pay rate % · Bar  
Plots tab: searchable/filterable register of all unique plots — street, plot number, resident count, paying status (green/red dot)

---

## Non-negotiable rules

1. Always `<!DOCTYPE html>` with `<meta name="viewport" content="width=1280">` — never mobile viewport
2. Always full-page shell: fixed 240px dark sidebar + scrollable main content area
3. Always load these three Google Fonts — no substitutions:
   - `IBM Plex Mono` (weights 400, 500, 600) — all labels, mono data, table headers
   - `Playfair Display` (weights 700, 900) — page titles, KPI values, donut centre numbers, camera values
   - `DM Sans` (weights 300, 400, 500, 600) — body text, card content
4. Always load Chart.js from `https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js`
5. Always use the exact CSS variables below — never hardcode colours except where the variable system requires it
6. Main content panels use `padding:36px 40px` and `max-width:1200px`
7. KPI values always use Playfair Display at font-size 36px, weight 900
8. Card headers always use IBM Plex Mono at 11px, uppercase, letter-spacing 0.07em
9. Sidebar nav buttons always use IBM Plex Mono at 11px; active state has `border-left:2px solid #b91c1c`
10. Chart.js tick font always `IBM Plex Mono,monospace` at size 10, colour `#999`

---

## Complete CSS — copy verbatim into every report

```css
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --ink:#0f0f0f;--ink2:#2a2a2a;--ink3:#5a5a5a;--ink4:#999;
  --paper:#f9f7f2;--paper2:#f0ece3;--paper3:#e4ddd0;--paper4:#d4cbbe;
  --red:#b91c1c;--red-l:#fef2f2;--red-m:#fecaca;
  --amber:#b45309;--amber-l:#fffbeb;--amber-m:#fde68a;
  --green:#15803d;--green-l:#f0fdf4;--green-m:#bbf7d0;
  --blue:#1d4ed8;--blue-l:#eff6ff;--blue-m:#bfdbfe;
  --purple:#7e22ce;--purple-l:#faf5ff;--purple-m:#e9d5ff;
  --sidebar:240px;
  --font-display:'Playfair Display',serif;
  --font-mono:'IBM Plex Mono',monospace;
  --font-body:'DM Sans',sans-serif;
}
html,body{height:100%;background:var(--paper);color:var(--ink);font-family:var(--font-body);}
.shell{display:flex;min-height:100vh;}

/* SIDEBAR */
.sidebar{width:var(--sidebar);flex-shrink:0;background:var(--ink);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;border-right:1px solid #1e1e1e;}
.sb-brand{padding:28px 22px 20px;}
.sb-brand h1{font-family:var(--font-display);font-size:17px;font-weight:900;color:#fff;line-height:1.25;letter-spacing:-0.3px;}
.sb-brand p{font-family:var(--font-mono);font-size:9px;color:#555;margin-top:5px;letter-spacing:0.06em;text-transform:uppercase;}
.sb-date{margin:0 22px 20px;padding:8px 10px;background:#1a1a1a;border-radius:4px;border-left:2px solid #b91c1c;}
.sb-date span{font-family:var(--font-mono);font-size:9px;color:#aaa;display:block;}
.sb-date strong{font-family:var(--font-mono);font-size:11px;color:#fff;}
.sb-nav{flex:1;padding:0 12px;}
.sb-section{font-family:var(--font-mono);font-size:8px;text-transform:uppercase;letter-spacing:0.12em;color:#444;padding:16px 10px 6px;}
.nav-btn{width:100%;text-align:left;border:none;background:transparent;font-family:var(--font-mono);font-size:11px;color:#666;padding:9px 10px;border-radius:4px;cursor:pointer;display:flex;align-items:center;gap:9px;transition:all 0.15s;margin-bottom:1px;letter-spacing:0.02em;}
.nav-btn:hover{background:#1a1a1a;color:#ccc;}
.nav-btn.active{background:#1f1f1f;color:#fff;border-left:2px solid #b91c1c;padding-left:8px;}
.nb-icon{font-size:13px;width:16px;text-align:center;flex-shrink:0;}
.sb-footer{padding:18px 22px;border-top:1px solid #1e1e1e;}
.sb-conf{font-family:var(--font-mono);font-size:8px;text-transform:uppercase;letter-spacing:0.1em;color:#444;}

/* MAIN */
.main{flex:1;overflow-y:auto;min-width:0;}
.panel{display:none;padding:36px 40px;max-width:1200px;}
.panel.active{display:block;}

/* PAGE HEADER */
.page-hdr{margin-bottom:32px;display:flex;align-items:flex-end;justify-content:space-between;border-bottom:1px solid var(--paper3);padding-bottom:20px;}
.page-hdr h2{font-family:var(--font-display);font-size:30px;font-weight:900;letter-spacing:-0.5px;color:var(--ink);}
.page-hdr p{font-family:var(--font-mono);font-size:10px;color:var(--ink4);margin-top:4px;}
.page-hdr-badge{font-family:var(--font-mono);font-size:9px;padding:4px 10px;border-radius:3px;border:1px solid var(--paper3);color:var(--ink3);}

/* KPI GRID */
.kpi-row{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px;}
.kpi-row.cols3{grid-template-columns:repeat(3,1fr);}
.kpi-row.cols2{grid-template-columns:repeat(2,1fr);}
.kpi{background:#fff;border:1px solid var(--paper3);border-radius:6px;padding:20px 22px;position:relative;overflow:hidden;}
.kpi::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;}
.kpi.kb::after{background:var(--blue);}.kpi.kg::after{background:var(--green);}
.kpi.kr::after{background:var(--red);}.kpi.ka::after{background:var(--amber);}
.kpi.kp::after{background:var(--purple);}
.kl{font-family:var(--font-mono);font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink4);margin-bottom:8px;}
.kv{font-family:var(--font-display);font-size:36px;font-weight:900;line-height:1;letter-spacing:-1px;}
.ks{font-family:var(--font-mono);font-size:10px;color:var(--ink4);margin-top:6px;}
.kv.clg{color:var(--green);}.kv.clr{color:var(--red);}.kv.clp{color:var(--purple);}
.kv.cla{color:var(--amber);}.kv.clb{color:var(--blue);}

/* CARDS */
.card{background:#fff;border:1px solid var(--paper3);border-radius:6px;overflow:hidden;margin-bottom:20px;}
.card-row{display:grid;gap:20px;margin-bottom:20px;}
.card-row.cols2{grid-template-columns:1fr 1fr;}
.card-row.cols3{grid-template-columns:1fr 1fr 1fr;}
.card-row > .card{margin-bottom:0;}
.ch{padding:14px 20px;border-bottom:1px solid var(--paper2);display:flex;align-items:center;justify-content:space-between;}
.ch h3{font-family:var(--font-mono);font-size:11px;text-transform:uppercase;letter-spacing:0.07em;color:var(--ink2);font-weight:600;}
.ch-sub{font-family:var(--font-mono);font-size:9px;color:var(--ink4);}
.cb{padding:20px;}

/* DONUT CHARTS */
.donut-wrap{display:flex;align-items:center;gap:28px;}
.dw{position:relative;width:110px;height:110px;flex-shrink:0;}
.dlbl{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.dlbl .dv{font-family:var(--font-display);font-size:24px;font-weight:900;line-height:1;}
.dlbl .ds{font-family:var(--font-mono);font-size:9px;color:var(--ink4);}
.leg{display:flex;flex-direction:column;gap:8px;}
.lr{display:flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:11px;color:var(--ink2);}
.sw{width:10px;height:10px;border-radius:2px;flex-shrink:0;}
.lr-pct{margin-left:auto;font-weight:600;}

/* INSIGHT BOX */
.insight{background:var(--paper2);border-left:3px solid var(--paper4);border-radius:0 4px 4px 0;padding:10px 14px;font-family:var(--font-mono);font-size:11px;color:var(--ink2);line-height:1.7;margin-top:14px;}

/* STREETS TABLE */
.st-table{width:100%;border-collapse:collapse;}
.st-table th{font-family:var(--font-mono);font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink4);padding:8px 12px;text-align:left;border-bottom:1px solid var(--paper3);background:var(--paper);}
.st-table td{padding:10px 12px;border-bottom:1px solid var(--paper2);vertical-align:middle;}
.st-table tr:last-child td{border-bottom:none;}
.st-table tr:hover td{background:var(--paper);}
.st-name{font-size:13px;font-weight:600;color:var(--ink);}
.rate-badge{font-family:var(--font-mono);font-size:10px;font-weight:600;padding:3px 8px;border-radius:3px;display:inline-block;}
.bar-track{height:6px;background:var(--paper3);border-radius:2px;overflow:hidden;width:120px;}
.bar-fill{height:100%;border-radius:2px;}

/* CAPTAINS */
.cap-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.cap-card{background:var(--paper);border:1px solid var(--paper3);border-radius:5px;padding:14px 16px;}
.cap-street{font-size:13px;font-weight:600;color:var(--ink);margin-bottom:2px;}
.cap-name{font-family:var(--font-mono);font-size:9px;color:var(--ink4);margin-bottom:10px;}
.cap-bar-wrap{display:flex;align-items:center;gap:10px;}
.cap-bar{flex:1;height:6px;background:var(--paper3);border-radius:2px;overflow:hidden;}
.cap-fill{height:100%;border-radius:2px;}
.cap-ratio{font-family:var(--font-mono);font-size:10px;font-weight:600;width:40px;text-align:right;}
.cap-tag{font-family:var(--font-mono);font-size:8px;padding:2px 6px;border-radius:2px;font-weight:600;display:inline-block;margin-bottom:6px;}
.tag-r{background:var(--red-m);color:var(--red);}
.tag-e{background:var(--amber-m);color:var(--amber);}
.tag-g{background:var(--green-m);color:var(--green);}

/* CAMERA */
.cam-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
.cam-item{background:var(--purple-l);border:1px solid var(--purple-m);border-radius:5px;padding:14px 16px;}
.cam-name{font-size:12px;font-weight:600;color:var(--ink);margin-bottom:2px;}
.cam-sub{font-family:var(--font-mono);font-size:9px;color:var(--ink4);margin-bottom:8px;}
.cam-val{font-family:var(--font-display);font-size:22px;font-weight:900;color:var(--purple);}
.cam-sponsor-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:16px;}
.cam-sponsor{background:#fff;border:1px solid var(--purple-m);border-radius:5px;padding:12px 14px;text-align:center;}
.cam-total-bar{background:var(--green-l);border:1px solid var(--green-m);border-radius:5px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;}
.cam-total-lbl{font-family:var(--font-mono);font-size:11px;color:var(--green);font-weight:600;}
.cam-total-val{font-family:var(--font-display);font-size:28px;font-weight:900;color:var(--green);}

/* DATA QUALITY */
.dq-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.dq-item{display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border-radius:5px;border-left:3px solid;font-size:12px;line-height:1.6;}
.dq-item.bad{border-color:var(--red);background:var(--red-l);}
.dq-item.warn{border-color:var(--amber);background:var(--amber-l);}
.dq-item.good{border-color:var(--green);background:var(--green-l);}
.dq-badge{font-family:var(--font-mono);font-size:8px;text-transform:uppercase;padding:2px 6px;border-radius:2px;flex-shrink:0;margin-top:2px;font-weight:600;letter-spacing:0.06em;}
.dq-item.bad .dq-badge{background:var(--red-m);color:var(--red);}
.dq-item.warn .dq-badge{background:var(--amber-m);color:var(--amber);}
.dq-item.good .dq-badge{background:var(--green-m);color:var(--green);}

/* CHART LEGEND */
.chart-legend{display:flex;gap:20px;margin-bottom:14px;}
.cl-item{display:flex;align-items:center;gap:7px;font-family:var(--font-mono);font-size:10px;color:var(--ink3);}
.cl-dot{width:10px;height:10px;border-radius:2px;flex-shrink:0;}

/* EXPENSE TABLE */
.exp-table{width:100%;border-collapse:collapse;}
.exp-table th{font-family:var(--font-mono);font-size:9px;text-transform:uppercase;letter-spacing:0.08em;color:var(--ink4);padding:8px 14px;text-align:left;border-bottom:1px solid var(--paper3);}
.exp-table td{padding:11px 14px;border-bottom:1px solid var(--paper2);font-family:var(--font-mono);font-size:11px;}
.exp-table tr:last-child td{border-bottom:none;}
.exp-cat{display:inline-block;padding:2px 7px;border-radius:3px;font-size:9px;font-weight:600;}
```

---

## HTML shell — copy verbatim, update only title and reporting period date

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1280">
<title>MCAA Membership Dashboard — [Month Year]</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<style>
  [PASTE COMPLETE CSS ABOVE]
</style>
</head>
<body>
<div class="shell">

<aside class="sidebar">
  <div class="sb-brand">
    <h1>MCAA<br>Dashboard</h1>
    <p>Muckleneuk &amp; Claudius<br>Area Association</p>
  </div>
  <div class="sb-date">
    <span>Reporting period</span>
    <strong>[DD Month YYYY]</strong>
  </div>
  <div class="sb-nav">
    <div class="sb-section">Analytics</div>
    <button class="nav-btn active" onclick="go('ov')"><span class="nb-icon">◈</span>Overview</button>
    <button class="nav-btn" onclick="go('rv')"><span class="nb-icon">◉</span>Revenue</button>
    <button class="nav-btn" onclick="go('cam')"><span class="nb-icon">◎</span>Camera</button>
    <button class="nav-btn" onclick="go('st')"><span class="nb-icon">◫</span>Streets</button>
    <button class="nav-btn" onclick="go('ca')"><span class="nb-icon">◷</span>Captains</button>
    <div class="sb-section">Financials</div>
    <button class="nav-btn" onclick="go('ex')"><span class="nb-icon">◻</span>Expenses</button>
    <div class="sb-section">Reporting</div>
    <button class="nav-btn" onclick="go('dq')"><span class="nb-icon">◈</span>Data quality</button>
  </div>
  <div class="sb-footer"><div class="sb-conf">⬛ Confidential</div></div>
</aside>

<main class="main">
  [TAB PANELS HERE — see component patterns below]
</main>
</div>
```

---

## JavaScript — copy verbatim, update only data arrays

```javascript
function go(t){
  document.querySelectorAll('.nav-btn,.panel').forEach(el=>el.classList.remove('active'));
  document.querySelector('[onclick="go(\''+t+'\')"]').classList.add('active');
  document.getElementById('tab-'+t).classList.add('active');
}

const base={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}};
const tk={font:{size:10,family:'IBM Plex Mono,monospace'},color:'#999'};
const gr={color:'rgba(0,0,0,0.05)'};
```

Chart.js donut config (always cutout 68%, borderWidth 3, borderColor #fff):
```javascript
new Chart(el, {
  type:'doughnut',
  data:{datasets:[{data:[A,B],backgroundColor:['#15803d','#b91c1c'],borderWidth:3,borderColor:'#fff'}]},
  options:{...base,cutout:'68%'}
});
```

Stacked bar + line overlay (trend chart):
```javascript
{
  type:'bar',
  data:{labels:SM,datasets:[
    {label:'DO',data:doT,backgroundColor:'rgba(29,78,216,0.7)',stack:'s',borderRadius:2},
    {label:'EFT',data:eftT,backgroundColor:'rgba(21,128,61,0.7)',stack:'s',borderRadius:2},
    {type:'line',label:'Total',data:doT.map((d,i)=>d+eftT[i]),borderColor:'#b91c1c',
     borderWidth:2.5,backgroundColor:'transparent',tension:0.3,pointRadius:3,
     pointBackgroundColor:'#b91c1c',stack:undefined}
  ]},
  options:{...base,
    scales:{
      x:{stacked:true,ticks:tk,grid:{display:false}},
      y:{stacked:false,ticks:{...tk,callback:v=>'R'+Math.round(v/1000)+'k'},grid:gr}
    },
    plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>' R'+(c.parsed.y||0).toLocaleString()}}}
  }
}
```

Simple stacked bar (revenue breakdown):
```javascript
{
  type:'bar',
  data:{labels:SM,datasets:[
    {label:'DO',data:doT,backgroundColor:'rgba(29,78,216,0.8)',stack:'s',borderRadius:3},
    {label:'EFT',data:eftT,backgroundColor:'rgba(21,128,61,0.8)',stack:'s',borderRadius:3}
  ]},
  options:{...base,
    scales:{
      x:{stacked:true,ticks:tk,grid:{display:false}},
      y:{stacked:true,ticks:{...tk,callback:v=>'R'+Math.round(v/1000)+'k'},grid:gr}
    }
  }
}
```

Single bar (DO count / EFT count):
- DO: `backgroundColor:'rgba(29,78,216,0.8)'`
- EFT: `backgroundColor:'rgba(21,128,61,0.8)'`
- Always `borderRadius:3`

---

## Component patterns

### Page header (every tab)
```html
<div class="page-hdr">
  <div><h2>[Tab title]</h2><p>[Subtitle — mono, small]</p></div>
  <span class="page-hdr-badge">[Optional badge text]</span>
</div>
```

### KPI card
```html
<div class="kpi k[b|g|r|a|p]">
  <div class="kl">[Label]</div>
  <div class="kv [cl(g|r|p|a|b)]">[Value]</div>
  <div class="ks">[Subtext]</div>
</div>
```
KPI colour classes: `kb`=blue, `kg`=green, `kr`=red, `ka`=amber, `kp`=purple  
Value colour classes: `clg`=green, `clr`=red, `clp`=purple, `cla`=amber, `clb`=blue

### Card with header
```html
<div class="card">
  <div class="ch"><h3>[Title]</h3><span class="ch-sub">[Subtitle]</span></div>
  <div class="cb">[Content]</div>
</div>
```

### Two-column card row
```html
<div class="card-row cols2">
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

### Donut chart with legend
```html
<div class="donut-wrap">
  <div class="dw">
    <canvas id="[id]" width="110" height="110"></canvas>
    <div class="dlbl"><div class="dv">[centre number]</div><div class="ds">[label]</div></div>
  </div>
  <div class="leg">
    <div class="lr"><span class="sw" style="background:#15803d"></span>[Label A]<span class="lr-pct" style="color:#15803d">[%]</span></div>
    <div class="lr"><span class="sw" style="background:#b91c1c"></span>[Label B]<span class="lr-pct" style="color:#b91c1c">[%]</span></div>
  </div>
</div>
```

### Insight box (below donut or chart)
```html
<div class="insight">[Insight text in IBM Plex Mono]</div>
```

### Streets table row (generated by JS)
Columns in order: Street name | Total plots | DO (blue) | EFT (green) | Not paying (red) | Rate badge | Bar track  
Rate badge colours: red-l/red below 20%, amber-l/amber 20–39%, green-l/green 40%+  
Bar fill uses same colour logic; cap width at 100% with `Math.min(rate,100)`

### Captain card
```html
<div class="cap-card">
  <span class="cap-tag tag-[r|e|g]">[Recruit|Follow up|On track]</span>
  <div class="cap-street">[Street name]</div>
  <div class="cap-name">[Capt: Name | No captain assigned]</div>
  <div class="cap-bar-wrap">
    <div class="cap-bar"><div class="cap-fill" style="width:[pct]%;background:[col]"></div></div>
    <span class="cap-ratio" style="color:[col]">[paid]/[total]</span>
  </div>
</div>
```
Captain bar colours: 0%=`#b91c1c`, <25%=`#b45309`, ≥25%=`#15803d`

### Camera member item
```html
<div class="cam-item">
  <div class="cam-name">[Name]</div>
  <div class="cam-sub">[Street · plot N]</div>
  <div class="cam-val">R[amount]</div>
</div>
```

### Camera sponsor item
```html
<div class="cam-sponsor">
  <div class="cam-name" style="font-size:12px;font-weight:600;margin-bottom:6px">[Name]</div>
  <div class="cam-val" style="font-family:var(--font-display);font-size:20px;font-weight:900;color:var(--purple)">R[amount]</div>
</div>
```

### Camera total bar
```html
<div class="cam-total-bar">
  <span class="cam-total-lbl">[Label]</span>
  <span class="cam-total-val">R[amount]</span>
</div>
```

### Data quality item (generated by JS)
```javascript
const issues=[{t:'bad'|'warn'|'good', x:'[text]'}, ...];
const lbl={bad:'Critical',warn:'Warning',good:'Good'};
// renders into .dq-grid as .dq-item elements
```

### Expense table row
```html
<tr>
  <td>[DD/MM/YYYY]</td>
  <td>[Bank reference]</td>
  <td><span class="exp-cat" style="background:var(--[colour]-m);color:var(--[colour])">[Category]</span></td>
  <td style="text-align:right;font-weight:600">[Amount]</td>
  <td style="color:var(--ink4)">[Notes]</td>
</tr>
```
Expense category colour map:
- Salary → `--red`
- Maintenance → `--amber`  
- Camera purchase → `--purple`
- Bank fee / Utilities → `--blue`
- Reversal → `--amber`
- Other → `--paper3` bg, `--ink3` text

---

## Tab structure (always these 7 tabs in this order)

| Tab ID | Nav label | Icon | Section |
|--------|-----------|------|---------|
| `ov` | Overview | ◈ | Analytics |
| `rv` | Revenue | ◉ | Analytics |
| `cam` | Camera | ◎ | Analytics |
| `st` | Streets | ◫ | Analytics |
| `ca` | Captains | ◷ | Analytics |
| `ex` | Expenses | ◻ | Financials |
| `dq` | Data quality | ◈ | Reporting |

First tab (`ov`) always has `class="nav-btn active"` and `class="panel active"` on page load.

---

## Colour reference (quick lookup)

| Semantic | CSS var | Hex |
|----------|---------|-----|
| Ink (black) | `--ink` | `#0f0f0f` |
| Ink medium | `--ink2` | `#2a2a2a` |
| Ink light | `--ink3` | `#5a5a5a` |
| Ink muted | `--ink4` | `#999` |
| Paper base | `--paper` | `#f9f7f2` |
| Paper 2 | `--paper2` | `#f0ece3` |
| Paper 3 | `--paper3` | `#e4ddd0` |
| Paper 4 | `--paper4` | `#d4cbbe` |
| Red | `--red` | `#b91c1c` |
| Red light | `--red-l` | `#fef2f2` |
| Red medium | `--red-m` | `#fecaca` |
| Amber | `--amber` | `#b45309` |
| Amber light | `--amber-l` | `#fffbeb` |
| Amber medium | `--amber-m` | `#fde68a` |
| Green | `--green` | `#15803d` |
| Green light | `--green-l` | `#f0fdf4` |
| Green medium | `--green-m` | `#bbf7d0` |
| Blue | `--blue` | `#1d4ed8` |
| Blue light | `--blue-l` | `#eff6ff` |
| Blue medium | `--blue-m` | `#bfdbfe` |
| Purple | `--purple` | `#7e22ce` |
| Purple light | `--purple-l` | `#faf5ff` |
| Purple medium | `--purple-m` | `#e9d5ff` |
| Accent (sidebar/active) | — | `#b91c1c` |
| Sidebar bg | — | `#0f0f0f` (var --ink) |
| Sidebar hover | — | `#1a1a1a` |
| Sidebar active | — | `#1f1f1f` |
| Sidebar border | — | `#1e1e1e` |
| DO chart fill | — | `rgba(29,78,216,0.8)` |
| EFT chart fill | — | `rgba(21,128,61,0.8)` |
| Total line | — | `#b91c1c` |

---

## Output file naming convention
`mcaa_dashboard_v[N].html` where N increments with each new monthly report.
