import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock SvelteKit environment variables
vi.mock('$env/static/public', () => ({
    PUBLIC_APPWRITE_ENDPOINT: 'https://localhost/v1',
    PUBLIC_APPWRITE_PROJECT_ID: 'test-project'
}));

// Mock appwrite module
const mocks = vi.hoisted(() => ({
    mockListDocuments: vi.fn(),
    mockCreateDocument: vi.fn(),
    mockUpdateDocument: vi.fn(),
    mockDeleteDocument: vi.fn(),
    mockGetDocument: vi.fn(),
    mockGetFilePreview: vi.fn(),
    mockCreateFile: vi.fn(),
    mockDeleteFile: vi.fn(),
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
        Storage: vi.fn().mockImplementation(function() {
            return {
                getFilePreview: mocks.mockGetFilePreview,
                createFile: mocks.mockCreateFile,
                deleteFile: mocks.mockDeleteFile,
            };
        }),
        ID: {
            unique: () => 'unique-id'
        },
        Query: {
            equal: (field: string, value: any) => `equal(${field}, ${value})`,
            notEqual: (field: string, value: any) => `notEqual(${field}, ${value})`,
            orderDesc: (field: string) => `orderDesc(${field})`,
            limit: (value: number) => `limit(${value})`,
            offset: (value: number) => `offset(${value})`,
        }
    };
});

import * as appwrite from '../../src/lib/appwrite';

describe('Appwrite Operations', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Article CRUD operations', () => {
        it('getPublishedArticles should fetch published articles with translations', async () => {
            // First call: translations
            mocks.mockListDocuments.mockResolvedValueOnce({ 
                total: 1,
                documents: [{ $id: 't1', article_id: '1', language: 'pt-br', title: 'Translated' }] 
            });
            // Second call: master articles
            mocks.mockListDocuments.mockResolvedValueOnce({ 
                total: 1,
                documents: [{ $id: '1', category: 'news', status: 'published' }] 
            });

            const articles = await appwrite.getPublishedArticles('pt-br');
            
            expect(mocks.mockListDocuments).toHaveBeenCalledTimes(2);
            expect(articles).toHaveLength(1);
            expect(articles[0].translation?.title).toBe('Translated');
        });

        it('getArticleBySlug should fetch master and translation', async () => {
            // First call: find translation by slug
            mocks.mockListDocuments.mockResolvedValueOnce({ 
                total: 1,
                documents: [{ $id: 't1', article_id: '1', slug: 'test', language: 'pt-br', title: 'Title' }] 
            });
            // Second call: get master document
            mocks.mockGetDocument.mockResolvedValueOnce({ $id: '1', category: 'news' });

            const article = await appwrite.getArticleBySlug('test', 'pt-br');
            
            expect(article?.translation?.title).toBe('Title');
            expect(article?.$id).toBe('1');
        });

        it('createArticle should create a document in master collection', async () => {
            const articleData = {
                category: 'news',
                status: 'draft' as const,
                authorId: 'user1',
                authorName: 'Admin',
                featured: false,
                tags: []
            } as any;

            mocks.mockCreateDocument.mockResolvedValue({ $id: 'new-id', ...articleData });
            
            const result = await appwrite.createArticle(articleData);
            
            expect(mocks.mockCreateDocument).toHaveBeenCalledWith(
                appwrite.DATABASE_ID,
                appwrite.COLLECTIONS.ARTICLES,
                'unique-id',
                articleData
            );
            expect(result.$id).toBe('new-id');
        });

        it('updateArticle should update master fields and ignore translation field', async () => {
            const updateData = { category: 'updated', translation: { title: 'Ignored' } } as any;
            mocks.mockUpdateDocument.mockResolvedValue({ $id: '1', category: 'updated' });

            await appwrite.updateArticle('1', updateData);

            expect(mocks.mockUpdateDocument).toHaveBeenCalledWith(
                appwrite.DATABASE_ID,
                appwrite.COLLECTIONS.ARTICLES,
                '1',
                { category: 'updated' }
            );
        });

        it('deleteArticle should delete master and all translations', async () => {
            mocks.mockListDocuments.mockResolvedValueOnce({
                documents: [{ $id: 't1' }, { $id: 't2' }]
            });

            await appwrite.deleteArticle('1');

            // 1 for search translations, 2 for deleting them, 1 for master
            expect(mocks.mockDeleteDocument).toHaveBeenCalledTimes(3);
            expect(mocks.mockDeleteDocument).toHaveBeenLastCalledWith(
                appwrite.DATABASE_ID,
                appwrite.COLLECTIONS.ARTICLES,
                '1'
            );
        });
    });

    describe('Image Operations', () => {
        it('getImageUrl should return preview URL for file IDs', () => {
            mocks.mockGetFilePreview.mockReturnValue({ toString: () => 'http://preview-url' });
            
            const url = appwrite.getImageUrl('file-123');
            
            expect(mocks.mockGetFilePreview).toHaveBeenCalledWith(
                appwrite.STORAGE_BUCKET_ID,
                'file-123',
                800,
                600
            );
            expect(url).toBe('http://preview-url');
        });

        it('getImageUrl should return original URL if it starts with http', () => {
            const originalUrl = 'https://example.com/image.jpg';
            const url = appwrite.getImageUrl(originalUrl);
            expect(url).toBe(originalUrl);
            expect(mocks.mockGetFilePreview).not.toHaveBeenCalled();
        });

        it('uploadImage should create a file and return its ID', async () => {
            const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
            mocks.mockCreateFile.mockResolvedValue({ $id: 'new-file-id' });

            const fileId = await appwrite.uploadImage(mockFile);

            expect(mocks.mockCreateFile).toHaveBeenCalledWith(
                appwrite.STORAGE_BUCKET_ID,
                'unique-id',
                mockFile
            );
            expect(fileId).toBe('new-file-id');
        });
    });
});
