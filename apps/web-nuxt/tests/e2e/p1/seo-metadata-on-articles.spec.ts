import { expect, test } from "@playwright/test";

test.describe("@p2 article SEO", () => {
  test("article page renders alternates and open graph tags when a slug is available", async ({
    page,
    request,
  }) => {
    const list = await request.get(
      "/api/articles/featured?limit=1&locale=pt-br"
    );
    const payload = (await list.json()) as {
      articles: { translation?: { slug?: string }; slug?: string }[];
    };
    const first = payload.articles?.[0];
    const slug = first?.translation?.slug || first?.slug;
    test.skip(!slug, "No published article in Appwrite for SEO check");

    await page.goto(`/artigos/${slug}`);
    await expect(page.locator('link[rel="alternate"]')).toHaveCount(6);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "article"
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /.+/
    );
    await expect(
      page.locator('meta[property="og:description"]')
    ).toHaveAttribute("content", /.+/);
  });
});
