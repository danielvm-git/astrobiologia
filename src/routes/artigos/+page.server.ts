import { getPublishedArticles } from "$lib/appwrite";
import { getRequestLanguage } from "$lib/server/request-language";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const lang = getRequestLanguage(locals);

  try {
    const articles = await getPublishedArticles(lang, 50);

    return {
      articles,
      listLoadError: false,
    };
  } catch (err) {
    console.error("Error loading articles:", err);
    return { articles: [], listLoadError: true };
  }
};
