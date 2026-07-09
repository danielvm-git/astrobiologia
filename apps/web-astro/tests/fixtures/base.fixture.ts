import fs from "node:fs";
import path from "node:path";
import { test as base, createBdd } from "playwright-bdd";
import { loadE2eEnv } from "../helpers/e2eEnv";
import { deleteE2eArticleById } from "../helpers/appwriteTestClient";
import { testRunId } from "../helpers/testRunId";

loadE2eEnv();

// Read skip marker written by global-setup when Appwrite is unavailable/paused.
// This lets CI pass green when infra is down rather than blocking on infra issues.
const SKIP_MARKER = path.resolve(__dirname, "..", "..", "e2e-skip.marker");
const skipReason = fs.existsSync(SKIP_MARKER)
  ? fs.readFileSync(SKIP_MARKER, "utf-8").trim()
  : null;

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
        await deleteE2eArticleById(id);
      } catch (err) {
        failures.push(`${id} (Appwrite: ${String(err)})`);
      }
      // Fallback: HTTP delete when Appwrite key unavailable in fixture context.
      try {
        const res = await page.request.delete(`/api/admin/articles/${id}`);
        if (!res.ok() && res.status() !== 404) {
          failures.push(`${id} (HTTP ${res.status()})`);
        }
      } catch (err) {
        if (!failures.some((f) => f.startsWith(id))) {
          failures.push(`${id} (${String(err)})`);
        }
      }
    }
    if (failures.length > 0) {
      console.warn(
        `[e2e cleanup] Failed to delete articles: ${failures.join(", ")}`
      );
    }
  },
});

// Skip all E2E tests when Appwrite infra is unavailable (paused / unconfigured).
// This keeps CI green and prevents blocking on external infra issues.
if (skipReason) {
  const reason = `E2E skipped: Appwrite unavailable (${skipReason}). Restore at https://cloud.appwrite.io`;
  test.beforeEach(async () => {
    test.skip(true, reason);
  });
}

export const { Given, When, Then, Before } = createBdd(test);
export { expect } from "@playwright/test";
