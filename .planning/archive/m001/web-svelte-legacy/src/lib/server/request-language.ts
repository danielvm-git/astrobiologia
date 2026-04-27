export const DEFAULT_REQUEST_LANGUAGE = "pt-br" as const;

type LocalsWithParaglide = {
  paraglide?: { lang?: string };
};

export function getRequestLanguage(locals: LocalsWithParaglide): string {
  const raw = locals.paraglide?.lang;
  if (typeof raw === "string" && raw.length > 0) {
    return raw;
  }
  return DEFAULT_REQUEST_LANGUAGE;
}
