# How to publish this app (simple steps)

This app is a **Node.js website** (it includes a small server). Because of that, it must be published to a host that can run Node.js (not a "static files only" host).

> I can't publish it for you from here because publishing requires signing in to your own hosting/GitHub accounts. The steps below are the easiest way to do it yourself.

## Easiest option: Render (free/low-cost web service)
1. **Create accounts**
   - GitHub: https://github.com/ (if you don't have one)
   - Render: https://render.com/

2. **Put this project on GitHub** (no command line needed)
   - In GitHub, click **New repository**, name it (e.g. `subscription-finder`), and create it.
   - On the repo page click **Add file → Upload files**.
   - Drag and drop these project files/folders from `C:\Users\Game-PC\Documents\Default Project`:
     - `package.json`, `server.js`, `README.md`, `DEPLOY.md`, `.gitignore`
     - the `public` folder (with `index.html`, `styles.css`, `app.js`, `bg-bot.svg`)
   - Click **Commit changes**. (Do **not** upload `node_modules` if it exists.)

3. **Deploy on Render**
   - In Render, click **New + → Web Service**.
   - Choose **Build and deploy from a Git repository** and connect your GitHub repo.
   - Settings:
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
   - Click **Create Web Service** / **Deploy**.
   - Wait for the deploy to finish; Render will give you a public URL like `https://your-app.onrender.com`.

4. **Open your site**
   - Visit the Render URL. The search, chart, and sorting should work.

## Important: "real" subscription results
- The **demo data message has been removed**, but the app still uses the mock lookup in `server.js` (`searchSubscriptions()`).
- There is **no public API** that can return someone's paid subscriptions from just an email address (billing data is private).
- To show real subscriptions, `searchSubscriptions()` in `server.js` must be replaced with a real, **authorized** data source for your own accounts (for example, an integration you sign into/connect that you own). This usually requires developer setup, API keys/permissions, and compliance with privacy/terms—it's not something that can be enabled automatically.
- **Use only for your own subscriptions.**

## If you want someone else to handle the technical parts
If you're not comfortable with the steps above, a developer or a technically inclined friend can:
- upload this folder to GitHub and deploy it on Render/Railway/etc. (about 10–15 minutes), and/or
- implement a real authorized provider inside `searchSubscriptions()` if you have a specific service/integration in mind and the necessary access/credentials.

## Running it on your own computer (if Node.js is installed)
```bash
npm install
npm start
```
Then open http://localhost:3000
