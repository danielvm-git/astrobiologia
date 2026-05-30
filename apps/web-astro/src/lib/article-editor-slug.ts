type SlugContext = {
  activeLocale: string;
  title: string;
  ptBrSlug: string;
};

export function deriveArticleSlug({
  activeLocale,
  title,
  ptBrSlug,
}: SlugContext): string {
  let slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  if (!slug && title.trim()) {
    slug =
      ptBrSlug && activeLocale !== "pt-br"
        ? `${ptBrSlug}-${activeLocale}`
        : `artigo-${activeLocale}-${Date.now().toString(36)}`;
  }

  return slug;
}
