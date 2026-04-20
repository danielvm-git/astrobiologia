import { json, error } from '@sveltejs/kit';
import { translateText } from '$lib/server/deepl';

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
        return json({ error: 'Erro ao traduzir. Verifique a chave da API do DeepL.' }, { status: 500 });
    }
};
