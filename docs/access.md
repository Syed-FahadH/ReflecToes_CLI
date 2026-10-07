# Access setup (Ben)

Give each team member their own login or token, scoped to the job, so it can be revoked alone.
The real guardrails are platform permissions. Claude settings only catch mistakes.

## GitHub (free plan): read access plus forks
Rulesets are not enforced on private repos on the free plan. The free equivalent is to give team members **Read** and have them work from a fork, so only Ben can change `main`.
1. Org settings (github.com/organizations/sdtdb/settings) > **Member privileges** > check **Allow forking of private repositories** > Save.
2. Each repo > **Settings** > **Collaborators and teams** > **Add people** > role **Read**.
3. The team member clones the repo normally. When they ask Claude to open a pull request, `gh pr create` forks the repo to their account and opens the PR from there.
4. Ben reviews and merges. The nightly vault sync pushes to `main` as Ben, so it keeps working.
Upgrade path: GitHub Team (per-user monthly fee) enforces rulesets if you later want Write access with a required review.

## Shopify
1. **Staff account** per store. Allow: Products, Online Store (pages, blogs, navigation, themes), Files, Analytics. Leave off: Orders, Customers, Finances, Settings, Apps, Staff, Payments, Discounts.
2. **One custom app per person per store** (Dev Dashboard), scoped for SEO:

| Scope | For |
|---|---|
| `read_products`, `write_products` | Product and collection SEO fields, body copy, image alt text, product metafields. Also allows price edits; no scope separates them |
| `read_content`, `write_content` | Pages, blogs, articles, and their SEO fields |
| `read_online_store_navigation`, `write_online_store_navigation` | Menus and URL redirects (menus have no undo, AGENTS.md rule 3) |
| `read_files`, `write_files` | Upload images, set file alt text |
| `read_metaobjects`, `write_metaobjects`, `read_metaobject_definitions` | FAQ blocks and other structured content |
| `read_themes` | Read theme files and find draft theme IDs |
| `read_reports` | ShopifyQL sales and traffic for prioritizing pages |
| `read_translations`, `write_translations` | Only if you sell in more than one language |

Never: `write_themes` (it also allows publish and delete), `read_customers`, `read_orders`, `write_orders`, `write_discounts`, `write_price_rules`, `write_shipping`, `write_script_tags`, `write_inventory`, anything payments or staff.

## Theme repos (one per brand)
Theme edits go through Git so Ben's merge is the only way code reaches the live theme.

| Brand | Repo | State |
|---|---|---|
| ReflecToes | `sdtdb/reflectoes-theme` | Exists. Confirm `main` matches the live theme before connecting |
| Oh Susannah | `sdtdb/ohsusannah-theme` | To create |

**Create a theme repo** (Ben, once per brand, in PowerShell):
```powershell
mkdir "$env:USERPROFILE\AI\ohsusannah-theme"; cd "$env:USERPROFILE\AI\ohsusannah-theme"
shopify theme pull --live --store oh-susannahs-pillowcases.myshopify.com
git init -b main; git add -A; git commit -m "Live theme baseline"
gh repo create sdtdb/ohsusannah-theme --private --source . --push
```
Theme files must sit at the repo root (`assets/`, `config/`, `layout/`, `sections/`, ...).

**Connect it to Shopify** (Ben, per store):
1. Shopify admin > **Online Store** > **Themes** > **Add theme** > **Connect from GitHub**.
2. Log in to GitHub and install the Shopify app on the `sdtdb` org, giving it access to the theme repos.
3. Pick the repo and branch `main`. Shopify adds a new theme to the library that stays in sync with `main`.
4. Preview it, then **Publish**. From now on, merging a PR into `main` updates the live theme, and edits made in the theme editor commit back to `main`.
Theme library limit is 20. If it is full, back up and delete an old unpublished theme first.

**Team member workflow:** `shopify theme dev` for a live preview, or `shopify theme push --unpublished` for a shareable draft, then a PR. Ben previews the draft, merges, and Shopify deploys.

## Amazon Ads API, read only
The Ads API has no read-only scope. Access follows the Amazon user who authorizes the token: a user with **View** on Campaign Manager gets a token that can read reports and campaigns but whose writes are rejected.
1. Seller Central > Settings > **User Permissions** > team member > **Manage Permissions** > Advertising > **Campaign Manager: View**. Do this per seller account. If they currently have View & Edit, the token would be able to write.
2. Recommended: do not hand out Ads API tokens at all. Ben's API app secret would have to be shared to refresh them. Instead expose reporting through sales-dashboard or a read-only MCP server running on Ben's machine (same plan as SP-API).
3. If a direct token is needed anyway: the team member signs in to Login with Amazon with their own Amazon user during the consent step, and the token goes in their `.env`. Before trusting it, have Ben watch one write attempt against an already paused test campaign and confirm Amazon rejects it.

## Amazon SP-API
No read-only mode exists. The roles that read listings and pricing also allow writes. Serve data through a read-only build of the SP-API MCP server (write tools not registered) instead of issuing keys.

## Sharing environment variables
- Never send Ben's `.env`. Each person builds their own from `.env.example` with tokens issued to them.
- Hand values over through a password manager shared vault (1Password or Bitwarden) containing only that person's items. 1Password can inject values without writing to disk: `op run --env-file .env -- <command>`.
- Rotate everything a person had access to when they leave.

## Claude Team plan vs this repo
| Need | Repo alone | Team plan adds |
|---|---|---|
| Shared skills and brand rules | Plugin marketplace | Org-wide skills in claude.ai too (web, desktop, mobile) |
| Guardrail settings | Managed settings file on each PC (a local admin can remove it) | Server-managed settings from the admin console |
| Connectors (Shopify, Drive, Gmail) | Each person sets up their own | Admin allows or blocks connectors org-wide |
| Offboarding | Remove GitHub, Shopify, password manager access | Plus one-click seat removal |
| Billing and data terms | Separate personal accounts | One bill, business data terms |

## Applying the managed files on a team PC (admin PowerShell)
```powershell
New-Item -ItemType Directory -Force "C:\Program Files\ClaudeCode"
Copy-Item admin\managed-settings.json "C:\Program Files\ClaudeCode\managed-settings.json"
Copy-Item admin\managed-CLAUDE.md "C:\Program Files\ClaudeCode\CLAUDE.md"
```
Check the current paths in the Claude Code settings docs first. On a Team plan, paste the settings JSON into the admin console instead.
