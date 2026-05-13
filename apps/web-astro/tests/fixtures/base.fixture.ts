import { test as base, createBdd } from "playwright-bdd";

type TestFixtures = {
  createdArticleIds: string[];
};

export const test = base.extend<TestFixtures>({
  createdArticleIds: async ({ page }, use) => {
    const ids: string[] = [];
    await use(ids);
    for (const id of ids) {
      try {
        // Use page.evaluate so the browser's session cookie is included in the request
        await page.evaluate(async (articleId) => {
          await fetch(`/api/admin/articles/${articleId}`, { method: "DELETE" });
        }, id);
      } catch {
        // best-effort: don't fail the test on cleanup failure
      }
    }
  },
});

export const { Given, When, Then } = createBdd(test);
export { expect } from "@playwright/test";
