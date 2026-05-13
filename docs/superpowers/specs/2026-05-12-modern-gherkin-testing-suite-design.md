# Spec: Modern Gherkin Testing Suite for Astro

**Date:** 2026-05-12  
**Status:** Draft  
**Topic:** Implementing a modern, spec-driven testing architecture for the Astrobiologia Astro rebuild.

---

## 1. Overview

This specification outlines the architecture for a Gherkin-based testing suite. Following "Vibe Coding" and Spec-Driven Development (SDD) principles, the suite serves as the executable source of truth for site features, providing high-fidelity visual feedback to the developer.

## 2. Goals

- **Spec-Driven Development:** Feature files act as the primary design and validation artifacts.
- **Page-by-Page Coverage:** Visual representation of site health and coverage.
- **Modern Tech Stack:** Leveraging Playwright, Cucumber-JS, and Allure 3.0.
- **Astro Optimization:** Tests run against production-like preview builds.
- **Migration Tracking:** Includes specs for features still in the legacy Nuxt app to track migration progress.

## 3. Architecture

### 3.1. Directory Structure (apps/web-astro/)

```text
tests/
├── features/           # Gherkin .feature files grouped by page/domain
│   ├── homepage.feature
│   ├── articles.feature
│   ├── search.feature  (Legacy Migration)
│   ├── categories.feature (Legacy Migration)
│   └── admin/          # Admin domain specs
│       ├── auth.feature
│       ├── dashboard.feature
│       ├── editor.feature
│       ├── translation.feature
│       └── settings.feature
├── steps/              # Cucumber step definitions (TypeScript)
│   ├── common.steps.ts
│   ├── homepage.steps.ts
│   └── admin.steps.ts
├── fixtures/           # Page Objects and test data
│   └── base.fixture.ts
├── allure.config.ts    # Allure 3.0 configuration
└── playwright.config.ts # Playwright E2E configuration
```

### 3.2. Tools & Integration

- **Test Runner:** Playwright (for E2E and browser-based component tests).
- **BDD Framework:** `@cucumber/cucumber` integrated via `playwright-bdd`.
- **Reporting:** **Allure 3.0** with the **Awesome** plugin.
- **Component Testing:** Astro's **Container API** (`AstroContainer`) for rendering `.astro` components in isolation.

## 4. Workflows

### 4.1. Local Development (Vibe Coding Loop)

1. **Define:** Write/Update `.feature` file.
2. **Execute:** Run `npm run test:ui` (Playwright UI Mode).
3. **Watch:** Use `allure watch` (Allure 3) for real-time result updates in the browser.

### 4.2. Continuous Quality

- Tests are executed against `npm run preview` to ensure parity with production.
- Metadata tags in Gherkin (`@p0`, `@smoke`, `@slug`) map directly to categories in the Allure report.

## 5. Implementation Strategy

- **Phase 1: Infrastructure.** Set up Cucumber-JS, Playwright, and Allure 3.0.
- **Phase 2: Base Steps.** Implement common navigation and i18n steps.
- **Phase 3: Public Features.** Homepage, Articles, Search, Categories.
- **Phase 4: Admin Features.** Auth, Dashboard, Editor (CRUD + Translation), Settings.
- **Phase 5: Reporting.** Configure Allure Awesome plugin and "Quality Gates".

---

## 6. Self-Review Notes

- **Placeholder scan:** None.
- **Consistency:** Aligned with Allure 3.0 new features and Astro 4.9+ Container API.
- **Scope:** Includes migration gaps (Search, Categories, Admin) to serve as a complete project status map.
- **Ambiguity:** Explicitly choosing Git-Centric SDD over external TMS for Vibe Coding compatibility.
