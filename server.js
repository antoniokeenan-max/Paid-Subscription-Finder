const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const CATALOG = [
  { name: 'Netflix', category: 'Streaming', plans: [15.49, 22.99], logo: 'N' },
  { name: 'Spotify Premium', category: 'Music', plans: [11.99], logo: 'S' },
  { name: 'Adobe Creative Cloud', category: 'Productivity', plans: [59.99], logo: 'A' },
  { name: 'Microsoft 365', category: 'Productivity', plans: [9.99], logo: 'M' },
  { name: 'Dropbox Plus', category: 'Cloud Storage', plans: [11.99], logo: 'D' },
  { name: 'YouTube Premium', category: 'Streaming', plans: [13.99], logo: 'Y' },
  { name: 'Amazon Prime', category: 'Shopping/Streaming', plans: [14.99], logo: 'P' },
  { name: 'Disney+', category: 'Streaming', plans: [13.99], logo: 'D+' },
  { name: 'GitHub Pro', category: 'Developer Tools', plans: [4.00], logo: 'G' },
  { name: 'Notion Plus', category: 'Productivity', plans: [10.00], logo: 'No' },
  { name: 'iCloud+', category: 'Cloud Storage', plans: [2.99, 9.99], logo: 'iC' },
  { name: 'ChatGPT Plus', category: 'AI Tools', plans: [20.00], logo: 'C' }
];

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Subscription lookup provider. Replace this mock implementation with a real,
// authorized data source for the signed-in user's own subscriptions.
async function searchSubscriptions(email) {
  const normalized = String(email || '').trim().toLowerCase();
  if (!normalized) return [];
  const rand = mulberry32(hashString(normalized));
  const count = 3 + Math.floor(rand() * 6); // 3-8 subscriptions
  const shuffled = [...CATALOG].sort(() => rand() - 0.5);
  const picked = shuffled.slice(0, count);
  const today = new Date();
  return picked.map((item, idx) => {
    const plan = item.plans[Math.floor(rand() * item.plans.length)];
    const monthsAgo = Math.floor(rand() * 36);
    const start = new Date(today);
    start.setMonth(start.getMonth() - monthsAgo);
    const next = new Date(today);
    next.setMonth(next.getMonth() + 1);
    return {
      id: `${hashString(normalized + item.name).toString(16)}-${idx}`,
      name: item.name,
      category: item.category,
      logo: item.logo,
      monthlyCost: Number(plan.toFixed(2)),
      currency: 'USD',
      billingCycle: 'Monthly',
      status: rand() > 0.12 ? 'Active' : 'Paused',
      startDate: start.toISOString().slice(0, 10),
      nextBillingDate: next.toISOString().slice(0, 10)
    };
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.get('/api/subscriptions', async (req, res) => {
  const email = String(req.query.email || '').trim();
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  const subscriptions = (await searchSubscriptions(email))
    .sort((a, b) => b.monthlyCost - a.monthlyCost);

  const totalMonthly = subscriptions.reduce((sum, s) => sum + s.monthlyCost, 0);
  res.json({
    email,
    totalMonthly: Number(totalMonthly.toFixed(2)),
    count: subscriptions.length,
    subscriptions,
    note: 'Results shown for the provided email.'
  });
});

app.listen(PORT, () => {
  console.log(`Subscription Finder running at http://localhost:${PORT}`);
});
