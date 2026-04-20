import { createSessionClient, DATABASE_ID } from '$lib/server/appwrite';
import { COLLECTIONS } from '$lib/appwrite';
import { Query } from 'node-appwrite';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createLogger } from '$lib/server/logger';
import { locales } from '$lib/paraglide/runtime';

const logger = createLogger('ADMIN-ARTIGOS-SERVER');

export const load: PageServerLoad = async (event) => {
	try {
		const { databases } = createSessionClient(event);
		
		const response = await databases.listDocuments(
			DATABASE_ID,
			COLLECTIONS.ARTICLES,
			[Query.orderDesc('$createdAt'), Query.limit(100)]
		);

        const articleIds = response.documents.map(d => d.$id);
        
        // Fetch all translations for these articles to determine status badges
        let titles: Record<string, string> = {};
        let availability: Record<string, Record<string, boolean>> = {};

        if (articleIds.length > 0) {
            const transResponse = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.ARTICLES_TRANSLATIONS,
                [Query.equal('article_id', articleIds)]
            );
            
            transResponse.documents.forEach((t: any) => {
                // Initialize availability for this article if not present
                if (!availability[t.article_id]) {
                    availability[t.article_id] = {};
                    locales.forEach(l => availability[t.article_id][l] = false);
                }

                availability[t.article_id][t.language] = true;
                if (t.language === 'pt-br') {
                    titles[t.article_id] = t.title;
                }
            });
        }

		return {
			articles: JSON.parse(JSON.stringify(response.documents)).map((a: any) => ({
                ...a,
                title: titles[a.$id] || '(Sem título)',
                languages: availability[a.$id] || Object.fromEntries(locales.map(l => [l, false]))
            }))
		};
	} catch (err) {
		logger.error('Articles load error', err);
		return {
			articles: [],
			error: 'Failed to load articles on server'
		};
	}
};

export const actions: Actions = {
	delete: async (event) => {
		const { request } = event;
		const { databases } = createSessionClient(event);
		
		try {
			const formData = await request.formData();
			const id = formData.get('id') as string;

			if (!id) throw new Error('ID não fornecido');

			// 1. Delete all translations
			const trans = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, [
				Query.equal('article_id', id)
			]);
			
			for (const t of trans.documents) {
				await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, t.$id);
			}

			// 2. Delete master
			await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ARTICLES, id);

			return { success: true };
		} catch (err: any) {
			logger.error('Delete action error', err);
			return { error: err.message || 'Erro ao excluir' };
		}
	}
};
