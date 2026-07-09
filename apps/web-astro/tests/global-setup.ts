import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { type FullConfig } from "@playwright/test";
import { ensureSeedPublishedArticle } from "./helpers/appwriteTestClient";
import { loadE2eEnv } from "./helpers/e2eEnv";

// Use import.meta.url because Playwright may load global-setup as an ES module.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKIP_MARKER = path.resolve(__dirname, "..", "e2e-skip.marker");

export default async function globalSetup(_config: FullConfig) {
  loadE2eEnv();

  // Guard: if Appwrite is not configured, skip seeding.
  // This allows running E2E tests in environments without Appwrite access.
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const project = process.env.APPWRITE_PROJECT_ID;
  const key = process.env.APPWRITE_API_KEY;
  if (!endpoint || !project || !key) {
    console.log("ℹ Global Setup: Appwrite not configured; skipping seed.");
    fs.writeFileSync(SKIP_MARKER, "no-appwrite-config", "utf-8");
    return;
  }

  try {
    await ensureSeedPublishedArticle();
    console.log("✓ Global Setup: seed article ensured.");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);

    // Detect paused Appwrite project — skip E2E gracefully instead of failing CI.
    // Appwrite Cloud free-tier projects pause after 30 days of inactivity.
    if (/paused/i.test(msg)) {
      console.warn(
        "⚠ Global Setup: Appwrite project is PAUSED (free-tier inactivity)."
      );
      console.warn(
        "   E2E tests will be skipped until the project is restored."
      );
      console.warn(
        "   Restore: https://cloud.appwrite.io → select project → Restore"
      );
      fs.writeFileSync(SKIP_MARKER, "project-paused", "utf-8");

      // Also skip in CI: write GitHub step summary for visibility
      if (process.env.CI && process.env.GITHUB_STEP_SUMMARY) {
        fs.appendFileSync(
          process.env.GITHUB_STEP_SUMMARY,
          "### ⚠ E2E tests skipped: Appwrite project is paused\n\n" +
            "The Appwrite Cloud project used for E2E testing is paused due to inactivity.\n" +
            "Restore it from the [Appwrite Console](https://cloud.appwrite.io) to re-enable E2E tests.\n"
        );
      }
      return;
    }

    console.error("✗ Global Setup FAILED: Could not seed test data:", msg);
    throw err;
  }
}
