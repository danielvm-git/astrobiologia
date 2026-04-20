import { getPublishedArticles } from '$lib/appwrite';
import { CATEGORIES } from '$lib/appwrite';
import { locales } from '$lib/paraglide/runtime';
import type { RequestHandler } from '@sveltejs/kit';

type SitemapUrl = {
	url: string;
	lastmod?: string;
	changefreq: 'daily' | 'weekly' | 'monthly';
	priority: number;
};

export const GET: RequestHandler = async () => {
	try {
		const allPages: SitemapUrl[] = [];

		// Add localized static pages
		for (const locale of locales) {
			allPages.push({ url: `/${locale}`, changefreq: 'weekly', priority: 1.0 });
			allPages.push({ url: `/${locale}/sobre`, changefreq: 'monthly', priority: 0.7 });
			allPages.push({ url: `/${locale}/artigos`, changefreq: 'daily', priority: 0.9 });
			allPages.push({ url: `/${locale}/busca`, changefreq: 'weekly', priority: 0.7 });
			allPages.push({ url: `/${locale}/contato`, changefreq: 'monthly', priority: 0.5 });
			allPages.push({ url: `/${locale}/privacidade`, changefreq: 'monthly', priority: 0.4 });

			for (const category of CATEGORIES) {
				allPages.push({
					url: `/${locale}/categorias/${category.slug}`,
					changefreq: 'weekly',
					priority: 0.75
				});
			}

			// Add localized articles
			const articles = await getPublishedArticles(locale, 1000);
			const articlePages = articles.map((article) => ({
				url: `/${locale}/artigos/${article.translation?.slug || article.slug}`,
				lastmod: article.$updatedAt || article.$createdAt,
				changefreq: 'monthly' as const,
				priority: 0.8
			}));
			allPages.push(...articlePages);
		}

		const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
	.map(
		(page) => `  <url>
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
