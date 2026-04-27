import { Query } from "node-appwrite";
import { createSessionClient, getDatabaseId } from "~/server/utils/appwrite";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const config = useRuntimeConfig();
  const { databases } = createSessionClient(event);
  const response = await databases.listDocuments(
    getDatabaseId(),
    config.public.articlesCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(100)]
  );

  const articleIds = response.documents.map((document) => document.$id);
  const translationResponse = articleIds.length
    ? await databases.listDocuments(
        getDatabaseId(),
        config.public.articleTranslationsCollectionId,
        [Query.equal("article_id", articleIds), Query.limit(200)]
      )
    : { documents: [] };

  const titles: Record<string, string> = {};
  for (const translation of translationResponse.documents as Array<{
    article_id: string;
    title: string;
    language: string;
  }>) {
    if (translation.language === "pt-br") {
      titles[translation.article_id] = translation.title;
    }
  }

  const articles = response.documents.map((article) => ({
    ...article,
    title: titles[article.$id] || "(Sem título)",
  }));

  return { articles };
});
