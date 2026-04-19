import { getArticleBySlug, getArticlesByCategory } from '$lib/appwrite';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const lang = (locals as any).paraglide?.lang || 'pt-br';
    
	try {
		const article = await getArticleBySlug(params.slug, lang);

		if (!article) {
            console.error(`Article not found: slug=${params.slug}, lang=${lang}`);
			throw error(404, 'Article not found');
		}

		const relatedArticles = await getArticlesByCategory(article.category, lang, 3);

		return {
			article,
			relatedArticles: relatedArticles.filter(a => a.$id !== article.$id)
		};
	} catch (err) {
		if (err && (err as any).status === 404) throw err;
		console.error(`Error loading article: slug=${params.slug}, lang=${lang}`, err);
		throw error(500, 'Failed to load article');
	}
};
