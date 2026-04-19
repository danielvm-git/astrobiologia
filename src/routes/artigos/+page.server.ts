import { databases, Query, DATABASE_ID } from '$lib/appwrite';
import type { PageServerLoad } from './$types';

const ARTICLES_COLLECTION_ID = 'articles';

export const load: PageServerLoad = async () => {
	try {
		const response = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[
				Query.equal('status', 'published'),
				Query.orderDesc('publishedAt'),
				Query.limit(50)
			]
		);

		return {
			articles: response.documents
		};
	} catch (err) {
		console.error('Error loading articles:', err);
		return { articles: [] };
	}
};
