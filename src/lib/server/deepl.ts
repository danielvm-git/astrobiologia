import { env } from '$env/dynamic/private';

const authKey = env.DEEPL_API_KEY;

/**
 * Translates text from Portuguese to English using DeepL REST API.
 * Uses fetch to avoid dependency on deepl-node.
 */
export async function translateToEnglish(text: string): Promise<string> {
    if (!authKey) {
        throw new Error('DEEPL_API_KEY is not configured in .env');
    }

    const isFree = authKey.endsWith(':fx');
    const url = isFree ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';

    const params = new URLSearchParams();
    params.append('text', text);
    params.append('source_lang', 'PT');
    params.append('target_lang', 'EN-US');

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

export async function translateHtmlToEnglish(html: string): Promise<string> {
    if (!authKey) {
        throw new Error('DEEPL_API_KEY is not configured in .env');
    }

    const isFree = authKey.endsWith(':fx');
    const url = isFree ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';

    const params = new URLSearchParams();
    params.append('text', html);
    params.append('source_lang', 'PT');
    params.append('target_lang', 'EN-US');
    params.append('tag_handling', 'html');

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
            console.error('DeepL HTML API Error:', response.status, errBody);
            throw new Error(`DeepL API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.translations[0].text;
    } catch (error) {
        console.error('DeepL HTML translation error:', error);
        throw error;
    }
}
