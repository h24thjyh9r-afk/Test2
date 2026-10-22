const STORAGE_KEY = "fixkostenwaechter.v1";
const $ = (id) => document.getElementById(id);
const money = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const dateFmt = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "short", year: "numeric" });

let expenses = loadExpenses();
let toastTimer;
let selectedSavings = new Set();

function loadExpenses() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value.filter(validExpense) : [];
  } catch {
    return [];
  }
}
function validExpense(item) {
  return item && typeof item.id === "string" && typeof item.name === "string"
    && Number.isFinite(Number(item.amount)) && Number(item.amount) > 0
    && ["weekly", "monthly", "quarterly", "yearly"].includes(item.cycle);
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  render();
}
function monthlyAmount(item) {
  const amount = Number(item.amount);
  return ({ weekly: amount * 52 / 12, monthly: amount, quarterly: amount / 3, yearly: amount / 12 })[item.cycle];
}
function cycleLabel(cycle) {
  return ({ weekly: "wöchentlich", monthly: "monatlich", quarterly: "vierteljährlich", yearly: "jährlich" })[cycle] || cycle;
}
function categorySymbol(category) {
  return ({
    "Streaming": "▶", "Telefon & Internet": "⌁", "Wohnen": "⌂",
    "Versicherung": "◇", "Mobilität": "↗", "Fitness & Freizeit": "✦",
    "Software": "▣", "Sonstiges": "€"
  })[category] || "€";
}
function safeText(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}
function parseDay(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(value + "T12:00:00");
  return !Number.isNaN(d.getTime()) && d.getFullYear() === Number(value.slice(0,4)) && d.getMonth()+1 === Number(value.slice(5,7)) && d.getDate() === Number(value.slice(8,10)) ? d : null;
}
function daysBetween(a,b) {
  return Math.round((Date.UTC(b.getFullYear(),b.getMonth(),b.getDate()) - Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()))/86400000);
}
function shiftDays(d,n) {
  const copy = new Date(d); copy.setDate(copy.getDate()+n); return copy;
}
function deadlineData(item) {
  const end = parseDay(item.contractEnd);
  if (!end) return null;
  const notice = Number(item.noticeDays ?? 30);
  const reminder = Number(item.reminderDays ?? 14);
  if (!Number.isInteger(notice) || notice < 0 || notice > 3650 || !Number.isInteger(reminder) || reminder < 0 || reminder > 3650) return null;
  const deadline = shiftDays(end,-notice);
  const today = new Date();
  return { end, deadline, remaining: daysBetween(today,deadline), reminder, note: item.contractNote || "" };
}
function renderDeadlines() {
  const records = expenses.filter(x => x.active).map(item => ({item, data: deadlineData(item)})).filter(x => x.data).sort((a,b) => a.data.deadline-b.data.deadline);
  const due = records.filter(x => x.data.remaining >= 0 && x.data.remaining <= x.data.reminder);
  const overdue = records.filter(x => x.data.remaining < 0);
  $("deadline-summary").textContent = `${records.length} Verträge mit Enddatum · ${due.length} im Erinnerungsfenster · ${overdue.length} mit abgelaufener Kündigungsfrist`;
  $("deadline-list").innerHTML = records.length ? records.map(({item,data}) => {
    const status = data.remaining < 0 ? `Frist seit ${-data.remaining} Tagen abgelaufen` : data.remaining === 0 ? "Kündigungsfrist endet heute" : data.remaining <= data.reminder ? `Erinnerung: noch ${data.remaining} Tage` : `Noch ${data.remaining} Tage`;
    const level = data.remaining < 0 ? "expired" : data.remaining <= data.reminder ? "urgent" : "normal";
    return `<article class="deadline-item ${level}"><div><strong>${safeText(item.name)}</strong><div class="deadline-meta">Vertragsende: ${dateFmt.format(data.end)} · Kündigen bis: ${dateFmt.format(data.deadline)}</div>${data.note ? `<div class="deadline-meta">Notiz: ${safeText(data.note)}</div>` : ""}</div><span class="deadline-status">${status}</span></article>`;
  }).join("") : '<p class="analysis-copy">Noch keine aktiven Verträge mit Enddatum. Ergänze die Vertragsdaten über „Bearbeiten“.</p>';
}
function render() {
  const active = expenses.filter(item => item.active);
  const monthly = active.reduce((sum, item) => sum + monthlyAmount(item), 0);
  $("monthly-total").textContent = money.format(monthly);
  $("yearly-total").textContent = money.format(monthly * 12);
  $("empty-state").hidden = expenses.length > 0;

  const query = $("search-expenses").value.trim().toLocaleLowerCase("de-DE");
  const categoryFilter = $("filter-category").value;
  const categories = [...new Set(expenses.map(item => item.category || "Sonstiges"))].sort((a,b) => a.localeCompare(b,"de"));
  $("filter-category").innerHTML = '<option value="">Alle Kategorien</option>' + categories.map(cat => `<option value="${safeText(cat)}">${safeText(cat)}</option>`).join("");
  $("filter-category").value = categories.includes(categoryFilter) ? categoryFilter : "";
  const filtered = expenses.filter(item => (!query || `${item.name} ${item.category}`.toLocaleLowerCase("de-DE").includes(query)) && (!categoryFilter || item.category === categoryFilter));
  $("filter-count").textContent = `${filtered.length} von ${expenses.length} Einträgen`;
  const list = $("expense-list");
  list.innerHTML = filtered.map(item => {
    const nextDate = item.date ? dateFmt.format(new Date(`${item.date}T12:00:00`)) : "Kein Datum";
    const deadline = deadlineData(item);
    return `<article class="expense-item ${item.active ? "" : "inactive"}">
      <div class="category-icon" aria-hidden="true">${categorySymbol(item.category)}</div>
      <div class="expense-main">
        <h3>${safeText(item.name)}</h3>
        <div class="expense-meta">${safeText(item.category)} · ${safeText(cycleLabel(item.cycle))}<br>${item.active ? "Nächste Zahlung: " + safeText(nextDate) : "Pausiert"}${deadline ? `<br>Vertragsende: ${dateFmt.format(deadline.end)} · Kündigen bis: ${dateFmt.format(deadline.deadline)}` : ""}</div>
      </div>
      <div class="expense-price">
        <strong>${money.format(Number(item.amount))}</strong>
        <small>${safeText(cycleLabel(item.cycle))}</small>
      </div>
      <div class="item-actions">
        <button class="small-button" data-action="toggle" data-id="${item.id}" type="button">${item.active ? "Pausieren" : "Aktivieren"}</button>
        <button class="small-button" data-action="edit" data-id="${item.id}" type="button">Bearbeiten</button>
        <button class="small-button delete" data-action="delete" data-id="${item.id}" type="button">Löschen</button>
      </div>
    </article>`;
  }).join("");

  renderAnalysis(active, monthly);
  renderDeadlines();
  renderDashboard(active, monthly);
  if (active.length === 0) {
    $("insight-text").textContent = "Aktiviere oder füge Fixkosten hinzu, um deine laufenden Ausgaben und mögliche Einsparungen zu vergleichen.";
  } else {
    const largest = [...active].sort((a, b) => monthlyAmount(b) - monthlyAmount(a))[0];
    $("insight-text").textContent = `Deine größten laufenden Kosten sind „${largest.name}“ mit ${money.format(monthlyAmount(largest))} pro Monat. Prüfe, ob du diesen Dienst noch benötigst.`;
  }
}

