export function normalizeLocaleTag(tag: string): string {
  return tag.trim().toLowerCase().replace(/_/g, "-");
}

export function primaryLanguageSubtag(tag: string): string {
  const normalized = normalizeLocaleTag(tag);
  const separatorIndex = normalized.indexOf("-");
  return separatorIndex === -1
    ? normalized
    : normalized.slice(0, separatorIndex);
}

export function localeTagsMatch(stored: string, preferred: string): boolean {
  const normalizedStored = normalizeLocaleTag(stored);
  const normalizedPreferred = normalizeLocaleTag(preferred);
  if (normalizedStored === normalizedPreferred) return true;
  return (
    primaryLanguageSubtag(normalizedStored) ===
    primaryLanguageSubtag(normalizedPreferred)
  );
}

export function shouldShowTranslationFallbackBadge(
  uiLocale: string,
  translation: { language: string } | undefined
): boolean {
  const normalizedUi = normalizeLocaleTag(uiLocale);
  if (!translation) {
    return normalizedUi !== "pt-br";
  }
  if (normalizedUi === "pt-br") {
    return normalizeLocaleTag(translation.language) !== "pt-br";
  }
  return !localeTagsMatch(translation.language, uiLocale);
}
