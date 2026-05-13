/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly APPWRITE_ENDPOINT: string;
  readonly APPWRITE_PROJECT_ID: string;
  readonly APPWRITE_API_KEY: string;
  readonly DATABASE_ID: string;
  readonly ARTICLES_COLLECTION_ID: string;
  readonly ARTICLE_TRANSLATIONS_COLLECTION_ID: string;
  readonly CATEGORIES_COLLECTION_ID: string;
  readonly STORAGE_BUCKET_ID: string;
  readonly SITE_SETTINGS_COLLECTION_ID: string;
  readonly DEEPL_API_KEY: string;
  readonly APPWRITE_SITE_ID: string;
  readonly PUBLIC_APPWRITE_ENDPOINT: string;
  readonly PUBLIC_APPWRITE_PROJECT_ID: string;
  readonly PUBLIC_STORAGE_BUCKET_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    user: import("node-appwrite").Models.User<Record<string, unknown>> | null;
  }
}
