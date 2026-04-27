import { CATEGORIES } from "~/server/utils/appwrite";
import { getArticlesByCategory } from "~/server/utils/article-read";

export default defineEventHandler(async (event) => {
  const category = event.context.params?.category;
  if (!category || !CATEGORIES.some((item) => item.slug === category)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Categoria não encontrada",
    });
  }

  const query = getQuery(event);
  const language = typeof query.locale === "string" ? query.locale : "pt-br";
  const limit = typeof query.limit === "string" ? Number(query.limit) : 50;
  const articles = await getArticlesByCategory(category, language, limit);

  return { articles, categorySlug: category };
});
