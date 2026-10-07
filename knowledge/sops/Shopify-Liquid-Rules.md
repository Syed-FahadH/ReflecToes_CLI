---
type: sop
summary: Shopify page template section rules, theme API quirks, active location ID, no-undo mutation safety
updated: 2026-09-16
---
# Shopify rules

## Page templates
- On `page.*.json`, `main` is always the native `main-page` type with empty blocks.
- Custom HTML, CSS, and JS go in a separate `custom-liquid` section placed after `main` in the order array.
- Never assign `custom-liquid` to `main`. Putting content in the Page body field has caused problems before.
- `themeFilesUpsert` works on unpublished duplicates only. `themeDuplicate` returns `newTheme`.
- Don't open Customize on draft themes with custom sections before publishing.
- Active location ID: `gid://shopify/Location/60933210183`.

## Destructive mutations
Menus, nested settings, and bulk field replacements have no undo. See [[Shopify-Admin-No-Undo-Mutations]].
