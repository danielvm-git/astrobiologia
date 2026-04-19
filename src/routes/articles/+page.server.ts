import { appwrite, databases } from '$lib/appwrite';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const DATABASE_ID = 'astrobiology_db';
const ARTICLES_COLLECTION_ID = 'articles';

export const load: PageServerLoad = async () => {
	try {
		const response = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[
				appwrite.Query.equal('status', 'published'),
				appwrite.Query.orderDesc('publishedAt'),
				appwrite.Query.limit(50)
			]
		);

		return {
			articles: response.documents
		};
	} catch (err) {
		console.error('Error loading articles:', err);
		throw error(500, 'Failed to load articles');
	}
};
