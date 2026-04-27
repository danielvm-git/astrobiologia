import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock SvelteKit environment variables
vi.mock('$env/static/public', () => ({
    PUBLIC_APPWRITE_ENDPOINT: 'https://localhost/v1',
    PUBLIC_APPWRITE_PROJECT_ID: 'test-project',
    PUBLIC_DATABASE_ID: '69e464fb0006a1b3c4eb',
    PUBLIC_ARTICLES_COLLECTION_ID: 'articles'
}));

import { mockDatabases, mockStorage } from '../mocks/appwrite';
import { createArticle, createArticleTranslation } from '../factories/article.factory';

import * as appwrite from '../../src/lib/appwrite';

// Mock global fetch
global.fetch = vi.fn();

describe('Appwrite Operations', () => {
    describe('Article CRUD operations', () => {
        it('getPublishedArticles should fetch published articles with translations', async () => {
            const article = createArticle({ $id: '1' });
            const translation = createArticleTranslation('1', 'pt-br', { title: 'Translated' });

            mockDatabases.listDocuments.mockResolvedValueOnce({ 
                total: 1,
                documents: [article] 
            });
            mockDatabases.listDocuments.mockResolvedValueOnce({ 
                total: 1,
                documents: [translation] 
            });

            const articles = await appwrite.getPublishedArticles('pt-br');
            
            expect(mockDatabases.listDocuments).toHaveBeenCalledTimes(2);
            expect(articles).toHaveLength(1);
            expect(articles[0].translation?.title).toBe('Translated');
        });

        it('getArticleBySlug should fetch master and translation', async () => {
            const article = createArticle({ $id: '1' });
            const translation = createArticleTranslation('1', 'pt-br', { slug: 'test', title: 'Title' });

            mockDatabases.listDocuments.mockResolvedValueOnce({ 
                total: 1,
                documents: [translation] 
            });
            mockDatabases.getDocument.mockResolvedValueOnce(article);

            const result = await appwrite.getArticleBySlug('test', 'pt-br');
            
            expect(result?.translation?.title).toBe('Title');
            expect(result?.$id).toBe('1');
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

            mockDatabases.createDocument.mockResolvedValue({ $id: 'new-id', ...articleData });
            
            const result = await appwrite.createArticle(articleData);
            
            expect(mockDatabases.createDocument).toHaveBeenCalledWith(
                appwrite.DATABASE_ID,
                appwrite.COLLECTIONS.ARTICLES,
                'unique_id', // From centralized mock ID.unique
                articleData
            );
            expect(result.$id).toBe('new-id');
        });

        it('updateArticle should update master fields and ignore translation field', async () => {
            const updateData = { category: 'updated', translation: { title: 'Ignored' } } as any;
            mockDatabases.updateDocument.mockResolvedValue({ $id: '1', category: 'updated' });

            await appwrite.updateArticle('1', updateData);

            expect(mockDatabases.updateDocument).toHaveBeenCalledWith(
                appwrite.DATABASE_ID,
                appwrite.COLLECTIONS.ARTICLES,
                '1',
                { category: 'updated' }
            );
        });

        it('deleteArticle should delete master and all translations', async () => {
            mockDatabases.listDocuments.mockResolvedValueOnce({
                documents: [{ $id: 't1' }, { $id: 't2' }]
            });

            await appwrite.deleteArticle('1');

            expect(mockDatabases.deleteDocument).toHaveBeenCalledTimes(3);
            expect(mockDatabases.deleteDocument).toHaveBeenLastCalledWith(
                appwrite.DATABASE_ID,
                appwrite.COLLECTIONS.ARTICLES,
                '1'
            );
        });
    });

    describe('Image Operations', () => {
        it('getImageUrl should return preview URL for file IDs', () => {
            mockStorage.getFilePreview.mockReturnValue({ toString: () => 'http://preview-url' });
            
            const url = appwrite.getImageUrl('file-123');
            
            expect(mockStorage.getFilePreview).toHaveBeenCalledWith(
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
            expect(mockStorage.getFilePreview).not.toHaveBeenCalled();
        });

        it('uploadImage should call api and return fileId', async () => {
            const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ fileId: 'new-file-id' })
            });

            const fileId = await appwrite.uploadImage(mockFile);

            expect(global.fetch).toHaveBeenCalledWith('/api/upload', expect.objectContaining({
                method: 'POST'
            }));
            expect(fileId).toBe('new-file-id');
        });
    });
});
