import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSession = {
	secret: 'oauth-exchanged-session-secret',
	expire: new Date(Date.now() + 3_600_000).toISOString()
};

const createSession = vi.fn().mockImplementation(() => Promise.resolve(mockSession));

vi.mock('$lib/server/appwrite', () => ({
	SESSION_COOKIE: 'a_session_test-project-id',
	createAdminClient: vi.fn(() => ({
		account: { createSession }
	}))
}));

vi.mock('$lib/paraglide/runtime', () => ({
	localizeHref: vi.fn((path: string) => path)
}));

vi.mock('$lib/server/public-origin', () => ({
	isPublicHttps: vi.fn(() => false)
}));

vi.mock('$lib/server/logger', () => ({
	createLogger: () => ({
		info: vi.fn(),
		debug: vi.fn(),
		error: vi.fn()
	})
}));

vi.mock('@sveltejs/kit', async (importOriginal) => {
	const original = await importOriginal<typeof import('@sveltejs/kit')>();
	return {
		...original,
		redirect: vi.fn((status: number, location: string) => {
			const err = new Error('redirect') as { status: number; location: string } & Error;
			err.status = status;
			err.location = location;
			throw err;
		})
	};
});

function makeOAuthGetEvent(userId: string, tokenSecret: string) {
	const u = new URL('http://localhost:5173/oauth');
	u.searchParams.set('userId', userId);
	u.searchParams.set('secret', tokenSecret);
	const cookiesSet = vi.fn();
	return {
		url: u,
		cookies: { set: cookiesSet, get: vi.fn() },
		request: new Request(u.toString()),
		cookiesSet
	};
}

describe('OAuth callback GET /oauth', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		createSession.mockImplementation(() => Promise.resolve(mockSession));
	});

	it('[P0] exchanges userId+secret, sets SESSION_COOKIE to session secret, then redirects to dashboard', async () => {
		const { GET } = await import('../../src/routes/oauth/+server');
		const { SESSION_COOKIE } = await import('$lib/server/appwrite');
		const event = makeOAuthGetEvent('uid_oauth_1', 'appwrite_oauth_intermediate_secret');

		await expect(async () => GET(event as any)).rejects.toMatchObject({
			status: 302,
			location: expect.stringContaining('/admin/dashboard')
		});

		expect(createSession).toHaveBeenCalledWith({
			userId: 'uid_oauth_1',
			secret: 'appwrite_oauth_intermediate_secret'
		});
		expect(event.cookiesSet).toHaveBeenCalledWith(
			SESSION_COOKIE,
			mockSession.secret,
			expect.objectContaining({ path: '/', httpOnly: true, sameSite: 'lax' })
		);
	});

	it('[P0] does not set session cookie when userId is missing (redirects to login)', async () => {
		const { GET } = await import('../../src/routes/oauth/+server');
		const u = new URL('http://localhost:5173/oauth');
		u.searchParams.set('secret', 'only_secret');
		const cookiesSet = vi.fn();
		const event = { url: u, cookies: { set: cookiesSet, get: vi.fn() }, request: new Request(u.toString()) };

		await expect(async () => GET(event as any)).rejects.toMatchObject({ status: 302 });

		expect(createSession).not.toHaveBeenCalled();
		expect(cookiesSet).not.toHaveBeenCalled();
	});
});
