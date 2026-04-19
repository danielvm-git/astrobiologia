export interface SEOMetaTags {
	title: string;
	description: string;
	image?: string;
	url?: string;
	type?: string;
}

export function generateMetaTags(data: SEOMetaTags) {
	return {
		title: data.title,
		description: data.description,
		openGraph: {
			title: data.title,
			description: data.description,
			url: data.url,
			type: data.type || 'website',
			images: data.image
				? [
						{
							url: data.image,
							width: 1200,
							height: 630,
							alt: data.title
						}
					]
				: undefined
		},
		twitter: {
			card: 'summary_large_image',
			title: data.title,
			description: data.description,
			image: data.image
		}
	};
}

export function generateSchemaMarkup(article: any) {
	return {
		'@context': 'https://schema.org',
		'@type': 'NewsArticle',
		headline: article.title,
		description: article.excerpt || article.title,
		image: article.featuredImage || '/default-og-image.jpg',
		datePublished: article.createdAt,
		dateModified: article.updatedAt || article.createdAt,
		author: {
			'@type': 'Person',
			name: 'Danilo Albergaria'
		},
		publisher: {
			'@type': 'Organization',
			name: 'Astrobiologia',
			logo: {
				'@type': 'ImageObject',
				url: '/logo.jpg'
			}
		}
	};
}
