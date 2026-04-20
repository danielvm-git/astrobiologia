import { createSessionClient, DATABASE_ID } from '$lib/server/appwrite';
import { COLLECTIONS } from '$lib/appwrite';
import { Query } from 'node-appwrite';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const { params } = event;
	try {
		const { databases } = createSessionClient(event);
        
		const article = await databases.getDocument(
			DATABASE_ID,
			COLLECTIONS.ARTICLES,
			params.id
		);

        const transResponse = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.ARTICLES_TRANSLATIONS,
            [Query.equal('article_id', params.id)]
        );

		return {
			article,
            translations: transResponse.documents
		};
	} catch (err) {
		console.error('Error loading article:', err);
		throw error(404, 'Article not found');
	}
};
