import { chromium, type FullConfig } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { Client, Databases, ID, Query } from "node-appwrite";

const AUTH_FILE = path.join(process.cwd(), "tests/.auth/admin.json");

export default async function globalSetup(_config: FullConfig) {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;

  // 1. Setup Auth State
  if (email && password) {
    mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto("http://localhost:4321/admin/login");
      const status = await page.evaluate(
        async ({ e, p }) => {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: e, password: p }),
          });
          return res.status;
        },
        { e: email, p: password }
      );
      if (status === 200) {
        await context.storageState({ path: AUTH_FILE });
      }
    } catch {
      // ignore login failures in global setup, individual tests will handle it
    } finally {
      await browser.close();
    }
  }

  // 2. Seed Data if necessary
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const project = process.env.APPWRITE_PROJECT_ID;
  const key = process.env.APPWRITE_API_KEY;
  const dbId = process.env.DATABASE_ID;
  const artColId = process.env.ARTICLES_COLLECTION_ID;
  const transColId = process.env.ARTICLE_TRANSLATIONS_COLLECTION_ID;

  if (endpoint && project && key && dbId && artColId && transColId) {
    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(project)
      .setKey(key);
    const databases = new Databases(client);

    try {
      const res = await databases.listDocuments(dbId, artColId, [
        Query.equal("status", "published"),
        Query.limit(1),
      ]);

      if (res.total === 0) {
        console.log("No published articles found. Seeding a test article...");
        const articleId = ID.unique();
        await databases.createDocument(dbId, artColId, articleId, {
          category: "noticias",
          status: "published",
          featured: true,
          authorName: "System Test",
          publishedAt: new Date().toISOString(),
        });

        await databases.createDocument(dbId, transColId, ID.unique(), {
          article_id: articleId,
          language: "pt-br",
          title: "Artigo de Teste (Semeado)",
          slug: "artigo-teste-semeado-" + Date.now().toString(36),
          excerpt:
            "Este é um artigo gerado automaticamente para os testes E2E.",
          content:
            "<p>Conteúdo de teste para garantir que a página não esteja vazia.</p>",
        });
        console.log("Test article seeded successfully.");
      }
    } catch (err) {
      console.error("Failed to seed test data:", err);
    }
  }
}
