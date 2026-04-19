import { appwrite } from '$lib/appwrite';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

const BUCKET_ID = 'article_images';

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

		const fileBuffer = await file.arrayBuffer();
		const uint8Array = new Uint8Array(fileBuffer);

		const response = await appwrite.storage.createFile(
			BUCKET_ID,
			appwrite.ID.unique(),
			new File([uint8Array], file.name, { type: file.type })
		);

		const imageUrl = appwrite.getFilePreview(BUCKET_ID, response.$id);

		return json({ success: true, fileId: response.$id, url: imageUrl });
	} catch (error) {
		console.error('Upload error:', error);
		return json({ error: 'Failed to upload file' }, { status: 500 });
	}
};
