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
			// Appwrite default list limit ~25; paginate to load all translation rows for the badge grid
			const allTrans: any[] = [];
			const batchSize = 200;
			let lastId: string | null = null;
			for (;;) {
				const q: string[] = [
					Query.equal('article_id', articleIds),
					Query.orderAsc('$id'),
					Query.limit(batchSize)
				];
				if (lastId) q.push(Query.cursorAfter(lastId));
				const page = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, q);
				if (page.documents.length === 0) break;
				allTrans.push(...page.documents);
				if (page.documents.length < batchSize) break;
				lastId = page.documents[page.documents.length - 1].$id;
			}

            allTrans.forEach((t: any) => {
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
			const transDocs: any[] = [];
			let transLastId: string | null = null;
			const tb = 100;
			for (;;) {
				const transQ: string[] = [
					Query.equal('article_id', id),
					Query.orderAsc('$id'),
					Query.limit(tb)
				];
				if (transLastId) transQ.push(Query.cursorAfter(transLastId));
				const trans = await databases.listDocuments(DATABASE_ID, COLLECTIONS.ARTICLES_TRANSLATIONS, transQ);
				if (trans.documents.length === 0) break;
				transDocs.push(...trans.documents);
				if (trans.documents.length < tb) break;
				transLastId = trans.documents[trans.documents.length - 1].$id;
			}

			for (const t of transDocs) {
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
