#!/usr/bin/env node
/**
 * Reset Appwrite articles/storage and import Danilo Albergaria content.
 *
 * Usage:
 *   node scripts/load-albergaria-articles.mjs [--dry-run] [--skip-purge]
 *
 * Requires APPWRITE_* env vars (reads repo .env and apps/web-astro/.env).
 */

import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client, Databases, Storage, Query, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const TEMP_DIR = path.join(REPO_ROOT, "temp", "albergaria-images");
const CATALOG_PATH = path.join(__dirname, "articles-data.json");

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const SKIP_PURGE = args.has("--skip-purge");

// ── env bootstrap ────────────────────────────────────────────────────────────

function loadEnvFiles() {
  const files = [
    path.join(REPO_ROOT, ".env"),
    path.join(REPO_ROOT, "apps/web-astro/.env"),
    path.join(REPO_ROOT, "apps/web-astro/.env.test"),
  ];
  for (const file of files) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf-8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (!(key in process.env)) process.env[key] = val;
    }
  }
}

function requireEnv(key) {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env: ${key}`);
  return val;
}

// ── HTML helpers ─────────────────────────────────────────────────────────────

function decodeHtml(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html) {
  return decodeHtml(
    html
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function metaContent(html, property) {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const m = html.match(re);
  if (m) return decodeHtml(m[1]);
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
    "i"
  );
  const m2 = html.match(re2);
  return m2 ? decodeHtml(m2[1]) : "";
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function paragraphsToHtml(text) {
  const blocks = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (blocks.length === 0) return "<p></p>";
  return blocks.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n");
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function markdownishToHtml(text) {
  const lines = text.split("\n");
  const out = [];
  let buffer = [];

  const flush = () => {
    if (buffer.length === 0) return;
    const para = buffer.join(" ").trim();
    if (para) out.push(`<p>${escapeHtml(para)}</p>`);
    buffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flush();
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flush();
      out.push(`<h2>${escapeHtml(trimmed.slice(3))}</h2>`);
      continue;
    }
    if (trimmed.startsWith("---")) {
      flush();
      continue;
    }
    buffer.push(trimmed);
  }
  flush();
  return out.join("\n") || "<p></p>";
}

function appendSourceFooter(html, sourceUrl, journalName) {
  const label = journalName || "fonte original";
  return `${html}\n<p><em>Texto publicado originalmente em <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>.</em></p>`;
}

function appendPdfLink(html, pdfUrl) {
  if (!pdfUrl) return html;
  return `${html}\n<p><a href="${pdfUrl}" target="_blank" rel="noopener noreferrer">Baixar PDF / artigo completo</a></p>`;
}

// ── per-domain extractors ────────────────────────────────────────────────────

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "AstrobiologiaMigration/1.0 (+https://astrobiologia.com.br; research import)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

async function extractPesquisaFapesp(url, seed) {
  const html = await fetchHtml(url);
  const title =
    seed.title ||
    metaContent(html, "og:title") ||
    (html.match(/<title>([^<]+)<\/title>/i)?.[1] ?? "").split(":")[0].trim();
  const imageUrl = seed.imageUrl || metaContent(html, "og:image");
  const excerpt =
    seed.excerpt ||
    metaContent(html, "og:description") ||
    metaContent(html, "description");

  // Body: paragraphs inside article-like regions
  let bodyHtml = "";
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  const source = articleMatch ? articleMatch[1] : html;
  const paragraphs = [...source.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripTags(m[1]))
    .filter(
      (p) =>
        p.length > 80 && !/republicar|creative commons|pesquisa fapesp/i.test(p)
    );

  bodyHtml = paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n");
  if (!bodyHtml) bodyHtml = `<p>${escapeHtml(excerpt || title)}</p>`;

  return {
    title,
    slug: seed.slug || slugify(title),
    excerpt: excerpt || paragraphs[0]?.slice(0, 240) || title,
    content: appendSourceFooter(
      bodyHtml,
      url,
      seed.journalName || "Pesquisa FAPESP"
    ),
    imageUrl,
  };
}

async function extractComCiencia(url, seed) {
  const html = await fetchHtml(url);
  const title =
    seed.title ||
    metaContent(html, "og:title") ||
    stripTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  const imageUrl = seed.imageUrl || metaContent(html, "og:image");
  const excerpt = seed.excerpt || metaContent(html, "og:description");

  const contentMatch = html.match(
    /<div[^>]+class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i
  );
  let bodyHtml = "";
  if (contentMatch) {
    const paragraphs = [
      ...contentMatch[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi),
    ]
      .map((m) => stripTags(m[1]))
      .filter((p) => p.length > 40);
    bodyHtml = paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n");
  }
  if (!bodyHtml) bodyHtml = `<p>${escapeHtml(excerpt || title)}</p>`;

  return {
    title,
    slug: seed.slug || slugify(title),
    excerpt: excerpt || title,
    content: appendSourceFooter(bodyHtml, url, "ComCiência"),
    imageUrl,
  };
}

async function extractTheConversation(url, seed) {
  const html = await fetchHtml(url);
  const title = seed.title || metaContent(html, "og:title");
  const imageUrl = seed.imageUrl || metaContent(html, "og:image");
  const excerpt = seed.excerpt || metaContent(html, "og:description");

  const contentMatch =
    html.match(
      /<div[^>]+class="[^"]*content-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i
    ) || html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  let bodyHtml = "";
  if (contentMatch) {
    const paragraphs = [
      ...contentMatch[1].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi),
    ]
      .map((m) => stripTags(m[1]))
      .filter(
        (p) => p.length > 40 && !/the conversation|creative commons/i.test(p)
      );
    bodyHtml = paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n");
  }
  if (!bodyHtml && seed.content) bodyHtml = seed.content;
  if (!bodyHtml) bodyHtml = `<p>${escapeHtml(excerpt || title)}</p>`;

  return {
    title,
    slug: seed.slug || slugify(title),
    excerpt,
    content: appendSourceFooter(bodyHtml, url, "The Conversation Brasil"),
    imageUrl,
  };
}

async function extractPlos(url, seed) {
  const html = await fetchHtml(url);
  const title = seed.title || metaContent(html, "og:title");
  const imageUrl = seed.imageUrl || metaContent(html, "og:image");
  const abstractMatch = html.match(
    /<div[^>]+class="[^"]*abstract[^"]*"[^>]*>([\s\S]*?)<\/div>/i
  );
  let abstract = seed.excerpt || "";
  if (abstractMatch) abstract = stripTags(abstractMatch[1]).slice(0, 500);
  if (!abstract) abstract = metaContent(html, "description");

  const content = appendPdfLink(
    appendSourceFooter(
      `<p>${escapeHtml(abstract)}</p><p>Este artigo acadêmico analisa quase três décadas de comunicação sobre astrobiologia e a busca por vida em outros lugares, comparando artigos científicos, releases de imprensa e reportagens em jornais de referência.</p>`,
      url,
      "PLOS One"
    ),
    seed.pdfUrl
  );

  return {
    title,
    slug: seed.slug || slugify(title),
    excerpt: abstract.slice(0, 280),
    content,
    imageUrl,
  };
}

async function extractNature(url, seed) {
  const html = await fetchHtml(url);
  const title = seed.title || metaContent(html, "og:title");
  const imageUrl = seed.imageUrl || metaContent(html, "og:image");
  const desc =
    seed.excerpt ||
    metaContent(html, "description") ||
    metaContent(html, "og:description");

  const content = appendPdfLink(
    appendSourceFooter(
      `<p>${escapeHtml(desc)}</p><p>Danilo Albergaria é coautor correspondente deste comentário na Nature Astronomy sobre os impactos da guerra na astronomia ucraniana e um plano de recuperação integrado à comunidade internacional.</p>`,
      url,
      "Nature Astronomy"
    ),
    seed.pdfUrl
  );

  return {
    title,
    slug: seed.slug || slugify(title),
    excerpt: desc.slice(0, 280),
    content,
    imageUrl,
  };
}

async function extractFcw(url, seed) {
  const html = await fetchHtml(url);
  const title = seed.title || "Hype na astrobiologia";
  const imageUrl = seed.imageUrl || metaContent(html, "og:image");

  // FCW page is an essay; grab visible text blocks
  const textBlocks = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripTags(m[1]))
    .filter(
      (p) =>
        p.length > 60 && /astrobiolog|hype|comunica|jornalismo|vida/i.test(p)
    );

  const excerpt =
    seed.excerpt ||
    textBlocks[0]?.slice(0, 280) ||
    "Reflexão sobre hype e comunicação na astrobiologia.";

  const bodyHtml =
    textBlocks.length > 0
      ? textBlocks.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n")
      : `<p>${escapeHtml(excerpt)}</p>`;

  return {
    title,
    slug: seed.slug || slugify(title),
    excerpt,
    content: appendSourceFooter(bodyHtml, url, "FCW Cultura Científica"),
    imageUrl,
  };
}

async function extractArticle(seed) {
  const url = seed.sourceUrl;
  if (url.includes("revistapesquisa.fapesp.br"))
    return extractPesquisaFapesp(url, seed);
  if (url.includes("comciencia.br")) return extractComCiencia(url, seed);
  if (url.includes("theconversation.com"))
    return extractTheConversation(url, seed);
  if (url.includes("plos.org")) return extractPlos(url, seed);
  if (url.includes("nature.com")) return extractNature(url, seed);
  if (url.includes("fcw.org.br")) return extractFcw(url, seed);
  throw new Error(`No extractor for ${url}`);
}

// ── Appwrite operations ──────────────────────────────────────────────────────

function createClients() {
  const client = new Client()
    .setEndpoint(requireEnv("APPWRITE_ENDPOINT"))
    .setProject(requireEnv("APPWRITE_PROJECT_ID"))
    .setKey(requireEnv("APPWRITE_API_KEY"));
  return {
    databases: new Databases(client),
    storage: new Storage(client),
    dbId: requireEnv("DATABASE_ID"),
    articlesId: requireEnv("ARTICLES_COLLECTION_ID"),
    translationsId: requireEnv("ARTICLE_TRANSLATIONS_COLLECTION_ID"),
    bucketId: requireEnv("STORAGE_BUCKET_ID"),
  };
}

async function listAllDocuments(databases, dbId, collectionId) {
  const docs = [];
  let lastId = null;
  for (;;) {
    const queries = [Query.limit(100), Query.orderAsc("$id")];
    if (lastId) queries.push(Query.cursorAfter(lastId));
    const page = await databases.listDocuments(dbId, collectionId, queries);
    docs.push(...page.documents);
    if (page.documents.length < 100) break;
    lastId = page.documents.at(-1).$id;
  }
  return docs;
}

async function listAllFiles(storage, bucketId) {
  const files = [];
  let lastId = null;
  for (;;) {
    const queries = [Query.limit(100), Query.orderAsc("$id")];
    if (lastId) queries.push(Query.cursorAfter(lastId));
    const page = await storage.listFiles(bucketId, queries);
    files.push(...page.files);
    if (page.files.length < 100) break;
    lastId = page.files.at(-1).$id;
  }
  return files;
}

async function purgeDatabase(clients) {
  const { databases, storage, dbId, articlesId, translationsId, bucketId } =
    clients;
  console.log("Purging translations...");
  for (const doc of await listAllDocuments(databases, dbId, translationsId)) {
    if (DRY_RUN) continue;
    await databases.deleteDocument(dbId, translationsId, doc.$id);
  }
  console.log("Purging articles...");
  for (const doc of await listAllDocuments(databases, dbId, articlesId)) {
    if (DRY_RUN) continue;
    await databases.deleteDocument(dbId, articlesId, doc.$id);
  }
  console.log("Purging storage files...");
  for (const file of await listAllFiles(storage, bucketId)) {
    if (DRY_RUN) continue;
    await storage.deleteFile(bucketId, file.$id);
  }
  console.log("Purge complete.");
}

async function downloadImage(url, slug) {
  if (!url) return null;
  mkdirSync(TEMP_DIR, { recursive: true });
  const res = await fetch(url, {
    headers: { "User-Agent": "AstrobiologiaMigration/1.0" },
    redirect: "follow",
  });
  if (!res.ok) {
    console.warn(`  ⚠ Image download failed (${res.status}): ${url}`);
    return null;
  }
  const contentType = res.headers.get("content-type") || "image/jpeg";
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : "jpg";
  const filePath = path.join(TEMP_DIR, `${slug}.${ext}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(filePath, buffer);
  return { filePath, buffer, ext, contentType };
}

