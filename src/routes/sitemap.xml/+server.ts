import { getPublishedArticles } from '$lib/appwrite';
import { locales } from '$lib/paraglide/runtime';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	try {
        let allPages: any[] = [];

        // Add localized static pages
        for (const locale of locales) {
            allPages.push({ url: `/${locale}`, changefreq: 'weekly', priority: 1.0 });
            allPages.push({ url: `/${locale}/sobre`, changefreq: 'monthly', priority: 0.7 });
            allPages.push({ url: `/${locale}/artigos`, changefreq: 'monthly', priority: 0.8 });
            
            // Add localized articles
            const articles = await getPublishedArticles(locale, 1000);
            const articlePages = articles.map((article: any) => ({
                url: `/${locale}/artigos/${article.translation?.slug || article.slug}`,
                lastmod: article.$updatedAt || article.$createdAt,
                changefreq: 'monthly',
                priority: 0.8
            }));
            allPages = [...allPages, ...articlePages];
        }

		const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
	.map(
		(page: any) => `  <url>
    <loc>https://astrobiologia.com.br${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod.split('T')[0]}</lastmod>` : ''}
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
