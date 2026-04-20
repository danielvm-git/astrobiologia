---
status: complete
phase: 05-multilingual-i18n
source:
  - 05-01-SUMMARY.md
  - 05-02-SUMMARY.md
  - 05-03-SUMMARY.md
  - 05-04-SUMMARY.md
started: 2026-04-20T12:56:38Z
updated: 2026-04-20T13:13:40Z
---

## Current Test

[testing complete]

## Tests

### 1. Cold Start Smoke Test
expected: With no app process running, start the app from a clean state and verify it boots without startup errors. Opening the home page should load normally and show real site content.
result: pass

### 2. Locale Redirect and Routing
expected: Accessing the root route redirects to a language-aware route, and navigating between localized URLs keeps the correct language context.
result: issue
reported: "npm run preflight ... [500] GET /busca Error: Cannot access url.searchParams on a page with prerendering enabled"
severity: blocker

### 3. Header Language Switcher
expected: Using the language switcher in the header changes the URL locale and updates visible UI text without broken navigation.
result: issue
reported: "troquei pro ingles e o menu permanece igual. pisca mais não muda"
severity: major

### 4. Footer and Mobile Language Switcher
expected: Footer/mobile language controls are visible and switching language updates links and localized labels consistently.
result: issue
reported: "o footer muda pro ingles mas não volta pro português. o header não muda nada"
severity: major

### 5. Localized Homepage and Article Listings
expected: Homepage and listing pages show content in the selected locale, including translated titles/summaries when available.
result: issue
reported: "no, npthing changes"
severity: major

### 6. Localized Article Detail
expected: Opening an article in each locale shows the corresponding translation and keeps canonical navigation within that locale.
result: issue
reported: "somethimes it changes sometimes not, i can see the article in english and portuguese"
severity: minor

### 7. SEO Alternate/Cross-Language Tags
expected: Public pages include language alternates and canonical metadata aligned with the current locale URL.
result: issue
reported: "cannot see"
severity: major

### 8. Sitemap Localized Entries
expected: The sitemap includes localized variants for core pages and articles instead of only one language version.
result: issue
reported: "cannot see"
severity: major

### 9. Admin Editor Language Tabs
expected: In admin article editor, switching between language tabs allows editing each translation while preserving shared master metadata fields.
result: pass

### 10. Create and Update Translations in Admin
expected: Creating/updating an article with multiple language versions persists each translation correctly and reloading the editor shows saved values per locale.
result: pass

## Summary

total: 10
passed: 3
issues: 7
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "Accessing the root route redirects to a language-aware route, and navigating between localized URLs keeps the correct language context."
  status: failed
  reason: "User reported: npm run preflight ... [500] GET /busca Error: Cannot access url.searchParams on a page with prerendering enabled"
  severity: blocker
  test: 2
  artifacts: []
  missing: []
- truth: "Using the language switcher in the header changes the URL locale and updates visible UI text without broken navigation."
  status: failed
  reason: "User reported: troquei pro ingles e o menu permanece igual. pisca mais não muda"
  severity: major
  test: 3
  artifacts: []
  missing: []
- truth: "Footer/mobile language controls are visible and switching language updates links and localized labels consistently."
  status: failed
  reason: "User reported: o footer muda pro ingles mas não volta pro português. o header não muda nada"
  severity: major
  test: 4
  artifacts: []
  missing: []
- truth: "Homepage and listing pages show content in the selected locale, including translated titles/summaries when available."
  status: failed
  reason: "User reported: no, npthing changes"
  severity: major
  test: 5
  artifacts: []
  missing: []
- truth: "Opening an article in each locale shows the corresponding translation and keeps canonical navigation within that locale."
  status: failed
  reason: "User reported: somethimes it changes sometimes not, i can see the article in english and portuguese"
  severity: minor
  test: 6
  artifacts: []
  missing: []
- truth: "Public pages include language alternates and canonical metadata aligned with the current locale URL."
  status: failed
  reason: "User reported: cannot see"
  severity: major
  test: 7
  artifacts: []
  missing: []
- truth: "The sitemap includes localized variants for core pages and articles instead of only one language version."
  status: failed
  reason: "User reported: cannot see"
  severity: major
  test: 8
  artifacts: []
  missing: []
