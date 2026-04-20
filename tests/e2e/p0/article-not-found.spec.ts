import { test, expect } from '@playwright/test';

test.describe('@p0 Article error', () => {
	test('[P0] unknown slug shows 404', async ({ page }) => {
		const response = await page.goto('/artigos/this-slug-should-not-exist-e2e-404');

		expect(response?.status()).toBe(404);

		await expect(page.getByRole('heading', { level: 1, name: '404' })).toBeVisible();
		// Serialized HTTP errors surface as "Not Found" (not the `error(404, ...)` detail string).
		await expect(page.getByText(/^Not Found$/)).toBeVisible();
	});
});
