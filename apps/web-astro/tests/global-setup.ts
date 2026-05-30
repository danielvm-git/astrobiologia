import { chromium, type FullConfig } from "@playwright/test";
import { ensureSeedPublishedArticle } from "./helpers/appwriteTestClient";
import { loadE2eEnv } from "./helpers/e2eEnv";

export default async function globalSetup(_config: FullConfig) {
  loadE2eEnv();
  try {
    await ensureSeedPublishedArticle();
    console.log("Global Setup: seed article ensured.");
  } catch (err) {
    console.error("Failed to seed test data:", err);
  }
}
