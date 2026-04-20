import { env as publicEnv } from '$env/dynamic/public';

function fallbackOrigin(url: Pick<URL, 'origin' | 'protocol'>): string | undefined {
	if (typeof url?.origin === 'string' && url.origin) return url.origin;
	const protocol = (url as { protocol?: string }).protocol;
	const host = (url as { host?: string }).host;
	if (protocol && host) return `${protocol}//${host}`;
	return undefined;
}

/**
 * Browser-facing origin for OAuth redirect URLs and secure cookies.
 * Behind Appwrite/Varnish, `url` may reflect an internal scheme/host; forwarded headers (or PUBLIC_ORIGIN) fix that.
 */
export function getPublicOrigin(url: Pick<URL, 'origin' | 'protocol' | 'host'>, request: Pick<Request, 'headers'>): string {
	const explicit = publicEnv.PUBLIC_ORIGIN?.trim().replace(/\/$/, '');
	if (explicit) {
		try {
			return new URL(explicit).origin;
		} catch {
			// ignore invalid PUBLIC_ORIGIN
		}
	}

	const headers = request?.headers;
	const xfProto = headers?.get('x-forwarded-proto')?.split(',')[0]?.trim();
	const xfHost = headers?.get('x-forwarded-host')?.split(',')[0]?.trim();
	if (xfProto && xfHost) {
		return `${xfProto}://${xfHost}`;
	}

	return fallbackOrigin(url) ?? 'http://localhost';
}

/** Whether the client connection is HTTPS (works behind reverse proxies). */
export function isPublicHttps(url: Pick<URL, 'origin' | 'protocol' | 'host'>, request: Pick<Request, 'headers'>): boolean {
	const origin = getPublicOrigin(url, request);
	try {
		return new URL(origin).protocol === 'https:';
	} catch {
		const p = (url as { protocol?: string }).protocol;
		return p === 'https:';
	}
}
