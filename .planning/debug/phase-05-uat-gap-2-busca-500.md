---
status: investigating
trigger: "Diagnose one UAT gap for phase 05 multilingual-i18n (test #2): [500] GET /busca Error: Cannot access url.searchParams on a page with prerendering enabled"
created: 2026-04-20T00:00:00Z
updated: 2026-04-20T00:00:00Z
---

## Current Focus

hypothesis: Inspect prerendered route using `url.searchParams` during build/runtime for `/busca`
test: Read UAT + state, then trace `/busca` load/server code for forbidden `url.searchParams` usage under prerendering
expecting: A prerendered page/load path reading `url.searchParams` will match the exact runtime error
next_action: Read UAT and STATE docs, then inspect `src/routes/busca` implementation

## Symptoms

expected: Accessing root redirects to language-aware route, and navigating between localized URLs keeps language context.
actual: `npm run preflight` reports `[500] GET /busca Error: Cannot access url.searchParams on a page with prerendering enabled`.
errors: Cannot access url.searchParams on a page with prerendering enabled
reproduction: Run preflight/build checks that hit `/busca`
started: During phase 05 UAT validation (test 2)

## Eliminated

## Evidence

## Resolution

root_cause:
fix:
verification:
files_changed: []
