import { createAdminClient, SESSION_COOKIE } from '$lib/server/appwrite';
import { redirect } from '@sveltejs/kit';
import { localizeHref } from '$lib/paraglide/runtime';
import { isPublicHttps } from '$lib/server/public-origin';
import { createLogger } from '$lib/server/logger';

const log = createLogger('OAUTH');

export async function GET({ url, cookies, request }) {
    const userId = url.searchParams.get('userId');
    const secret = url.searchParams.get('secret');

    if (!userId || !secret) {
        throw redirect(302, localizeHref('/admin/login?error=missing_credentials'));
    }

    try {
        log.info('OAuth callback: exchanging OAuth params for session');
        const { account } = createAdminClient();
        const session = await account.createSession({ userId, secret });
        log.debug('OAuth session cookie set', { expire: session.expire });

        cookies.set(SESSION_COOKIE, session.secret, {
            path: '/',
            expires: new Date(session.expire),
            sameSite: 'lax',
            secure: isPublicHttps(url, request),
            httpOnly: true
        });
    } catch (err: any) {
        // Re-throw SvelteKit redirects so they aren't swallowed
        if (err?.status && err.status >= 300 && err.status < 400) throw err;
        log.error('OAuth session creation failed', err instanceof Error ? err : { err });
        throw redirect(302, localizeHref('/admin/login?error=session_creation_failed'));
    }

    // Redirect outside try/catch so it is never caught above
    throw redirect(302, localizeHref('/admin/dashboard'));
}
