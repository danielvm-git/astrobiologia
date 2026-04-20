import { createSessionClient, DATABASE_ID } from '$lib/server/appwrite';
import { COLLECTIONS } from '$lib/appwrite';
import { Query } from 'node-appwrite';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	try {
		const { databases } = createSessionClient(event);
		
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
