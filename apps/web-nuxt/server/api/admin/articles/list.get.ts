import { Query } from "node-appwrite";
import { ARTICLE_LOCALES } from "@/lib/article-locales";
import { createSessionClient, getDatabaseId } from "~/server/utils/appwrite";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const config = useRuntimeConfig();
  const { databases } = createSessionClient(event);
  const response = await databases.listDocuments(
    getDatabaseId(),
    config.public.articlesCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(100)]
  );

  const articleIds = response.documents.map((document) => document.$id);

  const allTrans: Array<{
    article_id: string;
    language: string;
    title?: string;
  }> = [];

  if (articleIds.length > 0) {
    const batchSize = 200;
    let lastId: string | null = null;
    for (;;) {
      const queries: string[] = [
        Query.equal("article_id", articleIds),
        Query.orderAsc("$id"),
        Query.limit(batchSize),
      ];
      if (lastId) queries.push(Query.cursorAfter(lastId));
      const page = await databases.listDocuments(
        getDatabaseId(),
        config.public.articleTranslationsCollectionId,
        queries
      );
      if (page.documents.length === 0) break;
      allTrans.push(
        ...(page.documents as unknown as Array<{
          article_id: string;
          language: string;
          title?: string;
          slug?: string;
        }>)
      );
      if (page.documents.length < batchSize) break;
      lastId = page.documents[page.documents.length - 1].$id;
    }
  }

  const titles: Record<string, string> = {};
  const slugs: Record<string, string> = {};
  const availability: Record<string, Record<string, boolean>> = {};

  for (const articleId of articleIds) {
    availability[articleId] = {};
    for (const locale of ARTICLE_LOCALES) {
      availability[articleId][locale] = false;
    }
  }

  for (const translation of allTrans) {
    if (!availability[translation.article_id]) {
      availability[translation.article_id] = Object.fromEntries(
        ARTICLE_LOCALES.map((l) => [l, false])
      );
    }
    availability[translation.article_id][translation.language] = true;
    if (translation.language === "pt-br") {
      if (translation.title) titles[translation.article_id] = translation.title;
      const slug = (translation as { slug?: string }).slug;
      if (slug) slugs[translation.article_id] = slug;
    }
  }

  const articles = JSON.parse(JSON.stringify(response.documents)).map(
    (a: Record<string, unknown> & { $id: string; slug?: string }) => ({
      ...a,
      title: titles[a.$id] || "(Sem título)",
      slug: slugs[a.$id] || a.slug || "",
      languages:
        availability[a.$id] ||
        Object.fromEntries(ARTICLE_LOCALES.map((l) => [l, false])),
    })
  );

  return { articles };
});
