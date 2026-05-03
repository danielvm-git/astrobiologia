import { getPublishedArticles } from "~/server/utils/article-read";
import type { Article } from "~/types/article";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const language = typeof query.locale === "string" ? query.locale : "pt-br";
  const limit = typeof query.limit === "string" ? Number(query.limit) : 50;
  const offset = typeof query.offset === "string" ? Number(query.offset) : 0;
  let articles: Article[] = [];
  try {
    articles = await getPublishedArticles(language, limit, offset);
  } catch {
    articles = [];
  }
  return { articles };
});
