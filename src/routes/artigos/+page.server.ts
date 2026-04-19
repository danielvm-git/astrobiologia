import { getPublishedArticles } from '$lib/appwrite';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const lang = (locals as any).paraglide?.lang || 'pt-br';

	try {
		const articles = await getPublishedArticles(lang, 50);

		return {
			articles
		};
	} catch (err) {
		console.error('Error loading articles:', err);
		return { articles: [] };
	}
};
