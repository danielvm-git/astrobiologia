import { chromium, type FullConfig } from "@playwright/test";
import { ensureSeedPublishedArticle } from "./helpers/appwriteTestClient";
import { loadE2eEnv } from "./helpers/e2eEnv";

export default async function globalSetup(_config: FullConfig) {
  loadE2eEnv();

  // Guard: if Appwrite is not configured, skip seeding.
  // This allows running E2E tests in environments without Appwrite access.
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const project = process.env.APPWRITE_PROJECT_ID;
  const key = process.env.APPWRITE_API_KEY;
  if (!endpoint || !project || !key) {
    console.log("ℹ Global Setup: Appwrite not configured; skipping seed.");
    return;
  }

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
