---
type: learning
summary: Stray closing brace inside media queries silently leaks scoped selectors into global scope
applies_to: Web dashboards and CSS
updated: 2026-09-16
---
# CSS media query stray brace leak

## Problem
Styles intended only for mobile screens (cards, form single-column layouts, table wraps) leaked into desktop view, and trailing closing braces caused invalid CSS syntax.

## Cause
When replacing a block inside an `@media (max-width: 900px)` query, an extra closing brace was left behind. The extra brace closed the media query block prematurely, leaving subsequent mobile rules in global scope. The final closing brace then had no opening block, leaving a negative brace balance (-1).

## Fix / rule
1. Verify brace balance with a quick Python scanner or linter before committing CSS edits.
2. In Python test suites that inspect frontend assets, add an assertion that tests for balanced `{` and `}` characters across stylesheets.