import { chromium, type FullConfig } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const AUTH_FILE = path.join(process.cwd(), "tests/.auth/admin.json");

export default async function globalSetup(_config: FullConfig) {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) return;

  mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto("http://localhost:4321/admin/login");
    const status = await page.evaluate(
      async ({ e, p }) => {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: e, password: p }),
        });
        return res.status;
      },
      { e: email, p: password }
    );
    if (status !== 200) {
      throw new Error(`Admin login failed with status ${status}`);
    }
    await context.storageState({ path: AUTH_FILE });
  } finally {
    await browser.close();
  }
}
