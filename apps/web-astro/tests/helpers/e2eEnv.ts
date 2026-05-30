import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WEB_ASTRO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);
const REPO_ROOT = path.resolve(WEB_ASTRO_ROOT, "..");

const E2E_ENV_KEYS = [
  "APPWRITE_ENDPOINT",
  "APPWRITE_PROJECT_ID",
  "APPWRITE_API_KEY",
  "DATABASE_ID",
  "ARTICLES_COLLECTION_ID",
  "ARTICLE_TRANSLATIONS_COLLECTION_ID",
  "CATEGORIES_COLLECTION_ID",
  "STORAGE_BUCKET_ID",
  "SITE_SETTINGS_COLLECTION_ID",
  "DEEPL_API_KEY",
  "PUBLIC_APPWRITE_ENDPOINT",
  "PUBLIC_APPWRITE_PROJECT_ID",
  "PUBLIC_STORAGE_BUCKET_ID",
  "E2E_ADMIN_EMAIL",
  "E2E_ADMIN_PASSWORD",
  "TEST_USER_EMAIL",
  "TEST_USER_PASSWORD",
] as const;

function parseEnvFile(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) return {};
  const vars: Record<string, string> = {};
  for (const line of readFileSync(filePath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (key) vars[key] = val;
  }
  return vars;
}

let loaded = false;

/** Load .env.test (web-astro) then repo-root .env without overwriting existing process.env. */
export function loadE2eEnv(): void {
  if (loaded) return;
  loaded = true;
  const files = [
    path.join(WEB_ASTRO_ROOT, ".env.test"),
    path.join(WEB_ASTRO_ROOT, ".env"),
    path.join(REPO_ROOT, ".env"),
  ];
  for (const file of files) {
    for (const [key, val] of Object.entries(parseEnvFile(file))) {
      if (!(key in process.env)) process.env[key] = val;
    }
  }
}

export function getE2eAdminEmail(): string | undefined {
  loadE2eEnv();
  return process.env.E2E_ADMIN_EMAIL ?? process.env.TEST_USER_EMAIL;
}

export function getE2eAdminPassword(): string | undefined {
  loadE2eEnv();
  return process.env.E2E_ADMIN_PASSWORD ?? process.env.TEST_USER_PASSWORD;
}

export function requireE2eAdminCredentials(): {
  email: string;
  password: string;
} {
  const email = getE2eAdminEmail();
  const password = getE2eAdminPassword();
  if (!email || !password) {
    throw new Error(
      "E2E admin credentials required. Set E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD " +
        "(or TEST_USER_EMAIL/TEST_USER_PASSWORD) in .env or apps/web-astro/.env.test"
    );
  }
  return { email, password };
}

/** Env vars forwarded to the Astro preview server during E2E. */
export function getE2eServerEnv(): Record<string, string> {
  loadE2eEnv();
  const env: Record<string, string> = {};
  for (const key of E2E_ENV_KEYS) {
    const value = process.env[key];
    if (value) env[key] = value;
  }
  return env;
}

// Bootstrap when imported from Playwright config or step modules.
loadE2eEnv();
