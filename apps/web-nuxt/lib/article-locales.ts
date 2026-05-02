export const ARTICLE_LOCALES = ["pt-br", "en", "nl", "es", "ja", "zh"] as const;

export type ArticleLocale = (typeof ARTICLE_LOCALES)[number];

export const ARTICLE_LOCALE_LABELS: Record<string, string> = {
  "pt-br": "Português",
  en: "English",
  nl: "Dutch",
  es: "Español",
  ja: "日本語",
  zh: "中文",
};
