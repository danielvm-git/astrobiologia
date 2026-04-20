import { createAdminClient, SESSION_COOKIE } from '$lib/server/appwrite';
import { redirect, fail } from '@sveltejs/kit';
import { localizeHref } from '$lib/paraglide/runtime';
import { AppwriteException, OAuthProvider } from 'node-appwrite';
import { createLogger } from '$lib/server/logger';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { getPublicOrigin, isPublicHttps } from '$lib/server/public-origin';

const log = createLogger('ADMIN-LOGIN');

function appwriteEndpointHost(): string {
	const raw = publicEnv.PUBLIC_APPWRITE_ENDPOINT?.trim();
	if (!raw) return 'unset';
	try {
		return new URL(raw).host;
	} catch {
		return 'invalid-url';
	}
}

/** Booleans and host only — never logs secrets. */
function oauthEnvSnapshot() {
	return {
		hasApiKey: Boolean(privateEnv.APPWRITE_API_KEY?.trim()),
		hasProjectId: Boolean(publicEnv.PUBLIC_APPWRITE_PROJECT_ID?.trim()),
		endpointHost: appwriteEndpointHost(),
		projectIdLen: (publicEnv.PUBLIC_APPWRITE_PROJECT_ID || '').length
	};
}

function serializeOAuthFailure(err: unknown): Record<string, unknown> {
	if (err instanceof AppwriteException) {
		const response =
			typeof err.response === 'string' ? err.response.slice(0, 1200) : String(err.response ?? '');
		return {
			kind: 'AppwriteException',
			code: err.code,
			type: err.type,
			message: err.message,
			response
		};
	}
	if (err instanceof Error) {
		const rec: Record<string, unknown> = {
			kind: err.name,
			message: err.message
		};
		if (err.stack) rec.stackPreview = err.stack.split('\n').slice(0, 14).join('\n');
		return rec;
	}
	return { kind: 'unknown', raw: String(err) };
}

export const actions = {
	google: async ({ url, request }) => {
		if (!privateEnv.APPWRITE_API_KEY?.trim()) {
			log.error('Google OAuth blocked: APPWRITE_API_KEY is empty at runtime', {
				env: oauthEnvSnapshot()
			});
			return fail(503, {
				message: 'Failed to initialize Google login.',
				error: 'server_misconfigured'
			});
		}

		const origin = getPublicOrigin(url, request);
		const successUrl = `${origin}/oauth`;
		const failureUrl = `${origin}/admin/login?error=google_failed`;
		const requestHostContext = {
			urlOrigin: url.origin,
			publicOrigin: origin,
			urlHost: url.host,
			forwardedHost: request.headers.get('x-forwarded-host'),
			forwardedProto: request.headers.get('x-forwarded-proto'),
			requestHost: request.headers.get('host')
		};

		const { account } = createAdminClient();

		try {
			// Visible in Appwrite Sites / any host logs (ingest URL only works locally)
			log.info('[DEBUG-ad9f63] Google OAuth pre-token', {
				successUrl,
				failureUrl,
				...requestHostContext
			});

			// #region agent log
			fetch('http://127.0.0.1:7935/ingest/d09c7f4b-ef13-49c5-ad00-b084fd7a41e4', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'ad9f63' },
				body: JSON.stringify({
					sessionId: 'ad9f63',
					hypothesisId: 'H1',
					location: 'admin/login/+page.server.ts:google',
					message: 'before createOAuth2Token',
					data: {
						successUrl,
						failureUrl,
						successPath: (() => {
							try {
								return new URL(successUrl).pathname;
							} catch {
								return null;
							}
						})(),
						projectIdLen: (publicEnv.PUBLIC_APPWRITE_PROJECT_ID || '').length,
						endpointHost: appwriteEndpointHost()
					},
					timestamp: Date.now()
				})
			}).catch(() => {});
			// #endregion

			const redirectUrl = await account.createOAuth2Token({
				provider: OAuthProvider.Google,
				success: successUrl,
				failure: failureUrl
			});

			throw redirect(302, redirectUrl);
		} catch (err: unknown) {
			const status = typeof err === 'object' && err !== null && 'status' in err ? (err as { status?: number }).status : undefined;
			if (status === 302) throw err;

			// #region agent log
			fetch('http://127.0.0.1:7935/ingest/d09c7f4b-ef13-49c5-ad00-b084fd7a41e4', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'ad9f63' },
				body: JSON.stringify({
					sessionId: 'ad9f63',
					hypothesisId: 'H1-H5',
					location: 'admin/login/+page.server.ts:google:catch',
					message: 'createOAuth2Token rejected',
					data: {
						...serializeOAuthFailure(err),
						successUrl,
						failureUrl
					},
					timestamp: Date.now()
				})
			}).catch(() => {});
			// #endregion

			log.error('Google OAuth createOAuth2Token failed', {
				oauth: serializeOAuthFailure(err),
				env: oauthEnvSnapshot(),
				redirects: { success: successUrl, failure: failureUrl },
				request: requestHostContext
			});

			const message =
				err instanceof AppwriteException
					? err.message
					: err instanceof Error
						? err.message
						: String(err);
			const code = err instanceof AppwriteException ? err.code : (err as { code?: number })?.code;

			return fail(500, {
				message: 'Failed to initialize Google login.',
				error: message,
				code
			});
		}
	},
    
	login: async ({ request, cookies, url }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        
        if (!email || !password) {
            return fail(400, { message: 'Email and password are required.' });
        }
        
        try {
            const { account } = createAdminClient();
            const session = await account.createEmailPasswordSession({ email, password });
            
            cookies.set(SESSION_COOKIE, session.secret, {
                path: '/',
                expires: new Date(session.expire),
                sameSite: 'lax',
                secure: isPublicHttps(url, request),
                httpOnly: true
            });
            
            throw redirect(302, localizeHref('/admin/dashboard'));
        } catch (err: any) {
            if (err.status === 302) throw err;
            log.error('Email login createEmailPasswordSession failed', err instanceof Error ? err : { err });
            return fail(401, { message: 'Login falhou. Verifique suas credenciais.' });
        }
    }
};
