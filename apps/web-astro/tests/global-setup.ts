import { chromium, type FullConfig } from "@playwright/test";
import { ensureSeedPublishedArticle } from "./helpers/appwriteTestClient";
import { loadE2eEnv } from "./helpers/e2eEnv";

export default async function globalSetup(_config: FullConfig) {
  loadE2eEnv();
  try {
    await ensureSeedPublishedArticle();
    console.log("✓ Global Setup: seed article ensured.");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("✗ Global Setup FAILED: Could not seed test data:", msg);
    // Fail hard — don't proceed if seeding fails, as P0 tests depend on it
    throw err;
  }
}
