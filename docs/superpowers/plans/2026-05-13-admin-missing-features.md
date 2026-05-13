# Admin Missing Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the three missing admin feature test suites (`auth`, `dashboard`, `settings`) and the Settings page they require.

**Architecture:** Auth and dashboard already have pages — only feature files + step definitions are needed. Settings requires a new `/admin/configuracoes` page (`Settings.tsx` + three API routes), a theme flash-prevention script in `Base.astro`, and a full feature file with step definitions.

**Tech Stack:** Astro, React, Playwright, playwright-bdd, node-appwrite, Tailwind CSS v4.

---

### File Map

| Action | Path                                                     |
| ------ | -------------------------------------------------------- |
| Modify | `apps/web-astro/src/components/admin/LoginForm.tsx`      |
| Modify | `apps/web-astro/src/layouts/Base.astro`                  |
| Modify | `apps/web-astro/src/layouts/Admin.astro`                 |
| Create | `apps/web-astro/src/pages/admin/configuracoes.astro`     |
| Create | `apps/web-astro/src/components/admin/Settings.tsx`       |
| Create | `apps/web-astro/src/pages/api/admin/settings.ts`         |
| Create | `apps/web-astro/src/pages/api/admin/account/email.ts`    |
| Create | `apps/web-astro/src/pages/api/admin/account/password.ts` |
| Create | `apps/web-astro/tests/features/admin/auth.feature`       |
| Create | `apps/web-astro/tests/steps/auth.steps.ts`               |
| Create | `apps/web-astro/tests/features/admin/dashboard.feature`  |
| Create | `apps/web-astro/tests/steps/dashboard.steps.ts`          |
| Create | `apps/web-astro/tests/features/admin/settings.feature`   |
| Create | `apps/web-astro/tests/steps/settings.steps.ts`           |

---

### Task 1: Auth Feature + Steps

Auth scenarios test the login page UI directly (form fill → submit → verify), not the cached session path used by other admin tests.

**Files:**

- Modify: `apps/web-astro/src/components/admin/LoginForm.tsx`
- Create: `apps/web-astro/tests/features/admin/auth.feature`
- Create: `apps/web-astro/tests/steps/auth.steps.ts`

- [ ] **Step 1: Add `data-testid="login-error"` to LoginForm.tsx**

  In `LoginForm.tsx`, replace the error div:

  ```tsx
  {
    error && (
      <div
        data-testid="login-error"
        className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium mb-6"
      >
        {error}
      </div>
    );
  }
  ```

- [ ] **Step 2: Write `auth.feature`**

  Create `apps/web-astro/tests/features/admin/auth.feature`:

  ```gherkin
  Feature: Admin Authentication
    As an admin
    I want to securely access the admin panel
    So I can manage site content

    @p0 @smoke
    Scenario: Valid credentials redirect to dashboard
      Given the user navigates to "/admin/login"
      Then the login form should be visible
      When they submit the login form with valid credentials
      Then they should be redirected to the admin dashboard

    @p1
    Scenario: Invalid credentials show an error
      Given the user navigates to "/admin/login"
      When they submit the login form with invalid credentials
      Then they should see a login error
  ```

- [ ] **Step 3: Write `auth.steps.ts`**

  Create `apps/web-astro/tests/steps/auth.steps.ts`:

  ```typescript
  import { Given, When, Then, expect } from "../fixtures/base.fixture";

  Then("the login form should be visible", async ({ page }) => {
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
  });

  When(
    "they submit the login form with valid credentials",
    async ({ page }) => {
      const email = process.env.E2E_ADMIN_EMAIL;
      const password = process.env.E2E_ADMIN_PASSWORD;
      if (!email || !password)
        throw new Error(
          "E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD must be set for auth tests"
        );
      await page.locator("input[type='email']").fill(email);
      await page.locator("input[type='password']").fill(password);
      await page.getByRole("button", { name: /entrar/i }).click();
    }
  );

  Then("they should be redirected to the admin dashboard", async ({ page }) => {
    await page.waitForURL("**/admin", { timeout: 10000 });
    await expect(page.getByRole("heading", { name: /painel/i })).toBeVisible();
  });

  When(
    "they submit the login form with invalid credentials",
    async ({ page }) => {
      await page.locator("input[type='email']").fill("invalid@test.com");
      await page.locator("input[type='password']").fill("wrongpassword123");
      await page.getByRole("button", { name: /entrar/i }).click();
    }
  );

  Then("they should see a login error", async ({ page }) => {
    await expect(page.getByTestId("login-error")).toBeVisible({
      timeout: 5000,
    });
  });
  ```

