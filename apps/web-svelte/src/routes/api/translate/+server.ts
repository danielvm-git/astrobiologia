import { json, error } from '@sveltejs/kit';
import { isDeepLConfigured, translateText } from '$lib/server/deepl';

export const POST = async ({ request, locals }) => {
    // Only allow authenticated users (admins) to use the translation API
    if (!locals.user) {
        throw error(401, 'Não autorizado');
    }

    const body = await request.json();
    const { text, isHtml, targetLang } = body;

    if (!text) {
        throw error(400, 'Texto não fornecido');
    }

    if (!targetLang) {
        throw error(400, 'Idioma de destino não fornecido');
    }

    try {
        const translated = await translateText(text, targetLang, isHtml);
        return json({ translated });
    } catch (e: any) {
        console.error('API Translation error:', e);
        if (!isDeepLConfigured()) {
            return json(
                {
                    error: 'DEEPL_API_KEY não configurada. Use "Copiar do inglês" ou defina a chave no ambiente.',
                    code: 'deepl_unconfigured'
                },
                { status: 503 }
            );
        }
        return json({ error: 'Erro ao traduzir. Verifique a chave da API do DeepL.' }, { status: 500 });
    }
};
