import { ID, Query } from "node-appwrite";
import { createSessionClient, getDatabaseId } from "~/server/utils/appwrite";

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

async function listAllTranslations(
  databases: ReturnType<typeof createSessionClient>["databases"],
  collectionId: string,
  articleId: string
) {
  const batchSize = 100;
  const documents: Record<string, unknown>[] = [];
  let lastId: string | null = null;
  for (;;) {
    const queries: string[] = [
      Query.equal("article_id", articleId),
      Query.orderAsc("$id"),
      Query.limit(batchSize),
    ];
    if (lastId) queries.push(Query.cursorAfter(lastId));
    const page = await databases.listDocuments(
      getDatabaseId(),
      collectionId,
      queries
    );
    if (page.documents.length === 0) break;
    documents.push(...page.documents);
    if (page.documents.length < batchSize) break;
    lastId = page.documents[page.documents.length - 1].$id as string;
  }
  return documents;
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
  const { databases } = createSessionClient(event);

  if (event.method === "GET") {
    const article = await databases.getDocument(
      getDatabaseId(),
      config.public.articlesCollectionId,
      id
    );
    const translations = await listAllTranslations(
      databases,
      config.public.articleTranslationsCollectionId,
      id
    );
    const translation =
      translations.find((doc) => doc.language === "pt-br") ||
      translations[0] ||
      null;
    return { article, translation, translations };
  }

  if (event.method === "PUT") {
    const body = await readBody<Record<string, unknown>>(event);

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

    const translationsInput = body.translations as TranslationInput[] | undefined;
    if (!Array.isArray(translationsInput)) {
      return { success: true };
    }

    const existingTrans = await listAllTranslations(
      databases,
      config.public.articleTranslationsCollectionId,
      id
    );

    for (const trans of translationsInput) {
      const existing = existingTrans.find(
        (t) => t.language === trans.language
      );
      const cleanTrans = sanitizePayload(trans as Record<string, unknown>);
      delete cleanTrans.article_id;

      if (existing) {
        await databases.updateDocument(
          getDatabaseId(),
          config.public.articleTranslationsCollectionId,
          existing.$id as string,
          cleanTrans
        );
      } else {
        await databases.createDocument(
          getDatabaseId(),
          config.public.articleTranslationsCollectionId,
          ID.unique(),
          {
            ...cleanTrans,
            article_id: id,
          }
        );
      }
    }

    return { success: true };
  }

  if (event.method === "DELETE") {
    const translations = await listAllTranslations(
      databases,
      config.public.articleTranslationsCollectionId,
      id
    );

    for (const translation of translations) {
      await databases.deleteDocument(
        getDatabaseId(),
        config.public.articleTranslationsCollectionId,
        translation.$id as string
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
