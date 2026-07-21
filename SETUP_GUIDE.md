# Setup Guide — Activating the Dynamic Bits

Your GitHub profile README lives in a special repo named exactly like your username:
**`Biraj2004/Biraj2004`**. If that repo doesn't exist yet, create it (public) and it'll
show up automatically at the top of your profile page.

## 1. Drop in the README
- Put `README.md` in the root of the `Biraj2004/Biraj2004` repo.
- Everything under **GitHub Stats**, **Streak**, **Top Languages**, **Trophies**, and
  **Profile Views** works immediately — those are all live third-party image endpoints
  (github-readme-stats, streak-stats, github-profile-trophy, komarev) that regenerate
  on every page load. No setup needed.

## 2. Activate the animated snake 🐍
This is the unique touch — a snake that "eats" its way through your real contribution graph.
1. In `Biraj2004/Biraj2004`, go to **Settings → Actions → General** and enable
   "Read and write permissions" for the `GITHUB_TOKEN`.
2. Create `.github/workflows/snake.yml` and paste the contents of the `snake.yml` file
   provided alongside this README.
3. Run the workflow once manually (Actions tab → Generate Snake Animation → Run workflow).
4. It will create an `output` branch with the SVG — the README already points to it, so
   the snake will appear and refresh daily on its own.

## 3. (Optional) Activate the WakaTime weekly breakdown
The "Weekly Dev Breakdown" section is a placeholder until you connect WakaTime:
1. Create a free account at wakatime.com and grab your API key.
2. Add it as a repo secret named `WAKATIME_API_KEY`.
3. Add the `athul/waka-readme` action (or similar) as a second workflow targeting the
   `<!--START_SECTION:waka--> ... <!--END_SECTION:waka-->` markers already in the README.
If you'd rather skip this, just delete that section — everything else works without it.

## 4. Customize
- Swap the `desc=` text in the top banner URL any time your role changes.
- Trophy `title=` list controls which badges are prioritized first.
- All colors are keyed to your signature `#4ade80` green accent for consistency with
  your portfolio (iambiraj.vercel.app).
