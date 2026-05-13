import { defineConfig } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
import { existsSync, readFileSync } from "fs";

// Load .env.test for local E2E credentials without requiring dotenv as a dep
if (existsSync(".env.test")) {
  for (const line of readFileSync(".env.test", "utf-8").split("\n")) {
    const eq = line.indexOf("=");
    if (eq > 0 && !line.startsWith("#")) {
      const key = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim();
      if (key && !(key in process.env)) process.env[key] = val;
    }
  }
}

const testDir = defineBddConfig({
  paths: ["tests/features/**/*.feature"],
  steps: ["tests/steps/**/*.ts", "tests/fixtures/base.fixture.ts"],
});

export default defineConfig({
  testDir,
  grepInvert: /@wip/,
  globalSetup: "./tests/global-setup",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 60_000,
  reporter: [["html", { open: "never" }], ["allure-playwright"]],
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
  },
});
