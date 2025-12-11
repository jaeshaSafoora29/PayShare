// Simple PayShare app (vanilla JS)
const form = document.getElementById('expense-form');
const titleIn = document.getElementById('title');
const amountIn = document.getElementById('amount');
const paidByIn = document.getElementById('paidBy');
const contributorsIn = document.getElementById('contributors');
const settledIn = document.getElementById('settled');
const expensesList = document.getElementById('expenses-list');
const totalEl = document.getElementById('total');
const pendingEl = document.getElementById('pending');
const membersEl = document.getElementById('members');
const summaryTable = document.getElementById('summary-table');
const distCanvas = document.getElementById('distChart');
const exportCsvBtn = document.getElementById('export-csv');
const loadSampleBtn = document.getElementById('load-sample');
const clearAllBtn = document.getElementById('clear-all');
const resetBtn = document.getElementById('reset-btn');

let expenses = [];
let editId = null;

// Utilities
function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,7) }
function currency(n){ return '₹' + Number(n).toFixed(2) }
function save(){ localStorage.setItem('payshare_expenses', JSON.stringify(expenses)) }
function load(){ const raw = localStorage.getItem('payshare_expenses'); if(raw) expenses = JSON.parse(raw) }
function round2(n){ return Math.round(n*100)/100 }

// Core
function addExpense(e){
  e.preventDefault();
  const title = titleIn.value.trim();
  const amount = parseFloat(amountIn.value) || 0;
  const paidBy = paidByIn.value.trim() || 'Unknown';
  const contributors = contributorsIn.value.split(',').map(s=>s.trim()).filter(Boolean);
  const settled = settledIn.checked;
  if(!title || amount<=0 || contributors.length===0){ alert('Please fill valid details'); return; }

  const item = {
    id: editId || uid(),
    title, amount: round2(amount), paidBy, contributors, settled, created: new Date().toISOString()
  };
  if(editId){
    expenses = expenses.map(x=> x.id===editId ? item : x);
    editId = null;
  } else {
    expenses.unshift(item);
  }
  form.reset();
  save(); render();
}

function render(){
  // list
  expensesList.innerHTML = '';
  expenses.forEach(x=>{
    const div = document.createElement('div');
    div.className = 'expense';
    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.innerHTML = `<strong>${x.title}</strong><br>${currency(x.amount)} • Paid by ${x.paidBy} • ${x.contributors.length} contributors`;
    const actions = document.createElement('div');
    actions.className = 'actions';
    const editBtn = document.createElement('button'); editBtn.textContent='Edit';
    const delBtn = document.createElement('button'); delBtn.textContent='Delete';
    const settleBtn = document.createElement('button'); settleBtn.textContent = x.settled? 'Unsettle':'Settle';
    editBtn.onclick = ()=> startEdit(x.id);
    delBtn.onclick = ()=> { if(confirm('Delete this expense?')){ expenses = expenses.filter(i=>i.id!==x.id); save(); render(); } }
    settleBtn.onclick = ()=> { x.settled = !x.settled; save(); render(); }
    actions.appendChild(editBtn); actions.appendChild(delBtn); actions.appendChild(settleBtn);
    div.appendChild(meta); div.appendChild(actions);
    expensesList.appendChild(div);
  });

  // dashboard totals
  const total = expenses.reduce((s,i)=> s + Number(i.amount), 0);
  const pending = expenses.filter(e=>!e.settled).reduce((s,i)=> s + Number(i.amount), 0);
  totalEl.textContent = currency(total);
  pendingEl.textContent = currency(pending);

  // members
  const membersSet = new Set();
  expenses.forEach(e=> { membersSet.add(e.paidBy); e.contributors.forEach(c=>membersSet.add(c)) });
  const members = Array.from(membersSet);
  membersEl.textContent = members.length ? members.join(', ') : '—';

  // summary (split equally among contributors)
  const balances = {}; // member -> net balance (positive means owed to them)
  members.forEach(m=> balances[m]=0);
  expenses.forEach(e=>{
    const share = round2(e.amount / e.contributors.length);
    e.contributors.forEach(c=>{
      // each contributor owes share to payer (unless contributor is payer)
      if(c === e.paidBy){
        // payer paid their share; no transfer for self
      } else {
        balances[e.paidBy] += share;
        balances[c] -= share;
      }
    });
    // if payer not included as contributor but paid, assume payer covered full amount; adjust
    if(!e.contributors.includes(e.paidBy)){
      // payer should be reimbursed by all contributors
      // nothing more to do because above loop gave payer shares from contributors
    }
  });

  // render summary table
  summaryTable.innerHTML = '<h3>Net balances (positive = should receive)</h3>';
  const table = document.createElement('table');
  table.innerHTML = '<tr><th>Member</th><th>Net (₹)</th></tr>';
  members.forEach(m=>{
    const r = document.createElement('tr');
    r.innerHTML = `<td>${m}</td><td>${currency(balances[m]||0)}</td>`;
    table.appendChild(r);
  });
  summaryTable.appendChild(table);

  // draw simple bar chart
  drawChart(balances);
}

