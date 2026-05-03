import { Query } from "node-appwrite";
import { createSessionClient, getDatabaseId } from "~/server/utils/appwrite";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const config = useRuntimeConfig();
  const { databases } = createSessionClient(event);

  try {
    const allResponse = await databases.listDocuments(
      getDatabaseId(),
      config.public.articlesCollectionId,
      [Query.limit(100)]
    );

    const publishedResponse = await databases.listDocuments(
      getDatabaseId(),
      config.public.articlesCollectionId,
      [Query.equal("status", "published"), Query.limit(100)]
    );

    const draftResponse = await databases.listDocuments(
      getDatabaseId(),
      config.public.articlesCollectionId,
      [Query.equal("status", "draft"), Query.limit(100)]
    );

    const recentResponse = await databases.listDocuments(
      getDatabaseId(),
      config.public.articlesCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(5)]
    );

    const categories = new Set<string>();
    for (const doc of allResponse.documents as Array<{ category?: string }>) {
      if (doc.category) categories.add(doc.category);
    }

    return {
      stats: {
        totalArticles: allResponse.total,
        publishedArticles: publishedResponse.total,
        draftArticles: draftResponse.total,
        categories: categories.size,
        recentArticles: JSON.parse(JSON.stringify(recentResponse.documents)),
      },
    };
  } catch {
    return {
      error: "Failed to load dashboard data",
    };
  }
});
