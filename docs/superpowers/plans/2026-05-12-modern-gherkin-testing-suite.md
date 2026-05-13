# Modern Gherkin Testing Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a spec-driven testing architecture for the Astro rebuild using Gherkin (Cucumber), Playwright, and Allure 3.0, covering both migrated and legacy features.

**Architecture:** Features grouped by page/domain, shared step definitions via a Cucumber World object, and real-time reporting using the Allure 3 Awesome plugin.

**Tech Stack:** Astro, Playwright, @cucumber/cucumber, playwright-bdd, allure-playwright, allure-js (v3).

---

### Task 1: Initialize Infrastructure & Dependencies

**Files:**

- Modify: `apps/web-astro/package.json`
- Create: `apps/web-astro/playwright.config.ts`
- Create: `apps/web-astro/allure.config.ts`

- [ ] **Step 1: Install testing dependencies**
      Run: `pnpm add -D @cucumber/cucumber playwright-bdd allure-playwright allure-js-commons @playwright/test` (in `apps/web-astro`)

- [ ] **Step 2: Configure Playwright for BDD & Allure**

```typescript
import { defineConfig, devices } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";

const testDir = defineBddConfig({
  paths: ["tests/features/**/*.feature"],
  importTestFrom: "tests/fixtures/base.fixture.ts",
});

export default defineConfig({
  testDir,
  reporter: [["html"], ["allure-playwright"]],
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 3: Configure Allure 3 Awesome Plugin**

```typescript
export default {
  outputFolder: "allure-results",
  plugins: {
    awesome: {
      options: {
        singleFile: true,
        reportName: "Astrobiologia Quality Map",
      },
    },
  },
};
```

- [ ] **Step 4: Commit Infrastructure**

```bash
git add apps/web-astro/package.json apps/web-astro/playwright.config.ts apps/web-astro/allure.config.ts
git commit -m "chore: setup gherkin and allure 3 infrastructure"
```

### Task 2: Create Base Fixtures & Common Steps

**Files:**

- Create: `apps/web-astro/tests/fixtures/base.fixture.ts`
- Create: `apps/web-astro/tests/steps/common.steps.ts`

- [ ] **Step 1: Define the Base Fixture**

```typescript
import { test as base, createBdd } from "playwright-bdd";

export const test = base.extend({});
export const { Given, When, Then } = createBdd(test);
```

- [ ] **Step 2: Implement Common Navigation & Auth Steps**

```typescript
import { Given, When, Then, expect } from "./base.fixture";

Given("the user is on the homepage", async ({ page }) => {
  await page.goto("/");
});

Given("the user navigates to {string}", async ({ page }, url: string) => {
  await page.goto(url);
});

Given("the user is logged in as admin", async ({ page }) => {
  // TODO: Implement actual login logic once auth is migrated
  await page.goto("/admin/login");
});

Then(
  "the page title should contain {string}",
  async ({ page }, title: string) => {
    await expect(page).toHaveTitle(new RegExp(title));
  }
);
```

- [ ] **Step 3: Commit Base Steps**

```bash
git add apps/web-astro/tests/fixtures/base.fixture.ts apps/web-astro/tests/steps/common.steps.ts
git commit -m "feat: add base fixtures and common steps"
```

### Task 3: Map Public Site Features (SDD)

**Files:**

- Create: `apps/web-astro/tests/features/homepage.feature`
- Create: `apps/web-astro/tests/features/articles.feature`
- Create: `apps/web-astro/tests/features/search.feature`
- Create: `apps/web-astro/tests/features/categories.feature`

- [ ] **Step 1: Write Homepage Feature Spec**

```gherkin
Feature: Homepage
  @p0 @smoke
  Scenario: Homepage loads correctly
    Given the user is on the homepage
    Then I should see the main navigation
    And I should see at least one article card
```

- [ ] **Step 2: Write Search Feature Spec (Legacy Gap)**

```gherkin
Feature: Search
  @p1 @migration-pending
  Scenario: User searches for an article
    Given the user navigates to "/busca"
    When they search for "exoplaneta"
    Then they should see relevant results
```

- [ ] **Step 3: Commit Public Features**

```bash
git add apps/web-astro/tests/features/*.feature
git commit -m "feat: map public site features including migration gaps"
```

### Task 4: Map Admin Panel Features (CRUD & Translation)

**Files:**

- Create: `apps/web-astro/tests/features/admin/editor.feature`
- Create: `apps/web-astro/tests/features/admin/translation.feature`

- [ ] **Step 1: Write Admin Editor Feature Spec**

```gherkin
Feature: Admin Article Editor
  @p0 @admin @migration-pending
  Scenario: Admin creates a new article
    Given the user is logged in as admin
    When they navigate to "/admin/artigos/new"
    And they fill in the article metadata
    And they write the article content in "pt-br"
    And they save the article
    Then the article should be created successfully
```

- [ ] **Step 2: Write Admin Translation Feature Spec**

```gherkin
Feature: Admin Translation Flow
  @p0 @admin @translation @migration-pending
  Scenario: Admin translates an article to English
    Given the user is editing an existing article
    When they click the "EN" translation tab
    And they click "Traduzir com DeepL"
    Then the English title and content should be populated
    When they save the translation
    Then the English version should be accessible at its slug
```

- [ ] **Step 3: Commit Admin Features**

```bash
git add apps/web-astro/tests/features/admin/*.feature
git commit -m "feat: map admin editor and translation features"
```

### Task 5: Finalize Reporting Dashboard

**Files:**

- Modify: `apps/web-astro/package.json`

- [ ] **Step 1: Add Reporting Scripts**
      Modify `package.json` to include:
      `"test:e2e": "playwright test"`,
      `"test:report": "allure generate allure-results --clean && allure open"`,
      `"test:watch": "allure watch allure-results"`

- [ ] **Step 2: Generate Initial Quality Map**
      Run: `pnpm test:e2e && pnpm test:report`
      Expected: Allure report shows passed tests for migrated features and failing/pending for others.

- [ ] **Step 3: Commit Final Setup**

```bash
git add apps/web-astro/package.json
git commit -m "chore: finalize quality map reporting scripts"
```
