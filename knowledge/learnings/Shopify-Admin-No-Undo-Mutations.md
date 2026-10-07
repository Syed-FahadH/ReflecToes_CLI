---
type: learning
summary: menuUpdate and other whole-tree Shopify mutations silently delete anything you didn't fetch
applies_to: Shopify Admin GraphQL, menus, settings
updated: 2026-09-16
---
# Shopify Admin API whole-tree mutations have no undo

## Problem (2026-07-11)
An agent fetched a 2-level menu tree and ran `menuUpdate`. The API replaced the whole tree, silently deleting the 3rd level (dozens of mega-menu items). Recovery needed the Wayback Machine.

## Rule
1. Query one level deeper than you think exists: `items { items { items { items { title } } } }`.
2. Save the full "before" JSON (chat or a file) before any whole-tree mutation.
3. Treat whole-object replacements like a DELETE. See [[Shopify-Liquid-Rules]].
