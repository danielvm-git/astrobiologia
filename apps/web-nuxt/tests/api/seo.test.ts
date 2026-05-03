import { expect, test } from "@playwright/test";

test.describe("seo routes", () => {
  test("sitemap returns xml with a urlset", async ({ request }, testInfo) => {
    const res = await request.get("/sitemap.xml");
    if (res.status() === 500) {
      testInfo.skip(true, "Sitemap needs Appwrite configuration");
    }
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("<urlset");
    expect(text).toContain("<loc>");
  });

  test("robots.txt allows crawlers and references sitemap", async ({
    request,
  }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toMatch(/User-agent:\s*\*/i);
    expect(text).toMatch(/Sitemap:\s*https?:\/\//i);
  });
});
