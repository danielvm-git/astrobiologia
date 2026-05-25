import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";
type SiteSettings = { siteName: string; tagline: string; description: string };

const THEME_LABELS: Record<Theme, string> = {
  light: "Claro",
  dark: "Escuro",
  system: "Sistema",
};

const inputClass =
  "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition";
const labelClass =
  "block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5";
const btnPrimary =
  "px-6 py-2.5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed";

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

function ThemeSection({
  theme,
  applyTheme,
}: {
  theme: Theme;
  applyTheme: (t: Theme) => void;
}) {
  return (
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
  );
}

type EmailSubFormProps = {
  newEmail: string;
  setNewEmail: (v: string) => void;
  emailPassword: string;
  setEmailPassword: (v: string) => void;
  emailLoading: boolean;
  emailError: string;
  saveEmail: () => void;
};

function EmailSubForm({
  newEmail,
  setNewEmail,
  emailPassword,
  setEmailPassword,
  emailLoading,
  emailError,
  saveEmail,
}: EmailSubFormProps) {
  return (
    <div className="mb-8">
      <p className={`${labelClass} mb-4`}>Alterar E-mail</p>
      {emailError && (
        <p className="text-red-600 text-sm font-medium mb-4">{emailError}</p>
      )}
      <div className="space-y-4">
        <div>
          <label htmlFor="account-email" className={labelClass}>
            Novo E-mail
          </label>
          <input
            type="email"
            id="account-email"
            data-testid="account-email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className={inputClass}
            placeholder="novo@exemplo.com"
          />
        </div>
        <div>
          <label htmlFor="account-email-password" className={labelClass}>
            Senha Atual
          </label>
          <input
            type="password"
            id="account-email-password"
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
  );
}

type AccountSectionProps = {
  currentPassword: string;
  setCurrentPassword: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  accountLoading: boolean;
  accountError: string;
  saveAccount: () => void;
  newEmail: string;
  setNewEmail: (v: string) => void;
  emailPassword: string;
  setEmailPassword: (v: string) => void;
  emailLoading: boolean;
  emailError: string;
  saveEmail: () => void;
};

function AccountSection(p: AccountSectionProps) {
  return (
    <section>
      <SectionHeading>Conta</SectionHeading>
      <EmailSubForm
        newEmail={p.newEmail}
        setNewEmail={p.setNewEmail}
        emailPassword={p.emailPassword}
        setEmailPassword={p.setEmailPassword}
        emailLoading={p.emailLoading}
        emailError={p.emailError}
        saveEmail={p.saveEmail}
      />
      {p.accountError && (
        <p
          data-testid="account-error"
          className="text-red-600 text-sm font-medium mb-4"
        >
          {p.accountError}
        </p>
      )}
      <div className="space-y-4">
        <div>
          <label htmlFor="account-current-password" className={labelClass}>
            Senha Atual
          </label>
          <input
            id="account-current-password"
            type="password"
            data-testid="account-current-password"
            value={p.currentPassword}
            onChange={(e) => p.setCurrentPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
        <div>
          <label htmlFor="account-password" className={labelClass}>
            Nova Senha
          </label>
          <input
            id="account-password"
            type="password"
            data-testid="account-password"
            value={p.newPassword}
            onChange={(e) => p.setNewPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
        <div>
          <label htmlFor="account-password-confirm" className={labelClass}>
            Confirmar Nova Senha
          </label>
          <input
            id="account-password-confirm"
            type="password"
            data-testid="account-password-confirm"
            value={p.confirmPassword}
            onChange={(e) => p.setConfirmPassword(e.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
        <button
          type="button"
          data-testid="account-save"
          onClick={p.saveAccount}
          disabled={p.accountLoading}
          className={btnPrimary}
        >
          {p.accountLoading ? "Salvando..." : "Salvar Senha"}
        </button>
      </div>
    </section>
  );
}

type MetadataSectionProps = {
  siteName: string;
  setSiteName: (v: string) => void;
  tagline: string;
  setTagline: (v: string) => void;
  siteDescription: string;
  setSiteDescription: (v: string) => void;
  metaLoading: boolean;
  metaError: string;
  saveMetadata: () => void;
};

function MetadataSection(p: MetadataSectionProps) {
  return (
    <section>
      <SectionHeading>Metadados do Site</SectionHeading>
      {p.metaError && (
        <p className="text-red-600 text-sm font-medium mb-4">{p.metaError}</p>
      )}
      <div className="space-y-4">
        <div>
          <label htmlFor="settings-site-name" className={labelClass}>
            Nome do Site
          </label>
          <input
            id="settings-site-name"
            type="text"
            data-testid="settings-site-name"
            value={p.siteName}
            onChange={(e) => p.setSiteName(e.target.value)}
            className={inputClass}
            placeholder="Astrobiologia"
          />
        </div>
        <div>
          <label htmlFor="settings-tagline" className={labelClass}>
            Tagline
          </label>
          <input
            id="settings-tagline"
            type="text"
            data-testid="settings-tagline"
            value={p.tagline}
            onChange={(e) => p.setTagline(e.target.value)}
            className={inputClass}
            placeholder="Portal brasileiro de astrobiologia"
          />
        </div>
        <div>
          <label htmlFor="settings-description" className={labelClass}>
            Descrição
          </label>
          <textarea
            id="settings-description"
            data-testid="settings-description"
            value={p.siteDescription}
            onChange={(e) => p.setSiteDescription(e.target.value)}
            className={`${inputClass} resize-none`}
            rows={3}
            placeholder="Notícias e pesquisas sobre a vida no universo."
          />
        </div>
        <button
          type="button"
          data-testid="settings-save"
          onClick={p.saveMetadata}
          disabled={p.metaLoading}
          className={btnPrimary}
        >
          {p.metaLoading ? "Salvando..." : "Salvar Metadados"}
        </button>
      </div>
    </section>
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
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [toast, setToast] = useState(false);

  function showToast() {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

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
    } catch {
      setEmailError("Erro de rede. Tente novamente.");
    } finally {
      setEmailLoading(false);
    }
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

  return (
    <div className="space-y-12 max-w-xl">
      <Toast visible={toast} />
      <div>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Configurações
        </h1>
      </div>
      <ThemeSection theme={theme} applyTheme={applyTheme} />
      <AccountSection
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        accountLoading={accountLoading}
        accountError={accountError}
        saveAccount={saveAccount}
        newEmail={newEmail}
        setNewEmail={setNewEmail}
        emailPassword={emailPassword}
        setEmailPassword={setEmailPassword}
        emailLoading={emailLoading}
        emailError={emailError}
        saveEmail={saveEmail}
      />
      <MetadataSection
        siteName={siteName}
        setSiteName={setSiteName}
        tagline={tagline}
        setTagline={setTagline}
        siteDescription={siteDescription}
        setSiteDescription={setSiteDescription}
        metaLoading={metaLoading}
        metaError={metaError}
        saveMetadata={saveMetadata}
      />
    </div>
  );
}
