---
type: project
summary: Check of the client SEO review against the live theme and the Shopify CLI draft theme, theme fixes made, admin actions waiting for approval, and draft copy for the jacket and vest collections
updated: 2026-10-09
---
# ReflecToes SEO review: live vs "Shopify CLI" draft

Method: all 104 sitemap URLs fetched on live and on the draft (theme 160040878151 / dev copy 160057229383). Compared title length, meta description, canonical, robots, H1 count. Every internal link target was also checked for redirects. Nothing on live was changed.

## Client list, one by one

| Client point | Live | Draft before this work | Draft now |
|---|---|---|---|
| Neon socks title is an H2 | Fixed (one H1) | Still an H2, no H1 (draft was older than the live fix) | H1 in `product.fluorescent-socks.json` |
| Second H1 on /pages/science-sources | 2 identical H1 (template H1 plus an H1 inside the page body) | same | Body H1 shown as H2 by `blocks/page-content.liquid` |
| Broken SAGE DOI on the visibility illusion page | Link `10.1177/00187208231160707` does not exist (doi.org returns 404) | same | Replaced with `10.1177/00187208231210644` (Crossref record for King, Szubski & Tyrrell 2023, Human Factors 66(10), 2409-2427). Fixed in `page.visibility-illusion.json` and `main-visibility-illusion.liquid` |
| Titles cut mid-word | 36 titles over 60 characters, 4 cut mid-word ("...Wheel Reflectors St", "...Socks and Gl", "...Safe at N", "...Crew S") | same | `snippets/meta-tags.liquid` trims to whole words at 60, drops a trailing connector, adds the shop name only if it still fits. 1 title left over 60 (home, 62, left alone). Admin titles below are still the better fix |
| Meta descriptions missing on policy pages and /collections/all | missing | missing | Fallbacks added: policy pages use the first words of the policy, /collections/all uses a short factual line |
| Outdated links and redirect chains | see below | see below | cannot be fixed in the theme, content lives in admin |
| Noindex free-shipping collection still in sitemap | yes | yes | admin setting, see below |

Important: the draft theme was missing the live heading fix for the neon socks page. Publishing the draft without this change would have brought the H2 back. Always crawl live and draft before any publish.

## Waiting for approval (live admin changes, not done)

### 1. Titles to set in admin (SEO title field), all 60 characters or fewer
Mid-word cuts first:
- Rim decals product: `Reflective Bike Rim Decals | High Visibility Wheel Stickers` (59)
- Reflective socks product: `Reflective Running & Cycling Socks | High Visibility Crew` (57)
- Blog, stay seen: `Why You Need Reflective Socks and Gloves to Stay Seen` (53)
- Blog, fluorescent vs retroreflective: `Fluorescent vs Retroreflective: What Keeps Cyclists Safe` (56)
Over 60 but whole words:
- Blog, high-vis jackets: `Why Most High-Vis Cycling Jackets Fail at Night` (47)
- Blog, bike clothing: `Why Reflective Bike Clothing Matters for Night Cyclists` (55)
- Blog, night running: `Night Running Safety: Accessories You Need` (42)
- Blog, commuting bike: `How to Choose the Best Bike for Commuting` (41)
- Blog, winter workout: `How to Use Reflective Gear for Winter Workouts` (46)
- Home (62 now): `ReflecToes | Reflective Running & Cycling Gear` (46)

### 2. Links that point at redirects (update the links, the redirects work)
Found in page bodies and collection descriptions, not in theme files:
- `/collections/gloves` to `/collections/reflective-gloves` (3 pages)
- `/collections/vest` to `/collections/reflective-vest` (5 pages)
- `/collections/stickers` to `/collections/reflective-stickers` (5 pages)
- `/collections/lights` to `/products/reflectoes-led-clip-lights-for-runners` (5 pages)
- `/collections/jacket` to `/products/reflective-jacket-waterproof` (1 page, /pages/shop-by-product-type), then onward to the jacket product
- `/collections/jersey` to `/products/reflectoes-high-visibility-reflective-cycling-jersey` (1 page)
- `/collections/iron-on` to `/products/iron-on-reflective-stickers-for-clothing` (2 pages)
- `/products/reflective-cycling-jersey-full-sleeve-...` to the `...long-sleeve...` handle (5 pages)
- `/products/reflectoes-led-safety-lights-for-runners-clip-attach-set-of-2` to the clip lights product (3 pages)
- `/products/reflectoes-high-visibility-cycling-jersey-reflective-hi-viz-cycling-shirt-men-and-women` to the jersey product (1 blog post)
- The theme `llms.txt` templates listed the old `jersey-full-sleeve` URL. Fixed in the draft.
Main menu links need a check in admin (Online Store, Navigation).
A rate limit hit during the crawl, so the full blog link check should be re-run with the Ahrefs list.

