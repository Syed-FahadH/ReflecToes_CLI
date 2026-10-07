---
type: learning
summary: Verify Shopify theme JSON structurally and local account identity before SEO changes
updated: 2026-10-06
---
# Shopify theme SEO readback

- Oh Susannah account configuration is in `C:\Users\Ben OBrien\AI\sales-dashboard\accounts\os`; check account-local variables plus shared environment-loading rules without printing values. Pin shop identity and primary domain before writes.
- Verified Oh Susannah primary domain: `https://www.ohsusannah.com`; Shopify domain: `oh-susannahs-pillowcases.myshopify.com`.
- `themeFilesUpsert` can rewrite JSON formatting/comment wrappers. A successful exact content submission may fail byte-for-byte readback while structural JSON matches. Strip JSONC comments and compare parsed JSON; compare Liquid text exactly. Re-read before retrying and retain durable send/readback evidence.
- Local Theme Check cannot resolve an external installed app-block reference from downloaded theme source alone. Compare the before/proposed error, preserve the app reference, and verify rendered behavior.
- Saved direct-Google OAuth refreshes failed and the local service account covered ReflecToes only. OS GSC access nevertheless worked through SEOmatic's workspace API key at its documented stateless JSON-RPC MCP endpoint. Verify the returned property rather than assuming a platform key cannot provide GSC data.
- SEOmatic's returned query summary contradicted its rows, and comparison calls returned 45-day periods despite larger day arguments. Check returned periods, totals and property identity before using them as evidence.
- Shopify's sitemap child URLs include required query parameters. Read the exact child URL from the sitemap index; a guessed `/sitemap_pages_1.xml` URL can return 400.
- OS SEO audit, field backups and completed live write journal: `C:\Users\Ben OBrien\AI\OS Shopify\seo-2026-09-30\REPORT.md`.

Related: [[Oh-Susannah]].

- Amazon galleries can contain old origin graphics and unrelated demonstration designs despite an exact SKU/ASIN match. Visually check imported assets against Shopify size, design and included items; do not transplant generic claims.
- Shopify `fileUpdate` with `referencesToRemove` detaches media from a product while retaining the file. Replacing `originalSource` preserves its ID; verify READY, dimensions and product associations afterward.
- Shopify product description updates may normalize whitespace between HTML tags. Compare that normalization before treating readback as a failure or sending a mutation again.

- Reused write helpers can overwrite historical product-after cache files. Archive each phase's exact readbacks under a dated phase folder before another operation uses the helper; do not publish an overwritten cache as earlier proof. Preserve original before snapshots and compare every fresh resource immediately before mutation.

- Shopify article updates can rewrite attribute quote delimiters and HTML character entities. After a successful send, do not repeat the mutation because a string comparison fails. Re-read once, compare complete parsed HTML tokens/attributes/text plus every other returned field, preserve the raw diff, then verify public links/images. Equivalent serialization is not missing work.

- For Windows SEO evidence published through Git, compute repo file hashes from staged/committed bytes because CRLF normalization changes local bytes. Keep separate working-copy and raw-capture hashes so another AI can verify the Git checkout without discarding original provenance.

- An authentication bootstrap executed with `exec` can overwrite globals such as an evidence output path. Initialize phase paths after the bootstrap or isolate its namespace. Before attributing an unexpected live change to another writer, correlate the saved mutation plan, response, resource timestamp and readback; misplaced evidence is not evidence of a different actor.

- Article gallery replacement: verify approved retained image identities by source URL, not shorthand labels or ordinal guesses. Count actual final `<img>` nodes rather than adding retained and replacement arrays, because a replacement gallery can include retained photos. Keep presentation dimensions consistent with the fetched rendition so legacy 480px assets are not enlarged to 700px.

- Metadata writes can pass Admin readback while public pages still serve cached old SEO values. Pause scaling and retain the failed public capture; resolve through later read-only requests without resending the mutation. October 6 cleanup resolved two such delays and verified all 296 changed resources afterward.

- Theme handoffs must explicitly distinguish live fixes, old staged drafts, current fresh drafts, and visual verification. A prior draft is not evidence that current live contains the fix. For a narrow heading patch, copy current live, compare the full asset manifest, inspect the actual preview bar identity, and visually check desktop/mobile before calling it ready for developer review.
- A full Basic theme library (20 themes) can make themeDuplicate return null newTheme with no userErrors. Verify inventory before retrying. Free a slot only with owner-authorized backup/removal of a named unpublished theme. Theme file URL bodies can rotate between reads; compare downloaded binary bytes and stable checksums rather than URL equality. Some API server checksums differ from repeatable downloaded text; record exceptions and use exact repeated native reads plus ZIP round-trip verification.

- An article Admin featured-image readback and a filename somewhere in public HTML do not prove the visible hero uses that image. Horizon main-blog-post had an unbound static image block displaying a giant unrelated placeholder. Verify the actual DOM image/currentSrc/natural/display dimensions. Render article.image in the article section, preserve its proportions, cap at native width, and hide an empty hero; all 85 published article checks passed October 6.
