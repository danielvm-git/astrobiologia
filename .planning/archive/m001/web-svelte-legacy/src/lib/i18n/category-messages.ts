import * as m from "$lib/paraglide/messages";

const titleBySlug: Record<string, () => string> = {
  analises: m.category_analises,
  entrevistas: m.category_entrevistas,
  exoplanetas: m.category_exoplanetas,
  extremofilos: m.category_extremofilos,
  noticias: m.category_noticias,
  "pesquisas-brasileiras": m.category_pesquisas,
};

const descriptionBySlug: Record<string, () => string> = {
  analises: m.category_desc_analises,
  entrevistas: m.category_desc_entrevistas,
  exoplanetas: m.category_desc_exoplanetas,
  extremofilos: m.category_desc_extremofilos,
  noticias: m.category_desc_noticias,
  "pesquisas-brasileiras": m.category_desc_pesquisas,
};

export function getCategoryTitleI18n(slug: string): string {
  return titleBySlug[slug]?.() ?? slug;
}

export function getCategoryDescriptionI18n(slug: string): string {
  return descriptionBySlug[slug]?.() ?? m.hero_subtitle();
}
