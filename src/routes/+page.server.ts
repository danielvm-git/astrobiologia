import { databases, Query } from '$lib/appwrite';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const DATABASE_ID = 'astrobiology_db';
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
				Query.limit(6)
			]
		);

		return {
			featured: featuredResponse.documents,
			recent: recentResponse.documents
		};
	} catch (err) {
		console.error('Error loading homepage data:', err);
		throw error(500, 'Failed to load articles');
	}
};
