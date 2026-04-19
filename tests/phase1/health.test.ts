import { describe, it, expect, vi } from 'vitest';
import { GET } from '../../src/routes/api/health/+server';

// Mock dependencies
vi.mock('$lib/appwrite', () => ({
    databases: {
        listDocuments: vi.fn().mockResolvedValue({ documents: [] })
    },
    DATABASE_ID: 'test-db'
}));

vi.mock('@sveltejs/kit', () => ({
    json: vi.fn((data, init) => ({
        body: data,
        status: init?.status || 200
    }))
}));

describe('Health Check API', () => {
    it('should return 200 and ok status when database is connected', async () => {
        const response = await GET({} as any);
        
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
        expect(response.body.database).toBe('connected');
    });

    it('should return 500 and error status when database fails', async () => {
        const { databases } = await import('$lib/appwrite');
        (databases.listDocuments as any).mockRejectedValueOnce(new Error('Connection failed'));

        const response = await GET({} as any);
        
        expect(response.status).toBe(500);
        expect(response.body.status).toBe('error');
        expect(response.body.database).toBe('disconnected');
    });
});
