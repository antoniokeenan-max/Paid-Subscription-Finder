const form = document.getElementById('search-form');
const emailInput = document.getElementById('email');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');
const bodyEl = document.getElementById('results-body');
const summaryEmail = document.getElementById('summary-email');
const summaryCount = document.getElementById('summary-count');
const summaryTotal = document.getElementById('summary-total');
const noteEl = document.getElementById('note');
const searchBtn = document.getElementById('search-btn');

let costChart;
let categoryChart;

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

function renderTable(subscriptions) {
  bodyEl.innerHTML = subscriptions.map((s) => `
    <tr>
      <td><div class="service-cell"><span class="logo">${s.logo}</span><span>${s.name}</span></div></td>
      <td>${s.category}</td>
      <td><span class="badge ${s.status.toLowerCase()}">${s.status}</span></td>
      <td class="cost">${formatMoney(s.monthlyCost)}</td>
      <td>${s.billingCycle}</td>
      <td>${s.startDate}</td>
      <td>${s.nextBillingDate}</td>
    </tr>
  `).join('');
}

function buildCharts(subscriptions) {
  const labels = subscriptions.map((s) => s.name);
  const costs = subscriptions.map((s) => s.monthlyCost);
  const colors = ['#5b8cff','#34d399','#f59e0b','#f87171','#a78bfa','#22d3ee','#fb7185','#84cc16','#60a5fa','#f472b6'];

  const costCtx = document.getElementById('costChart');
  if (costChart) costChart.destroy();
  costChart = new Chart(costCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Monthly cost (USD)',
        data: costs,
        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: '#a8b0c7' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#a8b0c7', callback: (v) => '$' + v }, grid: { color: 'rgba(255,255,255,0.08)' } }
      }
    }
  });

  const byCategory = subscriptions.reduce((acc, s) => {
    acc[s.category] = (acc[s.category] || 0) + s.monthlyCost;
    return acc;
  }, {});
  const catLabels = Object.keys(byCategory);
  const catValues = catLabels.map((k) => Number(byCategory[k].toFixed(2)));

  const catCtx = document.getElementById('categoryChart');
  if (categoryChart) categoryChart.destroy();
  categoryChart = new Chart(catCtx, {
    type: 'doughnut',
    data: {
      labels: catLabels,
      datasets: [{
        data: catValues,
        backgroundColor: catLabels.map((_, i) => colors[i % colors.length]),
        borderColor: '#151b2f',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom', labels: { color: '#e8ecf7' } } }
    }
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  if (!email) return;

  setStatus('Searching for subscriptions...');
  searchBtn.disabled = true;
  resultsEl.classList.add('hidden');

  try {
    const res = await fetch(`/api/subscriptions?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Search failed.');

    // Ensure descending by monthly cost (server already sorts, but enforce on client too)
    const subscriptions = [...data.subscriptions].sort((a, b) => b.monthlyCost - a.monthlyCost);

    summaryEmail.textContent = data.email;
    summaryCount.textContent = String(data.count);
    summaryTotal.textContent = formatMoney(data.totalMonthly);
    noteEl.textContent = data.note;

    renderTable(subscriptions);
    buildCharts(subscriptions);

    resultsEl.classList.remove('hidden');
    setStatus(`Found ${data.count} subscription(s) for ${data.email}.`);
  } catch (err) {
    setStatus(err.message || 'Something went wrong.', true);
  } finally {
    searchBtn.disabled = false;
  }
});
