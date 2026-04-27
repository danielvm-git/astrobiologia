import { SESSION_COOKIE } from "./appwrite";

export function setAppwriteSessionCookie(
  event: any,
  session: { expire: string; secret: string }
): void {
  const config = useRuntimeConfig();
  const projectId = config.public.appwriteProjectId;
  const cookieName = SESSION_COOKIE(projectId);

  // Check if running on HTTPS based on request headers (for secure attribute)
  const isHttps =
    event.node.req.headers["x-forwarded-proto"] === "https" ||
    (event.node.req.connection as any).encrypted;

  setCookie(event, cookieName, session.secret, {
    expires: new Date(session.expire),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: !!isHttps,
  });
}
