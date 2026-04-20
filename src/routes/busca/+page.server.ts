import { searchPublishedArticles } from '$lib/appwrite';
import type { PageServerLoad } from './$types';

/** Required: search uses `url.searchParams`; incompatible with root layout `prerender = true`. */
export const prerender = false;

export const load: PageServerLoad = async ({ locals, url }) => {
	const lang = (locals as any).paraglide?.lang || 'pt-br';
	const q = (url.searchParams.get('q') || '').trim();

	try {
		const articles = q ? await searchPublishedArticles(q, lang, 30) : [];
		return {
			articles,
			query: q
		};
	} catch (err) {
		console.error('Error loading search results:', err);
		return {
			articles: [],
			query: q
		};
	}
};
