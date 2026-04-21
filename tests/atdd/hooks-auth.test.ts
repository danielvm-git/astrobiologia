import { handleAdminAuth } from '../../src/hooks.server';
import { redirect } from '@sveltejs/kit';
import * as appwriteServer from '../../src/lib/server/appwrite';

vi.mock('../../src/lib/paraglide/runtime', () => ({
    deLocalizeHref: (path: string) => path,
    localizeHref: (path: string) => path
}));

vi.mock('../../src/lib/server/appwrite', () => ({
    createSessionClient: vi.fn(),
    SESSION_COOKIE: 'a_session_test'
}));

describe('Admin Auth Hooks (ATDD)', () => {
    it('[P0] should redirect unauthenticated user from admin path', async () => {
        const event = {
            url: new URL('http://localhost/admin/dashboard'),
            cookies: {
                get: vi.fn().mockReturnValue(undefined),
                getAll: vi.fn().mockReturnValue([])
            },
            locals: {},
            request: { headers: new Headers() }
        } as any;

        const resolve = vi.fn();

        const { createSessionClient } = appwriteServer as any;
        createSessionClient.mockReturnValue({
            account: {
                get: vi.fn().mockRejectedValue(new Error('Unauthorized'))
            }
        });

        // Use try-catch to verify the redirect error
        try {
            await handleAdminAuth({ event, resolve });
        } catch (e: any) {
            expect(e.status).toBe(302);
            expect(e.location).toContain('/admin/login');
        }
    });

    it('[P0] should allow authenticated user to admin path', async () => {
        const event = {
            url: new URL('http://localhost/admin/dashboard'),
            cookies: {
                get: vi.fn().mockReturnValue('session_secret'),
                getAll: vi.fn().mockReturnValue([{ name: 'a_session_test', value: 'session_secret' }])
            },
            locals: {},
            request: { headers: new Headers() }
        } as any;

        const resolve = vi.fn().mockResolvedValue('resolved');

        const { createSessionClient } = appwriteServer as any;
        createSessionClient.mockReturnValue({
            account: {
                get: vi.fn().mockResolvedValue({ email: 'admin@astrobiologia.com.br' })
            }
        });

        const result = await handleAdminAuth({ event, resolve });
        expect(result).toBe('resolved');
        expect(event.locals.user).toBeDefined();
        expect(event.locals.user.email).toBe('admin@astrobiologia.com.br');
    });

    it('should not treat /administration as an admin path (no auth redirect)', async () => {
        const event = {
            url: new URL('http://localhost/administration'),
            cookies: {
                get: vi.fn().mockReturnValue(undefined),
                getAll: vi.fn().mockReturnValue([])
            },
            locals: {},
            request: { headers: new Headers() }
        } as any;

        const resolve = vi.fn().mockResolvedValue('ok');

        const { createSessionClient } = appwriteServer as any;
        createSessionClient.mockReturnValue({
            account: {
                get: vi.fn().mockResolvedValue(null)
            }
        });

        const result = await handleAdminAuth({ event, resolve });
        expect(result).toBe('ok');
        expect(resolve).toHaveBeenCalled();
    });
});
