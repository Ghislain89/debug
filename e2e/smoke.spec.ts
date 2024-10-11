import { test, expect } from '@playwright/test';

test('App loads and nav works', async ({ page }) => {
    await page.goto('/blog');
    // await page.setViewportSize({ width: 2000, height: 1000 });
    //
    //const nav = page.getByRole('navigation');
    //const blogLink = nav.getByText('Blog');
    const blogLink = page.getByRole('link', { name: /blog/i });
    await blogLink.scrollIntoViewIfNeeded();
    await blogLink.click();

    await expect(page.getByTestId('blog-posts')).toBeVisible();

    await expect(page.getByRole('link', { name: /uses/i })).not.toHaveClass(
        /active/
    );
    await expect(page.getByRole('link', { name: /blog/i })).toHaveClass(
        /active/
    );

    await expect(page.getByText('My Mission')).toBeVisible();
    await page.getByText('My Mission').click();

    await expect(page.getByText('My Mission')).toBeVisible();
});
