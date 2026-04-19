import { getPublishedArticles } from '$lib/appwrite';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	try {
		const articles = await getPublishedArticles(1000);

		const staticPages = [
			{ url: '/', changefreq: 'weekly', priority: 1.0 },
			{ url: '/sobre', changefreq: 'monthly', priority: 0.7 }
		];

		const dynamicPages = articles.map((article: any) => ({
			url: `/artigos/${article.slug}`,
			lastmod: article.$updatedAt || article.$createdAt,
			changefreq: 'monthly',
			priority: 0.8
		}));

		const allPages = [...staticPages, ...dynamicPages];

		const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
	.map(
		(page: any) => `  <url>
    <loc>https://astrobiologia.com.br${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>`;

		return new Response(sitemapXml, {
			headers: {
				'Content-Type': 'application/xml'
			}
		});
	} catch (error) {
		console.error('Sitemap generation failed:', error);
		return new Response('Error generating sitemap', { status: 500 });
	}
};
