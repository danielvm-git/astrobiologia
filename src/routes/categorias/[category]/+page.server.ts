import { error } from '@sveltejs/kit';
import { databases, Query, CATEGORIES, DATABASE_ID, COLLECTIONS } from '$lib/appwrite';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const categorySlug = params.category;
	const category = CATEGORIES.find(c => c.slug === categorySlug);

	if (!category) {
		throw error(404, 'Categoria não encontrada');
	}

	const categoryLabel = category.name;

	try {
		const response = await databases.listDocuments(
			DATABASE_ID,
			COLLECTIONS.ARTICLES,
			[
				Query.equal('status', 'published'),
				Query.equal('category', categoryLabel),
				Query.orderDesc('publishedAt')
			]
		);

		return {
			category: categorySlug,
			categoryLabel,
			articles: response.documents
		};
	} catch (err) {
		console.error('Error loading category:', err);
		return { category: categorySlug, categoryLabel, articles: [] };
	}
};
