import { describe, it, expect, vi } from 'vitest';
import { redirect } from '@sveltejs/kit';
import { load } from '../../src/routes/admin/+layout.server';

vi.mock('@sveltejs/kit', () => ({
    redirect: vi.fn((status, location) => {
        const err = new Error('redirect');
        (err as any).status = status;
        (err as any).location = location;
        throw err;
    })
}));

describe('Admin Layout Auth Guard', () => {
    it('should redirect to dashboard if authenticated and on login page', async () => {
        const event = {
            cookies: {
                getAll: () => [{ name: 'a_session_123', value: 'xyz' }]
            },
            url: { pathname: '/admin/login' }
        } as any;

        try {
            await load(event);
        } catch (err: any) {
            expect(redirect).toHaveBeenCalledWith(302, '/admin/dashboard');
            expect(err.location).toBe('/admin/dashboard');
        }
    });

    it('should redirect to login if not authenticated and not on login page', async () => {
        const event = {
            cookies: {
                getAll: () => []
            },
            url: { pathname: '/admin/artigos' }
        } as any;

        try {
            await load(event);
        } catch (err: any) {
            expect(redirect).toHaveBeenCalledWith(302, '/admin/login');
            expect(err.location).toBe('/admin/login');
        }
    });

    it('should allow access if authenticated and not on login page', async () => {
        const event = {
            cookies: {
                getAll: () => [{ name: 'a_session_123', value: 'xyz' }]
            },
            url: { pathname: '/admin/artigos' }
        } as any;

        const result = await load(event);
        expect(result).toEqual({ hasSession: true });
    });

    it('should allow access to login page if not authenticated', async () => {
        const event = {
            cookies: {
                getAll: () => []
            },
            url: { pathname: '/admin/login' }
        } as any;

        const result = await load(event);
        expect(result).toEqual({ hasSession: false });
    });
});
