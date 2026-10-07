# ai-business

Shared AI skills, brand rules, and guardrails for ReflecToes, Oh Susannah, and UFO Tops.
Rules for agents: [AGENTS.md](AGENTS.md). Access and permissions: [docs/access.md](docs/access.md).

## Team member setup (Claude Code)
1. Accept the GitHub invite to this repo.
2. Clone it to the standard location:
   ```
   git clone https://github.com/sdtdb/ai-business "%USERPROFILE%\AI\ai-business"
   ```
3. In Claude Code, install the skills:
   ```
   /plugin marketplace add sdtdb/ai-business
   /plugin install business@ai-business
   ```
   (Skipped if Ben's managed settings already enable it.)
4. Copy `.env.example` to `.env` and fill in only the values Ben gives you through the password manager.
5. Run `git pull` in this folder at the start of each week, and `/plugin marketplace update ai-business` in Claude Code.

## Changing skills or rules
Branch, edit, open a pull request. Ben merges. Changes reach Ben's vault the next night, and his edits come back the same way.

## What syncs with Ben's vault
Every folder in `skills/` and every file listed in `vault-sync.json`, both directions, nightly.
If both sides changed the same file, nothing is overwritten; Ben gets a conflict note to merge by hand.

## Tool support
| Tool | How it reads this repo |
|---|---|
| Claude Code | Plugin skills, `CLAUDE.md` |
| Codex / ChatGPT | `AGENTS.md`, `skills/` |
| Antigravity / Gemini | `GEMINI.md`, `AGENTS.md`, `skills/` |
