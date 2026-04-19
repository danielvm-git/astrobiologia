import { getArticleBySlug, getArticlesByCategory } from '$lib/appwrite';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    // locals.paraglide.lang is set by the paraglide middleware hook
    const lang = (locals as any).paraglide?.lang || 'pt-br';
    
	try {
		// Fetch the article by slug and language
		const article = await getArticleBySlug(params.slug, lang);

		if (!article) {
			throw error(404, 'Article not found');
		}

		// Fetch related articles by category in same language
		const relatedArticles = await getArticlesByCategory(article.category, lang, 3);

		return {
			article,
			relatedArticles: relatedArticles.filter(a => a.$id !== article.$id)
		};
	} catch (err) {
		if (err && (err as any).status === 404) throw err;
		console.error('Error loading article:', err);
		throw error(500, 'Failed to load article');
	}
};
