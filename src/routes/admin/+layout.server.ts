import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
    const allCookies = cookies.getAll();
    const hasSession = allCookies.some(c => c.name.startsWith('a_session_'));
    const isLoginPage = url.pathname === '/admin/login';

    if (!hasSession && !isLoginPage) {
        throw redirect(302, '/admin/login');
    }

    if (hasSession && isLoginPage) {
        throw redirect(302, '/admin/dashboard');
    }

    return {
        hasSession
    };
};
