import { searchPublishedArticles } from "~/server/utils/article-read";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const q = typeof query.q === "string" ? query.q.trim() : "";
  const language = typeof query.locale === "string" ? query.locale : "pt-br";
  if (!q) {
    return { articles: [], query: "" };
  }

  const articles = await searchPublishedArticles(q, language, 30);
  return { articles, query: q };
});
