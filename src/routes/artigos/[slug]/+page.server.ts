import { databases, Query, DATABASE_ID } from '$lib/appwrite';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const ARTICLES_COLLECTION_ID = 'articles';

export const load: PageServerLoad = async ({ params }) => {
	try {
		// Fetch the article by slug
		const response = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[
				Query.equal('slug', params.slug),
				Query.equal('status', 'published'),
				Query.limit(1)
			]
		);

		if (response.documents.length === 0) {
			throw error(404, 'Article not found');
		}

		const article = response.documents[0];

		// Fetch related articles by category
		const relatedResponse = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[
				Query.equal('category', article.category),
				Query.equal('status', 'published'),
				Query.notEqual('$id', article.$id),
				Query.limit(3)
			]
		);

		return {
			article,
			relatedArticles: relatedResponse.documents
		};
	} catch (err) {
		if (err instanceof Error && err.message.includes('not found')) {
			throw error(404, 'Article not found');
		}
		console.error('Error loading article:', err);
		throw error(500, 'Failed to load article');
	}
};
