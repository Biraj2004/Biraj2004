# Self-Hosted GitHub Profile Engine — Complete Setup Guide

This repository contains a **100% self-hosted, automated profile analytics engine** that generates live vector profile cards ([`profile/github-stats.svg`](file:///e:/01.%20GitHub%20Repo%20Projects/01.%20My%20Portfolio/Biraj2004/profile/github-stats.svg) and [`profile/github-streak.svg`](file:///e:/01.%20GitHub%20Repo%20Projects/01.%20My%20Portfolio/Biraj2004/profile/github-streak.svg)) with private contribution support and zero dependence on third-party servers.

---

## How It Works

1. **Self-Hosted Generator Script** (`.github/scripts/generate-stats.js`):
   - Queries GitHub's GraphQL & REST APIs.
   - Calculates **All-Time Contributions (`1,401`)**, **Current Year Contributions (`931`)**, **Rolling 1-Year Contributions (`1,301`)**, **Current Streak (`8 days`)**, **Longest Streak (`25 days`)**, PRs, Issues, and Stars.
   - Renders custom SVG vector cards matching your signature `#4ade80` emerald green theme.

2. **Automated 6-Hour Workflow** (`.github/workflows/stats.yml`):
   - Runs automatically on a 6-hour cron schedule (`0 */6 * * *`) and on every push to `main`.
   - Commits updated SVGs directly to `main` so your GitHub Profile README updates live 24/7.

---

## Step-by-Step Setup Guide

### Step 1: Create & Save Your GitHub `PAT_TOKEN`

To include private repository commits, issues, and PRs in your contribution counts and streak calculations:

1. Go to **GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)**.
2. Click **Generate new token (classic)**.
3. Set Note to `Profile Stats Generator`.
4. Select the following scopes:
   - `repo` (Full control of private repositories)
   - `read:user` (Read user profile data)
5. Click **Generate token** and copy the generated token string.
6. Go to your **`Biraj2004/Biraj2004` repository → Settings → Secrets and variables → Actions**.
7. Click **New repository secret**:
   - **Name**: `PAT_TOKEN`
   - **Secret**: Paste your copied token.
8. On your main GitHub profile page, click the **Contribution settings** dropdown (above your green contribution graph) and ensure **"Include private contributions"** is checked.

---

### Step 2: Enable GitHub Actions Permissions

1. Go to your repository **Settings → Actions → General**.
2. Scroll down to **Workflow permissions**.
3. Select **Read and write permissions**.
4. Check **"Allow GitHub Actions to create and approve pull requests"**.
5. Click **Save**.

---

### Step 3: Trigger Initial Workflow Build

1. Go to the **Actions** tab in your repository.
2. Select **Generate GitHub Profile Stats & Streak** from the left sidebar.
3. Click **Run workflow → Run workflow**.
4. Within ~30 seconds, the workflow will generate and commit fresh `profile/github-stats.svg` and `profile/github-streak.svg` files to your `main` branch.

---

## Customization & Tech Stack Icons

### Tech Stack Grid (`README.md`)

The README features 24 skill icons formatted into 3 perfectly balanced rows (8 icons per row):

```html
<div align="center">
  <img
    src="https://skillicons.dev/icons?i=react,nextjs,ts,js,html,css,tailwind,nodejs,java,androidstudio,kotlin,spring,express,mongodb,postgres,python,cpp,git,github,githubactions,postman,vscode,figma,latex&perline=8"
  />
</div>
```

- To add or modify skills, edit the `i=` parameter list separated by commas.
- Keep `perline=8` to maintain the 8-column symmetric layout.

---

## Local Execution (Optional)

If you want to run the generator script locally on your machine:

```bash
# Set your token (Optional: for private repo access)
$env:PAT_TOKEN="your_github_pat_token_here"

# Run the generator script
node .github/scripts/generate-stats.js
```

The script will generate local copies under `profile/github-stats.svg` and `profile/github-streak.svg`.

---

## Card Dimension & Layout Specifications

| Card              | SVG File                    | Width   | Height  | Key Metrics Displayed                                                                              |
| ----------------- | --------------------------- | ------- | ------- | -------------------------------------------------------------------------------------------------- |
| **GitHub Stats**  | `profile/github-stats.svg`  | `495px` | `270px` | Stars, All-Time Contribs (`1,401`), 2026 Contribs (`931`), PRs, Merged %, Issues, Rank A Badge     |
| **GitHub Streak** | `profile/github-streak.svg` | `495px` | `205px` | Hero Flame Badge, 1-Year Contribs (`1,301`), Current Streak (`8 days`), Longest Streak (`25 days`) |
