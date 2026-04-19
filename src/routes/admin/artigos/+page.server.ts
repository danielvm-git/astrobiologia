import { databases, Query } from '$lib/appwrite';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const DATABASE_ID = '69e464fb0006a1b3c4eb';
const ARTICLES_COLLECTION_ID = 'articles';

export const load: PageServerLoad = async ({ cookies }) => {
	try {
		const allCookies = cookies.getAll();
		const hasSession = allCookies.some(c => c.name.startsWith('a_session_'));
		if (!hasSession) {
			console.log('Server: No session found, allowing load.');
		}

		const response = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[Query.orderDesc('$createdAt'), Query.limit(100)]
		);

		return {
			articles: response.documents
		};
	} catch (err) {
		console.error('Articles error:', err);
		throw redirect(302, '/admin/login');
	}
};
