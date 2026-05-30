import { test as base, createBdd } from "playwright-bdd";
import { loadE2eEnv } from "../helpers/e2eEnv";
import { testRunId } from "../helpers/testRunId";

loadE2eEnv();

type TestFixtures = {
  createdArticleIds: string[];
  testDataPrefix: string;
};

export const test = base.extend<TestFixtures>({
  testDataPrefix: async ({}, use) => {
    await use(testRunId("fixture"));
  },
  createdArticleIds: async ({ page }, use) => {
    const ids: string[] = [];
    await use(ids);
    const failures: string[] = [];
    for (const id of ids) {
      try {
        const res = await page.request.delete(`/api/admin/articles/${id}`);
        if (!res.ok()) {
          failures.push(`${id} (HTTP ${res.status()})`);
        }
      } catch (err) {
        failures.push(`${id} (${String(err)})`);
      }
    }
    if (failures.length > 0) {
      console.warn(
        `[e2e cleanup] Failed to delete articles: ${failures.join(", ")}`
      );
    }
  },
});

export const { Given, When, Then, Before } = createBdd(test);
export { expect } from "@playwright/test";
