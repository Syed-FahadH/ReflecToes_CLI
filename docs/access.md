# Access setup (Ben)

Rule of thumb: give each person their own login or token, scoped to the job, so it can be revoked alone.
The real guardrails are the permissions on each platform. Claude settings only catch mistakes.

## Shopify
1. **Staff account** on each store (not collaborator, not owner). Allow: Products, Online Store (pages, blogs, navigation, themes), Files, Analytics. Leave off: Orders, Customers, Finances, Settings, Apps, Staff, Payments, Discounts.
   The Shopify CLI and the Shopify AI Toolkit sign in as this account, so whatever it cannot do, Claude cannot do.
2. **Themes through Git only.** Connect each theme to GitHub with Shopify's GitHub integration. He works in his own dev theme (`shopify theme dev`) and opens pull requests. Branch protection on `main` requires Ben's review. Only Ben publishes.
3. **Custom app per person, only if he needs scripts** (Dev Dashboard). Scopes:

| Give | For |
|---|---|
| `read_products`, `write_products` | SEO titles, descriptions, product metafields (also allows price edits; start with read only if that worries you) |
| `read_content`, `write_content` | Blogs, articles, pages |
| `read_online_store_navigation`, `write_online_store_navigation` | Menus (no undo, see AGENTS.md rule 3) |
| `read_metaobjects`, `write_metaobjects` | Structured content |
| `read_files`, `write_files` | Images |
| `read_themes` | Read only. Theme changes go through Git |
| `read_reports` | ShopifyQL analytics |
| `read_inventory` | Context only |

Never: `write_themes`, `read_customers`, `read_orders`, `write_discounts`, `write_price_rules`, `write_shipping`, `write_script_tags`, anything payments or staff.

## Amazon SP-API
SP-API has no true read-only mode. Access is by role, and the roles that read listings and pricing (Product Listing, Pricing) also allow writes.
- **Recommended:** do not give him SP-API keys. Give him the data through sales-dashboard or a read-only build of the SP-API MCP server (allowlist of GET tools only, running on the server with Ben's credentials, write tools not registered).
- **Seller Central:** add him as a user with "View" (not "View & Edit") on only the pages he needs. Users cannot create SP-API apps without developer permissions, so leave those off.

## Amazon Ads
- Invite him in Advertising Console > User management with a **view-only** role on the brands he needs. API calls made with a token he authorizes inherit that role, so writes fail.
- Better for now: same as SP-API, read the data through sales-dashboard rather than holding his own Ads tokens.

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
