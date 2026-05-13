import type { APIRoute } from "astro";
import { AppwriteException } from "node-appwrite";
import { createAdminClient } from "../../../lib/appwrite";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const SETTINGS_DOC_ID = "site-settings";

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  try {
    const { databases } = createAdminClient();
    const DB = import.meta.env.DATABASE_ID;
    const SETTINGS = import.meta.env.SITE_SETTINGS_COLLECTION_ID;
    const doc = await databases.getDocument(DB, SETTINGS, SETTINGS_DOC_ID);
    return json({ settings: doc });
  } catch (err: unknown) {
    console.error("[settings GET]", err);
    return json({ settings: null });
  }
};

export const PUT: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  let body: { siteName?: string; tagline?: string; description?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  try {
    const { databases } = createAdminClient();
    const DB = import.meta.env.DATABASE_ID;
    const SETTINGS = import.meta.env.SITE_SETTINGS_COLLECTION_ID;

    try {
      await databases.updateDocument(DB, SETTINGS, SETTINGS_DOC_ID, body);
    } catch (inner: unknown) {
      if (inner instanceof AppwriteException && inner.code === 404) {
        await databases.createDocument(DB, SETTINGS, SETTINGS_DOC_ID, body);
      } else {
        throw inner;
      }
    }
    return json({ success: true });
  } catch {
    return json({ error: "Erro ao salvar configurações." }, 500);
  }
};
