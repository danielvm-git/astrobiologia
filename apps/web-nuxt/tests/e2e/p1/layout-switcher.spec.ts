import { expect, test } from "@playwright/test";

test.describe("@p1 Admin settings — layout switcher", () => {
  test("[P1] /admin/settings redirects to login when unauthenticated", async ({
    page,
  }) => {
    await page.goto("/admin/settings");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("[P1] Aparência section shows 4 layout thumbnails when authenticated", async ({
    page,
  }, testInfo) => {
    const session = process.env.E2E_ADMIN_SESSION;
    const projectId = process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID;
    testInfo.skip(
      !session || !projectId,
      "Set E2E_ADMIN_SESSION and NUXT_PUBLIC_APPWRITE_PROJECT_ID to run authenticated tests"
    );

    await page.context().addCookies([
      {
        name: `a_session_${projectId}`,
        value: session!,
        domain: "localhost",
        path: "/",
      },
    ]);

    await page.goto("/admin/settings");
    await expect(
      page.getByRole("heading", { name: /Aparência/i })
    ).toBeVisible();

    const thumbnails = page.locator("button[aria-pressed]");
    await expect(thumbnails).toHaveCount(4);

    await expect(
      page.getByRole("button", { name: /Grade Uniforme/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Herói \+ Grade/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Herói \+ Sidebar/i })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Revista/i })).toBeVisible();

    await expect(
      page.getByRole("button", { name: /Salvar layout/i })
    ).toBeVisible();
  });

  test("[P1] clicking a thumbnail updates the selected state", async ({
    page,
  }, testInfo) => {
    const session = process.env.E2E_ADMIN_SESSION;
    const projectId = process.env.NUXT_PUBLIC_APPWRITE_PROJECT_ID;
    testInfo.skip(
      !session || !projectId,
      "Set E2E_ADMIN_SESSION and NUXT_PUBLIC_APPWRITE_PROJECT_ID to run authenticated tests"
    );

    await page.context().addCookies([
      {
        name: `a_session_${projectId}`,
        value: session!,
        domain: "localhost",
        path: "/",
      },
    ]);

    await page.goto("/admin/settings");

    const gradeButton = page.getByRole("button", { name: /Grade Uniforme/i });
    await gradeButton.click();
    await expect(gradeButton).toHaveAttribute("aria-pressed", "true");
  });
});
