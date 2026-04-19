/**
 * Phase 5, Plan 2: Database Schema Update for i18n
 * 
 * This script:
 * 1. Creates the `article_translations` collection.
 * 2. Adds attributes to `article_translations`.
 * 3. Adds indexes to `article_translations`.
 * 4. Adds i18n-related attributes to the existing `articles` collection.
 */

import { Client, Databases, ID } from 'node-appwrite';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Load .env manually
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');
const envLines = readFileSync(envPath, 'utf-8').split('\n');
const env = {};
for (const line of envLines) {
    if (line && !line.startsWith('#')) {
        const [key, ...parts] = line.split('=');
        if (key) env[key.trim()] = parts.join('=').trim();
    }
}

const ENDPOINT = env.PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const PROJECT_ID = env.PUBLIC_APPWRITE_PROJECT_ID;
const API_KEY = env.APPWRITE_API_KEY;
const DATABASE_ID = env.PUBLIC_DATABASE_ID || '69e464fb0006a1b3c4eb';
const TRANSLATIONS_COLLECTION_ID = 'article_translations';
const ARTICLES_COLLECTION_ID = env.PUBLIC_ARTICLES_COLLECTION_ID || 'articles';

if (!ENDPOINT || !PROJECT_ID || !API_KEY) {
    console.error('❌ Missing required env vars (ENDPOINT, PROJECT_ID, API_KEY). Check your .env file.');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new Databases(client);

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function setup() {
    console.log('🚀 Updating Appwrite Schema for i18n...\n');

    // 1. Create article_translations collection
    try {
        await databases.createCollection(
            DATABASE_ID,
            TRANSLATIONS_COLLECTION_ID,
            'Article Translations',
            ['read("any")'] // public read
        );
        console.log('✅ Collection created: article_translations');
    } catch (e) {
        if (e.code === 409) {
            console.log('⚠️  Collection article_translations already exists, continuing...');
        } else {
            throw e;
        }
    }
    await delay(1000);

    // 2. Create attributes for article_translations
    console.log('\n📋 Creating attributes for article_translations...');
    const translationAttrs = [
        { key: 'article_id', type: 'string', size: 255, required: true },
        { key: 'language', type: 'string', size: 10, required: true },
        { key: 'title', type: 'string', size: 255, required: true },
        { key: 'slug', type: 'string', size: 255, required: true },
        { key: 'excerpt', type: 'string', size: 1000, required: false },
        { key: 'content', type: 'string', size: 1000000, required: true },
        { key: 'metaTitle', type: 'string', size: 255, required: false },
        { key: 'metaDescription', type: 'string', size: 500, required: false },
    ];

    for (const attr of translationAttrs) {
        try {
            if (attr.type === 'string') {
                await databases.createStringAttribute(DATABASE_ID, TRANSLATIONS_COLLECTION_ID, attr.key, attr.size, attr.required);
            }
            console.log(`  ✅ ${attr.key}`);
            await delay(500);
        } catch (e) {
            if (e.code === 409) {
                console.log(`  ⚠️  ${attr.key} already exists`);
            } else {
                console.log(`  ❌ Error creating ${attr.key}: ${e.message}`);
            }
        }
    }

    // 3. Create indexes for article_translations
    console.log('\n🔍 Creating indexes for article_translations...');
    try {
        await databases.createIndex(DATABASE_ID, TRANSLATIONS_COLLECTION_ID, 'slug_index', 'unique', ['slug']);
        console.log('  ✅ slug (unique index)');
        await delay(500);
    } catch (e) {
        console.log(`  ⚠️  slug index: ${e.message}`);
    }

    try {
        await databases.createIndex(DATABASE_ID, TRANSLATIONS_COLLECTION_ID, 'article_lang_index', 'unique', ['article_id', 'language']);
        console.log('  ✅ article_id + language (unique index)');
        await delay(500);
    } catch (e) {
        console.log(`  ⚠️  article_lang index: ${e.message}`);
    }

    // 4. Update articles collection (add language and translationId)
    console.log('\n📋 Updating articles collection with i18n fields...');
    try {
        await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'language', 10, false, 'pt-br');
        console.log('  ✅ language');
        await delay(500);
    } catch (e) {
        console.log(`  ⚠️  language: ${e.message}`);
    }

    try {
        await databases.createStringAttribute(DATABASE_ID, ARTICLES_COLLECTION_ID, 'translationId', 255, false);
        console.log('  ✅ translationId');
        await delay(500);
    } catch (e) {
        console.log(`  ⚠️  translationId: ${e.message}`);
    }

    console.log('\n🎉 Schema update complete!');
}

setup().catch(e => {
    console.error('\n❌ Setup failed:', e.message);
    process.exit(1);
});
