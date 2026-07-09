import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test as setup, expect } from "@playwright/test";
import {
  getE2eAdminEmail,
  getE2eAdminPassword,
  loadE2eEnv,
} from "./helpers/e2eEnv";
import { createAdminSessionViaApi } from "./helpers/e2eAuthBootstrap";
import {
  ADMIN_AUTH_FILE,
  writeAdminStorageState,
} from "./helpers/adminStorageState";

loadE2eEnv();

// Read skip marker written by global-setup when Appwrite is unavailable.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKIP_MARKER = path.resolve(__dirname, "..", "e2e-skip.marker");

setup("admin storage state", async ({ page }) => {
  // Check skip marker before attempting any Appwrite operations.
  if (fs.existsSync(SKIP_MARKER)) {
    const reason = fs.readFileSync(SKIP_MARKER, "utf-8").trim();
    // Write an empty storage state so dependent projects don't crash on missing file.
    // Their BDD Before hooks will skip tests when the marker is present.
    writeAdminStorageState({
      name: `a_session_${process.env.APPWRITE_PROJECT_ID ?? "_"}`,
      value: "skipped",
      expires: Date.now() / 1000 + 3600,
    });
    setup.skip(true, `E2E skipped: Appwrite unavailable (${reason})`);
    return;
  }

  const email = getE2eAdminEmail();
  const password = getE2eAdminPassword();

  if (email && password) {
    await page.goto("/admin/login");
    await page.locator("input[type='email']").fill(email);
    await page.locator("input[type='password']").fill(password);
    await page.getByRole("button", { name: /entrar/i }).click();
    await page.waitForURL(/\/admin$/, { timeout: 15000 });
    await expect(
      page.getByRole("heading", { name: /painel de controle/i })
    ).toBeVisible();
    await page.context().storageState({ path: ADMIN_AUTH_FILE });
    return;
  }

  const sessionCookie = await createAdminSessionViaApi();
  if (!sessionCookie) {
    setup.skip(
      true,
      "E2E admin credentials or Appwrite API key not configured"
    );
    return;
  }

  writeAdminStorageState(sessionCookie);
});
