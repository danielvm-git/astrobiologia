import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock SvelteKit environment variables
vi.mock('$env/static/public', () => ({
    PUBLIC_APPWRITE_ENDPOINT: 'https://localhost/v1',
    PUBLIC_APPWRITE_PROJECT_ID: 'test-project',
    PUBLIC_DATABASE_ID: '69e464fb0006a1b3c4eb',
    PUBLIC_ARTICLES_COLLECTION_ID: 'articles'
}));

// Mock appwrite module
const mocks = vi.hoisted(() => ({
    mockListDocuments: vi.fn(),
    mockCreateDocument: vi.fn(),
    mockUpdateDocument: vi.fn(),
    mockDeleteDocument: vi.fn(),
    mockGetDocument: vi.fn(),
}));

vi.mock('appwrite', () => {
    return {
        Client: vi.fn().mockImplementation(function() {
            return {
                setEndpoint: vi.fn().mockReturnThis(),
                setProject: vi.fn().mockReturnThis(),
            };
        }),
        Account: vi.fn().mockImplementation(function() {
            return {};
        }),
        Databases: vi.fn().mockImplementation(function() {
            return {
                listDocuments: mocks.mockListDocuments,
                createDocument: mocks.mockCreateDocument,
                updateDocument: mocks.mockUpdateDocument,
                deleteDocument: mocks.mockDeleteDocument,
                getDocument: mocks.mockGetDocument,
            };
        }),
        Storage: vi.fn().mockImplementation(function() { return {}; }),
        ID: { unique: () => 'unique-id' },
        Query: {
            equal: (field: string, value: any) => `equal(${field}, ${value})`,
            orderDesc: (field: string) => `orderDesc(${field})`,
            limit: (value: number) => `limit(${value})`,
            offset: (value: number) => `offset(${value})`,
        },
        OAuthProvider: { Google: 'google' }
    };
});

import * as appwrite from '../../src/lib/appwrite';

describe('Phase 5: i18n Relational Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should fetch article with correct language translation', async () => {
        // 1. Mock finding translation by slug
        mocks.mockListDocuments.mockResolvedValueOnce({
            total: 1,
            documents: [{ $id: 't-en', article_id: 'a1', language: 'en', slug: 'test-en', title: 'English Title' }]
        });
        // 2. Mock fetching master article
        mocks.mockGetDocument.mockResolvedValueOnce({
            $id: 'a1',
            category: 'news',
            status: 'published'
        });

        const article = await appwrite.getArticleBySlug('test-en', 'en');

        expect(article?.translation?.language).toBe('en');
        expect(article?.translation?.title).toBe('English Title');
        expect(article?.$id).toBe('a1');
    });

    it('should correctly join master with translations for listing', async () => {
        // 1. Mock master articles list
        mocks.mockListDocuments.mockResolvedValueOnce({
            total: 2,
            documents: [
                { $id: 'a1', status: 'published' },
                { $id: 'a2', status: 'published' }
            ]
        });
        // 2. Mock translations list
        mocks.mockListDocuments.mockResolvedValueOnce({
            total: 2,
            documents: [
                { $id: 't-pt-1', article_id: 'a1', language: 'pt-br', title: 'PT 1' },
                { $id: 't-pt-2', article_id: 'a2', language: 'pt-br', title: 'PT 2' }
            ]
        });

        const articles = await appwrite.getPublishedArticles('pt-br');

        expect(articles).toHaveLength(2);
        expect(articles[0].translation?.title).toBe('PT 1');
        expect(articles[1].translation?.title).toBe('PT 2');
    });

    it('should return null if no translation exists for the requested language', async () => {
        // Mock no translations found
        mocks.mockListDocuments.mockResolvedValueOnce({ total: 0, documents: [] });

        const article = await appwrite.getArticleBySlug('non-existent', 'en');
        expect(article).toBeNull();
    });
});
