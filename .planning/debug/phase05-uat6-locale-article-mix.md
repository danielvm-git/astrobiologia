---
status: investigating
trigger: "Diagnose one UAT gap for phase 05 multilingual-i18n. Gap: opening an article in each locale sometimes changes locale and sometimes not; user can see article in english and portuguese. Test #6."
created: 2026-04-20T13:16:39Z
updated: 2026-04-20T13:16:39Z
---

## Current Focus

hypothesis: Gather initial evidence from UAT and route/article locale logic.
test: Inspect locale-aware article routes, slug resolution, and canonical link construction.
expecting: Find inconsistent locale source-of-truth causing mixed-language navigation.
next_action: Read UAT, STATE, and related article/i18n route files completely.

## Symptoms

expected: Opening an article in each locale shows the corresponding translation and keeps canonical navigation within that locale.
actual: Sometimes locale switches unexpectedly; user can see article in English and Portuguese inconsistently.
errors: No explicit runtime error reported; behavioral inconsistency in locale routing/content selection.
reproduction: Open articles across locales and navigate; observe translation and canonical behavior varying.
started: Reported during UAT phase 05, test number 6.

## Eliminated

## Evidence

## Resolution

root_cause:
fix:
verification:
files_changed: []
