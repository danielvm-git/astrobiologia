---
status: investigating
trigger: "Diagnose one UAT gap for phase 05 multilingual-i18n... test number: 7"
created: 2026-04-20T13:15:29Z
updated: 2026-04-20T13:15:29Z
---

## Current Focus
hypothesis: Metadata generation for canonical/alternates is not aligned with locale-aware URLs on some public routes.
test: Inspect UAT expectations and route-level SEO metadata builders for canonical + hreflang output.
expecting: Find either missing locale propagation or incorrect canonical base path construction.
next_action: Read UAT test 7 and current project state, then trace metadata code paths in public routes.

## Symptoms
expected: Public pages include language alternates and canonical metadata aligned with the current locale URL.
actual: cannot see
errors: none reported
reproduction: Run UAT test 7 for phase 05 multilingual-i18n and inspect public page metadata output.
started: reported during phase 05 UAT

## Eliminated

## Evidence

## Resolution
root_cause:
fix:
verification:
files_changed: []
