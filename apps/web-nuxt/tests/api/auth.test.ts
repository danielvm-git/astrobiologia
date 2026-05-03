import { expect, test } from "@playwright/test";

test.describe("admin API auth", () => {
  test("returns 401 for article list without a session", async ({
    request,
  }) => {
    const res = await request.get("/api/admin/articles/list");
    expect(res.status()).toBe(401);
  });

  test("returns 401 when an invalid session cookie is sent", async ({
    request,
  }) => {
    const res = await request.get("/api/admin/articles/list", {
      headers: { Cookie: "a_session_project=invalid" },
    });
    expect(res.status()).toBe(401);
  });

  test("returns 200 for article list with a valid session cookie", async ({
    request,
  }, testInfo) => {
    const session = process.env.E2E_ADMIN_SESSION;
    const projectId = process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID;
    testInfo.skip(
      !session || !projectId,
      "Set E2E_ADMIN_SESSION and NUXT_PUBLIC_APPWRITE_PROJECT_ID to assert authorized admin API"
    );
    const res = await request.get("/api/admin/articles/list", {
      headers: { Cookie: `a_session_${projectId}=${session}` },
    });
    expect(res.status()).toBe(200);
  });
});
