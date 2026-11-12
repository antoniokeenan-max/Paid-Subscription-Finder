# Subscription Finder (Demo)

A website-based app that takes an email address and displays associated **paid online subscriptions** on a graphical dashboard. Results are shown in **descending order by monthly cost**.

> **Note:** This is a prototype using mock/demo data generated locally from the provided email. It does **not** access real email accounts or third-party subscription records.

## Features
- Search by email address
- Summary stats (subscriptions found, total monthly cost)
- Graphical charts (monthly cost by subscription, spending by category)
- Detailed subscription table sorted by monthly cost (descending)

## Tech stack
- Node.js + Express (backend/API + static file serving)
- Vanilla HTML/CSS/JavaScript (frontend)
- Chart.js (charts via CDN)

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.
4. Enter an email address and click **Search**.

## API
- `GET /api/subscriptions?email=<email>`  
  Returns mock subscription results for the email, sorted by `monthlyCost` descending.
