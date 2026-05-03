import { CATEGORIES } from "~/server/utils/appwrite";
import { getPublishedArticles } from "~/server/utils/article-read";

const LOCALES = ["pt-br", "en", "es", "ja", "nl", "zh"];

type SitemapUrl = {
  url: string;
  lastmod?: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: number;
};

export default defineEventHandler(async () => {
  try {
    const allPages: SitemapUrl[] = [];

    for (const locale of LOCALES) {
      allPages.push({ url: `/${locale}`, changefreq: "weekly", priority: 1.0 });
      allPages.push({
        url: `/${locale}/sobre`,
        changefreq: "monthly",
        priority: 0.7,
      });
      allPages.push({
        url: `/${locale}/artigos`,
        changefreq: "daily",
        priority: 0.9,
      });
      allPages.push({
        url: `/${locale}/busca`,
        changefreq: "weekly",
        priority: 0.7,
      });
      allPages.push({
        url: `/${locale}/contato`,
        changefreq: "monthly",
        priority: 0.5,
      });
      allPages.push({
        url: `/${locale}/privacidade`,
        changefreq: "monthly",
        priority: 0.4,
      });

      for (const category of CATEGORIES) {
        allPages.push({
          url: `/${locale}/categorias/${category.slug}`,
          changefreq: "weekly",
          priority: 0.75,
        });
      }

      const articles = await getPublishedArticles(locale, 1000);
      const pages = articles.map((article) => ({
        url: `/${locale}/artigos/${article.translation?.slug || article.slug}`,
        lastmod: article.$updatedAt || article.$createdAt,
        changefreq: "monthly" as const,
        priority: 0.8,
      }));

      allPages.push(...pages);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (page) => `  <url>
    <loc>https://astrobiologia.com.br${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod.split("T")[0]}</lastmod>` : ""}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch {
    return new Response("Error generating sitemap", { status: 500 });
  }
});
