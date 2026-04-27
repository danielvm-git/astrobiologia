import { localeTagsMatch, normalizeLocaleTag } from './locale-tag';

export function shouldShowTranslationFallbackBadge(
	uiLocale: string,
	translation: { language: string } | undefined
): boolean {
	const ui = normalizeLocaleTag(uiLocale);
	if (!translation) {
		return ui !== 'pt-br';
	}
	if (ui === 'pt-br') {
		return normalizeLocaleTag(translation.language) !== 'pt-br';
	}
	return !localeTagsMatch(translation.language, uiLocale);
}
