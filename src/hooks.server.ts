import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { deLocalizeHref, getTextDirection, localizeHref } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { createLogger } from '$lib/server/logger';

const logger = createLogger('HOOKS');

const handleParaglide: Handle = ({ event, resolve }) => paraglideMiddleware(event.request, ({ request, locale }) => {
	event.request = request;
	(event.locals as any).paraglide = { lang: locale };

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale).replace('%paraglide.dir%', getTextDirection(locale))
	});
});

import { createSessionClient, SESSION_COOKIE } from '$lib/server/appwrite';

export const handleAdminAuth: Handle = async ({ event, resolve }) => {
	const path = deLocalizeHref(event.url.pathname).replace(/\/$/, '') || '/';
	const isAdminPath = path.startsWith('/admin');

	// Attempt to populate user for all requests if session cookie exists
	const { account } = createSessionClient(event);
	try {
		// Only check account if we have a reason to believe a session might exist
		// Checking all cookies for the prefix is faster than an API call
		const hasSessionCookie = (event.cookies as any).getAll 
			? event.cookies.getAll().some(c => c.name.startsWith('a_session'))
			: !!event.cookies.get(SESSION_COOKIE);
		
		if (hasSessionCookie) {
			event.locals.user = await account.get() as any;
			logger.info('Session verified', { email: event.locals.user?.email, path });
		} else {
			event.locals.user = null;
		}
	} catch (e: any) {
		logger.warn('Session verification failed', { message: e.message, path });
		// Session invalid or expired - only delete if it was our specific cookie
		if (event.cookies.get(SESSION_COOKIE)) {
			event.cookies.delete(SESSION_COOKIE, { path: '/' });
		}
		event.locals.user = null;
	}

	if (isAdminPath) {
		const isLoginPage = path === '/admin/login';

		if (!event.locals.user && !isLoginPage) {
			logger.info('Redirecting unauthenticated user to login', { path });
			throw redirect(302, localizeHref('/admin/login'));
		}

		if (event.locals.user && isLoginPage) {
			logger.info('Redirecting authenticated user to dashboard', { email: event.locals.user.email });
			throw redirect(302, localizeHref('/admin/dashboard'));
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAdminAuth);
