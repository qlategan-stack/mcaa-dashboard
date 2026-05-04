/* ==============================================================
   MCAA DASHBOARD — CANONICAL JAVASCRIPT
   Paste inside <script>...</script> at end of body.
   Replace [DATA ARRAYS] with the per-month values.
   ============================================================== */

/* --- TAB NAVIGATION --- */
function go(t){
  document.querySelectorAll('.nav-btn,.panel').forEach(el=>el.classList.remove('active'));
  document.querySelector('[onclick="go(\''+t+'\')"]').classList.add('active');
  document.getElementById('tab-'+t).classList.add('active');
}

/* --- CHART.JS BASE CONFIG --- */
const base={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}}};
const tk={font:{size:10,family:'IBM Plex Mono,monospace'},color:'#999'};
const gr={color:'rgba(0,0,0,0.05)'};

/* --- DATA ARRAYS (REPLACE WITH PER-MONTH VALUES) --- */
// Three-tier counts
const totalResidents = [N];
const uniquePlots    = [N];
const payingResidents= [N];
const notPaying      = totalResidents - payingResidents;

// Donut data
const d1Paying       = payingResidents;
const d1NotPaying    = notPaying;
const d2PlotsCovered = [N];
const d2PlotsNoPayer = uniquePlots - d2PlotsCovered;
const d3WithCaptain  = [N];
const d3NoCaptain    = totalResidents - d3WithCaptain;

// Trend chart — months labels + DO/EFT arrays
const SM   = ['Sep-25','Oct-25','Nov-25','Dec-25','Jan-26','Feb-26','Mar-26'];  // example
const doT  = [/* DO totals per month */];
const eftT = [/* EFT totals per month */];

// Streets table data — array of {street, plots, residents, paying, notPaying, rate}
const streetsData = [
  // {street:'First Avenue', plots:65, residents:80, paying:18, notPaying:62, rate:22.5},
];

// Captains data — array of {street, captain, paid, total}
const captainsData = [
  // {street:'First Avenue', captain:'John Smith', paid:18, total:80},
];

// Camera member contributions — array of {name, street, plot, amount}
const cameraMembers = [];

// Camera sponsors — array of {name, amount}
const cameraSponsors = [];

// Expenses — array of {date, ref, category, amount, notes}
const expensesData = [];

// Data quality issues — array of {t:'bad'|'warn'|'good', x:'description'}
const dqIssues = [];

/* --- DONUT CHART HELPER --- */
function makeDonut(canvasId, valueA, valueB, colorA, colorB){
  const el = document.getElementById(canvasId);
  if(!el) return;
  return new Chart(el, {
    type:'doughnut',
    data:{datasets:[{
      data:[valueA, valueB],
      backgroundColor:[colorA, colorB],
      borderWidth:3,
      borderColor:'#fff'
    }]},
    options:{...base, cutout:'68%'}
  });
}

/* --- INITIALISE OVERVIEW DONUTS --- */
makeDonut('d1', d1Paying, d1NotPaying, '#15803d', '#b91c1c');
makeDonut('d2', d2PlotsCovered, d2PlotsNoPayer, '#15803d', '#b91c1c');
makeDonut('d3', d3WithCaptain, d3NoCaptain, '#15803d', '#b91c1c');

/* --- TREND CHART (REVENUE TAB) --- */
const trendEl = document.getElementById('trend');
if(trendEl){
  new Chart(trendEl, {
    type:'bar',
    data:{labels:SM, datasets:[
      {label:'DO',  data:doT,  backgroundColor:'rgba(29,78,216,0.7)', stack:'s', borderRadius:2},
      {label:'EFT', data:eftT, backgroundColor:'rgba(21,128,61,0.7)', stack:'s', borderRadius:2},
      {type:'line', label:'Total', data:doT.map((d,i)=>d+eftT[i]),
       borderColor:'#b91c1c', borderWidth:2.5, backgroundColor:'transparent',
       tension:0.3, pointRadius:3, pointBackgroundColor:'#b91c1c', stack:undefined}
    ]},
    options:{...base,
      scales:{
        x:{stacked:true, ticks:tk, grid:{display:false}},
        y:{stacked:false, ticks:{...tk, callback:v=>'R'+Math.round(v/1000)+'k'}, grid:gr}
      },
      plugins:{legend:{display:false},
        tooltip:{callbacks:{label:c=>' R'+(c.parsed.y||0).toLocaleString()}}
      }
    }
  });
}

