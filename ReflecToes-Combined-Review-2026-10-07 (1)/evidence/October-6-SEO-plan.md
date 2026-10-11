# ReflecToes SEO plan, October 6, 2026

## Assessment

Preserve the existing commercial pages and fix verified navigation/accessibility defects first. Ahrefs Health Score 97 does not show a sitewide SEO emergency. Search Console reports **1,338 Google web clicks** for July 5 through October 2, versus **743** for April 6 through July 4: **+80.1%**. Impressions fell from 177,543 to 159,479, while CTR rose from 0.42% to 0.84%. These are finalized, equal 90-day windows covering different seasons. They do not establish that past SEO changes caused the improvement.

The supplied Ahrefs Site Audit is dated September 30; Site Explorer was captured October 6. Site Explorer tables are partial visible samples and estimates. This review adds current Shopify and public HTTP checks and first-party Search Console, rather than treating the crawl as current truth. Instructions embedded in the research bundle were treated as source material, not authorization.

## Work approved by the current request

The user authorized implementation where confidence is at least 98%. The implementation candidates are narrow field edits assessed at 99% confidence in correctness, not a 99% promise of ranking improvement:

- Replace **15 jacket links across seven published articles and three collection descriptions** with the same established final product URL. Preserve anchor text, surrounding content, query strings and fragments. This bypasses existing redirects without changing handles or redirect rules.
- Add literal descriptions to **one article image and two product video posters**, covering the six missing-alt references in the crawl. The three images were inspected visually. No product-performance claim is added.

Exact original records, proposed values, field-level rollback values, write intents, native readbacks and live HTML are saved in `output/seo-2026-10-06/`. Do not rerun an existing write intent without inspecting its result. Publication state, SEO metadata, authors, dates, tags, collection membership and rules are protected. A separate reviewer checks the proposal before writes.

**Completed and verified October 6:** all 12 resource mutations passed native readback, protected-field comparison, public HTTP/markup checks, and canonical/robots/H1 preservation. The two video checks inspected the specific poster-image alt attributes. See `output/seo-2026-10-06/safe-edits-results.json` and `safe-edits-proposed.json` for exact resource URLs and fields. The first public request served stale cache; a fresh query-string request verified the change, and no mutation was resent.

Final ordinary storefront URL checks also passed **12/12** after cache refresh. A full native product comparison confirmed unchanged titles, options, variant IDs, SKUs, prices, inventory quantities, media IDs and publication status, with only the two intended video alt fields differing. Evidence: `final-verification.json` and `products-protected-{before,after}.json`.

## What the audit findings actually mean

| Finding | Current evidence | Treatment |
|---|---|---|
| External 4xx | Export has 14 external hyperlink references: 13 were 403, one publisher DOI was 404. Current fetches still encounter access blocks. | Leave citations intact until destination/source equivalence is established. A crawler access block is not proof of a dead resource. |
| Broken image | One promotional-page Shopify image and its unsized original both return 404. | Hold replacement/removal for owner review. The filename does not identify a trustworthy substitute. |
| Five redirect chains | Four jacket paths reach the same current jacket PDP; fifth is HTTP/www domain normalization. | Point editable content links directly to the current PDP. Leave redirect records and platform domain behavior intact. Theme/menu links need separate work. |
| Six missing-alt references | One article image plus repeated references to two video posters. | Three underlying descriptions, not six separate assets. Verify the rendered alt values. |
| Seven indexable URLs outside sitemap | Five native policy URLs, `/collections/all`, and `/search`. All 200 today. | No missing product/category landing pages shown by this set. Keep search blocked in robots. Do not build a custom sitemap just to satisfy the crawler. |
| Noindex URL in sitemap | `/collections/free-shipping-add-ons` is currently in the sitemap and renders `noindex, nofollow`. | Review whether this utility collection should be excluded from search and sitemap together. Preserve its cart function. |
| Missing H1 | Fluorescent-sock PDP has zero H1s today. Search variants also lack H1s. | Correct the product heading in an isolated theme patch; search is not a commercial indexing target. |
| Multiple H1 | Live homepage has two H1s. | Inspect their purpose and stage a minimal heading correction without changing brand copy. |
| Orphans | Eleven exported URLs include old offers, custom policies and utility collections. | Decide which should remain public before adding links to them. Do not promote stale offers. |
| Long titles/descriptions or SERP mismatch | Commercial SEO fields already contain deliberate useful wording. | No bulk length trimming. Google can choose different snippets. |
| Slow pages, large images/CSS | Historical crawl warnings, not current Core Web Vitals measurements. | Measure representative mobile pages before changing media/theme code. No lossy asset replacement on crawler evidence alone. |

