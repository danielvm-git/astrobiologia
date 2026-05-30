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

setup("admin storage state", async ({ page }) => {
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
