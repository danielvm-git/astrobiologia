import { env } from '$env/dynamic/private';

const authKey = env.DEEPL_API_KEY;

// Map our locale tags to DeepL target language codes
const TARGET_LANG_MAP: Record<string, string> = {
    'pt-br': 'PT-BR',
    'en': 'EN-US',
    'nl': 'NL',
    'es': 'ES',
    'ja': 'JA',
    'zh': 'ZH'
};

/**
 * Translates text from Portuguese to a target language using DeepL REST API.
 */
export async function translateText(text: string, targetLang: string, isHtml = false): Promise<string> {
    if (!authKey) {
        throw new Error('DEEPL_API_KEY is not configured in .env');
    }

    const targetCode = TARGET_LANG_MAP[targetLang.toLowerCase()] || targetLang.toUpperCase();
    const isFree = authKey.endsWith(':fx');
    const url = isFree ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';

    const params = new URLSearchParams();
    params.append('text', text);
    params.append('source_lang', 'PT');
    params.append('target_lang', targetCode);
    if (isHtml) {
        params.append('tag_handling', 'html');
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: params,
            headers: {
                'Authorization': `DeepL-Auth-Key ${authKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error('DeepL API Error:', response.status, errBody);
            throw new Error(`DeepL API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.translations[0].text;
    } catch (error) {
        console.error('DeepL translation error:', error);
        throw error;
    }
}

/** Legacy aliases for compatibility */
export async function translateToEnglish(text: string): Promise<string> {
    return translateText(text, 'en');
}

export async function translateHtmlToEnglish(html: string): Promise<string> {
    return translateText(html, 'en', true);
}
