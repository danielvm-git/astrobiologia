// Covers: SEO-006
import { describe, expect, it } from "vitest";

function assertSitemapShape(xml: string) {
  const hasUrlset = xml.includes("<urlset");
  const hasUrl = xml.includes("<url>") && xml.includes("</url>");
  const hasLoc = xml.includes("<loc>");
  if (!hasUrlset || !hasUrl || !hasLoc) {
    throw new Error("invalid sitemap");
  }
}

describe("sitemap xml", () => {
  it("rejects sitemap text missing required elements", () => {
    expect(() => assertSitemapShape("<urlset></urlset>")).toThrow();
  });

  it("accepts sitemap text with loc entries", () => {
    const sample = `<?xml version="1.0"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://astrobiologia.com.br/artigos/test</loc>
  </url>
</urlset>`;
    expect(() => assertSitemapShape(sample)).not.toThrow();
  });
});
