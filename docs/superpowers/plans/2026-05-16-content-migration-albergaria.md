# Danilo Albergaria Content Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Purge all dummy data and import 12 professional science journalism articles by Danilo Albergaria into Appwrite.

**Architecture:** A standalone TypeScript migration script using `node-appwrite` and existing project libraries. The script will be executed in three stages: Purge, Extract, and Import.

**Tech Stack:** TypeScript, `node-appwrite`, `node-fetch`.

---

### Task 1: Script Skeleton & Environment

**Files:**

- Create: `scripts/migrate-albergaria.ts`

- [ ] **Step 1: Create the migration script directory and file**

```bash
mkdir -p scripts
touch scripts/migrate-albergaria.ts
```

- [ ] **Step 2: Add imports and configuration**

```typescript
import { Client, Databases, Storage, Query, ID } from "node-appwrite";
import { getEnv } from "../apps/web-astro/src/lib/appwrite";

const ARTICLE_URLS = [
  "https://revistapesquisa.fapesp.br/fritz-muller-ganha-site-com-exposicao-virtual-e-books-e-artigos/",
  "https://revistapesquisa.fapesp.br/ameaca-imprevista-a-etnobotanica/",
  "https://revistapesquisa.fapesp.br/experimentos-avancam-na-manipulacao-das-interacoes-entre-ondas-acusticas-e-de-luz/",
  "https://revistapesquisa.fapesp.br/costa-ribeiro-descobriu-fontes-inesperadas-de-eletricidade/",
  "https://revistapesquisa.fapesp.br/atomos-gigantes-podem-ser-a-base-de-sensores-quanticos-mais-refinados/",
  "https://revistapesquisa.fapesp.br/cerveja-gelada-por-mais-tempo/",
  "https://revistapesquisa.fapesp.br/fenomeno-misterioso-da-agua-tambem-pode-ser-produzido-em-sistemas-quanticos/",
  "https://revistapesquisa.fapesp.br/o-ceu-visto-das-missoes/",
  "https://revistapesquisa.fapesp.br/as-raizes-da-fome/",
  "https://revistapesquisa.fapesp.br/morre-luiz-pinguelli-rosa-fisico-especialista-em-energia/",
  "https://www.comciencia.br/o-eclipse-de-1919-e-as-disputas-pela-ciencia/",
  "https://www.fcw.org.br/culturacientifica6/danilo-albergaria",
];

const client = new Client()
  .setEndpoint(getEnv("APPWRITE_ENDPOINT"))
  .setProject(getEnv("APPWRITE_PROJECT_ID"))
  .setKey(getEnv("APPWRITE_API_KEY"));

const databases = new Databases(client);
const storage = new Storage(client);
const dbId = getEnv("DATABASE_ID");
const articlesId = getEnv("ARTICLES_COLLECTION_ID");
const translationsId = getEnv("ARTICLE_TRANSLATIONS_COLLECTION_ID");
const bucketId = getEnv("STORAGE_BUCKET_ID");
```

- [ ] **Step 3: Commit skeleton**

```bash
git add scripts/migrate-albergaria.ts
git commit -m "feat: add migration script skeleton"
```

---

### Task 2: Purge Logic

**Files:**

- Modify: `scripts/migrate-albergaria.ts`

- [ ] **Step 1: Implement purge function**

```typescript
async function purge() {
  console.log("Starting purge...");

  // 1. Purge Translations
  const trans = await databases.listDocuments(dbId, translationsId, [
    Query.limit(100),
  ]);
  for (const doc of trans.documents) {
    await databases.deleteDocument(dbId, translationsId, doc.$id);
  }

  // 2. Purge Articles
  const articles = await databases.listDocuments(dbId, articlesId, [
    Query.limit(100),
  ]);
  for (const doc of articles.documents) {
    await databases.deleteDocument(dbId, articlesId, doc.$id);
  }

  // 3. Purge Storage
  const files = await storage.listFiles(bucketId, [Query.limit(100)]);
  for (const file of files.files) {
    await storage.deleteFile(bucketId, file.$id);
  }

  console.log("Purge complete.");
}
```

- [ ] **Step 2: Commit purge logic**

```bash
git add scripts/migrate-albergaria.ts
git commit -m "feat: add purge logic to migration script"
```

---

### Task 3: Extraction & Clean-up

**Files:**

- Modify: `scripts/migrate-albergaria.ts`

- [ ] **Step 1: Define article structure and cleaning logic**

```typescript
interface MigrationArticle {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  category: string;
  featured: boolean;
}

// Cleaning logic will be handled by sub-agents during extraction
// or manually implemented if needed.
```

- [ ] **Step 2: Add extraction placeholder (to be filled by sub-agent)**

```typescript
const REAL_ARTICLES: MigrationArticle[] = [
  // Sub-agent will populate this using web_fetch
];
```

- [ ] **Step 3: Commit extraction placeholder**

```bash
git add scripts/migrate-albergaria.ts
git commit -m "chore: add article data placeholder"
```

---

### Task 4: Import & Image Handling

**Files:**

- Modify: `scripts/migrate-albergaria.ts`

- [ ] **Step 1: Implement image upload helper**

```typescript
async function uploadImage(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  const file = new File([blob], "image.jpg", { type: "image/jpeg" });
  const uploaded = await storage.createFile(bucketId, ID.unique(), file);
  return uploaded.$id;
}
```

- [ ] **Step 2: Implement import function**

```typescript
async function runImport() {
  console.log("Starting import...");
  for (const data of REAL_ARTICLES) {
    const fileId = await uploadImage(data.imageUrl);

    // Create Master Article
    const article = await databases.createDocument(
      dbId,
      articlesId,
      ID.unique(),
      {
        slug: data.slug,
        category: data.category,
        featured: data.featured,
        featuredImage: fileId,
        status: "published",
        publishedAt: new Date().toISOString(),
      }
    );

    // Create Translation
    await databases.createDocument(dbId, translationsId, ID.unique(), {
      article_id: article.$id,
      language: "pt-br",
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
    });

    console.log(`Imported: ${data.title}`);
  }
}
```

- [ ] **Step 3: Commit import logic**

```bash
git add scripts/migrate-albergaria.ts
git commit -m "feat: add import logic to migration script"
```

---

### Task 5: Content Extraction (Sub-agent)

- [ ] **Step 1: Dispatch sub-agent to fetch and clean content**
      Task: "@generalist Visit the 12 URLs in migrate-albergaria.ts and extract the full content, title, slug, excerpt, and image URL for each. Clean the content (remove ads/menus) and return it as an array of JSON objects matching the MigrationArticle interface. Map categories to: noticias, analises, exoplanetas, extremofilos, entrevistas, pesquisas-brasileiras."

- [ ] **Step 2: Update REAL_ARTICLES array with results**

- [ ] **Step 3: Commit finalized data**

```bash
git add scripts/migrate-albergaria.ts
git commit -m "data: finalize article content for migration"
```

---

### Task 6: Execution & Verification

- [ ] **Step 1: Run the migration script**

```bash
npx tsx scripts/migrate-albergaria.ts
```

- [ ] **Step 2: Verify on site**
      Visit https://astrobiologia.appwrite.network/artigos and confirm 12 articles are present with images.

- [ ] **Step 3: Cleanup script**

```bash
rm scripts/migrate-albergaria.ts
git add scripts
git commit -m "chore: cleanup migration script"
```