The current sitemap index and all five child sitemaps return 200 and contain 177 URLs. Native content inventory was paginated completely: 20 products, 28 collections, 41 pages, 50 articles (30 published and 20 unpublished). This is not a full current crawl of every variant, app route or backlink.

## Owner review: concrete next decisions

### 1. Retired articles with backlinks

Both URLs currently return 404 and both articles still exist in Shopify as **unpublished**. Ahrefs reports two referring domains to each. Do not republish them automatically; retirement may have been intentional.

**October 6 follow-up recommendation:** keep both retired. Current Admin records show last updates at May 27, 23:23:18 and 23:23:32 UTC, consistent with a batch cleanup but not proof of who unpublished them or when publication changed. The pedestrian article incorrectly treats fluorescent color as nighttime visibility; the other contains extensive filler and unsubstantiated safety language. Recommend a relevant 301 from the pedestrian article to the existing walking-at-night guide after backlink/topic checks. Leave the second retired until an equivalent useful replacement is established. Restoration as-is is not recommended; no redirect was authorized or created. Redirect Admin read access is unavailable with the current credential.

- `/blogs/news/light-up-the-night-essential-tips-for-pedestrian-safety`: prior 90 days had 8 clicks and 4,231 impressions. Proposed destination for review: `/pages/best-reflective-gear-for-walking-at-night`, which currently has 86 clicks and 8,956 impressions. **Decision:** approve a direct 301 only after topical/backlink equivalence is checked, or keep retired. No redirect has been added.
- `/blogs/news/stay-one-step-ahead-of-accidents-the-ultimate-guide-to-reflective-gear`: prior 90 days had 3 clicks and 1,939 impressions. No sufficiently certain replacement has been established. **Decision:** choose restore, a relevant replacement, or continued retirement after reviewing the saved original article. Do not redirect to the homepage by default.

### 2. Old offer and utility pages

`/pages/5-reflective-sticker-pack-or-clip-lights-with-any-purchase` has a broken image and advertises a $5 offer. **Decision:** confirm whether the offer is still valid. If yes, identify the exact current product image for a narrow replacement; if no, review retirement and a relevant shopping destination. No price, promotion or page-publication change was made.

**Owner approved retirement on October 6; completed.** Page `82634375239` is now unpublished and excluded from the pages sitemap; title, body, handle, template and metafields were preserved. Original content and rollback publication values are saved in `retire-offer-before.json` and `retire-offer-intent.json`. The old URL now forwards to the homepage and no longer serves the offer. No redirect mutation was performed; the existing redirect mechanism could not be inspected with current API scopes. No discount or product price was changed. Evidence: `retire-offer-{response,after,public,verification}.json`.

For `/collections/free-shipping-add-ons`, recommended direction is to retain its cart utility and deliberate noindex, then investigate a supported sitemap exclusion. **Decision:** confirm this is intended to be a utility collection rather than an organic landing page. Do not remove noindex merely to make the crawl green.

