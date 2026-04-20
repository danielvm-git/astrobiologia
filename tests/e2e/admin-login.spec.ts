import { test, expect } from '@playwright/test';

test.describe('Admin Login Flow (ATDD)', () => {
    test.skip('[P0] should login successfully with email/password', async ({ page }) => {
        // THIS TEST WILL FAIL - UI/Backend might not be fully synced for this scenario
        await page.goto('/admin/login');
        
        await page.getByPlaceholder('Email').fill('admin@astrobiologia.com.br');
        await page.getByPlaceholder('Senha').fill('password123');
        await page.getByRole('button', { name: 'Entrar com Email' }).click();

        // Expect redirect to dashboard
        await expect(page).toHaveURL(/.*admin\/dashboard/);
        await expect(page.getByText('Astrobiologia Admin')).toBeVisible();
    });

    test.skip('[P1] should show error on invalid credentials', async ({ page }) => {
        await page.goto('/admin/login');
        
        await page.getByPlaceholder('Email').fill('wrong@example.com');
        await page.getByPlaceholder('Senha').fill('wrongpass');
        await page.getByRole('button', { name: 'Entrar com Email' }).click();

        // Expect error message
        const errorMsg = page.locator('div', { hasText: /E-mail ou senha incorretos/i });
        await expect(errorMsg).toBeVisible();
    });
});
