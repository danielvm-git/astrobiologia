import { account, OAuthProvider } from '$lib/appwrite';

/**
 * Starts Google OAuth from the browser using the Appwrite web SDK.
 * Success redirects to `/oauth` (server exchanges userId+secret for httpOnly session).
 */
export function startGoogleOAuth(): { error?: string } {
	try {
		const origin = window.location.origin;
		account.createOAuth2Token(
			OAuthProvider.Google,
			`${origin}/oauth`,
			`${origin}/admin/login?error=google_failed`
		);
		return {};
	} catch (e: unknown) {
		const message =
			e instanceof Error ? e.message : 'Failed to initialize Google login.';
		return { error: message };
	}
}
