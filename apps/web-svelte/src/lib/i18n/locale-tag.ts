export function normalizeLocaleTag(tag: string): string {
	return tag.trim().toLowerCase().replace(/_/g, '-');
}

export function primaryLanguageSubtag(tag: string): string {
	const n = normalizeLocaleTag(tag);
	const i = n.indexOf('-');
	return i === -1 ? n : n.slice(0, i);
}

export function localeTagsMatch(stored: string, preferred: string): boolean {
	const a = normalizeLocaleTag(stored);
	const b = normalizeLocaleTag(preferred);
	if (a === b) return true;
	return primaryLanguageSubtag(a) === primaryLanguageSubtag(b);
}