function renderAnalysis(active, monthly) {
  const largest = [...active].sort((a,b) => monthlyAmount(b)-monthlyAmount(a));
  $("analysis-overview").textContent = active.length ? `${active.length} aktive Ausgaben · ${money.format(monthly)} monatlich · ${money.format(monthly*12)} jährlich. Größte Position: ${largest[0].name} (${money.format(monthlyAmount(largest[0]))}/Monat).` : "Keine aktiven Fixkosten vorhanden.";
  $("top-expenses").innerHTML = largest.slice(0, 5).map((item,i) => `<div class="top-row"><span>${i+1}. ${safeText(item.name)}</span><strong>${money.format(monthlyAmount(item))}/Monat</strong></div>`).join("");
  const sums = new Map();
  for (const item of active) sums.set(item.category || "Sonstiges", (sums.get(item.category || "Sonstiges") || 0) + monthlyAmount(item));
  const groups = [...sums.entries()].sort((a,b) => b[1]-a[1]);
  $("category-chart").innerHTML = groups.length ? groups.map(([cat,amount]) => `<div class="chart-row"><div class="chart-label"><span>${safeText(cat)}</span><strong>${money.format(amount)} · ${(amount/monthly*100).toLocaleString("de-DE",{maximumFractionDigits:1})} %</strong></div><div class="chart-track"><div class="chart-fill" style="width:${Math.min(100,amount/monthly*100)}%"></div></div></div>`).join("") : '<p class="analysis-copy">Noch keine Daten für die Auswertung.</p>';
  const activeIds = new Set(active.map(item=>item.id));
  selectedSavings = new Set([...selectedSavings].filter(id=>activeIds.has(id)));
  $("savings-options").innerHTML = largest.length ? largest.map(item => `<label class="saving-option"><input type="checkbox" data-savings-id="${safeText(item.id)}" ${selectedSavings.has(item.id)?"checked":""}><span>${safeText(item.name)}</span><strong>${money.format(monthlyAmount(item))}/Monat</strong></label>`).join("") : '<p class="analysis-copy">Erfasse aktive Fixkosten, um Einsparungen zu simulieren.</p>';
  const savings = active.filter(item=>selectedSavings.has(item.id)).reduce((sum,item)=>sum+monthlyAmount(item),0);
  $("savings-monthly").textContent = money.format(savings);
  $("savings-yearly").textContent = money.format(savings*12);
}
$("search-expenses").addEventListener("input", render);
$("filter-category").addEventListener("change", render);
$("savings-options").addEventListener("change", event => {
  const input = event.target.closest("input[data-savings-id]");
  if (!input) return;
  if (input.checked) selectedSavings.add(input.dataset.savingsId);
  else selectedSavings.delete(input.dataset.savingsId);
  render();
});
$("clear-simulation").addEventListener("click", () => {selectedSavings.clear(); render();});

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function defaultDate() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function openForm(item = null) {
  $("expense-form").reset();
  $("form-error").textContent = "";
  $("dialog-title").textContent = item ? "Fixkosten bearbeiten" : "Neue Ausgabe";
  $("expense-id").value = item?.id || "";
  $("expense-name").value = item?.name || "";
  $("expense-amount").value = item?.amount ?? "";
  $("expense-cycle").value = item?.cycle || "monthly";
  $("expense-category").value = item?.category || "Streaming";
  $("expense-date").value = item?.date || defaultDate();
  $("contract-end").value = item?.contractEnd || "";
  $("notice-days").value = item?.noticeDays ?? 30;
  $("reminder-days").value = item?.reminderDays ?? 14;
  $("contract-note").value = item?.contractNote || "";
  $("expense-active").checked = item ? Boolean(item.active) : true;
  $("expense-dialog").showModal();
  setTimeout(() => $("expense-name").focus(), 50);
}
function closeForm() { $("expense-dialog").close(); }

