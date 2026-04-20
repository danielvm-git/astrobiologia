import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { deLocalizeHref, getTextDirection, localizeHref } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) => paraglideMiddleware(event.request, ({ request, locale }) => {
	event.request = request;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale).replace('%paraglide.dir%', getTextDirection(locale))
	});
});

import { createSessionClient, SESSION_COOKIE } from '$lib/server/appwrite';

const handleAdminAuth: Handle = async ({ event, resolve }) => {
	const path = deLocalizeHref(event.url.pathname);
	const isAdminPath = path.startsWith('/admin');

	// Attempt to populate user for all requests if session cookie exists
	const session = event.cookies.get(SESSION_COOKIE);
	if (session) {
		try {
			const { account } = createSessionClient(event);
			event.locals.user = await account.get() as any;
			console.log('Hook: Session verified for', event.locals.user?.email);
		} catch (e: any) {
			console.warn('Hook: Session verification failed:', e.message);
			// Session invalid or expired
			event.cookies.delete(SESSION_COOKIE, { path: '/' });
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	if (isAdminPath) {
		const isLoginPage = path === '/admin/login';

		if (!event.locals.user && !isLoginPage) {
			throw redirect(302, localizeHref('/admin/login'));
		}

		if (event.locals.user && isLoginPage) {
			throw redirect(302, localizeHref('/admin/dashboard'));
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAdminAuth);
