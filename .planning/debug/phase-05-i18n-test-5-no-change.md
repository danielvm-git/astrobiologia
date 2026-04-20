---
status: investigating
trigger: "Diagnose one UAT gap for phase 05 multilingual-i18n. Gap test 5: Homepage and listing pages show content in selected locale; actual report: 'no, npthing changes'. Diagnose only."
created: 2026-04-20T00:00:00Z
updated: 2026-04-20T00:00:00Z
---

## Current Focus

hypothesis: [pending]
test: gather initial evidence from homepage/listing locale data path
expecting: identify where selected locale is ignored or overwritten
next_action: read homepage/listing loaders and translation selection utilities end-to-end

## Symptoms

expected: Homepage and listing pages show content in selected locale, including translated titles/summaries when available.
actual: no, npthing changes
errors: none reported for test 5
reproduction: switch locale and view homepage + listing pages; content remains unchanged
started: observed during phase 05 UAT on 2026-04-20

## Eliminated

## Evidence

## Resolution

root_cause:
fix:
verification:
files_changed: []