/* --- STREETS TABLE RENDERER --- */
function renderStreets(){
  const tbody = document.getElementById('streets-body');
  if(!tbody) return;
  streetsData.sort((a,b)=>b.rate - a.rate);
  tbody.innerHTML = streetsData.map(s=>{
    const col = s.rate >= 40 ? 'green' : s.rate >= 20 ? 'amber' : 'red';
    const colVar = `var(--${col})`;
    const colLight = `var(--${col}-l)`;
    return `<tr>
      <td><span class="st-name">${s.street}</span></td>
      <td>${s.plots}</td>
      <td>${s.residents}</td>
      <td style="color:var(--green);font-weight:600">${s.paying}</td>
      <td style="color:var(--red)">${s.notPaying}</td>
      <td><span class="rate-badge" style="background:${colLight};color:${colVar}">${s.rate.toFixed(0)}%</span></td>
      <td><div class="bar-track"><div class="bar-fill" style="width:${Math.min(s.rate,100)}%;background:${colVar}"></div></div></td>
    </tr>`;
  }).join('');
}
renderStreets();

/* --- CAPTAINS GRID RENDERER --- */
function renderCaptains(){
  const grid = document.getElementById('cap-grid');
  if(!grid) return;
  grid.innerHTML = captainsData.map(c=>{
    const pct = c.total ? (c.paid / c.total * 100) : 0;
    const col = pct === 0 ? '#b91c1c' : pct < 25 ? '#b45309' : '#15803d';
    const tag = pct === 0 ? 'r' : pct < 25 ? 'e' : 'g';
    const tagText = pct === 0 ? 'Recruit' : pct < 25 ? 'Follow up' : 'On track';
    const captainText = c.captain ? `Capt: ${c.captain}` : 'No captain assigned';
    return `<div class="cap-card">
      <span class="cap-tag tag-${tag}">${tagText}</span>
      <div class="cap-street">${c.street}</div>
      <div class="cap-name">${captainText}</div>
      <div class="cap-bar-wrap">
        <div class="cap-bar"><div class="cap-fill" style="width:${pct}%;background:${col}"></div></div>
        <span class="cap-ratio" style="color:${col}">${c.paid}/${c.total}</span>
      </div>
    </div>`;
  }).join('');
}
renderCaptains();

/* --- CAMERA RENDERER --- */
function renderCamera(){
  const memGrid = document.querySelector('.cam-grid');
  if(memGrid){
    memGrid.innerHTML = cameraMembers.map(m=>`
      <div class="cam-item">
        <div class="cam-name">${m.name}</div>
        <div class="cam-sub">${m.street} · plot ${m.plot}</div>
        <div class="cam-val">R${m.amount.toLocaleString()}</div>
      </div>`).join('');
  }
  const sponsorGrid = document.querySelector('.cam-sponsor-grid');
  if(sponsorGrid){
    sponsorGrid.innerHTML = cameraSponsors.map(s=>`
      <div class="cam-sponsor">
        <div class="cam-name" style="font-size:12px;font-weight:600;margin-bottom:6px">${s.name}</div>
        <div class="cam-val" style="font-family:var(--font-display);font-size:20px;font-weight:900;color:var(--purple)">R${s.amount.toLocaleString()}</div>
      </div>`).join('');
  }
}
renderCamera();

/* --- EXPENSES RENDERER --- */
function renderExpenses(){
  const tbody = document.getElementById('exp-body');
  if(!tbody) return;
  const colMap = {
    'Salary':'red', 'Maintenance':'amber', 'Camera purchase':'purple',
    'Bank fee':'blue', 'Utilities':'blue', 'Reversal':'amber', 'Other':null
  };
  tbody.innerHTML = expensesData.map(e=>{
    const col = colMap[e.category];
    const catStyle = col
      ? `background:var(--${col}-m);color:var(--${col})`
      : `background:var(--paper3);color:var(--ink3)`;
    return `<tr>
      <td>${e.date}</td>
      <td>${e.ref}</td>
      <td><span class="exp-cat" style="${catStyle}">${e.category}</span></td>
      <td style="text-align:right;font-weight:600">R${e.amount.toLocaleString()}</td>
      <td style="color:var(--ink4)">${e.notes || ''}</td>
    </tr>`;
  }).join('');
}
renderExpenses();

/* --- DATA QUALITY RENDERER --- */
function renderDQ(){
  const grid = document.getElementById('dq-grid');
  if(!grid) return;
  const lbl = {bad:'Critical', warn:'Warning', good:'Good'};
  grid.innerHTML = dqIssues.map(i=>`
    <div class="dq-item ${i.t}">
      <span class="dq-badge">${lbl[i.t]}</span>
      <span>${i.x}</span>
    </div>`).join('');
}
renderDQ();