function startEdit(id){
  const e = expenses.find(x=>x.id===id);
  if(!e) return;
  editId = id;
  titleIn.value = e.title; amountIn.value = e.amount; paidByIn.value = e.paidBy;
  contributorsIn.value = e.contributors.join(', ');
  settledIn.checked = e.settled;
  window.scrollTo({top:0, behavior:'smooth'});
}

function drawChart(balances){
  const ctx = distCanvas.getContext('2d');
  ctx.clearRect(0,0,distCanvas.width, distCanvas.height);
  const entries = Object.entries(balances);
  if(entries.length===0) return;
  const maxVal = Math.max(...entries.map(e=>Math.abs(e[1]) || 0), 1);
  const barH = 18; const gap = 8;
  ctx.font = '13px Arial';
  entries.forEach((e,i)=>{
    const name = e[0]; const val = e[1] || 0;
    const x = 150; const y = i*(barH+gap)+8;
    // label
    ctx.fillStyle = '#111'; ctx.fillText(name, 8, y+12);
    // bar background
    ctx.fillStyle = '#eef6ff'; ctx.fillRect(x, y, 420, barH);
    // bar value
    const w = Math.round((Math.abs(val)/maxVal) * 420);
    ctx.fillStyle = val>=0 ? '#2b6cb0' : '#c026d3';
    ctx.fillRect(x + (val>=0?0:420-w), y, w, barH);
    // value
    ctx.fillStyle = '#111'; ctx.fillText(currency(val), x+430, y+12);
  });
}

// CSV export
function exportCSV(){
  if(expenses.length===0){ alert('No data'); return; }
  const header = ['id','title','amount','paidBy','contributors','settled','created'];
  const rows = expenses.map(e=> [e.id, e.title, e.amount, e.paidBy, '"' + e.contributors.join(';') + '"', e.settled, e.created].join(','));
  const csv = header.join(',') + '\n' + rows.join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'payshare_expenses.csv'; a.click();
  URL.revokeObjectURL(url);
}

// Sample data loader
function loadSample(){
  // a small sample dataset
  expenses = [
    {id: uid(), title:'Dinner - Friday', amount:1200, paidBy:'Alice', contributors:['Alice','Bob','Charlie'], settled:false, created:new Date().toISOString()},
    {id: uid(), title:'Cab to airport', amount:900, paidBy:'Bob', contributors:['Alice','Bob'], settled:true, created:new Date().toISOString()},
    {id: uid(), title:'Groceries', amount:600, paidBy:'Charlie', contributors:['Alice','Bob','Charlie'], settled:false, created:new Date().toISOString()}
  ];
  save(); render();
}

function clearAll(){
  if(confirm('Clear all expenses? This will remove local data.')){ expenses=[]; save(); render(); }
}

// init
form.addEventListener('submit', addExpense);
exportCsvBtn.addEventListener('click', exportCSV);
loadSampleBtn.addEventListener('click', loadSample);
clearAllBtn.addEventListener('click', clearAll);
resetBtn.addEventListener('click', ()=>{ editId=null; form.reset(); });

load();
render();
