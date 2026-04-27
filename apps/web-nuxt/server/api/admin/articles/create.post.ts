import { ID } from "node-appwrite";
import { createSessionClient, getDatabaseId } from "~/server/utils/appwrite";

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

  await databases.createDocument(
    getDatabaseId(),
    config.public.articleTranslationsCollectionId,
    ID.unique(),
    {
      article_id: article.$id,
      language: "pt-br",
      title: body.title || "",
      slug: body.slug || "",
      excerpt: body.excerpt || "",
      content: body.content || "",
    }
  );

  return { success: true, id: article.$id };
});
