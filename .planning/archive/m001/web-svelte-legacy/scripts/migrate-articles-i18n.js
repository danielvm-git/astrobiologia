/**
 * Phase 5, Plan 2: Migration to Relational Translation Pattern (v2)
 *
 * This script:
 * 1. Fetches all articles from the `articles` collection.
 * 2. Checks if a 'pt-br' translation already exists.
 * 3. Creates it if missing.
 */

import { Client, Databases, Query, ID } from "node-appwrite";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env manually
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");
const envLines = readFileSync(envPath, "utf-8").split("\n");
const env = {};
for (const line of envLines) {
  if (line && !line.startsWith("#")) {
    const [key, ...parts] = line.split("=");
    if (key) env[key.trim()] = parts.join("=").trim();
  }
}

const ENDPOINT = env.PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID = env.PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = env.APPWRITE_API_KEY;
const DATABASE_ID = env.PUBLIC_DATABASE_ID || "69e464fb0006a1b3c4eb";
const TRANSLATIONS_COLLECTION_ID = "article_translations";
const ARTICLES_COLLECTION_ID = env.PUBLIC_ARTICLES_COLLECTION_ID || "articles";

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error("❌ Missing required env vars. Check your .env file.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

async function migrate() {
  console.log(`🚀 Starting Corrected Article Migration\n`);

  const response = await databases.listDocuments(
    DATABASE_ID,
    ARTICLES_COLLECTION_ID,
    [Query.limit(100)]
  );
  const articles = response.documents;

  console.log(`Found ${articles.length} master articles.\n`);

  for (const article of articles) {
    console.log(`Checking: ${article.title} (${article.$id})`);

    try {
      // Check by specific article_id + language
      const existing = await databases.listDocuments(
        DATABASE_ID,
        TRANSLATIONS_COLLECTION_ID,
        [
          Query.equal("article_id", article.$id),
          Query.equal("language", "pt-br"),
        ]
      );

      if (existing.total > 0) {
        console.log(
          `  ⚠️  [SKIP] Translation already exists (ID: ${existing.documents[0].$id})`
        );
      } else {
        const translationData = {
          article_id: article.$id,
          language: "pt-br",
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || "",
          content: article.content,
          metaTitle: article.metaTitle || article.title,
          metaDescription: article.metaDescription || article.excerpt || "",
        };

        await databases.createDocument(
          DATABASE_ID,
          TRANSLATIONS_COLLECTION_ID,
          ID.unique(),
          translationData
        );
        console.log("  ✅ [CREATED] Translation added.");
      }
    } catch (e) {
      console.error(`  ❌ [ERROR]: ${e.message}`);
    }

    // Small throttle
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log("\n🎉 Migration process complete!");
}

migrate().catch((e) => {
  console.error("\n❌ Migration failed:", e.message);
  process.exit(1);
});
