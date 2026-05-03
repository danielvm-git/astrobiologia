import { searchPublishedArticles } from "$lib/appwrite";
import { getRequestLanguage } from "$lib/server/request-language";
import type { PageServerLoad } from "./$types";

/** Required: search uses `url.searchParams`; incompatible with root layout `prerender = true`. */
export const prerender = false;

export const load: PageServerLoad = async ({ locals, url }) => {
  const lang = getRequestLanguage(locals);
  const q = (url.searchParams.get("q") || "").trim();

  try {
    const articles = q ? await searchPublishedArticles(q, lang, 30) : [];
    return {
      articles,
      listLoadError: false,
      query: q,
    };
  } catch (err) {
    console.error("Error loading search results:", err);
    return {
      articles: [],
      listLoadError: true,
      query: q,
    };
  }
};
