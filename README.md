# ai-business

Shared AI skills, brand rules, and guardrails for ReflecToes, Oh Susannah, and UFO Tops.
Rules for agents: [AGENTS.md](AGENTS.md). Access and permissions: [docs/access.md](docs/access.md).

## Team member setup (Claude Code, Windows)
1. Accept the GitHub invite email for `sdtdb/ai-business`.
2. In PowerShell, install the tools and sign in to GitHub (pick GitHub.com, HTTPS, log in with a browser):
   ```
   winget install --id Git.Git -e
   winget install --id GitHub.cli -e
   gh auth login
   gh auth setup-git
   ```
3. Open Claude Code in any folder and paste this:
   > Clone https://github.com/sdtdb/ai-business into %USERPROFILE%\AI\ai-business using gh. Then copy .env.example to .env in that folder (leave values blank), and create the empty file %APPDATA%\shopify-ai-toolkit\opt-out. Tell me when done. Do not change anything else.
4. Still in Claude Code, install the skills (skip if Ben's managed settings already did it):
   ```
   /plugin marketplace add sdtdb/ai-business
   /plugin install business@ai-business
   ```
   Then `/plugin` > **Marketplaces** > `ai-business` > **Enable auto-update**, so new skills arrive on their own.
5. Fill `.env` with only the values Ben shares through the password manager. Never paste them into chat.
6. Restart Claude Code and run `/skills`. You should see `business:` skills such as `business:seo-page`.

## Staying in sync
- Ben's managed settings pull this repo every time Claude Code starts. Without them, run `git pull` in this folder weekly.
- Skills update through plugin auto-update.

## Changing skills or rules
Ask Claude Code: "In %USERPROFILE%\AI\ai-business, make a branch, apply this change, and open a pull request with gh (fork if needed)." You have read access, so gh forks the repo and opens the PR from your copy. Ben reviews and merges. Changes reach Ben's vault the next night, and his edits come back the same way.

## What syncs with Ben's vault
Every folder in `skills/` and every file listed in `vault-sync.json`, both directions, nightly.
If both sides changed the same file, nothing is overwritten; Ben gets a conflict note to merge by hand.

## Tool support
| Tool | How it reads this repo |
|---|---|
| Claude Code | Plugin skills, `CLAUDE.md` |
| Codex / ChatGPT | `AGENTS.md`, `skills/` |
| Antigravity / Gemini | `GEMINI.md`, `AGENTS.md`, `skills/` |
