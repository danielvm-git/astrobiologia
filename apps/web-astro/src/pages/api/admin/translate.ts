import type { APIRoute } from "astro";
import { getEnv } from "../../../lib/appwrite";

const TARGET_LANG_MAP: Record<string, string> = {
  "pt-br": "PT-BR",
  en: "EN-US",
  nl: "NL",
  es: "ES",
  ja: "JA",
  zh: "ZH",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ locals, request }) => {
  if (!locals.user) return json({ error: "Não autorizado" }, 401);

  let body: { text?: string; isHtml?: boolean; targetLang?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  if (!body.text) return json({ error: "Texto não fornecido" }, 400);
  if (!body.targetLang)
    return json({ error: "Idioma de destino não fornecido" }, 400);

  const authKey = getEnv("DEEPL_API_KEY");
  if (!authKey?.trim())
    return json({ error: "DEEPL_API_KEY não configurada" }, 503);

  const targetCode =
    TARGET_LANG_MAP[body.targetLang.toLowerCase()] ||
    body.targetLang.toUpperCase();
  const isFree = authKey.endsWith(":fx");
  const url = isFree
    ? "https://api-free.deepl.com/v2/translate"
    : "https://api.deepl.com/v2/translate";

  const params = new URLSearchParams({
    text: body.text,
    source_lang: "PT",
    target_lang: targetCode,
  });
  if (body.isHtml) params.append("tag_handling", "html");

  try {
    const res = await fetch(url, {
      method: "POST",
      body: params,
      headers: {
        Authorization: `DeepL-Auth-Key ${authKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (!res.ok) throw new Error(`DeepL ${res.status}`);
    const data = (await res.json()) as {
      translations?: Array<{ text: string }>;
    };
    return json({ translated: data.translations?.[0]?.text ?? "" });
  } catch {
    return json({ error: "Erro ao traduzir" }, 500);
  }
};
