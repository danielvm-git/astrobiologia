import { CATEGORIES, getArticlesByCategory } from '$lib/appwrite';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { category } = params;
	const lang = (locals as any).paraglide?.lang || 'pt-br';

	const knownCategory = CATEGORIES.some((c) => c.slug === category);
	if (!knownCategory) {
		throw error(404, 'Categoria não encontrada');
	}

	try {
		const articles = await getArticlesByCategory(category, lang, 50);

		return {
			articles,
			categorySlug: category
		};
	} catch (err) {
		console.error('Error loading category articles:', err);
		throw error(404, 'Categoria não encontrada');
	}
};
