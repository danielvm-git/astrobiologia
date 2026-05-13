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
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
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

      {/* Account — password sub-form only; email sub-form added in Task 4 */}
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
