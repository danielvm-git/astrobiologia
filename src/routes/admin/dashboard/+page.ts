import { databases, Query } from '$lib/appwrite';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const DATABASE_ID = '69e464fb0006a1b3c4eb';
const ARTICLES_COLLECTION_ID = 'articles';

export const load: PageLoad = async () => {

	try {
		// Get all articles
		const allResponse = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[Query.limit(100)]
		);

		const publishedResponse = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[Query.equal('status', 'published'), Query.limit(100)]
		);

		const draftResponse = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[Query.equal('status', 'draft'), Query.limit(100)]
		);

		const recentResponse = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[Query.orderDesc('$createdAt'), Query.limit(5)]
		);

		// Get unique categories
		const categories = new Set<string>();
		allResponse.documents.forEach((doc) => {
			if (doc.category) categories.add(doc.category);
		});

		return {
			stats: {
				totalArticles: allResponse.total,
				publishedArticles: publishedResponse.total,
				draftArticles: draftResponse.total,
				categories: categories.size,
				recentArticles: recentResponse.documents
			}
		};
	} catch (err) {
		console.error('Dashboard error:', err);
		return {
			error: 'Failed to load dashboard data'
		};
	}
};
