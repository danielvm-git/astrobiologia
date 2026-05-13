# Test Quality Mandates

All tests in this directory must adhere to the following standards to maintain our high quality score (currently 88/100, Grade B):

## 1. Resilient Locators

- **Primary**: Use `page.getByTestId()` for all interactive elements (buttons, inputs).
- **Secondary**: Use ARIA roles (`page.getByRole()`) for semantic navigation and structural elements.
- **Forbidden**: Do not use brittle CSS classes (e.g., `.bg-slate-200`) or complex XPath selectors.

## 2. Deterministic Waiting

- **Mandate**: `page.waitForTimeout()` is FORBIDDEN.
- **Pattern**:
  - Use `page.waitForResponse()` before navigation to intercept API calls.
  - Use `expect().toBeVisible()` with custom timeouts for UI state changes.
  - Rely on Playwright's auto-waiting for most actions.

## 3. State Isolation & Cleanup

- **Fixture**: Use the `createdArticleIds` array from `base.fixture.ts` for all article creation tests.
- **Cleanup**: Ensure every test entity created (articles, categories, settings) has a corresponding teardown step in the fixture to prevent state leakage.
- **Parallelism**: All scenarios must be independent and capable of running in parallel (`fullyParallel: true`).

## 4. BDD Clarity

- Scenarios must follow a strict Given-When-Then structure in `.feature` files.
- Step definitions should be generic enough to be reused across different features.

---

_Reference: Test Quality Review 2026-05-13_
