import { getFeaturedArticles, getPublishedArticles } from "$lib/appwrite";
import { getRequestLanguage } from "$lib/server/request-language";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const lang = getRequestLanguage(locals);

  try {
    // Fetch featured articles
    const featured = await getFeaturedArticles(lang, 3);

    // Fetch recent articles
    const recent = await getPublishedArticles(lang, 24);

    return {
      featured,
      listLoadError: false,
      recent,
    };
  } catch (err) {
    console.error("Error loading homepage data:", err);
    return { featured: [], listLoadError: true, recent: [] };
  }
};
