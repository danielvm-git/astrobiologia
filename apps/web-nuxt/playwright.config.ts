import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:4174",
    trace: "on-first-retry",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      testDir: "./tests/e2e",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "api",
      testDir: "./tests/api",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run build && npm run preview -- --port 4174",
    port: 4174,
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000,
  },
});
