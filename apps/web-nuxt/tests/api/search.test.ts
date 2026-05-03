import { expect, test } from "@playwright/test";

test.describe("search API", () => {
  test("returns empty list when q is empty", async ({ request }) => {
    const res = await request.get("/api/search?q=");
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as { articles: unknown[]; query: string };
    expect(body.articles).toEqual([]);
    expect(body.query).toBe("");
  });

  test("returns JSON with articles array for a non-empty query", async ({
    request,
  }) => {
    const res = await request.get("/api/search?q=astronomia&locale=pt-br");
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as { articles: unknown[]; query: string };
    expect(Array.isArray(body.articles)).toBe(true);
    expect(body.query).toBe("astronomia");
  });

  test("accepts a locale override parameter", async ({ request }) => {
    const res = await request.get("/api/search?q=life&locale=en");
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as { articles: unknown[]; query: string };
    expect(body.query).toBe("life");
  });

  test("omitting locale still responds successfully", async ({ request }) => {
    const res = await request.get("/api/search?q=terra");
    expect(res.ok()).toBeTruthy();
  });

  test("search results are capped at 30 entries", async ({ request }) => {
    const res = await request.get("/api/search?q=a&locale=pt-br");
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as {
      articles: { $id: string }[];
      query: string;
    };
    expect(body.articles.length).toBeLessThanOrEqual(30);
  });

  test("does not require an Authorization header", async ({ request }) => {
    const res = await request.get("/api/search?q=teste", { headers: {} });
    expect(res.status()).toBe(200);
  });
});
