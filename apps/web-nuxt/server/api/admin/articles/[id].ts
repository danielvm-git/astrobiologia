import { ID, Query } from "node-appwrite";
import { createAdminClient, getDatabaseId } from "~/server/utils/appwrite";

type TranslationInput = Record<string, unknown> & { language: string };

function sanitizePayload(data: Record<string, unknown>) {
  const clean: Record<string, unknown> = {};
  const forbidden = ["updatedAt", "createdAt"];
  for (const key of Object.keys(data)) {
    if (key.startsWith("$") || forbidden.includes(key)) continue;
    clean[key] = data[key];
  }
  return clean;
}

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing article id" });
  }

  const config = useRuntimeConfig();
  const { databases } = createAdminClient();

  if (event.method === "GET") {
    const article = await databases.getDocument(
      getDatabaseId(),
      config.public.articlesCollectionId,
      id
    );

    const translations = await databases.listDocuments(
      getDatabaseId(),
      config.public.articleTranslationsCollectionId,
      [Query.equal("article_id", id)]
    );

    const translation =
      translations.documents.find((doc: any) => doc.language === "pt-br") ||
      translations.documents[0] ||
      null;

    return { article, translation, translations: translations.documents };
  }

  if (event.method === "PUT") {
    const body = await readBody(event);

    const masterPayload = sanitizePayload({
      category: body.category,
      tags: body.tags,
      featuredImage: body.featuredImage,
      featuredImageAlt: body.featuredImageAlt,
      status: body.status,
      featured: body.featured,
      authorId: body.authorId,
      authorName: body.authorName,
      publishedAt: body.publishedAt,
    });

    Object.keys(masterPayload).forEach((key) => {
      if (masterPayload[key] === undefined) delete masterPayload[key];
    });

    await databases.updateDocument(
      getDatabaseId(),
      config.public.articlesCollectionId,
      id,
      masterPayload
    );

    const translationsInput = body.translations as
      | TranslationInput[]
      | undefined;
    if (!Array.isArray(translationsInput) || translationsInput.length === 0) {
      return { success: true };
    }

    // Fetch existing translation document IDs keyed by language so we can
    // update in-place instead of always creating new documents (ID.unique()
    // would always create, violating the unique (article_id, language) index).
    const existingDocs = await databases.listDocuments(
      getDatabaseId(),
      config.public.articleTranslationsCollectionId,
      [Query.equal("article_id", id), Query.limit(25)]
    );
    const existingIdByLanguage = new Map<string, string>(
      existingDocs.documents.map((doc) => [
        (doc as unknown as { language: string }).language,
        doc.$id,
      ])
    );

    for (const trans of translationsInput) {
      const cleanTrans = sanitizePayload(trans as Record<string, unknown>);
      delete cleanTrans.article_id;
      delete cleanTrans.$id;

      const language = cleanTrans.language as string;
      const docId = existingIdByLanguage.get(language) ?? ID.unique();

      await databases.upsertDocument(
        getDatabaseId(),
        config.public.articleTranslationsCollectionId,
        docId,
        {
          ...cleanTrans,
          article_id: id,
        }
      );
    }

    return { success: true };
  }

  if (event.method === "DELETE") {
    const translations = await databases.listDocuments(
      getDatabaseId(),
      config.public.articleTranslationsCollectionId,
      [Query.equal("article_id", id)]
    );

    for (const t of translations.documents) {
      await databases.deleteDocument(
        getDatabaseId(),
        config.public.articleTranslationsCollectionId,
        t.$id as string
      );
    }

    await databases.deleteDocument(
      getDatabaseId(),
      config.public.articlesCollectionId,
      id
    );

    return { success: true };
  }

  throw createError({ statusCode: 405, statusMessage: "Method not allowed" });
});
