# Heading fixes: staged and visually checked

Owner authorized staging the two heading fixes for the website developer to review and publish. Publication is not authorized for this agent.

Current live theme: FSM build - July 2026, ID 143277621319. New unpublished draft: **RT SEO heading fixes - 2026-10-06**, ID **159992709191**. It is a fresh copy of live with only the two edits below. The owner authorized backing up and removing Homepage CTA Test 2026-07-25 to free a slot in the full 20-theme library. All 512 old-theme files were retrieved, verified against a second native read, and preserved in a tested ZIP. Some server checksums differed from downloaded bytes; exact repeat reads and ZIP round-trip validation were used and the exceptions were recorded. The old test theme was then removed and its absence verified.

Preview: https://reflectoes.com/?preview_theme_id=159992709191

Sock product preview: https://reflectoes.com/products/3-pair-fluorescent-socks-day-glow-neon-socks-for-cyclists-runners?preview_theme_id=159992709191

Check the Shopify preview bar says **RT SEO heading fixes - 2026-10-06 / Draft**. If preview cookies or the query link do not work, open this exact theme from Shopify Admin > Online Store > Themes > Preview.

## Exact patch

- `sections/header.liquid`: remove only the homepage-only hidden shop-name H1. Keep the descriptive homepage hero H1.
- `templates/product.fluorescent-socks.json`: change only the product-title rich-text HTML from H2 to H1. Preserve the existing typography preset and all other settings.

Original asset snapshots, full live manifest, replacement files, readable diffs, native write/readback evidence, and screenshots are in `output/theme-headings-2026-10-06/` in the parent workspace. Both replacements were checked for a single exact match; the product template parses as JSON after its existing header comment is removed. Exact draft readbacks passed; only these two files differ from live. All 504 live asset checksums remain unchanged and the new draft remains unpublished.

## Verification status

VERIFIED: corrected draft rendered in the actual browser at desktop 1440x1000 and mobile 390x844. Homepage has exactly one H1, Reflective Running & Cycling Gear. Sock product has exactly one H1, its existing product title. Both canonicals retain their normal production URLs. No horizontal overflow at either tested width. Homepage day/night toggle works at both widths. Sock M-to-L selection updated the selected state, variant information and displayed price. Empty cart drawer opened normally. Images, header, title wrapping, and purchase controls were visually inspected; screenshots saved. Checkout and adding a product were not tested.

Review finding: the existing mobile Size Chart floating tab overlaps the right edge of the sock title slightly. Its code is unchanged. Ask the developer to review its positioning; it was not changed as part of these heading edits. An automated attempt to switch L back to M did not change the checked state, so do not interpret the size check as a full variant matrix test.

Confidence: 99% in the narrowly scoped heading fixes, supported by native readbacks, complete asset comparison, rendered heading/canonical checks and visual checks. No ranking or revenue improvement is quantified. Main risk is later live-theme drift before publication; developer should compare current live against this draft before publishing.

## Developer review and publication

Review the homepage and fluorescent sock product on desktop/mobile, verify one H1 on each, and check menus, product variants and cart behavior. Review the mobile Size Chart placement. Publish this exact fresh draft when satisfied. After publication, recheck the normal URLs and launch a fresh Ahrefs crawl. Live FSM build remains available for rollback after publication.

Do not publish an older Phase 3/science/reconciled draft merely to obtain these two fixes. This agent did not publish any theme.
