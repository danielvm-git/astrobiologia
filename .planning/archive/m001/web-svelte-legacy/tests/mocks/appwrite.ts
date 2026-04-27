import { vi } from "vitest";

/**
 * Centralized Appwrite Mocks for Vitest
 */

export const mockAccount = {
  get: vi.fn(),
  createEmailPasswordSession: vi.fn(),
  deleteSession: vi.fn(),
  create: vi.fn(),
};

export const mockDatabases = {
  listDocuments: vi.fn(),
  getDocument: vi.fn(),
  createDocument: vi.fn(),
  updateDocument: vi.fn(),
  deleteDocument: vi.fn(),
};

export const mockStorage = {
  getFilePreview: vi
    .fn()
    .mockReturnValue({ toString: () => "http://localhost/preview" }),
  createFile: vi.fn(),
  deleteFile: vi.fn(),
};

export const mockClient = {
  setEndpoint: vi.fn().mockReturnThis(),
  setProject: vi.fn().mockReturnThis(),
  setKey: vi.fn().mockReturnThis(),
  setSession: vi.fn().mockReturnThis(),
};

// This must be called at the top level of the test file or in setupFiles
export const appwriteMockImplementation = {
  Client: vi.fn().mockImplementation(function () {
    return mockClient;
  }),
  Account: vi.fn().mockImplementation(function () {
    return mockAccount;
  }),
  Databases: vi.fn().mockImplementation(function () {
    return mockDatabases;
  }),
  Storage: vi.fn().mockImplementation(function () {
    return mockStorage;
  }),
  ID: { unique: () => "unique_id" },
  Query: {
    equal: (attr: string, val: any) => `equal(${attr}, ${val})`,
    orderDesc: (attr: string) => `orderDesc(${attr})`,
    limit: (val: number) => `limit(${val})`,
    offset: (val: number) => `offset(${val})`,
  },
};
