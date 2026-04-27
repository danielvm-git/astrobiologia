import { createSessionClient, DATABASE_ID } from "$lib/server/appwrite";
import { COLLECTIONS } from "$lib/appwrite";
import { Query } from "node-appwrite";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  try {
    const { databases } = createSessionClient(event);

    const allResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ARTICLES,
      [Query.limit(100)]
    );

    const publishedResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ARTICLES,
      [Query.equal("status", "published"), Query.limit(100)]
    );

    const draftResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ARTICLES,
      [Query.equal("status", "draft"), Query.limit(100)]
    );

    const recentResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.ARTICLES,
      [Query.orderDesc("$createdAt"), Query.limit(5)]
    );

    // Get unique categories
    const categories = new Set<string>();
    allResponse.documents.forEach((doc) => {
      if (doc.category) categories.add(doc.category);
    });

    return {
      stats: {
        totalArticles: allResponse.total,
        publishedArticles: publishedResponse.total,
        draftArticles: draftResponse.total,
        categories: categories.size,
        recentArticles: JSON.parse(JSON.stringify(recentResponse.documents)),
      },
    };
  } catch (err) {
    console.error("Dashboard error:", err);
    return {
      stats: {
        totalArticles: 0,
        publishedArticles: 0,
        draftArticles: 0,
        categories: 0,
        recentArticles: [],
      },
      error: "Failed to load dashboard data",
    };
  }
};
