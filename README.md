# Tic · Tac · Toe

A small, dependency-light Tic-Tac-Toe app built with React + Vite. Ledger/notebook
visual theme, hand-drawn ink marks, running score tally saved to `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to Azure Static Web Apps

You have two easy options.

### Option A — Azure Portal (fastest, no CLI)

1. Push this folder to a GitHub repository.
2. In the [Azure Portal](https://portal.azure.com), create a new **Static Web App** resource.
3. Sign in with GitHub and pick the repo/branch when prompted.
4. Set the build details exactly like this:
   - **Build Presets:** `React` (or `Custom`)
   - **App location:** `/`
   - **Api location:** *(leave blank)*
   - **Output location:** `dist`
5. Click **Review + create**. Azure automatically commits a GitHub Actions
   workflow to your repo (this project already ships with an equivalent one at
   `.github/workflows/azure-static-web-apps.yml` — if Azure adds its own,
   just delete the duplicate and keep one) and it deploys within a couple of minutes.

### Option B — Azure CLI / SWA CLI

```bash
npm install -g @azure/static-web-apps-cli
npm run build
swa deploy ./dist --env production
```

The CLI will prompt you to log in and pick (or create) a Static Web App resource.

### Notes

- `staticwebapp.config.json` handles client-side routing fallback so
  refreshing the page never 404s (not strictly required for this single-page
  app today, but it's there if you add routes later).
- The included GitHub Actions workflow expects a repo secret named
  `AZURE_STATIC_WEB_APPS_API_TOKEN`. Azure creates this automatically when you
  provision the resource through the portal (Option A). If you create the
  resource another way, copy the deployment token from the resource's
  **Overview** page in the Azure Portal into a GitHub secret with that name.

## Project structure

```
├── src/
│   ├── App.jsx        # game logic + UI
│   ├── index.css       # theme
│   └── main.jsx        # React entry point
├── index.html
├── staticwebapp.config.json
├── .github/workflows/azure-static-web-apps.yml
└── package.json
```
