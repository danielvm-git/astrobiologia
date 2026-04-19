import { databases, Query, DATABASE_ID, COLLECTIONS } from '$lib/appwrite';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	try {
		const response = await databases.listDocuments(
			DATABASE_ID,
			COLLECTIONS.ARTICLES,
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