$("add-button").addEventListener("click", () => openForm());
$("empty-add-button").addEventListener("click", () => openForm());
$("close-dialog").addEventListener("click", closeForm);
$("cancel-dialog").addEventListener("click", closeForm);

$("expense-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("expense-name").value.trim();
  const amount = Number($("expense-amount").value);
  const date = $("expense-date").value;
  if (!name || !Number.isFinite(amount) || amount <= 0 || !date) {
    $("form-error").textContent = "Bitte prüfe Name, Betrag und nächste Zahlung.";
    return;
  }
  const contractEnd = $("contract-end").value;
  const noticeDays = Number($("notice-days").value);
  const reminderDays = Number($("reminder-days").value);
  if ((contractEnd && !parseDay(contractEnd)) || !Number.isInteger(noticeDays) || noticeDays < 0 || noticeDays > 3650 || !Number.isInteger(reminderDays) || reminderDays < 0 || reminderDays > 3650) {
    $("form-error").textContent = "Bitte prüfe Vertragsende, Kündigungsfrist und Erinnerungstage.";
    return;
  }
  const id = $("expense-id").value || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
  const item = {
    id, name, amount: Math.round(amount * 100) / 100,
    cycle: $("expense-cycle").value,
    category: $("expense-category").value,
    date, active: $("expense-active").checked,
    contractEnd, noticeDays, reminderDays, contractNote: $("contract-note").value.trim()
  };
  const index = expenses.findIndex(expense => expense.id === id);
  if (index >= 0) expenses[index] = item;
  else expenses.push(item);
  save();
  closeForm();
  showToast(index >= 0 ? "Änderungen gespeichert." : "Fixkosten hinzugefügt.");
});

