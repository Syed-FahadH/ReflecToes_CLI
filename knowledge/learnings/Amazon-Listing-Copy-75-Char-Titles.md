---
type: learning
summary: Amazon 75-char item names, 125-char highlights, 249-byte backend keywords, safe PATCH workflow
applies_to: Amazon listings, sales-dashboard
updated: 2026-10-07
---
# Amazon listing copy: 75-char Item name + Item highlights

- Since 2026-07-27, non-media Item names must be 75 chars or fewer. Item highlights (`title_differentiation`) adds 125 searchable chars. Amazon may swap in its own AI title if you don't comply.
- Pattern that passed validation: `Brand + top converting phrase, secondary phrase (variation)`. Words dropped from the old title go into highlights or backend so nothing loses indexing.
- Backend `generic_keyword` is capped at 249 bytes. Several RT listings were at 272-316 bytes, which can stop the whole field indexing.
- Pick keywords from Ads **customer search terms** (map ad group to advertised SKUs) and SQP across all weeks, not ad targets or the latest SQP week alone.
- Listings Items PATCH on item_name / title_differentiation / generic_keyword is not a pricing mutation. Always run `mode=VALIDATION_PREVIEW` first, and keep the before values for rollback.
- Product type: use `summaries[0].productType`. `productTypes` from searchListingsItems can differ (iron-ons showed SPORTING_GOODS vs IRON_ON_TRANSFER_DESIGN).
- Script: sales-dashboard `scripts/apply_listing_copy.py`, record in `docs/listing_copy/2026-09-14_*`.
- `searchListingsItems` defaults to last-updated order. Paging right after bulk edits skips moved listings. Send `sortBy=sku&sortOrder=ASC`, and treat an empty `status` as "processing", not "inactive".
- Fill the space: give each child name candidates longest-first; check old-title words against SQP impressions and organic rank before dropping them. Parent SKUs must be under 75 too.

## OS covers: wording correction (2026-10-06)

- Describe the product as a pillowcase or pillow/cushion cover. Do not describe a cover as a plush cushion or promise cushion filling, loft, or support. Cushion cover is valid wording; assess plush wording by what it describes rather than banning the word everywhere.
- If inserts are excluded, state that once in an ordinary bullet. Do not put the exclusion in the title or highlights or make it prominent. Actual inserts and verified filled bundles require separate treatment.
- October 7 owner rule: never name an OS pillowcase/cover as a pillow in product copy. Use pillowcase or throw pillow cover consistently through title, bullets, description and model name. Add an ordinary fit bullet for the exact variant: 18x18-inch inserts, both standard and queen inserts, king inserts, or toddler inserts. Do not infer insert dimensions from the larger cover dimensions. Preserve actual printed design quotations, such as Hug This Pillow Until You Can Hug Me.
- Owner edits must survive subsequent copy cleanup. Freshly read changed fields and hold on drift. Missing or conflicting size evidence stays unresolved; an Amazon VALID preview validates submission, not product truth or public detail-page publication.
- Read-back GETs can hit Amazon quotas during bulk copy publication. Throttle and retry GETs separately; never apply the read retry policy to a live PATCH. Catalog Items API verifies resolved catalog attributes separately from seller contributions. A stale public-page fetch does not authorize resending an accepted update.
