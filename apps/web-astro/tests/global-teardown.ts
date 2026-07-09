import fs from "node:fs";
import path from "node:path";
import type { FullConfig } from "@playwright/test";
import { cleanupE2eArtifacts } from "./helpers/appwriteTestClient";
import { loadE2eEnv } from "./helpers/e2eEnv";

const SKIP_MARKER = path.resolve(__dirname, "..", "e2e-skip.marker");

export default async function globalTeardown(_config: FullConfig) {
  loadE2eEnv();

  const endpoint = process.env.APPWRITE_ENDPOINT;
  const project = process.env.APPWRITE_PROJECT_ID;
  const key = process.env.APPWRITE_API_KEY;
  if (!endpoint || !project || !key) {
    console.log(
      "ℹ Global Teardown: Appwrite not configured; skipping cleanup."
    );
    return;
  }

  try {
    await cleanupE2eArtifacts();
    console.log("✓ Global Teardown: E2E artifacts cleaned up.");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("⚠ Global Teardown: cleanup failed:", msg);
  }

  // Always remove skip marker so next run evaluates Appwrite availability fresh.
  try {
    if (fs.existsSync(SKIP_MARKER)) fs.unlinkSync(SKIP_MARKER);
  } catch {
    // best-effort
  }
}
