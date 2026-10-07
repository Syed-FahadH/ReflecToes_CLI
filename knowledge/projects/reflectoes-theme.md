---
type: repo
summary: Versioned source of truth for the ReflecToes Shopify Horizon theme and reconciled historical drafts
location: C:\Users\Ben OBrien\AI\reflectoes-theme
stack: Shopify Liquid, JSON templates, CSS, JavaScript
status: active
next: Verify the current Shopify-connected branch and unpublished theme before editing or publishing
updated: 2026-09-21
---
# ReflecToes theme

## Purpose
Version-controlled Shopify theme source created to prevent unpublished theme drafts from silently overwriting each other.

## Guardrails
- Preserve `.gitattributes` line-ending behavior; Shopify stores theme files with LF.
- Use one branch per Shopify theme and develop against unpublished themes.
- Verify Shopify state and preview before publication.
- The historical live baseline and both original draft branches are retained for rollback and reconciliation evidence.

## Related
- Strategy and project control: [[ReflecToes-Shopify]].
- Brand context: [[ReflecToes]].
- Shopify safety rules: [[Shopify-Liquid-Rules]].