### 3. Two blog posts returning 404 with backlinks
URLs are in the Ahrefs backlinks report, not in the sitemap. Candidate targets: pedestrian post to `/blogs/news/enhancing-pedestrian-safety-with-bio-motion-technology` or `/pages/biomotion-science`; other post to the closest live article. Need the two exact old URLs.

### 4. Pages to retire or noindex
Seasonal or old offers still in the sitemap: `/pages/stocking-stuffers-buy-3-get-2-free`, `/pages/free-led-clip-lights-with-purchase-of-50`, `/pages/vip-customer-club`, `/pages/ptclub`, `/pages/kickstarter`. `/pages/workshop-kit` and `/pages/night-safety-workshop` cover the same offer, pick one. `/collections/free-shipping-add-ons` is noindex but still in the sitemap: unpublish it from the Online Store sales channel or set the hidden SEO flag.

### 5. Do not act yet
Spam backlinks (check Search Console for manual actions first), duplicate variants (canonicals are correct).

## Draft copy: new collection "Reflective Cycling Jackets"
Handle `reflective-cycling-jackets`. Check the keyword mapping in Search Console first (target: "reflective cycling jacket", about 250 searches a month, position 6). Today the only jacket is the RT-JA Rain Jacket ($64.99), so add the two vests under a "Layer it with" heading rather than leaving a one-product collection. The homepage "Jackets" tile and the cycling collection "Jackets" link should point here once it exists.

- SEO title: `Reflective Cycling Jackets | High-Visibility Rain Jackets`
- Meta description: `Reflective cycling jackets with a waterproof 15,000 mm shell, over-helmet hood and 360° reflective panels. Free U.S. shipping over $50.`
- H1: Reflective Cycling Jackets

Intro (collection description):
> A cycling jacket has two jobs after dark: keep you dry and make sure drivers see you. The ReflecToes Reflective Rain Jacket has a seam-sealed shell rated to 15,000 mm waterproof and 9,000 g/m²/24h breathable, with large retroreflective panels that return headlight beams around the whole jacket.
>
> The hood fits over a cycling helmet and rolls away when you don't need it. Pit vents and a rear mesh flap let heat out on hard efforts, and the jacket packs into its own rear pocket. It comes in fluorescent yellow for daytime visibility, sizes S to 2XL.
>
> Reflective material on moving parts of the body is easier for drivers to recognize as a person. Pair the jacket with [reflective socks](/products/reflective-cycling-and-running-socks) or [reflective bands](/products/reflective-safety-bands-2-pack-high-visibility-fluorescent-arm-ankle-or-wrist-straps) for movement at the ankles. Read the research on the [Science & Sources](/pages/science-sources) page.

FAQ (answers use facts from the product page only):
- Does the hood fit over a helmet? Yes. It is an adjustable over-helmet hood with a ducktail peak.
- How waterproof is it? Rated 15,000 mm with sealed seams.
- Can it be machine washed? Hand wash cold and hang dry. No iron, bleach or fabric softener.
- Does it work in daylight? The fluorescent yellow base is for daylight, the retroreflective panels are for headlights.
Do not copy the 15,000 mm and 9,000 specs to any other jacket (guardrail: RT-JA only).

## Draft copy: reflective vest collection
Targets "light vest" and "reflective vest for walking" (check position in Search Console first). The page today is a comparison table and two products, about 2,300 characters and 10 links.

- SEO title: `Reflective Vests for Running, Cycling & Walking` (47)
- Meta description: `Reflective vests for running, cycling and walking. Compare the packable light vest and the 4-pocket Deluxe Vest. Free U.S. shipping over $50.`

Intro to add above the comparison table:
> A reflective vest puts a large reflective area on your torso, so drivers see you from the front and back in headlights. We make two: a light vest that packs into its own pocket, and a Deluxe Vest with four pockets.
>
> **Light vest.** The [Packable Vest](/products/reflective-packable-running-vest) folds into its rear zip pocket, small enough for a jersey pocket or running belt. It has a wind-blocking front and a mesh back. Wear it for dawn and dusk runs, then pack it away.
>
> **Vest for walking.** For evening walks and dog walks, either vest works over your normal clothes. The fluorescent yellow base shows up at dusk and the reflective panels light up in headlights. See [the best reflective gear for walking at night](/pages/best-reflective-gear-for-walking-at-night) and the [walking collection](/collections/walking).
>
> **Cycling vest.** The [Deluxe Vest](/products/reflectoes-reflective-windbreaker-vest) carries a phone, keys and cards in four pockets and blocks wind on descents. Add reflective [socks](/collections/socks) or [bands](/collections/reflective-band) so your pedaling legs stay visible too.

