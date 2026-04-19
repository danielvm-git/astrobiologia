import { databases, Query, DATABASE_ID } from '$lib/appwrite';
import type { PageServerLoad } from './$types';

const ARTICLES_COLLECTION_ID = 'articles';

export const load: PageServerLoad = async () => {
	try {
		// Fetch featured articles
		const featuredResponse = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[
				Query.equal('status', 'published'),
				Query.equal('featured', true),
				Query.limit(3)
			]
		);

		// Fetch recent articles
		const recentResponse = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[
				Query.equal('status', 'published'),
				Query.orderDesc('publishedAt'),
				Query.limit(24)
			]
		);

		return {
			featured: featuredResponse.documents,
			recent: recentResponse.documents
		};
	} catch (err) {
		console.error('Error loading homepage data:', err);
		return { featured: [], recent: [] };
	}
};
