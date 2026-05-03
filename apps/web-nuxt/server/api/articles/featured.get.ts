import { getFeaturedArticles } from "~/server/utils/article-read";
import type { Article } from "~/types/article";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const language = typeof query.locale === "string" ? query.locale : "pt-br";
  const limit = typeof query.limit === "string" ? Number(query.limit) : 3;
  let articles: Article[] = [];
  try {
    articles = await getFeaturedArticles(language, limit);
  } catch {
    articles = [];
  }
  return { articles };
});
