import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getTextDirection } from '$lib/paraglide/runtime';
import { paraglideMiddleware } from '$lib/paraglide/server';

const handleParaglide: Handle = ({ event, resolve }) => paraglideMiddleware(event.request, ({ request, locale }) => {
	event.request = request;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%paraglide.lang%', locale).replace('%paraglide.dir%', getTextDirection(locale))
	});
});

const handleAdminAuth: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/admin')) {
		const allCookies = event.cookies.getAll();
		const hasSession = allCookies.some(c => c.name.startsWith('a_session_'));
		const isLoginPage = event.url.pathname === '/admin/login';

		if (!hasSession && !isLoginPage) {
			throw redirect(302, '/admin/login');
		}

		if (hasSession && isLoginPage) {
			throw redirect(302, '/admin/dashboard');
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(handleParaglide, handleAdminAuth);