FAQ: Which vest packs smaller? Do they block wind? How do I wash them (hand wash cold, hang dry)? Can I wear one over a jacket?

Internal links to add (anchor text on the right): the cycling vest and gilet blog posts to the Deluxe Vest page with "cycling vest"; the walking guide to the vest collection with "reflective vest for walking"; the packable vest page to the collection with "light vest".

## Order of work
1. Publish the draft theme only after reviewing it (it now carries the heading, DOI and title fixes).
2. Admin: titles, redirected links, two 404 redirects, noindex and sitemap clean-up.
3. Create the jacket collection, add the vest intro, then add internal links.

## Approval sheet (checked live 2026-10-09, nothing applied)

### A. Redirects to create (Shopify Admin, Online Store, Navigation, URL redirects)
Both old URLs return 404 today (each has 2 outside backlinks):

| From | To |
|---|---|
| `/blogs/news/light-up-the-night-essential-tips-for-pedestrian-safety` | `/pages/best-reflective-gear-for-walking-at-night` |
| `/blogs/news/stay-one-step-ahead-of-accidents-the-ultimate-guide-to-reflective-gear` | `/pages/retroreflective-vs-fluorescent` |

Alternative for the first: `/blogs/news/enhancing-pedestrian-safety-with-bio-motion-technology`. All targets return 200.

### B. Links to change (edit the link in the page or collection description, same anchor text)
`/collections/jacket` currently goes through two redirects: `/collections/jacket` to `/products/reflective-jacket-waterproof` to the jacket product. Point it at the jacket product now, and at the new jackets collection once that exists.

| Page (admin object) | Anchor text | Old link | New link |
|---|---|---|---|
| /pages/shop-by-product-type | Gloves | /collections/gloves | /collections/reflective-gloves |
| same | Vests | /collections/vest | /collections/reflective-vest |
| same | Jackets | /collections/jacket | /products/reflective-jacket-for-men-women-waterproof-and-windbreaker-jacket-with-hood-back-pocket-vents |
| same | Jerseys | /collections/jersey | /products/reflectoes-high-visibility-reflective-cycling-jersey |
| same | Stickers & Decals | /collections/stickers | /collections/reflective-stickers |
| same | Iron-On | /collections/iron-on | /products/iron-on-reflective-stickers-for-clothing |
| same | Lights | /collections/lights | /products/reflectoes-led-clip-lights-for-runners |
| collection cycling | Gloves, Bike/Helmet Decals, Vests, Lights | /collections/gloves, /stickers, /vest, /lights | /collections/reflective-gloves, /reflective-stickers, /reflective-vest, the clip lights product |
| collection walking | Stickers & Decals, Clip-on Lights, Vests | /collections/stickers, /lights, /vest | /collections/reflective-stickers, the clip lights product, /collections/reflective-vest |
| collection torso | Vests, Stickers & Decals | /collections/vest, /stickers | /collections/reflective-vest, /collections/reflective-stickers |
| collection work-utility | Vests, Iron-On Reflective, Work Lights | /collections/vest, /iron-on, /lights | /collections/reflective-vest, the iron-on product, the clip lights product |
| collection feet-ankles | Shoe Decals, Clip-on Lights | /collections/stickers, /lights | /collections/reflective-stickers, the clip lights product |
| collection hands | All Gloves | /collections/gloves | /collections/reflective-gloves |
| /pages/free-led-clip-lights-with-purchase-of-50 | LED Clip Lights | /products/reflectoes-led-safety-lights-for-runners-clip-attach-set-of-2 | /products/reflectoes-led-clip-lights-for-runners |
| blog: revolutionize-your-commute... | "visible cyclist" | same old LED lights product URL | /products/reflectoes-led-clip-lights-for-runners |
| blog: dont-let-rain-stop-your-ride... | "lights" | same old LED lights product URL | /products/reflectoes-led-clip-lights-for-runners |
| blog: stay-visible-and-stylish... | (image link) | /products/reflectoes-high-visibility-cycling-jersey-reflective-hi-viz-cycling-shirt-men-and-women | /products/reflectoes-high-visibility-reflective-cycling-jersey |
| homepage (live theme only) | Jersey Long / Short Sleeves | old full-sleeve jersey URL | fixed in the draft homepage, no admin edit needed |

Main menu items in Navigation were not readable from outside the store, so they still need a look in admin.

### C. Status of the five technical items
1 neon socks H1: fixed in the draft theme (live already has it). 4 SAGE DOI: fixed in the draft theme. 5 titles: theme trims to whole words in the draft, admin titles listed above are still better. 2 and 3 above need admin access. The 13 outbound 403s (OSHA, NHTSA, UN, ScienceDirect) block crawlers, no action.
