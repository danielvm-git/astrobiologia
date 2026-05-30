#!/usr/bin/env node
/**
 * One-shot cleanup of E2E test articles left in Appwrite.
 * Usage: node scripts/cleanup-e2e-articles.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Client, Databases, Query } from "node-appwrite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const SEED_ARTICLE_ID = "e2e-seed-article-v1";
const E2E_RUNNER_AUTHOR_ID = "e2e-runner";

function loadEnv() {
  for (const file of [resolve(REPO_ROOT, ".env")]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf-8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (key && !(key in process.env)) process.env[key] = val;
    }
  }
}

function requireEnv(key) {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env: ${key}`);
  return val;
}

function isE2eArticle(doc) {
  const authorId = String(doc.authorId ?? "");
  if (authorId === E2E_RUNNER_AUTHOR_ID) return true;
  const title = String(doc.title ?? "");
  const slug = String(doc.slug ?? "");
  return (
    /e2e-/i.test(title) ||
    /e2e-/i.test(slug) ||
    /artigo de teste/i.test(title) ||
    /artigo para tradu/i.test(title) ||
    /novo artigo de teste/i.test(title) ||
    /existing article/i.test(title)
  );
}

async function deleteArticleWithTranslations(
  db,
  dbId,
  artColId,
  transColId,
  articleId
) {
  for (;;) {
    const translations = await db.listDocuments(dbId, transColId, [
      Query.equal("article_id", articleId),
      Query.limit(100),
    ]);
    if (translations.documents.length === 0) break;
    for (const t of translations.documents) {
      await db.deleteDocument(dbId, transColId, t.$id);
    }
    if (translations.documents.length < 100) break;
  }
  await db.deleteDocument(dbId, artColId, articleId);
}

async function main() {
  loadEnv();
  const client = new Client()
    .setEndpoint(requireEnv("APPWRITE_ENDPOINT"))
    .setProject(requireEnv("APPWRITE_PROJECT_ID"))
    .setKey(requireEnv("APPWRITE_API_KEY"));
  const db = new Databases(client);
  const dbId = requireEnv("DATABASE_ID");
  const artColId = requireEnv("ARTICLES_COLLECTION_ID");
  const transColId = requireEnv("ARTICLE_TRANSLATIONS_COLLECTION_ID");

  let deleted = 0;

  try {
    await db.updateDocument(dbId, artColId, SEED_ARTICLE_ID, {
      status: "draft",
      featured: false,
    });
    console.log("✓ Seed article unpublished (draft, not featured)");
  } catch {
    console.log("⊘ Seed article not found — skipped");
  }

  const res = await db.listDocuments(dbId, artColId, [Query.limit(100)]);
  for (const doc of res.documents) {
    if (doc.$id === SEED_ARTICLE_ID) continue;
    if (!isE2eArticle(doc)) continue;
    console.log(`→ deleting: ${doc.title}`);
    await deleteArticleWithTranslations(
      db,
      dbId,
      artColId,
      transColId,
      doc.$id
    );
    deleted++;
  }

  console.log(`\nDone. Deleted ${deleted} E2E article(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
