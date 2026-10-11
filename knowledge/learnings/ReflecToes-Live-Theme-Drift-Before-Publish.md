---
type: learning
summary: The live ReflecToes theme is edited directly, so a draft theme goes stale within hours. Rebase on a fresh pull before any publish.
updated: 2026-10-09
---
# Live theme drift before publish

**Problem.** The unpublished theme "Shopify CLI" was built from a copy that was older than the live theme. On 2026-10-09 the live theme (RT SEO heading fixes - 2026-10-06) differed from that copy in 27 files: em dashes removed, new FAQ on the bands page, the fluorescent socks and LED lights benefit blocks corrected, a fourth fact on the Biomotion page, and the socks H1. Two product templates changed again on live during a single working hour. Publishing the older copy would have reverted all of it.

**Rule.**
- Before any publish, pull the live theme again and diff it against the draft's starting copy.
- Apply the draft's own changes on top of the fresh live files (take live for any file both sides changed, then re-apply the small edit). Do not publish the old copy.
- Re-check right before publishing, because the team edits live directly.
- Compare rendered page text on live and draft after rebasing, not only titles and headings.