$("expense-list").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const item = expenses.find(expense => expense.id === button.dataset.id);
  if (!item) return;
  if (button.dataset.action === "edit") openForm(item);
  if (button.dataset.action === "toggle") {
    item.active = !item.active;
    save();
    showToast(item.active ? "Ausgabe aktiviert." : "Ausgabe pausiert.");
  }
  if (button.dataset.action === "delete" && confirm(`„${item.name}“ wirklich löschen?`)) {
    expenses = expenses.filter(expense => expense.id !== item.id);
    save();
    showToast("Fixkosten gelöscht.");
  }
});
$("export-button").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "fixkostenwaechter-export.json";
  a.click();
  URL.revokeObjectURL(url);
  showToast("Export wurde erstellt.");
});
$("import-button").addEventListener("click", () => $("import-file").click());
$("import-file").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    if (file.size > 5_000_000) throw new Error("Die Datei ist zu groß (maximal 5 MB).");
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data) || data.length > 10000 || !data.every(validExpense)) throw new Error("Die JSON-Datei enthält keine gültige Fixkostenliste.");
    if (new Set(data.map(x=>x.id)).size !== data.length) throw new Error("Die Datei enthält doppelte IDs.");
    if (!confirm(`Importiert werden ${data.length} Einträge. Alle aktuellen Einträge auf diesem Gerät werden ersetzt. Fortfahren?`)) return;
    expenses = data;
    selectedSavings.clear();
    save();
    showToast("Daten erfolgreich importiert.");
  } catch(err) { alert(`Import fehlgeschlagen: ${err.message}`); }
  finally { event.target.value = ""; }
});
$("reset-button").addEventListener("click", () => {
  if (!expenses.length) { showToast("Es sind keine Daten gespeichert."); return; }
  if (confirm("Alle gespeicherten Fixkosten auf diesem Gerät löschen?")) {
    expenses = [];
    save();
    showToast("Alle Daten wurden gelöscht.");
  }
});


function renderDashboard(active, monthly) {
  const withEnd = active.map(item => ({item, data: deadlineData(item)})).filter(x => x.data);
  const urgent = withEnd.filter(x => x.data.remaining >= 0 && x.data.remaining <= x.data.reminder);
  const expired = withEnd.filter(x => x.data.remaining < 0);
  const withoutEnd = active.length - withEnd.length;
  const stats = [
    ["Aktive Ausgaben", active.length],
    ["Mit Vertragsende", withEnd.length],
    ["Frist bald fällig", urgent.length],
    ["Frist überschritten", expired.length],
    ["Ohne Vertragsende", withoutEnd]
  ];
  $("contract-dashboard").innerHTML = stats.map(([name,count]) => `<div class="dashboard-stat"><span>${name}</span><strong>${count}</strong></div>`).join("");
  const now = new Date();
  const labels = Array.from({length:12},(_,i)=>{
    const d = new Date(now.getFullYear(),now.getMonth()+i,1);
    return new Intl.DateTimeFormat("de-DE",{month:"short",year:"2-digit"}).format(d);
  });
  $("forecast-total").textContent = `${money.format(monthly*12)} für 12 Monate (hochgerechnet)`;
  $("forecast-chart").innerHTML = labels.map((label,i) => `<div class="forecast-row"><span>${safeText(label)}</span><div class="forecast-track"><div class="forecast-fill" style="width:${monthly>0?100:0}%"></div></div><strong>${money.format(monthly)}</strong></div>`).join("");
}
function buildPrintReport() {
  const active = expenses.filter(x=>x.active);
  const monthly = active.reduce((sum,x)=>sum+monthlyAmount(x),0);
  const dated = active.map(item=>({item,data:deadlineData(item)})).filter(x=>x.data).sort((a,b)=>a.data.deadline-b.data.deadline);
  const categories = new Map();
  active.forEach(x=>categories.set(x.category||"Sonstiges",(categories.get(x.category||"Sonstiges")||0)+monthlyAmount(x)));
  const today = dateFmt.format(new Date());
  const rows = (headers, data) => `<table><thead><tr>${headers.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>${data.length?data.map(row=>`<tr>${row.map(x=>`<td>${safeText(x)}</td>`).join("")}</tr>`).join(""):`<tr><td colspan="${headers.length}">Keine Einträge</td></tr>`}</tbody></table>`;
  $("print-report-content").innerHTML = `<h1>FixkostenWächter – Vertragsbericht</h1><p>Erstellt am ${safeText(today)} · Nur lokal gespeicherte Daten</p><h2>Kostenüberblick</h2><p><strong>${money.format(monthly)} monatlich</strong> · ${money.format(monthly*12)} jährlich (hochgerechnet) · ${active.length} aktive Ausgaben</p><h2>Kategorien</h2>${rows(["Kategorie","Monatlich"],[...categories.entries()].sort((a,b)=>b[1]-a[1]).map(([name,sum])=>[name,money.format(sum)]))}<h2>Aktive Fixkosten</h2>${rows(["Name","Kategorie","Betrag","Intervall","Monatswert"],active.map(x=>[x.name,x.category||"Sonstiges",money.format(Number(x.amount)),cycleLabel(x.cycle),money.format(monthlyAmount(x))]))}<h2>Kündigungsfristen</h2>${rows(["Vertrag","Vertragsende","Kündigen bis","Status"],dated.map(({item,data})=>[item.name,dateFmt.format(data.end),dateFmt.format(data.deadline),data.remaining<0?"Frist überschritten":data.remaining===0?"Heute":`${data.remaining} Tage verbleibend`]))}<h2>12-Monats-Prognose</h2><p>${money.format(monthly*12)} als gleichbleibender Kosten-Durchschnitt; keine tatsächliche Zahlungsplanung. Vertragsbedingungen und Kündigungsfristen bitte separat prüfen.</p><p class="report-note">Dieser Bericht ist eine Übersicht und keine Rechtsberatung oder Kündigungsbestätigung.</p>`;
}
$("print-report").addEventListener("click",()=>{buildPrintReport();window.print();});

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
render();


