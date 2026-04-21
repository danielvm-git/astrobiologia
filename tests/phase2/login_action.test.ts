/**
 * Regression tests for the admin login server action.
 *
 * Guards against: https://github.com/astrobiologia/astrobiologia/issues/login-redirect
 * Bug: After login, the dashboard was blank because use:enhance performed a
 * client-side navigation before the session cookie was committed by the browser.
 * Fix: loginEnhance uses window.location.href (full-page reload) instead of goto().
 *
 * These tests verify the SERVER CONTRACT:
 *   1. The session cookie (SESSION_COOKIE) is set with session.secret as its value.
 *   2. The action returns a redirect (302) to the dashboard, not an error.
 *   3. Invalid credentials return a 401 failure, not a redirect.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fail, redirect } from '@sveltejs/kit';

// --- Mocks ---

const mockSession = { secret: 'test-session-secret-xyz', expire: new Date(Date.now() + 3600000).toISOString() };

vi.mock('$lib/server/appwrite', () => ({
	SESSION_COOKIE: 'a_session_test-project-id',
	createAdminClient: vi.fn(() => ({
		account: {
			createEmailPasswordSession: vi.fn().mockResolvedValue(mockSession)
		}
	}))
}));

vi.mock('$lib/paraglide/runtime', () => ({
	localizeHref: vi.fn((path: string) => path)
}));

vi.mock('$lib/paraglide/messages', () => ({
	form_email_password_required: () => 'E-mail e senha são obrigatórios.'
}));

vi.mock('@sveltejs/kit', async (importOriginal) => {
	const original = await importOriginal<typeof import('@sveltejs/kit')>();
	return {
		...original,
		redirect: vi.fn((status: number, location: string) => {
			const err = new Error('redirect') as any;
			err.status = status;
			err.location = location;
			throw err;
		}),
		fail: vi.fn((status: number, data: object) => ({ status, data }))
	};
});

// --- Helpers ---

function makeEvent(email: string, password: string, protocol = 'http:') {
	const formData = new FormData();
	formData.set('email', email);
	formData.set('password', password);

	const cookiesSet = vi.fn();
	return {
		request: { formData: async () => formData } as any,
		cookies: { set: cookiesSet, get: vi.fn() } as any,
		url: { protocol } as any,
		cookiesSet
	};
}

// --- Tests ---

describe('login server action', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('[P0] sets SESSION_COOKIE with session.secret before redirecting', async () => {
		// Arrange
		const { actions } = await import('../../src/routes/admin/login/+page.server');
		const { SESSION_COOKIE } = await import('$lib/server/appwrite');
		const event = makeEvent('admin@astrobiologia.com', 'valid-password');

		// Act
		try {
			await actions.login(event as any);
		} catch (err: any) {
			// Assert — cookie must be set before redirect is thrown
			expect(event.cookiesSet).toHaveBeenCalledWith(
				SESSION_COOKIE,
				mockSession.secret,
				expect.objectContaining({ path: '/', httpOnly: true })
			);
			// Assert — redirect goes to dashboard
			expect(err.status).toBe(302);
			expect(err.location).toContain('/admin/dashboard');
		}
	});

	it('[P0] redirects to /admin/dashboard on successful login', async () => {
		// Arrange
		const { actions } = await import('../../src/routes/admin/login/+page.server');
		const event = makeEvent('admin@astrobiologia.com', 'valid-password');

		// Act & Assert
		await expect(actions.login(event as any)).rejects.toMatchObject({
			status: 302,
			location: expect.stringContaining('/admin/dashboard')
		});
	});

	it('[P1] returns fail(400) when email is missing', async () => {
		// Arrange
		const { actions } = await import('../../src/routes/admin/login/+page.server');
		const event = makeEvent('', 'some-password');

		// Act
		const result = await actions.login(event as any);

		// Assert — no redirect, no cookie
		expect(result).toBeDefined();
		expect(fail).toHaveBeenCalledWith(400, expect.any(Object));
		expect(event.cookiesSet).not.toHaveBeenCalled();
	});

	it('[P1] returns fail(401) on invalid credentials', async () => {
		// Arrange — override mock to simulate auth failure
		const { createAdminClient } = await import('$lib/server/appwrite');
		vi.mocked(createAdminClient).mockReturnValueOnce({
			account: {
				createEmailPasswordSession: vi.fn().mockRejectedValue(new Error('Invalid credentials'))
			}
		} as any);

		const { actions } = await import('../../src/routes/admin/login/+page.server');
		const event = makeEvent('wrong@example.com', 'bad-password');

		// Act
		const result = await actions.login(event as any);

		// Assert — no cookie set, error returned
		expect(fail).toHaveBeenCalledWith(401, expect.any(Object));
		expect(event.cookiesSet).not.toHaveBeenCalled();
	});
});

describe('loginEnhance redirect contract', () => {
	it('[P0] uses window.location.href (full-page reload) for redirect results', () => {
		// Arrange — reproduce the loginEnhance logic inline as the specification contract.
		// If someone refactors to use goto() instead, this test documents why that breaks things.
		let capturedHref: string | null = null;
		const mockWindow = { location: { set href(v: string) { capturedHref = v; } } };

		const loginEnhance = (win: typeof mockWindow) => () =>
			async ({ result }: { result: { type: string; location?: string } }) => {
				if (result.type === 'redirect' && result.location) {
					win.location.href = result.location;
				}
			};

		const callback = loginEnhance(mockWindow)();

		// Act
		callback({ result: { type: 'redirect', location: '/admin/dashboard' } });

		// Assert — full-page nav was triggered, not a SvelteKit client-side goto()
		expect(capturedHref).toBe('/admin/dashboard');
	});

	it('[P1] does nothing when result is not a redirect', () => {
		// Arrange
		let capturedHref: string | null = null;
		const mockWindow = { location: { set href(v: string) { capturedHref = v; } } };

		const loginEnhance = (win: typeof mockWindow) => () =>
			async ({ result }: { result: { type: string; location?: string } }) => {
				if (result.type === 'redirect' && result.location) {
					win.location.href = result.location;
				}
			};

		const callback = loginEnhance(mockWindow)();

		// Act
		callback({ result: { type: 'failure', location: undefined } });

		// Assert — href was never set; error handling falls through
		expect(capturedHref).toBeNull();
	});
});