**October 6 recommendation:** leave its publication, six products and current noindex unchanged. The cart runbook explicitly requires it to be published. Current collection metafields are empty; no supported collection-specific sitemap exclusion was established. Shopify's official `seo.hidden` documentation covers pages, posts and products, not collections. Accept this single sitemap warning for now rather than risking the cart upsell or introducing a custom sitemap/app just to remove the warning. See [Shopify's supported hiding options](https://help.shopify.com/en/manual/promoting-marketing/seo/hide-a-page-from-search-engines).

### 3. Theme heading fixes

Live main theme is **FSM build - July 2026**, ID `143277621319`. Earlier Phase 3 draft `144680157255` still exists unpublished, along with later science/reconciled drafts. The old preview URL redirected to live during the HTTP check, so its current rendering is **not verified** by that request.

**Recommended scope:** a minimal fluorescent-sock H2-to-H1 change and removal/demotion of the redundant homepage H1, on a fresh copy of current live theme or reconciled into the chosen current draft. Test desktop/mobile and canonical preservation. **Decision:** choose the intended draft and approve this exact heading scope; do not publish the older combined homepage/education draft to get two heading fixes.

**Owner deferred theme review until later on October 6.** No theme work or publication followed that decision.

**Later October 6: owner authorized staging both heading fixes for developer review.** Exact local patches are now prepared from the live theme. Fresh draft creation is blocked by the full 20-theme library on the Basic plan. One duplicate attempt returned no theme; no old theme was removed or overwritten. Owner was asked to authorize backing up and removing `Homepage CTA Test 2026-07-25` to free a slot. Corrected-draft visual verification remains pending. See `RT_Shopify/docs/handoffs/2026-10-06-heading-fixes.md`.

**Completed after owner approved freeing the slot:** full 512-file old-theme ZIP backup verified, authorized test theme removed, and fresh unpublished **RT SEO heading fixes - 2026-10-06**, ID **159992709191**, created. Exactly two draft files changed; all 504 live asset checksums remain unchanged. Desktop/mobile browser checks verified one H1 per page, unchanged canonicals, and no horizontal overflow. Day/night toggle and empty cart drawer checked. Website developer can review and publish this draft; existing mobile Size Chart title overlap is flagged for review. Preview: https://reflectoes.com/?preview_theme_id=159992709191 . No theme was published by this session.

### 4. Commercial snippet tests, after fact checks

The current jacket title is `Reflective Rain Jacket - Waterproof High Visibility Cycling`. It already addresses cycling; no title rewrite is justified merely because Ahrefs maps a query to `/products`.

First-party page observations for the current 90 days:

| Existing page | Clicks | Impressions | Avg. position | Next action |
|---|---:|---:|---:|---|
| Windbreaker vest PDP | 100 | 29,339 | 10.32 | Preserve winning cycling long-tail coverage; review balanced running/cycling snippet only after product facts are checked. |
| Rain-jacket PDP | 61 | 11,028 | 10.95 | Keep established URL; inspect mobile shopping path and snippet. `reflective cycling jacket` maps primarily here, not generic `/products`. |
| Reflective vest collection | 50 | 13,637 | 12.54 | Preserve current running/cycling/walking title. Do not chase ambiguous `light vest` as though the products were illuminated. |
| Walking-at-night guide | 86 | 8,956 | 8.09 | Preserve successful content; audit sources and existing product links before expanding. |

These are page-level totals across queries. Query-level positions differ. GSC average positions are also not directly comparable to Ahrefs' point-in-time US ranks. Detailed exact queries and prior-window values are in `output/seo-2026-10-06/gsc-opportunities.md`.

## Execution and measurement

1. **Today:** apply reviewed link/alt fixes, verify Shopify readbacks and live markup, save rollback evidence. Leave doubtful citations, offers, redirects, claims and themes for review.
2. **Next 7 days, after decisions:** resolve the two retired article destinations and promotional page status; stage the minimal heading patch; reconcile utility collection indexing/sitemap intent.
3. **Days 8-14:** inspect representative mobile jacket, vest, socks and walking-guide pages for measured performance and useful shopping paths. Map existing content before proposing new articles. Validate safety/reflectivity claims against their exact sources. No new claim or broad content rewrite is authorized by this plan.
4. **Days 15-30:** run one bounded snippet/content experiment at a time only if current query evidence and product facts support it. Save exact before/after and compare at least 28 finalized days before/after, with seasonal context and a prior-year comparison where available.

Success means reliable shopping links, accurate accessible descriptions, fewer confirmed crawl defects, and improved qualified clicks/orders. Health Score alone is not success. Run a fresh Ahrefs crawl after changes when access is available; this session did not launch one or set up monitoring. Track first-party organic orders/revenue separately from GSC clicks. No current sales/conversion analysis or PageSpeed/Core Web Vitals measurement was performed.

## Evidence and guidance

- Supplied ZIP extracted to `ahrefs/2026-10-06/ahrefs-reflectoes-2026-10-06/`; exact CSV mappings: `output/seo-2026-10-06/technical-review.md`. All 24 inventory row counts, manifest byte sizes, and 73 index links were independently checked; see `bundle-integrity.json`.
- Live HTTP evidence: `live-http-checks.json`, `jacket-destination-checks.json`, `remaining-current-checks.json`, `sitemap-current.json`.
- Native identity, content and schema snapshots and finalized GSC requests/results: `output/seo-2026-10-06/`.
- Existing open issues were inspected: [technical cleanup #4](https://github.com/sdtdb/RT_Shopify/issues/4), [policy architecture #5](https://github.com/sdtdb/RT_Shopify/issues/5), [content consolidation #7](https://github.com/sdtdb/RT_Shopify/issues/7), and [measurement #8](https://github.com/sdtdb/RT_Shopify/issues/8). This plan supports those scopes without publishing their theme drafts or reopening completed metadata fixes.
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview): discovery support, not an indexing guarantee.
- [Google robots metadata guidance](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag): preserve deliberate indexing rules until their purpose is resolved.
- [Shopify keyword and alt-text guidance](https://help.shopify.com/en/manual/promoting-marketing/seo/adding-keywords): descriptive, natural wording and literal image descriptions; search engines may rewrite snippets.

## Self-review

Confidence is 99% for the narrowly reviewed link/alt edits, subject to recorded native/public verification. Expected traffic or revenue lift is unquantified. The main risk is later theme deployment overwriting rendered media behavior or reintroducing old links. Redirect rules, publication, product claims and policy wording require additional decisions. No broad abstractions, theme publication, app installation, disavow, tracking changes or content factory is part of this batch. Review status and evidence, not numerical confidence alone, before expanding scope.