async function uploadImage(storage, bucketId, slug, imageData) {
  if (!imageData) return "";
  const input = InputFile.fromBuffer(
    imageData.buffer,
    `albergaria-${slug}.${imageData.ext}`
  );
  const created = await storage.createFile(bucketId, ID.unique(), input);
  return created.$id;
}

function truncate(text, max) {
  const t = (text || "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

async function importArticle(clients, author, seed, extracted) {
  const { databases, storage, dbId, articlesId, translationsId, bucketId } =
    clients;
  const publishedAt = seed.publishedAt
    ? new Date(seed.publishedAt).toISOString()
    : new Date().toISOString();

  const excerpt = truncate(extracted.excerpt, 280);
  const metaDescription = truncate(extracted.excerpt, 500);

  let featuredImageId = "";
  if (extracted.imageUrl) {
    console.log(`  ↓ image: ${extracted.imageUrl.slice(0, 80)}...`);
    const imageData = await downloadImage(extracted.imageUrl, extracted.slug);
    if (imageData && !DRY_RUN) {
      featuredImageId = await uploadImage(
        storage,
        bucketId,
        extracted.slug,
        imageData
      );
    }
  }

  const articlePayload = {
    title: extracted.title,
    slug: extracted.slug,
    excerpt,
    content: extracted.content,
    category: seed.category || "noticias",
    tags: seed.tags || [],
    featuredImage: featuredImageId,
    featuredImageAlt: extracted.title,
    status: "published",
    featured: Boolean(seed.featured),
    authorId: author.id,
    authorName: author.name,
    publishedAt,
  };

  if (DRY_RUN) {
    console.log(`  [dry-run] would create: ${extracted.title}`);
    return;
  }

  const articleId = ID.unique();
  const article = await databases.createDocument(
    dbId,
    articlesId,
    articleId,
    articlePayload
  );

  await databases.createDocument(dbId, translationsId, ID.unique(), {
    article_id: article.$id,
    language: "pt-br",
    title: extracted.title,
    slug: extracted.slug,
    excerpt,
    content: extracted.content,
    metaTitle: truncate(extracted.title, 120),
    metaDescription,
  });

  console.log(`  ✓ imported: ${extracted.title} (${extracted.slug})`);
}

// ── main ─────────────────────────────────────────────────────────────────────

async function main() {
  loadEnvFiles();
  const catalog = JSON.parse(readFileSync(CATALOG_PATH, "utf-8"));
  const clients = createClients();

  console.log(`Catalog: ${catalog.articles.length} articles`);
  if (DRY_RUN) console.log("DRY RUN — no writes");

  if (!SKIP_PURGE) {
    await purgeDatabase(clients);
  } else {
    console.log("Skipping purge (--skip-purge)");
  }

  const linksOut = [];
  let ok = 0;
  let fail = 0;

  for (const seed of catalog.articles) {
    console.log(`\n→ ${seed.sourceUrl}`);
    linksOut.push({
      title: seed.title || seed.slug,
      sourceUrl: seed.sourceUrl,
      pdfUrl: seed.pdfUrl || null,
      journalName: seed.journalName || null,
    });
    try {
      const extracted = await extractArticle(seed);
      await importArticle(clients, catalog.author, seed, extracted);
      ok++;
    } catch (err) {
      fail++;
      console.error(`  ✗ failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  const linksPath = path.join(__dirname, "articles-download-links.json");
  writeFileSync(linksPath, JSON.stringify(linksOut, null, 2));
  console.log(`\nSaved download links → ${linksPath}`);
  console.log(`Done: ${ok} imported, ${fail} failed`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