- [ ] **Step 4: Generate BDD specs and run auth tests**

  Run from `apps/web-astro`:

  ```bash
  npx bddgen && pnpm exec playwright test --grep "Admin Authentication"
  ```

  Expected: both auth scenarios pass (valid login requires `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD` env vars to be set).

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web-astro/src/components/admin/LoginForm.tsx \
          apps/web-astro/tests/features/admin/auth.feature \
          apps/web-astro/tests/steps/auth.steps.ts \
          apps/web-astro/.features-gen
  git commit -m "feat(e2e): add admin auth feature and step definitions"
  ```

---

### Task 2: Dashboard Feature + Steps

The Dashboard component renders text labels for stat cards — no testids needed; text selectors are stable.

**Files:**

- Create: `apps/web-astro/tests/features/admin/dashboard.feature`
- Create: `apps/web-astro/tests/steps/dashboard.steps.ts`

- [ ] **Step 1: Write `dashboard.feature`**

  Create `apps/web-astro/tests/features/admin/dashboard.feature`:

  ```gherkin
  Feature: Admin Dashboard
    As an admin
    I want to see the site overview on the dashboard
    So I can quickly understand the content status

    @p0 @smoke @admin
    Scenario: Dashboard loads with content stats
      Given the user is logged in as admin
      When they navigate to "/admin"
      Then the dashboard should show stat cards

    @p1 @admin
    Scenario: Novo Artigo quick action navigates to editor
      Given the user is logged in as admin
      When they navigate to "/admin"
      And they click the "Novo Artigo" quick action
      Then they should be on the new article page
  ```

- [ ] **Step 2: Write `dashboard.steps.ts`**

  Create `apps/web-astro/tests/steps/dashboard.steps.ts`:

  ```typescript
  import { Then, When, expect } from "../fixtures/base.fixture";

  Then("the dashboard should show stat cards", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /painel de controle/i })
    ).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Total de Artigos")).toBeVisible();
    await expect(page.getByText("Publicados")).toBeVisible();
    await expect(page.getByText("Rascunhos")).toBeVisible();
    await expect(page.getByText("Categorias")).toBeVisible();
  });

  When(
    "they click the {string} quick action",
    async ({ page }, action: string) => {
      await page
        .getByRole("link", { name: new RegExp(action, "i") })
        .first()
        .click();
    }
  );

  Then("they should be on the new article page", async ({ page }) => {
    await page.waitForURL("**/artigos/new", { timeout: 5000 });
  });
  ```

- [ ] **Step 3: Generate BDD specs and run dashboard tests**

  ```bash
  npx bddgen && pnpm exec playwright test --grep "Admin Dashboard"
  ```

  Expected: both dashboard scenarios pass.

- [ ] **Step 4: Commit**

  ```bash
  git add apps/web-astro/tests/features/admin/dashboard.feature \
          apps/web-astro/tests/steps/dashboard.steps.ts \
          apps/web-astro/.features-gen
  git commit -m "feat(e2e): add admin dashboard feature and step definitions"
  ```

---

### Task 3: Theme Flash-Prevention + Settings Page Skeleton

Adds the blocking theme script to `Base.astro` (runs before React hydration to prevent flash), the sidebar nav link, and the page + component with only the theme section wired.

**Files:**

- Modify: `apps/web-astro/src/layouts/Base.astro`
- Modify: `apps/web-astro/src/layouts/Admin.astro`
- Create: `apps/web-astro/src/pages/admin/configuracoes.astro`
- Create: `apps/web-astro/src/components/admin/Settings.tsx` (theme section only)

- [ ] **Step 1: Add theme script to `Base.astro`**

  In `Base.astro`, add `is:inline` script immediately after `<head>` opens (before any other tags so it runs first):

  ```astro
  <head>
    <script is:inline>
      (function () {
        var stored = localStorage.getItem("theme") || "system";
        var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        var isDark = stored === "dark" || (stored === "system" && prefersDark);
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
      })();
    </script>
    <meta charset="UTF-8" />
    ...rest of existing head tags unchanged...
  ```

- [ ] **Step 2: Add "Configurações" link to `Admin.astro` sidebar**

  In `Admin.astro`, after the "Novo Artigo" nav link, add:

  ```astro
  <a
    href={`${prefix}/admin/configuracoes`}
    class="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors uppercase tracking-widest"
  >
    Configurações
  </a>
  ```

- [ ] **Step 3: Create `configuracoes.astro`**

  Create `apps/web-astro/src/pages/admin/configuracoes.astro`:

  ```astro
  ---
  import Admin from "../../../layouts/Admin.astro";
  import Settings from "../../../components/admin/Settings";
  ---

  <Admin title="Configurações">
    <Settings client:only="react" />
  </Admin>
  ```

- [ ] **Step 4: Create `Settings.tsx` with theme section**

  Create `apps/web-astro/src/components/admin/Settings.tsx`:

  ```tsx
  import { useState, useEffect } from "react";

  type Theme = "light" | "dark" | "system";

  type SiteSettings = {
    siteName: string;
    tagline: string;
    description: string;
  };

  const THEME_LABELS: Record<Theme, string> = {
    light: "Claro",
    dark: "Escuro",
    system: "Sistema",
  };

  function SectionHeading({ children }: { children: string }) {
    return (
      <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 border-b border-slate-100 pb-3 mb-6">
        {children}
      </h2>
    );
  }

  function Toast({ visible }: { visible: boolean }) {
    if (!visible) return null;
    return (
      <div
        data-testid="toast-success"
        className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-lg font-black text-xs uppercase tracking-widest z-50"
      >
        Salvo com sucesso
      </div>
    );
  }

  export default function Settings() {
    const [theme, setTheme] = useState<Theme>("system");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [accountLoading, setAccountLoading] = useState(false);
    const [accountError, setAccountError] = useState("");
    const [siteName, setSiteName] = useState("");
    const [tagline, setTagline] = useState("");
    const [siteDescription, setSiteDescription] = useState("");
    const [metaLoading, setMetaLoading] = useState(false);
    const [metaError, setMetaError] = useState("");
    const [toast, setToast] = useState(false);

    function showToast() {
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    }

    useEffect(() => {
      const stored = (localStorage.getItem("theme") as Theme) || "system";
      setTheme(stored);
      fetch("/api/admin/settings")
        .then((r) => r.json())
        .then((data: { settings: SiteSettings | null }) => {
          if (data.settings) {
            setSiteName(data.settings.siteName ?? "");
            setTagline(data.settings.tagline ?? "");
            setSiteDescription(data.settings.description ?? "");
          }
        })
        .catch(() => {});
    }, []);

    function applyTheme(t: Theme) {
      setTheme(t);
      localStorage.setItem("theme", t);
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const isDark = t === "dark" || (t === "system" && prefersDark);
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      );
    }

    async function saveAccount() {
      if (newPassword !== confirmPassword) {
        setAccountError("As senhas não coincidem.");
        return;
      }
      setAccountLoading(true);
      setAccountError("");
      try {
        const res = await fetch("/api/admin/account/password", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: newPassword,
            oldPassword: currentPassword,
          }),
        });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setAccountError(data.error ?? "Erro ao atualizar senha.");
          return;
        }
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        showToast();
      } finally {
        setAccountLoading(false);
      }
    }

    async function saveMetadata() {
      setMetaLoading(true);
      setMetaError("");
      try {
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            siteName,
            tagline,
            description: siteDescription,
          }),
        });
        if (!res.ok) {
          const data = (await res.json()) as { error?: string };
          setMetaError(data.error ?? "Erro ao salvar configurações.");
          return;
        }
        showToast();
      } finally {
        setMetaLoading(false);
      }
    }

    const inputClass =
      "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition";
    const labelClass =
      "block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5";
    const btnPrimary =
      "px-6 py-2.5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed";

    return (
      <div className="space-y-12 max-w-xl">
        <Toast visible={toast} />

        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Configurações
          </h1>
        </div>

        {/* Theme */}
        <section>
          <SectionHeading>Tema</SectionHeading>
          <div
            data-testid="theme-selector"
            className="flex gap-6"
            role="radiogroup"
            aria-label="Tema"
          >
            {(["light", "dark", "system"] as Theme[]).map((t) => (
              <label
                key={t}
                className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-700"
              >
                <input
                  type="radio"
                  name="theme"
                  value={t}
                  data-testid={`theme-${t}`}
                  checked={theme === t}
                  onChange={() => applyTheme(t)}
                  className="accent-slate-900"
                />
                {THEME_LABELS[t]}
              </label>
            ))}
          </div>
        </section>

        {/* Account */}
        <section>
          <SectionHeading>Conta</SectionHeading>
          {accountError && (
            <p className="text-red-600 text-sm font-medium mb-4">
              {accountError}
            </p>
          )}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Senha Atual</label>
              <input
                type="password"
                data-testid="account-current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className={labelClass}>Nova Senha</label>
              <input
                type="password"
                data-testid="account-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className={labelClass}>Confirmar Nova Senha</label>
              <input
                type="password"
                data-testid="account-password-confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
              />
            </div>
            <button
              type="button"
              data-testid="account-save"
              onClick={saveAccount}
              disabled={accountLoading}
              className={btnPrimary}
            >
              {accountLoading ? "Salvando..." : "Salvar Senha"}
            </button>
          </div>
        </section>

        {/* Site Metadata */}
        <section>
          <SectionHeading>Metadados do Site</SectionHeading>
          {metaError && (
            <p className="text-red-600 text-sm font-medium mb-4">{metaError}</p>
          )}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Nome do Site</label>
              <input
                type="text"
                data-testid="settings-site-name"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className={inputClass}
                placeholder="Astrobiologia"
              />
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input
                type="text"
                data-testid="settings-tagline"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className={inputClass}
                placeholder="Portal brasileiro de astrobiologia"
              />
            </div>
            <div>
              <label className={labelClass}>Descrição</label>
              <textarea
                data-testid="settings-description"
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className={`${inputClass} resize-none`}
                rows={3}
                placeholder="Notícias e pesquisas sobre a vida no universo."
              />
            </div>
            <button
              type="button"
              data-testid="settings-save"
              onClick={saveMetadata}
              disabled={metaLoading}
              className={btnPrimary}
            >
              {metaLoading ? "Salvando..." : "Salvar Metadados"}
            </button>
          </div>
        </section>
      </div>
    );
  }
  ```

- [ ] **Step 5: Verify TypeScript compiles**

  ```bash
  pnpm --filter @astrobiologia/web-astro check
  ```

  Expected: no type errors.

- [ ] **Step 6: Commit**

  ```bash
  git add apps/web-astro/src/layouts/Base.astro \
          apps/web-astro/src/layouts/Admin.astro \
          apps/web-astro/src/pages/admin/configuracoes.astro \
          apps/web-astro/src/components/admin/Settings.tsx
  git commit -m "feat(admin): add settings page with theme, account, and metadata sections"
  ```

---

### Task 4: Account API Routes

**Files:**

- Create: `apps/web-astro/src/pages/api/admin/account/password.ts`
- Create: `apps/web-astro/src/pages/api/admin/account/email.ts`

- [ ] **Step 1: Create `account/password.ts`**

  Create `apps/web-astro/src/pages/api/admin/account/password.ts`:

  ```typescript
  import type { APIRoute } from "astro";
  import { createSessionClient } from "../../../../lib/appwrite";

  function json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  export const PATCH: APIRoute = async ({ locals, request }) => {
    if (!locals.user) return json({ error: "Unauthorized" }, 401);

    let body: { password: string; oldPassword: string };
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const { password, oldPassword } = body;
    if (!password || !oldPassword)
      return json({ error: "Campos obrigatórios ausentes." }, 400);

    try {
      const { account } = createSessionClient(request);
      await account.updatePassword(password, oldPassword);
      return json({ success: true });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao atualizar senha.";
      return json({ error: msg }, 400);
    }
  };
  ```

- [ ] **Step 2: Create `account/email.ts`**

  Create `apps/web-astro/src/pages/api/admin/account/email.ts`:

  ```typescript
  import type { APIRoute } from "astro";
  import { createSessionClient } from "../../../../lib/appwrite";

  function json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  export const PATCH: APIRoute = async ({ locals, request }) => {
    if (!locals.user) return json({ error: "Unauthorized" }, 401);

    let body: { email: string; password: string };
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const { email, password } = body;
    if (!email || !password)
      return json({ error: "Campos obrigatórios ausentes." }, 400);

    try {
      const { account } = createSessionClient(request);
      await account.updateEmail(email, password);
      return json({ success: true });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao atualizar e-mail.";
      return json({ error: msg }, 400);
    }
  };
  ```

- [ ] **Step 3: Add email sub-form to `Settings.tsx`**

  In `apps/web-astro/src/components/admin/Settings.tsx`, add the following state variables at the top of the component (alongside the existing account state):

  ```tsx
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  ```

  Add this `saveEmail` function after `saveAccount`:

  ```tsx
  async function saveEmail() {
    setEmailLoading(true);
    setEmailError("");
    try {
      const res = await fetch("/api/admin/account/email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: emailPassword }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setEmailError(data.error ?? "Erro ao atualizar e-mail.");
        return;
      }
      setNewEmail("");
      setEmailPassword("");
      showToast();
    } finally {
      setEmailLoading(false);
    }
  }
  ```

  Replace the Account `<section>` in the JSX with this version that has both sub-forms:

  ```tsx
  {
    /* Account */
  }
  <section>
    <SectionHeading>Conta</SectionHeading>

    {/* Email sub-form */}
    <div className="mb-8">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
        Alterar E-mail
      </p>
      {emailError && (
        <p className="text-red-600 text-sm font-medium mb-4">{emailError}</p>
      )}
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Novo E-mail</label>
          <input
            type="email"
            data-testid="account-email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className={inputClass}
            placeholder="novo@exemplo.com"
          />
        </div>
        <div>
          <label className={labelClass}>Senha Atual</label>
          <input
            type="password"
            data-testid="account-email-password"
            value={emailPassword}
            onChange={(e) => setEmailPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
        <button
          type="button"
          data-testid="account-email-save"
          onClick={saveEmail}
          disabled={emailLoading}
          className={btnPrimary}
        >
          {emailLoading ? "Salvando..." : "Salvar E-mail"}
        </button>
      </div>
    </div>

    {/* Password sub-form */}
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
        Alterar Senha
      </p>
      {accountError && (
        <p className="text-red-600 text-sm font-medium mb-4">{accountError}</p>
      )}
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Senha Atual</label>
          <input
            type="password"
            data-testid="account-current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className={labelClass}>Nova Senha</label>
          <input
            type="password"
            data-testid="account-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className={labelClass}>Confirmar Nova Senha</label>
          <input
            type="password"
            data-testid="account-password-confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
        <button
          type="button"
          data-testid="account-save"
          onClick={saveAccount}
          disabled={accountLoading}
          className={btnPrimary}
        >
          {accountLoading ? "Salvando..." : "Salvar Senha"}
        </button>
      </div>
    </div>
  </section>;
  ```

- [ ] **Step 4: Verify TypeScript compiles**

  ```bash
  pnpm --filter @astrobiologia/web-astro check
  ```

  Expected: no type errors.

- [ ] **Step 5: Commit**

  ```bash
  git add apps/web-astro/src/pages/api/admin/account/ \
          apps/web-astro/src/components/admin/Settings.tsx
  git commit -m "feat(api): add account password and email update routes and forms"
  ```

---

### Task 5: Site Metadata API Route

**Prerequisite:** `SITE_SETTINGS_COLLECTION_ID` must point to an Appwrite collection with string attributes: `siteName`, `tagline`, `description`. The API gracefully returns `{ settings: null }` when the collection is not configured (GET) and returns a 500 with an error message (PUT).

**Files:**

- Create: `apps/web-astro/src/pages/api/admin/settings.ts`

- [ ] **Step 1: Create `settings.ts`**

  Create `apps/web-astro/src/pages/api/admin/settings.ts`:

  ```typescript
  import type { APIRoute } from "astro";
  import {
    createAdminClient,
    createSessionClient,
  } from "../../../lib/appwrite";

  function json(data: unknown, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const SETTINGS_DOC_ID = "site-settings";

  export const GET: APIRoute = async ({ locals, request }) => {
    if (!locals.user) return json({ error: "Unauthorized" }, 401);

    try {
      const { databases } = createSessionClient(request);
      const DB = import.meta.env.DATABASE_ID;
      const SETTINGS = import.meta.env.SITE_SETTINGS_COLLECTION_ID;
      const doc = await databases.getDocument(DB, SETTINGS, SETTINGS_DOC_ID);
      return json({ settings: doc });
    } catch {
      return json({ settings: null });
    }
  };

  export const PUT: APIRoute = async ({ locals, request }) => {
    if (!locals.user) return json({ error: "Unauthorized" }, 401);

    let body: { siteName?: string; tagline?: string; description?: string };
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    try {
      const { databases } = createAdminClient();
      const DB = import.meta.env.DATABASE_ID;
      const SETTINGS = import.meta.env.SITE_SETTINGS_COLLECTION_ID;

      try {
        await databases.updateDocument(DB, SETTINGS, SETTINGS_DOC_ID, body);
      } catch {
        await databases.createDocument(DB, SETTINGS, SETTINGS_DOC_ID, body);
      }
      return json({ success: true });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao salvar configurações.";
      return json({ error: msg }, 500);
    }
  };
  ```

- [ ] **Step 2: Verify TypeScript compiles**

  ```bash
  pnpm --filter @astrobiologia/web-astro check
  ```

  Expected: no type errors.

- [ ] **Step 3: Commit**

  ```bash
  git add apps/web-astro/src/pages/api/admin/settings.ts
  git commit -m "feat(api): add site settings read/write route"
  ```

---

### Task 6: Settings Feature + Steps

The `@wip` metadata scenario will fail until the Appwrite `SITE_SETTINGS_COLLECTION_ID` collection is configured — this is intentional; it marks an infrastructure gap in the quality map.

**Files:**

- Create: `apps/web-astro/tests/features/admin/settings.feature`
- Create: `apps/web-astro/tests/steps/settings.steps.ts`

- [ ] **Step 1: Write `settings.feature`**

  Create `apps/web-astro/tests/features/admin/settings.feature`:

  ```gherkin
  Feature: Admin Settings
    As an admin
    I want to configure site settings
    So I can customize the site behavior and appearance

    @p0 @admin
    Scenario: Theme preference persists across page reload
      Given the user is logged in as admin
      When they navigate to "/admin/configuracoes"
      And they select the "dark" theme
      And they reload the page
      Then the "dark" theme radio should be selected

    @p1 @admin
    Scenario: Admin can update account password
      Given the user is logged in as admin
      When they navigate to "/admin/configuracoes"
      And they fill in the account password form
      And they save the account settings
      Then they should see a success toast

    @p1 @admin @wip
    Scenario: Site metadata can be saved
      Given the user is logged in as admin
      When they navigate to "/admin/configuracoes"
      And they fill in the site metadata
      And they save the site metadata
      Then they should see a success toast
  ```

- [ ] **Step 2: Write `settings.steps.ts`**

  Create `apps/web-astro/tests/steps/settings.steps.ts`:

  ```typescript
  import { When, Then, expect } from "../fixtures/base.fixture";

  When("they select the {string} theme", async ({ page }, theme: string) => {
    await page.getByTestId(`theme-${theme}`).click();
  });

  When("they reload the page", async ({ page }) => {
    await page.reload();
  });

  Then(
    "the {string} theme radio should be selected",
    async ({ page }, theme: string) => {
      await expect(page.getByTestId(`theme-${theme}`)).toBeChecked();
    }
  );

  When("they fill in the account password form", async ({ page }) => {
    const password = process.env.E2E_ADMIN_PASSWORD;
    if (!password) throw new Error("E2E_ADMIN_PASSWORD must be set");
    await page.getByTestId("account-current-password").fill(password);
    await page.getByTestId("account-password").fill(password);
    await page.getByTestId("account-password-confirm").fill(password);
  });

  When("they save the account settings", async ({ page }) => {
    const savedPromise = page.waitForResponse(
      (r) =>
        r.url().includes("/api/admin/account/password") &&
        r.request().method() === "PATCH" &&
        r.ok(),
      { timeout: 15000 }
    );
    await page.getByTestId("account-save").click();
    await savedPromise;
  });

  When("they fill in the site metadata", async ({ page }) => {
    await page.getByTestId("settings-site-name").fill("Astrobiologia");
    await page
      .getByTestId("settings-tagline")
      .fill("Portal brasileiro de astrobiologia");
    await page
      .getByTestId("settings-description")
      .fill("Notícias e pesquisas sobre a vida no universo.");
  });

  When("they save the site metadata", async ({ page }) => {
    const savedPromise = page.waitForResponse(
      (r) =>
        r.url().includes("/api/admin/settings") &&
        r.request().method() === "PUT" &&
        r.ok(),
      { timeout: 15000 }
    );
    await page.getByTestId("settings-save").click();
    await savedPromise;
  });

  Then("they should see a success toast", async ({ page }) => {
    await expect(page.getByTestId("toast-success")).toBeVisible({
      timeout: 10000,
    });
  });
  ```

- [ ] **Step 3: Generate BDD specs and run settings tests**

  ```bash
  npx bddgen && pnpm exec playwright test --grep "Admin Settings"
  ```

  Expected: theme persistence scenario passes; password scenario passes if `E2E_ADMIN_PASSWORD` is set; metadata scenario fails with a 500 until the Appwrite collection is configured (expected).

- [ ] **Step 4: Commit**

  ```bash
  git add apps/web-astro/tests/features/admin/settings.feature \
          apps/web-astro/tests/steps/settings.steps.ts \
          apps/web-astro/.features-gen
  git commit -m "feat(e2e): add admin settings feature and step definitions"
  ```
