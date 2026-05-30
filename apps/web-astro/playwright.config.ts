import { defineConfig } from "@playwright/test";
import { defineBddConfig } from "playwright-bdd";
import { getE2eServerEnv, loadE2eEnv } from "./tests/helpers/e2eEnv";
import { ADMIN_AUTH_FILE } from "./tests/helpers/adminStorageState";

loadE2eEnv();

const testDir = defineBddConfig({
  paths: ["tests/features/**/*.feature"],
  steps: ["tests/steps/**/*.ts", "tests/fixtures/base.fixture.ts"],
});

export default defineConfig({
  testDir,
  grepInvert: /@wip/,
  globalSetup: "./tests/global-setup",
  globalTeardown: "./tests/global-teardown",
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
    reuseExistingServer: false,
    env: getE2eServerEnv(),
  },
  projects: [
    {
      name: "setup",
      testDir: ".",
      testMatch: /tests\/auth\.setup\.ts/,
    },
    {
      name: "public-smoke",
      grep: /@p0/,
      grepInvert: /@admin|@deepl/,
    },
    {
      name: "admin-crud",
      grep: /(?=.*@p0)(?=.*@admin)/,
      grepInvert: /@deepl/,
      fullyParallel: false,
      workers: 1,
      dependencies: ["setup"],
      use: { storageState: ADMIN_AUTH_FILE },
    },
    {
      name: "admin-extended",
      grep: /(?=.*@p1)(?=.*@admin)/,
      grepInvert: /@deepl|@isolated|@wip/,
      dependencies: ["setup"],
      use: { storageState: ADMIN_AUTH_FILE },
    },
    {
      name: "external",
      grep: /@deepl/,
      fullyParallel: false,
      workers: 1,
      dependencies: ["setup"],
      use: { storageState: ADMIN_AUTH_FILE },
    },
    {
      name: "isolated",
      grep: /@isolated/,
      fullyParallel: false,
      workers: 1,
      dependencies: [
        "setup",
        "public-smoke",
        "admin-crud",
        "admin-extended",
        "external",
      ],
      use: { storageState: ADMIN_AUTH_FILE },
    },
  ],
});
