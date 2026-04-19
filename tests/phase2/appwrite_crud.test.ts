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
        it('getPublishedArticles should fetch published articles', async () => {
            mocks.mockListDocuments.mockResolvedValue({ documents: [{ $id: '1', title: 'Test' }] });
            const articles = await appwrite.getPublishedArticles();
            expect(mocks.mockListDocuments).toHaveBeenCalledWith(
                appwrite.DATABASE_ID,
                appwrite.COLLECTIONS.ARTICLES,
                expect.arrayContaining([
                    'equal(status, published)',
                    'orderDesc(publishedAt)'
                ])
            );
            expect(articles).toHaveLength(1);
            expect(articles[0].title).toBe('Test');
        });

        it('createArticle should create a document with unique ID', async () => {
            const articleData = {
                title: 'New Article',
                slug: 'new-article',
                content: '<p>Content</p>',
                status: 'draft' as const,
                // ... other required fields
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

        it('updateArticle should update the correct document', async () => {
            const updateData = { title: 'Updated Title' };
            mocks.mockUpdateDocument.mockResolvedValue({ $id: '1', ...updateData });

            await appwrite.updateArticle('1', updateData);

            expect(mocks.mockUpdateDocument).toHaveBeenCalledWith(
                appwrite.DATABASE_ID,
                appwrite.COLLECTIONS.ARTICLES,
                '1',
                updateData
            );
        });

        it('deleteArticle should delete the correct document', async () => {
            await appwrite.deleteArticle('1');
            expect(mocks.mockDeleteDocument).toHaveBeenCalledWith(
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
