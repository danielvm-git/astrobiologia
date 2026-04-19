import { databases } from '$lib/appwrite';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

const DATABASE_ID = '69e464fb0006a1b3c4eb';
const ARTICLES_COLLECTION_ID = 'articles';

export const load: PageLoad = async ({ params }) => {
	try {

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
