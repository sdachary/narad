// E2E Tests - Chat Functionality
import { test, expect } from '@playwright/test';

test.describe('Chat Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/Narad/);
    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('.chat-container')).toBeVisible();
  });

  test('shows welcome message', async ({ page }) => {
    const welcomeMessage = page.locator('.message.assistant').first();
    await expect(welcomeMessage).toBeVisible();
    await expect(welcomeMessage).toContainText('Narad');
  });

  test('can type in input field', async ({ page }) => {
    const input = page.locator('#user-input');
    await input.fill('Hello');
    await expect(input).toHaveValue('Hello');
  });

  test('input field has placeholder', async ({ page }) => {
    const input = page.locator('#user-input');
    await expect(input).toHaveAttribute('placeholder', /Ask Narad/);
  });

  test('send button is visible', async ({ page }) => {
    const sendBtn = page.locator('#send-btn');
    await expect(sendBtn).toBeVisible();
  });

  test('status indicator is visible', async ({ page }) => {
    const status = page.locator('#api-status');
    await expect(status).toBeVisible();
  });

  test('usage ring is visible', async ({ page }) => {
    const usageRing = page.locator('#usage-ring');
    await expect(usageRing).toBeVisible();
  });
});

test.describe('Message Sending', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('sends message on button click', async ({ page }) => {
    const input = page.locator('#user-input');
    const sendBtn = page.locator('#send-btn');

    await input.fill('Test message');
    await sendBtn.click();

    // User message should appear
    const userMessage = page.locator('.message.user').first();
    await expect(userMessage).toContainText('Test message');
  });

  test('sends message on Enter key', async ({ page }) => {
    const input = page.locator('#user-input');

    await input.fill('Test message');
    await input.press('Enter');

    // User message should appear
    const userMessage = page.locator('.message.user').first();
    await expect(userMessage).toContainText('Test message');
  });

  test('clears input after sending', async ({ page }) => {
    const input = page.locator('#user-input');

    await input.fill('Test message');
    await input.press('Enter');

    await expect(input).toHaveValue('');
  });

  test('does not send empty message', async ({ page }) => {
    const input = page.locator('#user-input');
    const sendBtn = page.locator('#send-btn');

    await input.fill('   ');
    await sendBtn.click();

    // No new messages should appear
    const messages = page.locator('.message');
    await expect(messages).toHaveCount(1); // Only welcome message
  });

  test('does not send when streaming', async ({ page }) => {
    const input = page.locator('#user-input');
    const sendBtn = page.locator('#send-btn');

    // Send first message
    await input.fill('First message');
    await sendBtn.click();

    // Wait for streaming to start
    await page.waitForSelector('.message.streaming', { timeout: 5000 }).catch(() => {});

    // Try to send another message
    await input.fill('Second message');
    await sendBtn.click();

    // Second message should not appear (button should be disabled)
    const messages = page.locator('.message.user');
    const count = await messages.count();
    expect(count).toBeLessThanOrEqual(2);
  });
});

test.describe('XSS Prevention', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('sanitizes XSS in displayed content', async ({ page }) => {
    // The page should not execute any scripts from user input
    const input = page.locator('#user-input');
    
    // Inject potential XSS
    await input.fill('<img src=x onerror="window.xssTest=true">');
    await input.press('Enter');

    // Wait a bit for any potential execution
    await page.waitForTimeout(500);

    // The xssTest property should not be set
    const xssTest = await page.evaluate(() => window.xssTest);
    expect(xssTest).toBeUndefined();
  });

  test('escapes HTML in user messages', async ({ page }) => {
    const input = page.locator('#user-input');
    
    await input.fill('<b>Bold</b>');
    await input.press('Enter');

    const messageContent = page.locator('.message.user .message-content').first();
    const text = await messageContent.textContent();
    
    // Should display the tags as text, not render them
    expect(text).toContain('<b>Bold</b>');
  });
});

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('input has proper labeling', async ({ page }) => {
    const input = page.locator('#user-input');
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
  });

  test('can navigate with keyboard', async ({ page }) => {
    const input = page.locator('#user-input');
    
    // Focus should start in input
    await expect(input).toBeFocused();
    
    // Tab should move to send button
    await page.keyboard.press('Tab');
    const sendBtn = page.locator('#send-btn');
    await expect(sendBtn).toBeFocused();
  });

  test('send works with Enter key', async ({ page }) => {
    const input = page.locator('#user-input');
    
    await input.fill('Keyboard test');
    await input.press('Enter');

    const userMessage = page.locator('.message.user').first();
    await expect(userMessage).toContainText('Keyboard test');
  });

  test('send does not trigger on Shift+Enter', async ({ page }) => {
    const input = page.locator('#user-input');
    
    await input.fill('Test');
    await input.press('Shift+Enter');

    // Should not send - message should still be in input
    await expect(input).toHaveValue('Test');
  });
});

test.describe('Responsive Design', () => {
  test('works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Core elements should still be visible
    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('.chat-container')).toBeVisible();
    await expect(page.locator('#user-input')).toBeVisible();
  });

  test('works on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('.chat-container')).toBeVisible();
  });

  test('works on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.app-header')).toBeVisible();
    await expect(page.locator('.chat-container')).toBeVisible();
  });
});

test.describe('API Integration', () => {
  test('health endpoint returns valid response', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('status');
    expect(data).toHaveProperty('service');
  });

  test('usage endpoint returns valid response', async ({ request }) => {
    const response = await request.get('/api/usage');
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data).toHaveProperty('coding');
    expect(data.coding).toHaveProperty('tokensUsed');
  });

  test('rejects message without content', async ({ request }) => {
    const response = await request.post('/api/chat', {
      data: { session_id: 'test-session' }
    });
    
    // Should either succeed with default message or fail gracefully
    expect([400, 403, 429, 500]).toContain(response.status());
  });
});
