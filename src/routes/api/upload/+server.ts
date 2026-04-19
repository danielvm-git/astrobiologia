import { storage, STORAGE_BUCKET_ID, ID } from '$lib/appwrite';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		const session = cookies.get('session');

		if (!session) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		const response = await storage.createFile(
			STORAGE_BUCKET_ID,
			ID.unique(),
			file
		);

		const imageUrl = storage.getFilePreview(STORAGE_BUCKET_ID, response.$id).toString();

		return json({ success: true, fileId: response.$id, url: imageUrl });
	} catch (error) {
		console.error('Upload error:', error);
		return json({ error: 'Failed to upload file' }, { status: 500 });
	}
};
