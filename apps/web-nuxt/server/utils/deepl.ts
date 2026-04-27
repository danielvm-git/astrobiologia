const TARGET_LANG_MAP: Record<string, string> = {
  "pt-br": "PT-BR",
  en: "EN-US",
  nl: "NL",
  es: "ES",
  ja: "JA",
  zh: "ZH",
};

export function isDeepLConfigured(): boolean {
  return Boolean(process.env.DEEPL_API_KEY?.trim());
}

export async function translateText(
  text: string,
  targetLang: string,
  isHtml = false
): Promise<string> {
  const authKey = process.env.DEEPL_API_KEY;
  if (!authKey) {
    throw new Error("DEEPL_API_KEY is not configured");
  }

  const targetCode =
    TARGET_LANG_MAP[targetLang.toLowerCase()] || targetLang.toUpperCase();
  const isFree = authKey.endsWith(":fx");
  const url = isFree
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";

  const params = new URLSearchParams();
  params.append("text", text);
  params.append("source_lang", "PT");
  params.append("target_lang", targetCode);
  if (isHtml) {
    params.append("tag_handling", "html");
  }

  const response = await fetch(url, {
    method: "POST",
    body: params,
    headers: {
      Authorization: `DeepL-Auth-Key ${authKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!response.ok) {
    throw new Error(`DeepL API Error: ${response.status}`);
  }

  const data = (await response.json()) as {
    translations?: Array<{ text: string }>;
  };
  return data.translations?.[0]?.text || "";
}
