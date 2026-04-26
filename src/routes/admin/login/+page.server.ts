import * as m from "$lib/paraglide/messages";
import { localizeHref } from "$lib/paraglide/runtime";
import { createAdminClient } from "$lib/server/appwrite";
import { createLogger } from "$lib/server/logger";
import { setAppwriteSessionCookie } from "$lib/server/session-cookie";
import { fail, redirect } from "@sveltejs/kit";

const log = createLogger("ADMIN-LOGIN");

/**
 * Email/password only. Google OAuth MUST be started from the browser via
 * `startGoogleOAuth()` (web SDK `createOAuth2Token`) — never from a server
 * action using node-appwrite (Invalid redirect / silent failure).
 */
export const actions = {
  login: async ({ request, cookies, url }) => {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return fail(400, { message: m.form_email_password_required() });
    }

    try {
      const { account } = createAdminClient();
      const session = await account.createEmailPasswordSession({
        email,
        password,
      });

      setAppwriteSessionCookie(cookies, url, request, session);

      throw redirect(302, localizeHref("/admin/dashboard"));
    } catch (err: any) {
      if (err.status === 302) throw err;
      log.error(
        "Email login createEmailPasswordSession failed",
        err instanceof Error ? err : { err }
      );
      return fail(401, {
        message: "Login falhou. Verifique suas credenciais.",
      });
    }
  },
};
