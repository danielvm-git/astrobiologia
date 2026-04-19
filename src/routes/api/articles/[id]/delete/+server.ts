import { appwrite, databases } from '$lib/appwrite';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

const DATABASE_ID = 'astrobiology_db';
const ARTICLES_COLLECTION_ID = 'articles';

export const POST: RequestHandler = async ({ params, request, cookies }) => {
	try {
		const session = cookies.get('session');

		if (!session) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = params;

		await databases.deleteDocument(DATABASE_ID, ARTICLES_COLLECTION_ID, id);

		return json({ success: true, message: 'Article deleted successfully' });
	} catch (error) {
		console.error('Delete error:', error);
		return json({ error: 'Failed to delete article' }, { status: 500 });
	}
};
