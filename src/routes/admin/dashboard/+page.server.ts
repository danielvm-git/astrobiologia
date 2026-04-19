import { appwrite, databases, account } from '$lib/appwrite';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const DATABASE_ID = 'astrobiology_db';
const ARTICLES_COLLECTION_ID = 'articles';

export const load: PageServerLoad = async ({ cookies }) => {
	// Check if user is authenticated
	try {
		const session = cookies.get('auth_session');
		if (!session) {
			throw redirect(302, '/admin/login');
		}

		// Get all articles
		const allResponse = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[appwrite.Query.limit(100)]
		);

		const publishedResponse = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[appwrite.Query.equal('status', 'published'), appwrite.Query.limit(100)]
		);

		const draftResponse = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[appwrite.Query.equal('status', 'draft'), appwrite.Query.limit(100)]
		);

		const recentResponse = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[appwrite.Query.orderDesc('$createdAt'), appwrite.Query.limit(5)]
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
		throw redirect(302, '/admin/login');
	}
};
