import type { APIRoute } from "astro";
import { Query } from "node-appwrite";
import { createSessionClient, getEnv } from "../../../lib/appwrite";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const GET: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  const { databases } = createSessionClient(request);
  const DB = getEnv("DATABASE_ID");
  const ARTICLES = getEnv("ARTICLES_COLLECTION_ID");

  try {
    const [allRes, publishedRes, draftRes, recentRes] = await Promise.all([
      databases.listDocuments(DB, ARTICLES, [Query.limit(100)]),
      databases.listDocuments(DB, ARTICLES, [
        Query.equal("status", "published"),
        Query.limit(100),
      ]),
      databases.listDocuments(DB, ARTICLES, [
        Query.equal("status", "draft"),
        Query.limit(100),
      ]),
      databases.listDocuments(DB, ARTICLES, [
        Query.orderDesc("$createdAt"),
        Query.limit(5),
      ]),
    ]);

    const categories = new Set(
      (allRes.documents as Array<{ category?: string }>)
        .map((d) => d.category)
        .filter(Boolean)
    );

    return json({
      stats: {
        totalArticles: allRes.total,
        publishedArticles: publishedRes.total,
        draftArticles: draftRes.total,
        categories: categories.size,
        recentArticles: JSON.parse(JSON.stringify(recentRes.documents)),
      },
    });
  } catch {
    return json({ error: "Failed to load dashboard data" }, 500);
  }
};
