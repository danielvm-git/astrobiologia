import { databases, Query, DATABASE_ID, COLLECTIONS } from '$lib/appwrite';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {

	try {
		// Get all articles
		const allResponse = await databases.listDocuments(
			DATABASE_ID,
			COLLECTIONS.ARTICLES,
			[Query.limit(100)]
		);

		const publishedResponse = await databases.listDocuments(
			DATABASE_ID,
			COLLECTIONS.ARTICLES,
			[Query.equal('status', 'published'), Query.limit(100)]
		);

		const draftResponse = await databases.listDocuments(
			DATABASE_ID,
			COLLECTIONS.ARTICLES,
			[Query.equal('status', 'draft'), Query.limit(100)]
		);

		const recentResponse = await databases.listDocuments(
			DATABASE_ID,
			COLLECTIONS.ARTICLES,
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
