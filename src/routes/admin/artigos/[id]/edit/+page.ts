import { databases, DATABASE_ID, COLLECTIONS } from '$lib/appwrite';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {

		const response = await databases.getDocument(
			DATABASE_ID,
			COLLECTIONS.ARTICLES,
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
