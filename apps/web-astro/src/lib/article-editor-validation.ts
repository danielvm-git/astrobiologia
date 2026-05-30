import type { ArticleTranslationTitleFields } from "@/lib/article-editor-types";

export const ARTICLE_TITLE_REQUIRED_MESSAGE = "O título é obrigatório.";
export const MASTER_ARTICLE_LOCALE = "pt-br";

/** Client-side guard: master locale (pt-br) title is required before save. */
export function getPortugueseTitleValidationError(
  translations: Record<string, ArticleTranslationTitleFields | undefined>
): string | null {
  const title = translations[MASTER_ARTICLE_LOCALE]?.title?.trim();
  if (!title) return ARTICLE_TITLE_REQUIRED_MESSAGE;
  return null;
}

export function getPortugueseTitleValidationErrorFromInputs(
  inputs: Array<{ language?: string; title?: string }>
): string | null {
  const ptBr = inputs.find((t) => t.language === MASTER_ARTICLE_LOCALE);
  return getPortugueseTitleValidationError({ [MASTER_ARTICLE_LOCALE]: ptBr });
}
