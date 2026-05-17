import type { APIRoute } from "astro";
import { Client, Sites, VCSReferenceType } from "node-appwrite";
import { getEnv } from "../../../lib/appwrite";

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ locals }) => {
  if (!locals.user) return json({ error: "Unauthorized" }, 401);

  const siteId = getEnv("APPWRITE_SITE_ID");
  if (!siteId)
    return json({ error: "APPWRITE_SITE_ID is not configured" }, 500);

  const client = new Client()
    .setEndpoint(getEnv("APPWRITE_ENDPOINT"))
    .setProject(getEnv("APPWRITE_PROJECT_ID"))
    .setKey(getEnv("APPWRITE_API_KEY"));

  try {
    const sites = new Sites(client);
    const deployment = await sites.createVcsDeployment(
      siteId,
      VCSReferenceType.Branch,
      "main",
      true
    );
    return json({ deploymentId: deployment.$id });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return json({ error: msg }, 500);
  }
};
