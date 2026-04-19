import { appwrite, databases } from '$lib/appwrite';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const DATABASE_ID = 'astrobiology_db';
const ARTICLES_COLLECTION_ID = 'articles';

const categoryMap: Record<string, string> = {
	'exoplanets': 'Exoplanets',
	'life-detection': 'Life Detection',
	'biosignatures': 'Biosignatures',
	'extremophiles': 'Extremophiles',
	'missions': 'Space Missions',
	'habitability': 'Habitability'
};

export const load: PageServerLoad = async ({ params }) => {
	const categorySlug = params.category;
	const categoryLabel = categoryMap[categorySlug];

	if (!categoryLabel) {
		throw error(404, 'Category not found');
	}

	try {
		const response = await databases.listDocuments(
			DATABASE_ID,
			ARTICLES_COLLECTION_ID,
			[
				appwrite.Query.equal('status', 'published'),
				appwrite.Query.equal('category', categoryLabel),
				appwrite.Query.orderDesc('publishedAt')
			]
		);

		return {
			category: categorySlug,
			categoryLabel,
			articles: response.documents
		};
	} catch (err) {
		console.error('Error loading category:', err);
		throw error(500, 'Failed to load category articles');
	}
};
