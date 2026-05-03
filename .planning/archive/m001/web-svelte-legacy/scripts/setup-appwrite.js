// One-time setup script for Appwrite database, collection and storage
// Run with: node scripts/setup-appwrite.js

import { Client, Databases, Storage, Users, ID } from "node-appwrite";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env manually (no dotenv dependency needed)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env");
const env = Object.fromEntries(
  readFileSync(envPath, "utf-8")
    .split("\n")
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => l.split("=").map((p) => p.trim()))
    .filter(([k]) => k)
);

const ENDPOINT = env.PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = env.PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = env.APPWRITE_API_KEY;
const DATABASE_ID = "69e464fb0006a1b3c4eb";
const ARTICLES_COLLECTION_ID = "articles";
const STORAGE_BUCKET_ID = "images";

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
  console.error("❌ Missing required env vars. Check your .env file.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

async function setup() {
  console.log("🚀 Setting up Appwrite...\n");

  // 1. Ensure database exists (skip creation on free plan — use existing)
  try {
    await databases.create(DATABASE_ID, "Astrobiologia");
    console.log("✅ Database created: 69e464fb0006a1b3c4eb");
  } catch (e) {
    if (
      e.code === 409 ||
      (e.message && e.message.includes("maximum number of databases"))
    ) {
      console.log(
        "⚠️  Database already exists, continuing with existing database..."
      );
    } else {
      throw e;
    }
  }

  // 2. Create articles collection
  try {
    await databases.createCollection(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      "Articles",
      ['read("any")'] // public read
    );
    console.log("✅ Collection created: articles");
  } catch (e) {
    if (e.code === 409) {
      console.log("⚠️  Collection already exists, checking attributes...");
    } else {
      throw e;
    }
  }

  // 3. Create attributes
  console.log("\n📋 Creating attributes...");
  const stringAttrs = [
    { key: "title", size: 255, required: true },
    { key: "slug", size: 255, required: true },
    { key: "excerpt", size: 1000, required: true },
    { key: "content", size: 1000000, required: true },
    { key: "category", size: 100, required: true },
    { key: "authorId", size: 255, required: true },
    { key: "authorName", size: 255, required: true },
    { key: "featuredImage", size: 255, required: false },
    { key: "featuredImageAlt", size: 255, required: false },
    { key: "metaTitle", size: 255, required: false },
    { key: "metaDescription", size: 500, required: false },
  ];

  for (const attr of stringAttrs) {
    try {
      await databases.createStringAttribute(
        DATABASE_ID,
        ARTICLES_COLLECTION_ID,
        attr.key,
        attr.size,
        attr.required
      );
      console.log(`  ✅ ${attr.key}`);
    } catch (e) {
      console.log(`  ⚠️  ${attr.key}: ${e.message}`);
    }
    await delay(300); // Appwrite needs a moment between attribute creations
  }

  // Tags array
  try {
    await databases.createStringAttribute(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      "tags",
      100,
      false,
      undefined,
      true
    );
    console.log("  ✅ tags (array)");
  } catch (e) {
    console.log(`  ⚠️  tags: ${e.message}`);
  }
  await delay(300);

  // Status enum
  try {
    await databases.createEnumAttribute(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      "status",
      ["draft", "published"],
      true
    );
    console.log("  ✅ status (enum)");
  } catch (e) {
    console.log(`  ⚠️  status: ${e.message}`);
  }
  await delay(300);

  // Featured boolean
  try {
    await databases.createBooleanAttribute(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      "featured",
      true
    );
    console.log("  ✅ featured (boolean)");
  } catch (e) {
    console.log(`  ⚠️  featured: ${e.message}`);
  }
  await delay(300);

  // PublishedAt datetime
  try {
    await databases.createDatetimeAttribute(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      "publishedAt",
      false
    );
    console.log("  ✅ publishedAt (datetime)");
  } catch (e) {
    console.log(`  ⚠️  publishedAt: ${e.message}`);
  }
  await delay(500);

  // 4. Create indexes
  console.log("\n🔍 Creating indexes...");
  try {
    await databases.createIndex(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      "slug_index",
      "unique",
      ["slug"]
    );
    console.log("  ✅ slug (unique index)");
  } catch (e) {
    console.log(`  ⚠️  slug index: ${e.message}`);
  }
  await delay(300);
  try {
    await databases.createIndex(
      DATABASE_ID,
      ARTICLES_COLLECTION_ID,
      "status_index",
      "key",
      ["status"]
    );
    console.log("  ✅ status (index)");
  } catch (e) {
    console.log(`  ⚠️  status index: ${e.message}`);
  }

  await createStorageBucket();
  await createAdminUser();
}

async function createAdminUser() {
  console.log("\n👤 Creating admin user...");
  const users = new Users(client);
  const adminEmail = env.APPWRITE_ADMIN_EMAIL;
  const adminPassword = env.APPWRITE_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log(
      "⚠️  Skipping user creation: APPWRITE_ADMIN_EMAIL or APPWRITE_ADMIN_PASSWORD not set in .env"
    );
    return;
  }

  try {
    await users.create(
      ID.unique(),
      adminEmail,
      undefined,
      adminPassword,
      "Admin"
    );
    console.log(`✅ Admin user created: ${adminEmail}`);
  } catch (e) {
    if (e.code === 409) {
      console.log("⚠️  User already exists or email taken, skipping...");
    } else {
      console.log(`⚠️  User creation failed: ${e.message}`);
    }
  }
}

async function createStorageBucket() {
  // 5. Create storage bucket
  console.log("\n🗂️  Creating storage bucket...");
  try {
    await storage.createBucket(STORAGE_BUCKET_ID, "Images", ['read("any")']);
    console.log("✅ Storage bucket created: images");
  } catch (e) {
    if (e.code === 409) {
      console.log("⚠️  Storage bucket already exists, skipping...");
    } else {
      console.log(`⚠️  Storage bucket: ${e.message}`);
    }
  }

  console.log("\n🎉 Setup complete! Your Appwrite project is ready.");
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

setup().catch((e) => {
  console.error("\n❌ Setup failed:", e.message);
  process.exit(1);
});
