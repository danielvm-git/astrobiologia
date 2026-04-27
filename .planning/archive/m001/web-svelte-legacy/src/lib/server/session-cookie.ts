import type { Cookies } from "@sveltejs/kit";
import { SESSION_COOKIE } from "./appwrite";
import { isPublicHttps } from "./public-origin";

export type AppwriteSessionSecretFields = {
  expire: string;
  secret: string;
};

export function setAppwriteSessionCookie(
  cookies: Cookies,
  url: URL,
  request: Request,
  session: AppwriteSessionSecretFields
): void {
  cookies.set(SESSION_COOKIE, session.secret, {
    expires: new Date(session.expire),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: isPublicHttps(url, request),
  });
}
