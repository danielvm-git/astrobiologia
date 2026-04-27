import { Query } from "node-appwrite";
import { createSessionClient, getDatabaseId } from "~/server/utils/appwrite";

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
    const translations = await databases.listDocuments(
      getDatabaseId(),
      config.public.articleTranslationsCollectionId,
      [Query.equal("article_id", id), Query.limit(50)]
    );
    const translation =
      translations.documents.find((doc) => doc.language === "pt-br") ||
      translations.documents[0] ||
      null;
    return { article, translation, translations: translations.documents };
  }

  if (event.method === "PUT") {
    const body = await readBody<Record<string, unknown>>(event);

    await databases.updateDocument(
      getDatabaseId(),
      config.public.articlesCollectionId,
      id,
      {
        category: body.category,
        tags: body.tags,
        featuredImage: body.featuredImage,
        featuredImageAlt: body.featuredImageAlt,
        status: body.status,
        featured: Boolean(body.featured),
        authorId: body.authorId,
        authorName: body.authorName,
        publishedAt: body.publishedAt,
      }
    );

    const translations = await databases.listDocuments(
      getDatabaseId(),
      config.public.articleTranslationsCollectionId,
      [
        Query.equal("article_id", id),
        Query.equal("language", "pt-br"),
        Query.limit(1),
      ]
    );

    if (translations.documents.length > 0) {
      await databases.updateDocument(
        getDatabaseId(),
        config.public.articleTranslationsCollectionId,
        translations.documents[0].$id,
        {
          title: body.title,
          slug: body.slug,
          excerpt: body.excerpt,
          content: body.content,
        }
      );
    }

    return { success: true };
  }

  if (event.method === "DELETE") {
    const translations = await databases.listDocuments(
      getDatabaseId(),
      config.public.articleTranslationsCollectionId,
      [Query.equal("article_id", id), Query.limit(200)]
    );

    for (const translation of translations.documents) {
      await databases.deleteDocument(
        getDatabaseId(),
        config.public.articleTranslationsCollectionId,
        translation.$id
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
