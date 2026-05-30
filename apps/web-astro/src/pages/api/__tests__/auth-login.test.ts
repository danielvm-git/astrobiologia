import { beforeEach, describe, expect, it, vi } from "vitest";
import "./helpers/mock-appwrite";
import { createAdminClient, setSessionCookie } from "@/lib/appwrite";

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when email or password missing", async () => {
    const { POST } = await import("../auth/login");
    const res = await POST({
      request: new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "a@test.com" }),
      }),
    } as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(400);
  });

  it("returns 401 on invalid credentials", async () => {
    vi.mocked(createAdminClient).mockReturnValueOnce({
      account: {
        createEmailPasswordSession: vi
          .fn()
          .mockRejectedValue(new Error("Invalid")),
      },
      databases: {},
      storage: {},
    } as unknown as ReturnType<typeof createAdminClient>);

    const { POST } = await import("../auth/login");
    const res = await POST({
      request: new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "bad@test.com", password: "wrong" }),
      }),
    } as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(401);
  });

  it("returns 200 and sets session cookie on success", async () => {
    vi.mocked(createAdminClient).mockReturnValueOnce({
      account: {
        createEmailPasswordSession: vi.fn().mockResolvedValue({
          secret: "sess_abc",
          expire: "2026-12-31",
        }),
      },
      databases: {},
      storage: {},
    } as unknown as ReturnType<typeof createAdminClient>);

    const { POST } = await import("../auth/login");
    const res = await POST({
      request: new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@test.com", password: "secret" }),
      }),
    } as unknown as Parameters<typeof POST>[0]);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(setSessionCookie).toHaveBeenCalled();
    expect(res.headers.get("Set-Cookie")).toContain("sess_abc");
  });
});
