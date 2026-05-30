import type { ArticleTranslation } from "@/lib/article-editor-types";

type TranslateApiResult = { translated?: string };

async function translateText(
  text: string,
  targetLocale: string,
  isHtml = false
): Promise<string> {
  if (!text.trim()) return "";
  const res = await fetch("/api/admin/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, targetLang: targetLocale, isHtml }),
  });
  const data = (await res.json()) as TranslateApiResult;
  return data.translated ?? text;
}

export async function buildTranslatedLocaleFields(
  source: ArticleTranslation,
  targetLocale: string,
  opts: { existingSlug: string; ptBrSlug: string }
): Promise<ArticleTranslation> {
  const [title, excerpt, content, metaTitle, metaDescription] =
    await Promise.all([
      translateText(source.title, targetLocale),
      translateText(source.excerpt, targetLocale),
      translateText(source.content, targetLocale, true),
      translateText(source.metaTitle || source.title, targetLocale),
      translateText(source.metaDescription || source.excerpt, targetLocale),
    ]);

  const slug =
    opts.existingSlug ||
    (opts.ptBrSlug ? `${opts.ptBrSlug}-${targetLocale}` : "");

  return {
    language: targetLocale,
    title,
    slug,
    excerpt,
    content,
    metaTitle,
    metaDescription,
  };
}
