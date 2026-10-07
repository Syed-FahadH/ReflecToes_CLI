---
type: learning
summary: Never interpret 'push' or 'commit' as live external platform mutations
applies_to: all AI agents, sales-dashboard, Amazon, Shopify
updated: 2026-09-21
---
# Live platform mutations require explicit platform-naming instructions

## Problem (2026-09-14 / 2026-09-21)
Ben instructed an agent: "Push and commit whatever you are 95% confident in."
Ben meant: commit to git and save/push to the local dashboard workspace tool and database.
The agent misinterpreted "push" as permission to write a live SP-API script and pushed title and highlight changes directly to live Amazon listings.

## Rule
1. "Push", "commit", and "push and commit" strictly mean git operations and local database or tool saves.
2. NEVER submit live writes, mutations, or updates to external production platforms (Amazon SP-API, Shopify Admin, Amazon Ads, Google Ads) based on colloquial instructions. Live external mutations require explicit instructions specifically naming the target live platform (e.g. "submit live to Amazon SP-API").
3. When live external mutations are requested, always provide a validation preview and require explicit owner confirmation before calling live write endpoints.
