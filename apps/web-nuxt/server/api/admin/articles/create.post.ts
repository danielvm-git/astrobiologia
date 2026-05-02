import { ID } from "node-appwrite";
import { createSessionClient, getDatabaseId } from "~/server/utils/appwrite";

type TranslationInput = {
  language: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
};

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const body = await readBody<Record<string, unknown>>(event);
  const config = useRuntimeConfig();
  const { databases } = createSessionClient(event);

  const now = new Date().toISOString();
  const articleData = {
    category: body.category || "noticias",
    tags: Array.isArray(body.tags) ? body.tags : [],
    featuredImage: body.featuredImage || "",
    featuredImageAlt: body.featuredImageAlt || "",
    status: body.status || "draft",
    featured: Boolean(body.featured),
    authorId: body.authorId || event.context.user.$id,
    authorName: body.authorName || event.context.user.name || "Admin",
    publishedAt: body.publishedAt || now,
  };

  const article = await databases.createDocument(
    getDatabaseId(),
    config.public.articlesCollectionId,
    ID.unique(),
    articleData
  );

  let translations: TranslationInput[] = Array.isArray(body.translations)
    ? (body.translations as TranslationInput[])
    : [];

  if (translations.length === 0) {
    translations = [
      {
        language: "pt-br",
        title: String(body.title ?? ""),
        slug: String(body.slug ?? ""),
        excerpt: String(body.excerpt ?? ""),
        content: String(body.content ?? ""),
        metaTitle: String(body.metaTitle ?? ""),
        metaDescription: String(body.metaDescription ?? ""),
      },
    ];
  }

  for (const trans of translations) {
    await databases.createDocument(
      getDatabaseId(),
      config.public.articleTranslationsCollectionId,
      ID.unique(),
      {
        article_id: article.$id,
        language: trans.language,
        title: trans.title ?? "",
        slug: trans.slug ?? "",
        excerpt: trans.excerpt ?? "",
        content: trans.content ?? "",
        metaTitle: trans.metaTitle ?? "",
        metaDescription: trans.metaDescription ?? "",
      }
    );
  }

  return { success: true, id: article.$id };
});
