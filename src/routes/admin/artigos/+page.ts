import { databases, Query } from '$lib/appwrite';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const DATABASE_ID = '69e464fb0006a1b3c4eb';
const ARTICLES_COLLECTION_ID = 'articles';

export const load: PageLoad = async () => {
	try {
		const response = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[Query.orderDesc('$createdAt'), Query.limit(100)]
		);

		return {
			articles: response.documents
		};
	} catch (err) {
		console.error('Articles load error (server):', err);
		return {
			articles: [],
			error: 'Failed to load articles on server'
		};
	}
};