// Version 5: Navigation ohne Seitenneuladung – alle Daten und Funktionen bleiben erhalten.
const VIEW_TITLES = {uebersicht:"Übersicht",fixkosten:"Fixkosten",sparanalyse:"Sparanalyse",vertraege:"Verträge & Fristen",prognose:"Prognose & Bericht",einstellungen:"Daten & Einstellungen"};
function closeMenu(){document.getElementById("sidebar").classList.remove("open");document.getElementById("sidebar-backdrop").hidden=true;document.getElementById("menu-toggle").setAttribute("aria-expanded","false");}
function showView(name){
  if(!Object.prototype.hasOwnProperty.call(VIEW_TITLES,name))name="uebersicht";
  document.querySelectorAll(".app-view").forEach(el=>el.hidden=el.dataset.view!==name);
  document.querySelectorAll(".nav-link").forEach(el=>el.setAttribute("aria-current",el.dataset.target===name?"page":"false"));
  document.getElementById("page-title").textContent=VIEW_TITLES[name];
  closeMenu();window.scrollTo(0,0);
  if(location.hash!=="#"+name)history.replaceState(null,"","#"+name);
}
document.querySelectorAll(".nav-link").forEach(button=>button.addEventListener("click",()=>showView(button.dataset.target)));
document.querySelectorAll("[data-go]").forEach(button=>button.addEventListener("click",()=>showView(button.dataset.go)));
document.getElementById("menu-toggle").addEventListener("click",()=>{const side=document.getElementById("sidebar");const open=!side.classList.contains("open");side.classList.toggle("open",open);document.getElementById("sidebar-backdrop").hidden=!open;document.getElementById("menu-toggle").setAttribute("aria-expanded",String(open));});
document.getElementById("sidebar-backdrop").addEventListener("click",closeMenu);
document.addEventListener("keydown",event=>{if(event.key==="Escape")closeMenu();});
document.getElementById("quick-add").addEventListener("click",()=>document.getElementById("add-button").click());
window.addEventListener("hashchange",()=>showView(location.hash.slice(1)));
showView(location.hash.slice(1)||"uebersicht");

// Die Kurzstatistik auf der Startseite verwendet dieselben Vertragsdaten wie das Dashboard.
const originalRenderDashboard=renderDashboard;
renderDashboard=function(active,monthly){
 originalRenderDashboard(active,monthly);
 const source=document.getElementById("contract-dashboard");
 const target=document.getElementById("overview-contract-stats");
 if(source&&target)target.innerHTML=source.innerHTML;
};
render();
