import { databases, DATABASE_ID, COLLECTIONS, getArticleTranslations } from '$lib/appwrite';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const article = await databases.getDocument(
			DATABASE_ID,
			COLLECTIONS.ARTICLES,
			params.id
		);

        const translations = await getArticleTranslations(params.id);

		return {
			article,
            translations
		};
	} catch (err) {
		console.error('Error loading article:', err);
		throw error(404, 'Article not found');
	}
};
