import { appwrite, databases } from '$lib/appwrite';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const DATABASE_ID = 'astrobiology_db';
const ARTICLES_COLLECTION_ID = 'articles';

export const load: PageServerLoad = async ({ cookies }) => {
	try {
		const session = cookies.get('auth_session');
		if (!session) {
			throw redirect(302, '/admin/login');
		}

		const response = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[appwrite.Query.orderDesc('$createdAt'), appwrite.Query.limit(100)]
		);

		return {
			articles: response.documents
		};
	} catch (err) {
		console.error('Articles error:', err);
		throw redirect(302, '/admin/login');
	}
};
