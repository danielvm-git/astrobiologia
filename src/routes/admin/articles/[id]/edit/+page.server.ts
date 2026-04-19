import { appwrite, databases } from '$lib/appwrite';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const DATABASE_ID = 'astrobiology_db';
const ARTICLES_COLLECTION_ID = 'articles';

export const load: PageServerLoad = async ({ params, cookies }) => {
	try {
		const session = cookies.get('auth_session');
		if (!session) {
			throw redirect(302, '/admin/login');
		}

		const response = await databases.getDocument(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			params.id
		);

		return {
			article: response
		};
	} catch (err) {
		console.error('Error loading article:', err);
		throw error(404, 'Article not found');
	}
};
