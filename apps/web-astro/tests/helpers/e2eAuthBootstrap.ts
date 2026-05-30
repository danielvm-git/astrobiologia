import { Client, Query, Users } from "node-appwrite";
import { getE2eAdminEmail } from "./e2eEnv";

// Inline patch — test helpers run outside Vite.
const originalPrepare = (Client.prototype as { prepareRequest?: unknown })
  .prepareRequest;
(Client.prototype as { prepareRequest: unknown }).prepareRequest = function (
  this: Client,
  method: string,
  url: URL,
  headers: Record<string, string> = {},
  params: Record<string, unknown> = {}
) {
  const result = (
    originalPrepare as (
      method: string,
      url: URL,
      headers: Record<string, string>,
      params: Record<string, unknown>
    ) => { options?: { agent?: unknown; dispatcher?: unknown } }
  ).call(this, method, url, headers, params);
  if (result?.options) {
    delete result.options.agent;
    delete result.options.dispatcher;
  }
  return result;
};

export type AdminSessionCookie = {
  name: string;
  value: string;
  expires: number;
};

/** Create an admin session via Appwrite Users API (no password required). */
export async function createAdminSessionViaApi(): Promise<AdminSessionCookie | null> {
  const endpoint = process.env.APPWRITE_ENDPOINT;
  const project = process.env.APPWRITE_PROJECT_ID;
  const key = process.env.APPWRITE_API_KEY;
  if (!endpoint || !project || !key) return null;

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(project)
    .setKey(key);
  const users = new Users(client);

  const email = getE2eAdminEmail();
  let userId: string | undefined;

  if (email) {
    const byEmail = await users.list([
      Query.equal("email", email),
      Query.limit(1),
    ]);
    userId = byEmail.users[0]?.$id;
  }

  if (!userId) {
    const anyUser = await users.list([Query.limit(1)]);
    userId = anyUser.users[0]?.$id;
  }

  if (!userId) return null;

  const session = await users.createSession(userId);
  return {
    name: `a_session_${project}`,
    value: session.secret,
    expires: new Date(session.expire).getTime() / 1000,
  };
}
