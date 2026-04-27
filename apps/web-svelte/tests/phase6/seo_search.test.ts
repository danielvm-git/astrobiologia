import { describe, expect, it } from 'vitest';

import { generateSchemaMarkup } from '../../src/lib/seo';

describe('Phase 6: SEO schema markup', () => {
	it('uses publish and update timestamps from Appwrite fields', () => {
		const markup = generateSchemaMarkup({
			title: 'Sinais de vida em exoplanetas',
			excerpt: 'Novo estudo detecta biossinais',
			featuredImage: 'https://astrobiologia.com.br/cover.jpg',
			publishedAt: '2026-04-20T10:00:00.000Z',
			$createdAt: '2026-04-19T10:00:00.000Z',
			$updatedAt: '2026-04-21T10:00:00.000Z',
			url: 'https://astrobiologia.com.br/pt-br/artigos/biossinais',
			language: 'pt-br'
		});

		expect(markup['@type']).toBe('NewsArticle');
		expect(markup.datePublished).toBe('2026-04-20T10:00:00.000Z');
		expect(markup.dateModified).toBe('2026-04-21T10:00:00.000Z');
		expect(markup.mainEntityOfPage).toBe('https://astrobiologia.com.br/pt-br/artigos/biossinais');
		expect(markup.inLanguage).toBe('pt-br');
	});
});
