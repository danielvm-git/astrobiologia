import { json, error } from '@sveltejs/kit';
import { translateHtmlToEnglish, translateToEnglish } from '$lib/server/deepl';

export const POST = async ({ request, locals }) => {
    // Only allow authenticated users (admins) to use the translation API
    if (!locals.user) {
        throw error(401, 'Não autorizado');
    }

    const body = await request.json();
    const { text, isHtml } = body;

    if (!text) {
        throw error(400, 'Texto não fornecido');
    }

    try {
        const translated = isHtml 
            ? await translateHtmlToEnglish(text)
            : await translateToEnglish(text);
        
        return json({ translated });
    } catch (e: any) {
        console.error('API Translation error:', e);
        return json({ error: 'Erro ao traduzir. Verifique a chave da API do DeepL.' }, { status: 500 });
    }
};
