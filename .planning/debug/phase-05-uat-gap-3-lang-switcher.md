---
status: investigating
trigger: "Diagnose one UAT gap for phase 05 multilingual-i18n. Gap test #3: switching header language updates URL locale, UI text, and keeps navigation intact. Report: 'troquei pro ingles e o menu permanece igual. pisca mais não muda'"
created: 2026-04-20T13:16:22Z
updated: 2026-04-20T13:16:22Z
---

## Current Focus

hypothesis: Header language switcher updates locale in URL, but the i18n store used by header labels is not being updated/reactively consumed.
test: Inspect header switcher flow, locale resolution, and translation source for menu labels; then verify whether route changes trigger translation recomputation.
expecting: If hypothesis is true, URL locale changes while header labels stay in previous language because labels read stale/independent state.
next_action: Check knowledge base for matching i18n stale-state patterns, then inspect UAT and i18n implementation files.

## Symptoms

expected: Using header language switcher changes URL locale and visible UI text without broken navigation.
actual: User switched to English, menu stayed the same; UI flickers but text does not change.
errors: none reported; behavioral bug ("pisca mas não muda")
reproduction: Open site in one locale, use header language selector to switch to English, observe header menu text.
started: not provided

## Eliminated

## Evidence

## Resolution

root_cause:
fix:
verification:
files_changed: []
