export const ARTICLE_LOCALES = ["pt-br", "en", "nl", "es", "ja", "zh"] as const;

export type ArticleLocale = (typeof ARTICLE_LOCALES)[number];

// Labels in Portuguese (default)
const LABELS_PT: Record<string, string> = {
  "pt-br": "Português",
  en: "Inglês",
  nl: "Holandês",
  es: "Espanhol",
  ja: "Japonês",
  zh: "Chinês",
};

// Labels in English
const LABELS_EN: Record<string, string> = {
  "pt-br": "Portuguese",
  en: "English",
  nl: "Dutch",
  es: "Spanish",
  ja: "Japanese",
  zh: "Chinese",
};

// Labels in Spanish
const LABELS_ES: Record<string, string> = {
  "pt-br": "Portugués",
  en: "Inglés",
  nl: "Holandés",
  es: "Espanhol",
  ja: "Japonés",
  zh: "Chino",
};

// Labels in Dutch
const LABELS_NL: Record<string, string> = {
  "pt-br": "Portugees",
  en: "Engels",
  nl: "Nederlands",
  es: "Spaans",
  ja: "Japans",
  zh: "Chinees",
};

// Labels in Japanese
const LABELS_JA: Record<string, string> = {
  "pt-br": "ポルトガル語",
  en: "英語",
  nl: "オランダ語",
  es: "スペイン語",
  ja: "日本語",
  zh: "中国語",
};

// Labels in Chinese
const LABELS_ZH: Record<string, string> = {
  "pt-br": "葡萄牙语",
  en: "英语",
  nl: "荷兰语",
  es: "西班牙语",
  ja: "日语",
  zh: "中文",
};

const ALL_LABELS: Record<string, Record<string, string>> = {
  "pt-br": LABELS_PT,
  en: LABELS_EN,
  es: LABELS_ES,
  nl: LABELS_NL,
  ja: LABELS_JA,
  zh: LABELS_ZH,
};

export function getArticleLocaleLabels(
  uiLocale: string
): Record<string, string> {
  return ALL_LABELS[uiLocale] || LABELS_EN;
}

export const ARTICLE_LOCALE_LABELS: Record<string, string> = {
  "pt-br": "Portuguese",
  en: "English",
  nl: "Dutch",
  es: "Spanish",
  ja: "Japanese",
  zh: "Chinese",
};
