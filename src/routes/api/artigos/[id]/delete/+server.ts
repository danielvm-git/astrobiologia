import { databases, DATABASE_ID, COLLECTIONS } from '$lib/appwrite';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ params, request, cookies }) => {
	try {
		const session = cookies.get('session');

		if (!session) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const { id } = params;

		if (!id) {
			return json({ error: 'Missing article ID' }, { status: 400 });
		}

		await databases.deleteDocument(DATABASE_ID, COLLECTIONS.ARTICLES, id);

		return json({ success: true, message: 'Article deleted successfully' });
	} catch (error) {
		console.error('Delete error:', error);
		return json({ error: 'Failed to delete article' }, { status: 500 });
	}
};
