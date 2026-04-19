import { databases, Query } from '$lib/appwrite';
import type { PageServerLoad } from './$types';

const DATABASE_ID = '69e464fb0006a1b3c4eb';
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
				Query.equal('status', 'published'),
				Query.equal('category', categoryLabel),
				Query.orderDesc('publishedAt')
			]
		);

		return {
			category: categorySlug,
			categoryLabel,
			articles: response.documents
		};
	} catch (err) {
		console.error('Error loading category:', err);
		return { category: categorySlug, categoryLabel, articles: [] };
	}
};
