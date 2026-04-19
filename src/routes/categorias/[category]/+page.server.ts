import { databases, Query, DATABASE_ID, COLLECTIONS } from '$lib/appwrite';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { category } = params;

	try {
		const response = await databases.listDocuments(
			DATABASE_ID,
			COLLECTIONS.ARTICLES,
			[
				Query.equal('status', 'published'),
				Query.equal('category', category),
				Query.orderDesc('publishedAt'),
				Query.limit(50)
			]
		);

		return {
			articles: response.documents,
			categorySlug: category
		};
	} catch (err) {
		console.error('Error loading category articles:', err);
		throw error(404, 'Categoria não encontrada');
	}
};
