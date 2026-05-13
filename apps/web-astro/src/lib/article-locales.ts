export const ARTICLE_LOCALES = ["pt-br", "en", "nl", "es", "ja", "zh"] as const;
export type ArticleLocale = (typeof ARTICLE_LOCALES)[number];

const LABELS: Record<string, Record<string, string>> = {
  "pt-br": {
    "pt-br": "Português",
    en: "Inglês",
    nl: "Holandês",
    es: "Espanhol",
    ja: "Japonês",
    zh: "Chinês",
  },
  en: {
    "pt-br": "Portuguese",
    en: "English",
    nl: "Dutch",
    es: "Spanish",
    ja: "Japanese",
    zh: "Chinese",
  },
  es: {
    "pt-br": "Portugués",
    en: "Inglés",
    nl: "Holandés",
    es: "Español",
    ja: "Japonés",
    zh: "Chino",
  },
  nl: {
    "pt-br": "Portugees",
    en: "Engels",
    nl: "Nederlands",
    es: "Spaans",
    ja: "Japans",
    zh: "Chinees",
  },
  ja: {
    "pt-br": "ポルトガル語",
    en: "英語",
    nl: "オランダ語",
    es: "スペイン語",
    ja: "日本語",
    zh: "中国語",
  },
  zh: {
    "pt-br": "葡萄牙语",
    en: "英语",
    nl: "荷兰语",
    es: "西班牙语",
    ja: "日语",
    zh: "中文",
  },
};

export function getArticleLocaleLabels(
  uiLocale: string
): Record<string, string> {
  return LABELS[uiLocale] ?? LABELS["en"];
}
