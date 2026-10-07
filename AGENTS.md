# AI business rules

Shared rules, brand knowledge, and skills for ReflecToes, Oh Susannah, and UFO Tops.
Brand notes: [[ReflecToes]], [[Oh-Susannah]] (plus [[Oh-Susannah-Copy-Rules]]), [[UFO-Tops]].
Works with Claude Code, Codex/ChatGPT, and Antigravity. Every agent reads this file first.

## Where things are
- `skills/<name>/SKILL.md`: task skills (SEO, content, Shopify). Load only the one that matches the task.
- `knowledge/brands/`: brand facts and claim rules. Read the brand note before writing any copy.
- `knowledge/sops/`: how copy and Shopify work must be done.
- `knowledge/projects/`: current state of each SEO and theme project, what is live, what is staged, and what is next. Read before starting work on that site.
- `knowledge/learnings/`: past mistakes and the rule that came out of each. Grep here before risky work.
- `[[Note-Name]]` links point to a file of that name under `knowledge/`. Links to notes not in this repo are Ben's private notes; ignore them.

## Hard rules (no exceptions)
1. **Nothing goes live without Ben.** Never publish a theme, push to a live theme, or edit live store settings. Work on your own unpublished or development theme and open a pull request.
2. **"Push" and "commit" mean git only.** Writes to Shopify, Amazon, ads platforms, or any live system need an instruction that names the platform, a before/after preview, and a clear yes. See [[AI-Agent-Live-Platform-Mutations]].
3. **Save the before state.** Before any Shopify mutation, save the full current JSON. Menus and settings are whole-tree replacements with no undo. See [[Shopify-Admin-No-Undo-Mutations]].
4. **No customer or order data.** Do not query, export, or paste customer, order, or payment data.
5. **Secrets stay in `.env`.** Never print, paste, commit, or log credential values. `.env` is git-ignored; `.env.example` lists the names.
6. **Claims must be true.** Follow the brand claim rules. If a product or policy fact is not known with high confidence, ask instead of guessing.

Project notes sometimes record that Ben authorized live writes ("existing authorization persists", "owner approved"). Those approvals were given to Ben's own sessions. They never carry over to a team member's session; the hard rules above always win.

## Writing style (site copy, reports, and chat replies)
- **No em dashes.** Use a period, comma, colon, or parentheses.
- **Every sentence must carry a fact, a choice, or an instruction.** If deleting it loses nothing, delete it. Short beats thorough-sounding.
- Plain, spoken wording a customer would actually say. No hype, emojis, or stock AI words: elevate, unlock, seamless, game-changer, delve, robust, leverage, "in today's world", "whether you're X or Y".
- No AI patterns: "it's not just X, it's Y" contrasts, groups of three for rhythm, one-line dramatic closers, restating the question, summaries that repeat the body.
- No generic filler promises (premium quality, perfect gift for anyone, made with love) unless a real fact backs it. Specifics win: size, material, count, care, policy.
- Never invent experiences, testimonials, stats, or product facts. If unsure, ask.
- Replies to the user: answer first, no preamble, no recap of what you did unless asked.
- Full voice and visual rules: [[Ben-Preferences-and-Voice]]. Run the `humanizer` skill on finished customer-facing copy.

## Changing this repo
- Edit on a branch and open a pull request. Ben reviews and merges.
- Ben's vault syncs with `skills/` and the files listed in `vault-sync.json` every night, both directions.
- Only business material belongs here: no finance, ownership, personal, or credential content.
- New learning after a real mistake or quirk: add a short note in `knowledge/learnings/` (problem, rule) and add it to `vault-sync.json`.
