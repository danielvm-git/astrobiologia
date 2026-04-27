import { describe, it, expect, vi } from "vitest";
import { redirect } from "@sveltejs/kit";
import { handle } from "../../src/hooks.server";

vi.mock("@sveltejs/kit", async (importOriginal) => {
  const original = await importOriginal<typeof import("@sveltejs/kit")>();
  return {
    ...original,
    redirect: vi.fn((status, location) => {
      const err = new Error("redirect");
      (err as any).status = status;
      (err as any).location = location;
      throw err;
    }),
  };
});

// Mock sequence/hooks helpers
vi.mock("@sveltejs/kit/hooks", () => ({
  sequence:
    (...handlers: any[]) =>
    async ({ event, resolve }: any) => {
      let index = 0;
      const next = async (event: any) => {
        if (index < handlers.length) {
          return handlers[index++]({ event, resolve: next });
        }
        return resolve(event);
      };
      return next(event);
    },
}));

// Mock paraglide middleware
vi.mock("$lib/paraglide/server", () => ({
  paraglideMiddleware: vi.fn((req, cb) =>
    cb({ request: req, locale: "pt-br" })
  ),
}));

vi.mock("$lib/paraglide/runtime", () => ({
  getTextDirection: vi.fn(() => "ltr"),
  deLocalizeHref: vi.fn((path) => path),
  localizeHref: vi.fn((path) => path),
}));

vi.mock("$lib/server/appwrite", () => ({
  createSessionClient: vi.fn(() => ({
    account: {
      get: vi
        .fn()
        .mockResolvedValue({
          $id: "user123",
          email: "admin@astrobiologia.com",
        }),
    },
  })),
  SESSION_COOKIE: "a_session",
}));

describe("Admin Auth Hook", () => {
  const resolve = vi.fn().mockResolvedValue({ status: 200 } as any);

  it("should redirect to dashboard if authenticated and on login page", async () => {
    const event = {
      cookies: {
        get: (name: string) => (name === "a_session" ? "xyz" : undefined),
        delete: vi.fn(),
      },
      locals: {},
      url: { pathname: "/admin/login" },
    } as any;

    try {
      await handle({ event, resolve });
    } catch (err: any) {
      expect(redirect).toHaveBeenCalledWith(302, "/admin/dashboard");
      expect(err.location).toBe("/admin/dashboard");
    }
  });

  it("should redirect to login if not authenticated and not on login page", async () => {
    const event = {
      cookies: {
        get: () => undefined,
        delete: vi.fn(),
      },
      locals: {},
      url: { pathname: "/admin/artigos" },
    } as any;

    try {
      await handle({ event, resolve });
    } catch (err: any) {
      expect(redirect).toHaveBeenCalledWith(302, "/admin/login");
      expect(err.location).toBe("/admin/login");
    }
  });

  it("should allow access if authenticated and not on login page", async () => {
    const event = {
      cookies: {
        get: (name: string) => (name === "a_session" ? "xyz" : undefined),
        delete: vi.fn(),
      },
      locals: {},
      url: { pathname: "/admin/artigos" },
    } as any;

    await handle({ event, resolve });
    expect(resolve).toHaveBeenCalled();
    expect(event.locals.user).toBeDefined();
  });

  it("should allow access to login page if not authenticated", async () => {
    const event = {
      cookies: {
        get: () => undefined,
        delete: vi.fn(),
      },
      locals: {},
      url: { pathname: "/admin/login" },
    } as any;

    await handle({ event, resolve });
    expect(resolve).toHaveBeenCalled();
    expect(event.locals.user).toBeNull();
  });

  it("should not affect non-admin routes", async () => {
    const event = {
      cookies: {
        get: () => undefined,
        delete: vi.fn(),
      },
      locals: {},
      url: { pathname: "/artigos" },
    } as any;

    await handle({ event, resolve });
    expect(resolve).toHaveBeenCalled();
  });
});
