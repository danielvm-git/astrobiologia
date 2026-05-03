import { Query } from "node-appwrite";
import { createAdminClient, getDatabaseId } from "~/server/utils/appwrite";

export default defineEventHandler(async () => {
  try {
    const startTime = Date.now();
    const { databases } = createAdminClient();
    const config = useRuntimeConfig();

    await databases.listDocuments(
      getDatabaseId(),
      config.public.articlesCollectionId,
      [Query.limit(1)]
    );

    return {
      status: "ok",
      database: "connected",
      latency: `${Date.now() - startTime}ms`,
      message: "Appwrite Cloud connection verified",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: "error",
      database: "disconnected",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error during connection check",
      timestamp: new Date().toISOString(),
    };
  }
});
