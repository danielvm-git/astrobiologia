import { describe, it, expect } from "vitest";
import {
  getPublicOrigin,
  isPublicHttps,
} from "../../src/lib/server/public-origin";

describe("getPublicOrigin", () => {
  it("prefers HTTPS from event.url when edge sends misleading X-Forwarded-Proto: http", () => {
    const url = new URL("https://astrobiologia.appwrite.network/admin/login");
    const request = new Request(url, {
      headers: {
        "x-forwarded-proto": "http",
        "x-forwarded-host": "astrobiologia.appwrite.network",
      },
    });

    expect(getPublicOrigin(url, request)).toBe(
      "https://astrobiologia.appwrite.network"
    );
  });

  it("uses forwarded HTTPS when SSR url is HTTP (TLS termination)", () => {
    const url = new URL("http://internal:3000/admin/login");
    const request = new Request(url, {
      headers: {
        "x-forwarded-proto": "https",
        "x-forwarded-host": "example.com",
      },
    });

    expect(getPublicOrigin(url, request)).toBe("https://example.com");
  });

  it("falls back to url origin when no forwarded headers", () => {
    const url = new URL("http://localhost:5173/login");
    const request = new Request(url);

    expect(getPublicOrigin(url, request)).toBe("http://localhost:5173");
  });
});

describe("isPublicHttps", () => {
  it("returns true when url is HTTPS despite forwarded proto http", () => {
    const url = new URL("https://example.com/cb");
    const request = new Request(url, {
      headers: {
        "x-forwarded-proto": "http",
        "x-forwarded-host": "example.com",
      },
    });
    expect(isPublicHttps(url, request)).toBe(true);
  });
});
