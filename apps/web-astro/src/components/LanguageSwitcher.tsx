import { useState } from "react";

const LANGUAGE_NAMES: Record<string, string> = {
  "pt-br": "PT-BR",
  en: "English",
  es: "Español",
  ja: "日本語",
  nl: "Dutch",
  zh: "中文",
};

const LOCALES = ["pt-br", "en", "es", "ja", "nl", "zh"];

interface Props {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function getLocaleHref(locale: string) {
    return locale === "pt-br" ? "/" : `/${locale}/`;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors rounded-md hover:bg-slate-50"
        aria-expanded={isOpen}
        aria-label="Selecionar idioma"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="m5 8 6 6" />
          <path d="m4 14 6-6 2-3" />
          <path d="M2 5h12" />
          <path d="M7 2h1" />
          <path d="m22 22-5-10-5 10" />
          <path d="M14 18h6" />
        </svg>
        {LANGUAGE_NAMES[currentLocale] ?? currentLocale.toUpperCase()}
        <svg
          className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white border border-slate-100 shadow-2xl py-2 z-50">
            {LOCALES.map((locale) => (
              <a
                key={locale}
                href={getLocaleHref(locale)}
                className={`block px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-slate-50 ${
                  currentLocale === locale ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {LANGUAGE_NAMES[locale] ?? locale.toUpperCase()}
              </a>
            ))}
          </div>
          <button
            className="fixed inset-0 z-40 cursor-default bg-transparent w-full h-full border-none"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        </>
      )}
    </div>
  );
}
