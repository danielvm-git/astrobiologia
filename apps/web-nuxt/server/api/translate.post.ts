import { isDeepLConfigured, translateText } from "~/server/utils/deepl";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({ statusCode: 401, statusMessage: "Não autorizado" });
  }

  const body = await readBody<{
    text?: string;
    isHtml?: boolean;
    targetLang?: string;
  }>(event);
  if (!body.text) {
    throw createError({
      statusCode: 400,
      statusMessage: "Texto não fornecido",
    });
  }

  if (!body.targetLang) {
    throw createError({
      statusCode: 400,
      statusMessage: "Idioma de destino não fornecido",
    });
  }

  try {
    const translated = await translateText(
      body.text,
      body.targetLang,
      body.isHtml
    );
    return { translated };
  } catch {
    if (!isDeepLConfigured()) {
      throw createError({
        statusCode: 503,
        statusMessage: "DEEPL_API_KEY não configurada.",
      });
    }
    throw createError({ statusCode: 500, statusMessage: "Erro ao traduzir." });
  }
});
