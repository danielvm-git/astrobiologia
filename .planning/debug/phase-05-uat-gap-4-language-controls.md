---
status: investigating
trigger: "Diagnose one UAT gap for phase 05 multilingual-i18n... test number: 4"
created: 2026-04-20T13:15:50Z
updated: 2026-04-20T13:15:50Z
---

## Current Focus

hypothesis: controls are not switching locale path/state consistently between header/footer
test: inspect i18n route/link generation in Header/Footer and locale utilities
expecting: identify mismatch causing one-way switch and no-op header updates
next_action: read knowledge base and then inspect header/footer implementation and locale helpers

## Symptoms

expected: Footer/mobile language controls are visible and switching language updates links and localized labels consistently.
actual: Footer switches to English but does not return to Portuguese; header does not change anything.
errors: o footer muda pro ingles mas não volta pro português. o header não muda nada
reproduction: open public page, use footer/mobile language control to switch to en and then back to pt; use header language switcher and observe no visible update
started: observed in UAT test 4 during phase 05 multilingual-i18n

## Eliminated

## Evidence

## Resolution

root_cause:
fix:
verification:
files_changed: []
