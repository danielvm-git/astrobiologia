import { Client, Account, Databases, Storage } from "node-appwrite";
import { parse } from "cookie";

export const SESSION_COOKIE = `a_session_${import.meta.env.APPWRITE_PROJECT_ID}`;

export const CATEGORIES = [
  {
    $id: "noticias",
    name: "Notícias",
    slug: "noticias",
    description: "Últimas notícias sobre astrobiologia",
    color: "primary",
  },
  {
    $id: "entrevistas",
    name: "Entrevistas",
    slug: "entrevistas",
    description: "Conversas com cientistas e pesquisadores",
    color: "secondary",
  },
  {
    $id: "analises",
    name: "Análises",
    slug: "analises",
    description: "Análises profundas sobre temas científicos",
    color: "accent",
  },
  {
    $id: "pesquisas-brasileiras",
    name: "Pesquisas Brasileiras",
    slug: "pesquisas-brasileiras",
    description: "Destaque para a ciência feita no Brasil",
    color: "primary",
  },
  {
    $id: "exoplanetas",
    name: "Exoplanetas",
    slug: "exoplanetas",
    description: "Mundos além do Sistema Solar",
    color: "secondary",
  },
  {
    $id: "extremofilos",
    name: "Extremófilos",
    slug: "extremofilos",
    description: "Vida em condições extremas",
    color: "accent",
  },
] as const;

function baseClient(): Client {
  return new Client()
    .setEndpoint(import.meta.env.APPWRITE_ENDPOINT)
    .setProject(import.meta.env.APPWRITE_PROJECT_ID);
}

export function createAdminClient() {
  const client = baseClient().setKey(import.meta.env.APPWRITE_API_KEY);
  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
  };
}

export function createSessionClient(request: Request) {
  const cookies = parse(request.headers.get("cookie") ?? "");
  const session = cookies[SESSION_COOKIE];
  const client = baseClient();
  if (session) client.setSession(session);
  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    hasSession: Boolean(session),
  };
}

export function getImageUrl(fileId: string, width = 800, height = 600): string {
  if (!fileId) return "";
  if (fileId.startsWith("http")) return fileId;
  const client = baseClient();
  const storage = new Storage(client);
  return storage
    .getFilePreview(import.meta.env.STORAGE_BUCKET_ID, fileId, width, height)
    .toString();
}

export function setSessionCookie(
  headers: Headers,
  secret: string,
  expire: string,
  isHttps: boolean
): void {
  const maxAge = Math.floor((new Date(expire).getTime() - Date.now()) / 1000);
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(secret)}`,
    `Max-Age=${maxAge}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (isHttps) parts.push("Secure");
  headers.append("Set-Cookie", parts.join("; "));
}

export function clearSessionCookie(headers: Headers, isHttps: boolean): void {
  const parts = [
    `${SESSION_COOKIE}=`,
    "Max-Age=0",
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];
  if (isHttps) parts.push("Secure");
  headers.append("Set-Cookie", parts.join("; "));
}
