import { getFeaturedArticles, getPublishedArticles } from '$lib/appwrite';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const lang = (locals as any).paraglide?.lang || 'pt-br';

	try {
		// Fetch featured articles
		const featured = await getFeaturedArticles(lang, 3);

		// Fetch recent articles
		const recent = await getPublishedArticles(lang, 24);

		return {
			featured,
			recent
		};
	} catch (err) {
		console.error('Error loading homepage data:', err);
		return { featured: [], recent: [] };
	}
};
