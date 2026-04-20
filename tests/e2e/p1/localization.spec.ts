import { test, expect } from '@playwright/test';

/**
 * P1 — I18n Integrity
 * Verifies that the site scaffold (header, footer) translates correctly when switching languages.
 */
test.describe('@p1 Localization', () => {
    
    const languages = [
        { 
            code: 'pt-br', 
            name: 'Português', 
            home: 'Início', 
            about: 'Sobre', 
            hero: 'Explorando a Vida no Universo' 
        },
        { 
            code: 'en', 
            name: 'English', 
            home: 'Home', 
            about: 'About', 
            hero: 'Exploring Life in the Universe' 
        },
        { 
            code: 'es', 
            name: 'Español', 
            home: 'Inicio', 
            about: 'Acerca de', 
            hero: 'Explorando la Vida en el Universo' 
        },
        { 
            code: 'nl', 
            name: 'Nederlands', 
            home: 'Home', 
            about: 'Over', 
            hero: 'Leven in het Universum Verkennen' 
        },
        { 
            code: 'ja', 
            name: '日本語', 
            home: 'ホーム', 
            about: 'アバウト', 
            hero: '宇宙の生命を探求する' 
        },
        { 
            code: 'zh', 
            name: '中文', 
            home: '首页', 
            about: '关于', 
            hero: '探索宇宙中的生命' 
        }
    ];

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    for (const lang of languages) {
        test(`should translate scaffold to ${lang.name} (${lang.code})`, async ({ page }) => {
            // Open language switcher
            // The button shows the current language code (e.g., PT-BR, EN, etc.)
            await page.getByRole('button', { name: 'Selecionar idioma' }).click();
            
            // Click the language option
            await page.getByRole('link', { name: lang.name, exact: true }).click();

            // Verify URL contains language code (except for default pt-br which is at root)
            if (lang.code !== 'pt-br') {
                await expect(page).toHaveURL(new RegExp(`/${lang.code}`));
            } else {
                await expect(page).toHaveURL(/\/$/);
            }

            // Verify Navigation Labels
            await expect(page.getByRole('link', { name: lang.home, exact: true }).first()).toBeVisible();
            await expect(page.getByRole('link', { name: lang.about, exact: true }).first()).toBeVisible();

            // Verify Hero Title (if on homepage)
            await expect(page.getByRole('heading', { level: 1, name: lang.hero })).toBeVisible();
        });
    }

    test('should persist language after refresh', async ({ page }) => {
        // Switch to English
        await page.getByRole('button', { name: 'Selecionar idioma' }).click();
        await page.getByRole('link', { name: 'English', exact: true }).click();
        await expect(page).toHaveURL(/\/en/);
        await expect(page.getByRole('link', { name: 'Home', exact: true }).first()).toBeVisible();

        // Refresh page
        await page.reload();

        // Verify it's still English
        await expect(page).toHaveURL(/\/en/);
        await expect(page.getByRole('link', { name: 'Home', exact: true }).first()).toBeVisible();
    });
});
