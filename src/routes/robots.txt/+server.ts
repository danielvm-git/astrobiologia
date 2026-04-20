import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /admin/login

Sitemap: https://astrobiologia.com.br/sitemap.xml`;

	return new Response(robots, {
		headers: {
			'Content-Type': 'text/plain'
		}
	});
};
