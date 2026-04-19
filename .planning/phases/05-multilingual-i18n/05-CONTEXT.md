# Phase 5: Multilingual (i18n)

## Goals
- Integrate a robust i18n solution compatible with Svelte 5.
- Provide a language switcher in the Header and Footer.
- Support multilingual article content (Drafting with DeepL integration).
- Ensure SEO compatibility for multiple languages.

## Constraints
- Must use Svelte 5 runes and patterns.
- Keep bundle size small.
- Use Appwrite for storing translated content if necessary, or local i18n files for UI.
- Maintain premium "New Scientist" aesthetic.

## Success Criteria (UAT)
- [ ] Language switcher works and persists preference.
- [ ] UI text is translated (PT-BR, EN).
- [ ] Articles can be created/edited in multiple languages.
- [ ] DeepL integration provides draft translations.
- [ ] URLs reflect language (e.g., `/en/articles/...`) or use a header-based approach (confirm with research).
