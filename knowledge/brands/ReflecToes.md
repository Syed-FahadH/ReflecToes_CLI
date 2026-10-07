---
type: area
summary: ReflecToes brand facts, channels, key ASINs, brand rules, and related repos
updated: 2026-10-04
---
# ReflecToes

> Shared with the team through the ai-business repo. No ownership, finance, legal, or personal details here.

## Standing facts
- Reflective safety gear: socks, vests, jersey, rain jacket, gloves, LED clip light, bands, wheel decals.
- Channels: Amazon FBA (main), Shopify reflectoes.com, Faire (about 3,300 retailers), Walmart, eBay.
- Key ASINs: rain jacket B0FQBV4X1H, reflective socks B0C9KPCJCX.
- Main competitors: Proviz Reflect360, BALEAF, Spotti, Little Donkey Andy. Position on safety and retroreflectivity, not commodity price.
- Shopify discount codes seen: NIGHTKIT15, DAYKIT15.

## Shopify claims guardrails
- Current rule: keep the strongest truthful marketing claim and fix the metric, comparator, attribution, or source instead of automatically weakening it.
- Quantified research claims should use linked numbered superscripts to the live Science & Sources page at `/pages/science-sources`.
- Science & Sources uses stable source numbers. Do not renumber them casually because live product and article links depend on the anchors.
- Manufacturer and supplier specs can be marketed without publishing confidential supplier documents.
- No ReflecToes product uses reflective yarn.
- RT-D1 / RT-D2: 330+ cd/lx/m². RT-D2B / RT-D4: 720+ cd/lx/m² plus manufacturer-rated 10-year service life.
- RT-JA only: 15,000 mm waterproof / 9,000 g/m²/24h breathability.
- Published warranty: 30 days. One-year defect replacements are a customer-service accommodation, not a one-year warranty.
- Detailed rules and study-specific claims: [[ReflecToes-Shopify-Claims-Guardrails]].

## Science source map
- Source 1: Balk et al. 2008, up to 7× pedestrian biomotion condition.
- Source 2: Wood et al. 2012, nighttime cyclists, 386 / 126 / 65 ft, 5.9× vs black, 3.1× vs vest.
- Source 3: Wood et al. 2017, eye tracking, 6.4 sec biomotion vs 13.9 sec vest recognition time.
- Source 4: Edewaard et al. 2020, fluorescent biomotion 3.3× farther in daylight.
- Source 5: Lahrmann et al. 2018, 6,793-cyclist high-visibility jacket trial, 55% fewer cyclist-motor vehicle multiparty crashes in the test group.
- Source 6: Tyrrell et al. 2009, visual clutter did not erase the biomotion advantage.
- Source 7: Wood et al. 2005, pedestrian low-beam recognition results.
- Source 8: Johansson 1973, biological-motion foundation.
- Source 9: Black et al. 2020, nighttime cyclist passing-distance study.
- Source 10: Kwan & Mapstone Cochrane review.

## Shopify implementation state
- `/pages/science-sources` is live and is the evidence hub for numbered claims.
- Product descriptions, FAQ, walking guide, biomotion article, wardrobe article, and several core product pages were strengthened and corrected on 2026-09-27.
- Education and Biomotion Science replacements are staged in unpublished theme `SEO Science Fixes - 2026-08-31`. They are not live and must not be published without review.
- Live MAIN theme is `FSM build - July 2026`. Direct theme-file writes are blocked through the connector.
- The live socks template no longer claims reflective yarn, but its `Why Choose ReflecToes?` block still needs a small manual correction to remove broad road-sign/highway-standard wording and the unsupported `detected fastest` phrase.
- Night Kit and Daylight Kit have custom HTML/CSS/JS builders. Preserve their product IDs, pricing, discount logic, and JavaScript when updating science copy.

## Rules
- Voice and visuals: [[Ben-Preferences-and-Voice]].
- Shopify: [[Shopify-Liquid-Rules]].
- Amazon listings: [[Amazon-Listing-Copy-75-Char-Titles]].

## Repos
[[sales-dashboard]], [[ReflecToes-SEO]], [[ReflecToes-Shopify]], [[reflectoes-theme]], [[RT-Wholesale]], [[Influencer-Tracker]], [[social-media-agent]], [[SP-API-MCP-Server]].

## Legacy knowledge
- [[OneNote/_Maps/ReflecToes|ReflecToes OneNote map]] contains historical product, marketing, supplier, and operations notes. Verify old claims before relying on them.
- [[OneNote/_Maps/ReflecToes-Creative|ReflecToes creative map]] narrows legacy poster, prompt, graphic, and creative material.
- [[ReflecToes-Creative-Library]] connects useful archived Claude design sessions to current corrected creative rules.

## Log
- 2026-09-18: Audited Amazon FBA packing workflow wf38481962-0757-4c85-9512-fe5b4ca2ca2d against five-carton packing sheet; held confirmation pending actual scale weight verification. See [[ReflecToes-FBA-Packing-Workflow-Review]].
- 2026-09-27: Added live Science & Sources page, stable source map, current theme staging status, and remaining theme-only blockers.
- 2026-09-27: Added authoritative Shopify claims, science sourcing, SKU spec, care, and warranty guardrails.
