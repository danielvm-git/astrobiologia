/**
 * RESET AND MIGRATE article_translations
 *
 * This script wipes the article_translations collection and reruns the migration from master articles.
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

const ENDPOINT =
  env.PUBLIC_APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1";
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

async function resetAndMigrate() {
  console.log(`🚀 RESETTING and MIGRATING translations...\n`);

  // 1. Wipe translations
  console.log(`🧹 Wiping collection: ${TRANSLATIONS_COLLECTION_ID}`);
  const transResponse = await databases.listDocuments(
    DATABASE_ID,
    TRANSLATIONS_COLLECTION_ID,
    [Query.limit(100)]
  );
  for (const doc of transResponse.documents) {
    await databases.deleteDocument(
      DATABASE_ID,
      TRANSLATIONS_COLLECTION_ID,
      doc.$id
    );
    console.log(`  🗑️ Deleted translation: ${doc.$id}`);
  }

  // 2. Fetch master articles
  console.log(`\n📦 Fetching master articles...`);
  const response = await databases.listDocuments(
    DATABASE_ID,
    ARTICLES_COLLECTION_ID,
    [Query.limit(100)]
  );
  const articles = response.documents;
  console.log(`Found ${articles.length} master articles.\n`);

  // 3. Create fresh translations
  for (const article of articles) {
    console.log(
      `Creating PT translation for: ${article.title} (${article.$id})`
    );

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

    try {
      await databases.createDocument(
        DATABASE_ID,
        TRANSLATIONS_COLLECTION_ID,
        ID.unique(),
        translationData
      );
      console.log("  ✅ Created.");
    } catch (e) {
      console.error(`  ❌ Error: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 100));
  }

  console.log("\n🎉 Reset and migration complete!");
}

resetAndMigrate().catch((e) => {
  console.error("\n❌ Operation failed:", e.message);
  process.exit(1);
});
