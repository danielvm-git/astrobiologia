import { vi } from "vitest";

export const mockCreateDocument = vi.fn();
export const mockUpdateDocument = vi.fn();
export const mockDeleteDocument = vi.fn();
export const mockGetDocument = vi.fn();
export const mockListDocuments = vi.fn();

export function resetAppwriteMocks() {
  mockCreateDocument.mockReset();
  mockUpdateDocument.mockReset();
  mockDeleteDocument.mockReset();
  mockGetDocument.mockReset();
  mockListDocuments.mockReset();
}

export const mockGetEnv = vi.fn((key: string) => {
  const env: Record<string, string> = {
    DATABASE_ID: "db_test",
    ARTICLES_COLLECTION_ID: "articles_test",
    ARTICLE_TRANSLATIONS_COLLECTION_ID: "translations_test",
    DEEPL_API_KEY: "",
  };
  return env[key] ?? "";
});

vi.mock("@/lib/appwrite", () => ({
  createAdminClient: vi.fn(() => ({
    account: {
      createEmailPasswordSession: vi.fn(),
    },
    databases: {
      createDocument: mockCreateDocument,
      updateDocument: mockUpdateDocument,
      deleteDocument: mockDeleteDocument,
      getDocument: mockGetDocument,
      listDocuments: mockListDocuments,
    },
    storage: {},
  })),
  createSessionClient: vi.fn(() => ({
    hasSession: true,
    account: {},
    databases: {
      createDocument: mockCreateDocument,
      updateDocument: mockUpdateDocument,
      deleteDocument: mockDeleteDocument,
      getDocument: mockGetDocument,
      listDocuments: mockListDocuments,
    },
    storage: {},
  })),
  getEnv: (...args: [string]) => mockGetEnv(...args),
  setSessionCookie: vi.fn((headers: Headers, secret: string) => {
    headers.append("Set-Cookie", `a_session_proj=s${secret}; Path=/`);
  }),
  SESSION_COOKIE: "a_session_proj",
}));
