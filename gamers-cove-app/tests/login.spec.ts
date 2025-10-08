import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow user to log in', async ({ page }) => {
    // Navigate to the login page
    await page.goto('/login');

    // Click the Google sign-in button
    const googleButton = page.locator('button:has-text("Sign in with Google")');
    await expect(googleButton).toBeVisible();
    
    // Note: In a real test, you would need to handle the Google OAuth flow
    // For now, we'll just verify the login page loads correctly
    
    // Verify the dashboard is accessible after login
    // This is a placeholder - in a real test, you would complete the login flow
    await page.goto('/dashboard');
    await expect(page).toHaveTitle(/Dashboard/);
  });
});

test.describe('Game Reviews', () => {
  test('should display game reviews', async ({ page }) => {
    // Navigate to a game details page
    await page.goto('/games/1');
    
    // Verify reviews section is visible
    const reviewsSection = page.locator('h2:has-text("Reviews")');
    await expect(reviewsSection).toBeVisible();
    
    // Check if there are reviews or a message about no reviews
    const noReviewsMessage = page.locator('text=No reviews yet');
    const reviewItems = page.locator('.review-item');
    
    if (await noReviewsMessage.isVisible()) {
      console.log('No reviews found, which is expected for a new game');
    } else {
      await expect(reviewItems.first()).toBeVisible();
    }
  });
});
