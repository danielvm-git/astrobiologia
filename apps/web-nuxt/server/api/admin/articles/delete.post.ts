import { Query } from "node-appwrite";
import { createSessionClient, getDatabaseId } from "~/server/utils/appwrite";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readBody<{ id?: string }>(event);
  if (!body.id) {
    throw createError({ statusCode: 400, statusMessage: "Missing article id" });
  }

  const config = useRuntimeConfig();
  const { databases } = createSessionClient(event);
  const batchSize = 100;

  for (;;) {
    const translations = await databases.listDocuments(
      getDatabaseId(),
      config.public.articleTranslationsCollectionId,
      [Query.equal("article_id", body.id), Query.limit(batchSize)]
    );
    if (translations.documents.length === 0) break;
    for (const translation of translations.documents) {
      await databases.deleteDocument(
        getDatabaseId(),
        config.public.articleTranslationsCollectionId,
        translation.$id
      );
    }
    if (translations.documents.length < batchSize) break;
  }

  await databases.deleteDocument(
    getDatabaseId(),
    config.public.articlesCollectionId,
    body.id
  );
  return { success: true };
});
