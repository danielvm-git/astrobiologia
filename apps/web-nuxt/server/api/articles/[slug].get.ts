import {
  getArticleBySlug,
  getArticlesByCategory,
} from "~/server/utils/article-read";

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug;
  const query = getQuery(event);
  const language = typeof query.locale === "string" ? query.locale : "pt-br";

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Missing slug" });
  }

  const article = await getArticleBySlug(slug, language);
  if (!article) {
    throw createError({ statusCode: 404, statusMessage: "Article not found" });
  }

  const relatedArticles = (
    await getArticlesByCategory(article.category, language, 4)
  ).filter((item) => item.$id !== article.$id);

  return { article, relatedArticles };
});
