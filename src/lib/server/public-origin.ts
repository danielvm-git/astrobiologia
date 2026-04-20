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
 *
 * Ordering matters: Appwrite Sites / Varnish sometimes send **X-Forwarded-Proto: http** on an internal hop
 * while SvelteKit's `event.url` is already **https://** (correct public URL). Preferring forwarded headers
 * unconditionally caused **http** OAuth redirect URLs → Appwrite `Invalid redirect` (400).
 *
 * @see https://svelte.dev/docs/kit/adapter-node — `ORIGIN`, `PROTOCOL_HEADER`, `HOST_HEADER`
 */
export function getPublicOrigin(url: Pick<URL, 'origin' | 'protocol' | 'host'>, request: Pick<Request, 'headers'>): string {
	let branch = 'fallback-localhost';
	let resolved: string;

	const explicit = publicEnv.PUBLIC_ORIGIN?.trim().replace(/\/$/, '');
	if (explicit) {
		try {
			resolved = new URL(explicit).origin;
			branch = 'PUBLIC_ORIGIN';
			// #region agent log
			fetch('http://127.0.0.1:7935/ingest/d09c7f4b-ef13-49c5-ad00-b084fd7a41e4', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'ad9f63' },
				body: JSON.stringify({
					sessionId: 'ad9f63',
					hypothesisId: 'H2',
					location: 'public-origin.ts:getPublicOrigin',
					message: 'resolved public origin',
					data: {
						branch,
						resolved,
						fromUrlPreview: fallbackOrigin(url) ?? null,
						xfProto: request?.headers?.get('x-forwarded-proto') ?? null,
						xfHost: request?.headers?.get('x-forwarded-host') ?? null
					},
					timestamp: Date.now()
				})
			}).catch(() => {});
			// #endregion
			return resolved;
		} catch {
			// ignore invalid PUBLIC_ORIGIN
		}
	}

	const fromUrl = fallbackOrigin(url);

	// Trust HTTPS from the framework URL when present (fixes broken X-Forwarded-Proto at the edge).
	if (fromUrl?.startsWith('https://')) {
		resolved = fromUrl;
		branch = 'https-from-event-url';
		// #region agent log
		fetch('http://127.0.0.1:7935/ingest/d09c7f4b-ef13-49c5-ad00-b084fd7a41e4', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'ad9f63' },
			body: JSON.stringify({
				sessionId: 'ad9f63',
				hypothesisId: 'H2',
				location: 'public-origin.ts:getPublicOrigin',
				message: 'resolved public origin',
				data: {
					branch,
					resolved,
					fromUrlPreview: fromUrl ?? null,
					xfProto: request?.headers?.get('x-forwarded-proto') ?? null,
					xfHost: request?.headers?.get('x-forwarded-host') ?? null
				},
				timestamp: Date.now()
			})
		}).catch(() => {});
		// #endregion
		return resolved;
	}

	const headers = request?.headers;
	const xfProto = headers?.get('x-forwarded-proto')?.split(',')[0]?.trim();
	const xfHost = headers?.get('x-forwarded-host')?.split(',')[0]?.trim();
	if (xfProto && xfHost) {
		resolved = `${xfProto}://${xfHost}`;
		branch = 'x-forwarded-headers';
	} else {
		resolved = fromUrl ?? 'http://localhost';
		branch = fromUrl ? 'fallback-fromUrl' : 'fallback-localhost';
	}
	// #region agent log
	fetch('http://127.0.0.1:7935/ingest/d09c7f4b-ef13-49c5-ad00-b084fd7a41e4', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'ad9f63' },
		body: JSON.stringify({
			sessionId: 'ad9f63',
			hypothesisId: 'H2',
			location: 'public-origin.ts:getPublicOrigin',
			message: 'resolved public origin',
			data: { branch, resolved, fromUrlPreview: fromUrl ?? null, xfProto: xfProto ?? null, xfHost: xfHost ?? null },
			timestamp: Date.now()
		})
	}).catch(() => {});
	// #endregion
	return resolved;
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
