import { localizeHref } from "$lib/paraglide/runtime";
import { createAdminClient } from "$lib/server/appwrite";
import { createLogger } from "$lib/server/logger";
import { setAppwriteSessionCookie } from "$lib/server/session-cookie";
import { redirect } from "@sveltejs/kit";

const log = createLogger("OAUTH");

export async function GET({ url, cookies, request }) {
  const userId = url.searchParams.get("userId");
  const secret = url.searchParams.get("secret");

  if (!userId || !secret) {
    throw redirect(302, localizeHref("/admin/login?error=missing_credentials"));
  }

  try {
    log.info("OAuth callback: exchanging OAuth params for session");
    const { account } = createAdminClient();
    const session = await account.createSession({ userId, secret });
    log.debug("OAuth session cookie set", { expire: session.expire });

    setAppwriteSessionCookie(cookies, url, request, session);
  } catch (err: any) {
    // Re-throw SvelteKit redirects so they aren't swallowed
    if (err?.status && err.status >= 300 && err.status < 400) throw err;
    log.error(
      "OAuth session creation failed",
      err instanceof Error ? err : { err }
    );
    throw redirect(
      302,
      localizeHref("/admin/login?error=session_creation_failed")
    );
  }

  // Redirect outside try/catch so it is never caught above
  throw redirect(302, localizeHref("/admin/dashboard"));
}
