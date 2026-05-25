import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Create a mock Client class that supports chaining
interface MockClient {
  setEndpoint: ReturnType<typeof vi.fn>;
  setProject: ReturnType<typeof vi.fn>;
  setKey: ReturnType<typeof vi.fn>;
  setSession: ReturnType<typeof vi.fn>;
}

function createMockClient(): MockClient {
  const client: MockClient = {} as MockClient;
  client.setEndpoint = vi.fn(() => client);
  client.setProject = vi.fn(() => client);
  client.setKey = vi.fn(() => client);
  client.setSession = vi.fn(() => client);
  return client;
}

vi.mock("node-appwrite", () => ({
  Client: vi.fn(() => createMockClient()),
  Account: vi.fn(() => ({
    get: vi.fn().mockResolvedValue({ $id: "user_1" }),
    createEmailPasswordSession: vi.fn().mockResolvedValue({
      secret: "sess_secret",
      expire: "2025-12-31",
    }),
  })),
  Databases: vi.fn(() => ({
    listDocuments: vi.fn().mockResolvedValue({ documents: [], total: 0 }),
    getDocument: vi.fn().mockResolvedValue({}),
  })),
  Storage: vi.fn(() => ({
    getFilePreview: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
  })),
}));

vi.mock("cookie", () => ({
  parse: vi.fn().mockReturnValue({}),
}));

// Stub env at top level so Vite captures these values at module transform time
vi.stubEnv("APPWRITE_ENDPOINT", "https://endpoint.example.com");
vi.stubEnv("PUBLIC_APPWRITE_ENDPOINT", "https://public.example.com");
vi.stubEnv("APPWRITE_PROJECT_ID", "proj_123");
vi.stubEnv("APPWRITE_API_KEY", "key_secret");
vi.stubEnv("STORAGE_BUCKET_ID", "bucket_456");

// Import once — module is transformed with the stubbed env above
const mod = await import("../appwrite");

describe("getEnv", () => {
  it("returns env value when set", () => {
    expect(mod.getEnv("APPWRITE_ENDPOINT")).toBe(
      "https://endpoint.example.com"
    );
  });

  it("reads PUBLIC_ prefixed key when requested directly", () => {
    expect(mod.getEnv("PUBLIC_APPWRITE_ENDPOINT")).toBe(
      "https://public.example.com"
    );
  });

  it("prefers direct key over PUBLIC_ prefix when both are set", () => {
    const direct = mod.getEnv("APPWRITE_ENDPOINT");
    const prefixed = mod.getEnv("PUBLIC_APPWRITE_ENDPOINT");
    expect(direct).toBe("https://endpoint.example.com");
    expect(prefixed).toBe("https://public.example.com");
    expect(direct).not.toBe(prefixed);
  });

  it("returns empty string for unknown key", () => {
    expect(mod.getEnv("THIS_VAR_DOES_NOT_EXIST")).toBe("");
  });
});

describe("getImageUrl", () => {
  it("returns empty string for empty fileId", () => {
    expect(mod.getImageUrl("")).toBe("");
  });

  it("returns the URL as-is when it starts with http", () => {
    const url = "https://cdn.example.com/image.jpg";
    expect(mod.getImageUrl(url)).toBe(url);
  });

  it("constructs preview URL for fileId", () => {
    const result = mod.getImageUrl("file_789");
    expect(result).toBe(
      "https://endpoint.example.com/storage/buckets/bucket_456/files/file_789/preview?width=800&height=600&project=proj_123"
    );
  });

  it("uses custom width and height when provided", () => {
    const result = mod.getImageUrl("file_789", 400, 300);
    expect(result).toContain("width=400&height=300");
  });
});

describe("SESSION_COOKIE", () => {
  it("is derived from APPWRITE_PROJECT_ID", () => {
    expect(mod.SESSION_COOKIE).toBe("a_session_proj_123");
  });
});

describe("createAdminClient", () => {
  it("returns account, databases, and storage", () => {
    const client = mod.createAdminClient();
    expect(client).toHaveProperty("account");
    expect(client).toHaveProperty("databases");
    expect(client).toHaveProperty("storage");
  });
});

describe("createSessionClient", () => {
  it("creates client without session when no cookie", async () => {
    const cookie = await import("cookie");
    (cookie.parse as ReturnType<typeof vi.fn>).mockReturnValueOnce({});
    const request = new Request("http://localhost");
    const client = mod.createSessionClient(request);
    expect(client.hasSession).toBe(false);
    expect(client).toHaveProperty("account");
    expect(client).toHaveProperty("databases");
    expect(client).toHaveProperty("storage");
  });

  it("creates client with session when cookie is present", async () => {
    const cookie = await import("cookie");
    (cookie.parse as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      [mod.SESSION_COOKIE]: "valid_session_token",
    });
    const request = new Request("http://localhost");
    const client = mod.createSessionClient(request);
    expect(client.hasSession).toBe(true);
    expect(client).toHaveProperty("account");
    expect(client).toHaveProperty("databases");
    expect(client).toHaveProperty("storage");
  });
});

describe("setSessionCookie", () => {
  it("sets cookie with correct attributes", () => {
    const headers = new Headers();
    vi.spyOn(Date, "now").mockReturnValue(1000000);
    mod.setSessionCookie(headers, "secret123", "2025-12-31", false);
    const cookie = headers.get("Set-Cookie") ?? "";
    expect(cookie).toContain(`${mod.SESSION_COOKIE}=secret123`);
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).not.toContain("Secure");
  });

  it("includes Secure flag when isHttps is true", () => {
    const headers = new Headers();
    vi.spyOn(Date, "now").mockReturnValue(1000000);
    mod.setSessionCookie(headers, "secret123", "2025-12-31", true);
    const cookie = headers.get("Set-Cookie") ?? "";
    expect(cookie).toContain("Secure");
  });
});

describe("clearSessionCookie", () => {
  it("sets Max-Age=0 to clear the cookie", () => {
    const headers = new Headers();
    mod.clearSessionCookie(headers, false);
    const cookie = headers.get("Set-Cookie") ?? "";
    expect(cookie).toContain(`${mod.SESSION_COOKIE}=`);
    expect(cookie).toContain("Max-Age=0");
    expect(cookie).toContain("Path=/");
    expect(cookie).toContain("HttpOnly");
  });
});
