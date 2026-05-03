import { account, OAuthProvider } from "$lib/appwrite";
import { localizeHref } from "$lib/paraglide/runtime";

/**
 * Starts Google OAuth from the browser using the Appwrite web SDK.
 *
 * IMPORTANT: OAuth2 token creation MUST stay in the browser SDK — never call
 * node-appwrite `createOAuth2Token` from server actions or API routes (Appwrite
 * returns Invalid redirect / silent failure).
 *
 * Success redirects to `/oauth` (server exchanges userId+secret for httpOnly session).
 */
export function startGoogleOAuth(): { error?: string } {
  try {
    const origin = window.location.origin;
    const failureUrl = `${origin}${localizeHref("/admin/login")}?error=google_failed`;
    account.createOAuth2Token(
      OAuthProvider.Google,
      `${origin}/oauth`,
      failureUrl
    );
    return {};
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Failed to initialize Google login.";
    return { error: message };
  }
}
