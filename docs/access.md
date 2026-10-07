# Access setup (Ben)

Rule of thumb: give each person their own login or token, scoped to the job, so it can be revoked alone.
The real guardrails are the permissions on each platform. Claude settings only catch mistakes.

## Shopify
1. **Staff account** on each store (not collaborator, not owner). Allow: Products, Online Store (pages, blogs, navigation, themes), Files, Analytics. Leave off: Orders, Customers, Finances, Settings, Apps, Staff, Payments, Discounts.
   The Shopify CLI and the Shopify AI Toolkit sign in as this account, so whatever it cannot do, Claude cannot do.
2. **Themes through Git only.** Connect each theme to GitHub with Shopify's GitHub integration. He works in his own dev theme (`shopify theme dev`) and opens pull requests. Branch protection on `main` requires Ben's review. Only Ben publishes.
3. **One custom app per person per store** (Dev Dashboard), scoped for SEO work:

| Scope | For |
|---|---|
| `read_products`, `write_products` | Product and collection SEO title/description, body copy, image alt text, product metafields. Also allows price edits; no scope separates them |
| `read_content`, `write_content` | Pages, blogs, articles, and their SEO fields |
| `read_online_store_navigation`, `write_online_store_navigation` | Menus and URL redirects (menus have no undo, AGENTS.md rule 3) |
| `read_files`, `write_files` | Upload images, set file alt text |
| `read_metaobjects`, `write_metaobjects`, `read_metaobject_definitions` | FAQ blocks and other structured content |
| `read_themes` | Read theme files and find draft theme IDs |
| `write_themes` | **Optional, see below** |
| `read_reports` | ShopifyQL sales and traffic for prioritizing pages |
| `read_translations`, `write_translations` | Only if you sell in more than one language |

Never: `read_customers`, `read_orders`, `write_orders`, `write_discounts`, `write_price_rules`, `write_shipping`, `write_script_tags`, `write_inventory`, anything payments or staff.

**Theme writes, drafts only.** No Shopify scope or staff permission limits theme edits to unpublished themes. `write_themes` also allows `themePublish` and `themeDelete`. Two options:
- **Recommended:** leave `write_themes` off the API key. He edits themes with the Shopify CLI against his own unpublished theme (`shopify theme dev`, `shopify theme push --unpublished`), commits to a branch, and opens a PR. The CLI asks before touching the live theme, and the managed settings block `theme publish` and live pushes.
- If he needs API theme edits for bulk scripts: add `write_themes`, keep the managed deny rules, and keep the live theme connected to GitHub `main` so any change to it shows up as a commit you can revert.

## Amazon SP-API
SP-API has no true read-only mode. Access is by role, and the roles that read listings and pricing (Product Listing, Pricing) also allow writes.
- **Recommended:** do not give him SP-API keys. Give him the data through sales-dashboard or a read-only build of the SP-API MCP server (allowlist of GET tools only, running on the server with Ben's credentials, write tools not registered).
- **Seller Central:** add him as a user with "View" (not "View & Edit") on only the pages he needs. Users cannot create SP-API apps without developer permissions, so leave those off.

## Amazon Ads (view only)
Seller accounts control Ads access from Seller Central:
1. Seller Central > Settings (gear) > **User Permissions** > enter his email > **Invite**.
2. After he accepts, click **Manage Permissions** on his row.
3. Under **Advertising**, set **Campaign Manager** to **View**. Leave every other row at **None** unless he needs it (Brand Analytics: View is useful for SEO keyword work).
4. Repeat per seller account (ReflecToes and Oh Susannah are separate).
He then sees campaigns at advertising.amazon.com but cannot change bids, budgets, or campaigns. If the Advertising row is missing, use advertising.amazon.com > Settings > **User management** > Invite user > **View only** (labels move around; check current Amazon help if they differ).
An Ads API token he authorizes inherits his view-only access, but read the data through sales-dashboard first rather than giving him API tokens.

## GitHub repo access and branch protection
1. github.com/sdtdb/ai-business > **Settings** > **Collaborators** > **Add people** > his GitHub username > role **Write**.
2. **Settings** > **Rules** > **Rulesets** > **New ruleset** > **New branch ruleset**:
   - Name `protect main`, Enforcement **Active**.
   - **Bypass list** > Add bypass > **Repository admin** (that is you, and it lets the nightly vault sync keep pushing to `main`).
   - Target branches > **Include default branch**.
   - Check **Restrict deletions**, **Require a pull request before merging** (required approvals **1**), **Block force pushes**.
   - **Create**.
3. Do the same on each theme repo (`reflectoes-theme`, `OS-Shopify`).
Rulesets on private repos need a paid GitHub plan (Pro for a personal account, Team for an organization). Without it the ruleset saves but is not enforced; the page shows a warning if so.

## Sharing environment variables
- Never send Ben's `.env`. It holds finance, Etsy, Amazon, and AI keys he does not need.
- His machine gets his own `.env` built from `.env.example`, holding only tokens issued to him.
- To hand over a value, use a password manager shared vault (1Password Business or Bitwarden Teams): one shared vault named "AI Business" with only his items. 1Password can inject values without writing them to disk: `op run --env-file .env -- <command>`.
- Rotate anything he had access to when he leaves.

## Claude Team plan vs this repo
| Need | Repo alone | Team plan adds |
|---|---|---|
| Shared skills and brand rules | Yes, via plugin marketplace | Org-wide skills in claude.ai too (web, desktop, mobile) |
| Guardrail settings | Managed settings file on his PC (he is admin, so he can remove it) | Server-managed settings pushed from the admin console |
| Connectors (Shopify, Drive, Gmail) | Each person sets up their own | Admin allows or blocks connectors org-wide |
| Offboarding | Remove GitHub, Shopify, password manager access | Plus one-click removal of his Claude seat and history |
| Usage and billing | Separate personal bills | One bill, usage dashboard |
| Data terms | Personal account terms | Business terms, no training on your data by default |

The repo covers skills and rules for every tool, including ChatGPT and Antigravity. Team covers control and ownership of the Claude account itself. They work together: keep the repo either way.

## Applying the managed files on his PC (admin PowerShell)
```powershell
New-Item -ItemType Directory -Force "C:\Program Files\ClaudeCode"
Copy-Item admin\managed-settings.json "C:\Program Files\ClaudeCode\managed-settings.json"
Copy-Item admin\managed-CLAUDE.md "C:\Program Files\ClaudeCode\CLAUDE.md"
```
Check the current paths in the Claude Code settings docs first; on a Team plan, paste the settings JSON into the admin console instead.
