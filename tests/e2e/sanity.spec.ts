/**
 * Playwright Sanity Test
 *
 * This is a simple test to verify that the Playwright e2e testing setup works correctly.
 * It tests the most basic functionality: loading the homepage and verifying basic content.
 *
 * ## What it tests:
 * - Playwright web server can start and serve the application
 * - Homepage loads successfully (HTTP 200)
 * - Basic page content is rendered
 * - Page has a title
 * - Navigation elements are present
 *
 * ## If this test fails:
 * 1. Check that `pnpm build` works correctly
 * 2. Check that `pnpm exec next start` can serve the built application
 * 3. Verify playwright.config.ts webServer configuration
 * 4. Check that port 3000 is available
 *
 * @example
 * // Run this specific test file
 * pnpm playwright test sanity.spec.ts
 *
 * // Run with debug mode
 * pnpm playwright test sanity.spec.ts --debug
 *
 * // Run with headed browser
 * pnpm playwright test sanity.spec.ts --headed
 */

import { test, expect } from '@playwright/test'

test.describe('Sanity Tests', () => {
  test('should load the homepage successfully', async ({ page }) => {
    // Navigate to homepage
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Verify successful response
    expect(response?.status()).toBe(200)

    // Verify page has a title
    const title = await page.title()
    expect(title).toBeTruthy()
    expect(title.length).toBeGreaterThan(0)

    console.log(`✓ Homepage loaded successfully with title: ${title}`)
  })

  test('should render basic page content', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Verify page has some text content
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).toBeTruthy()
    expect(bodyText!.length).toBeGreaterThan(0)

    console.log(`✓ Page has ${bodyText!.length} characters of content`)
  })

  test('should have navigation elements', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Look for navigation - could be nav element or header with links
    const hasNav = (await page.locator('nav').count()) > 0
    const hasHeader = (await page.locator('header').count()) > 0

    // At least one should exist
    expect(hasNav || hasHeader).toBe(true)

    console.log(`✓ Navigation elements found (nav: ${hasNav}, header: ${hasHeader})`)
  })

  test('should be able to click a link and navigate', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Find the first internal link (not external, not anchor)
    const internalLink = page.locator('a[href^="/"]').first()

    // Verify link exists
    await expect(internalLink).toBeVisible()

    // Get the href before clicking
    const href = await internalLink.getAttribute('href')
    expect(href).toBeTruthy()

    console.log(`✓ Found internal link: ${href}`)

    // Click and wait for navigation
    await internalLink.click()
    await page.waitForLoadState('domcontentloaded')

    // Verify we navigated to a different page
    const currentUrl = page.url()
    expect(currentUrl).toContain(href!)

    console.log(`✓ Successfully navigated to: ${currentUrl}`)
  })

  test('should handle 404 page', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist-12345', {
      waitUntil: 'domcontentloaded',
    })

    // Should get 404 response
    expect(response?.status()).toBe(404)

    // Page should still render something (404 page)
    const bodyText = await page.locator('body').textContent()
    expect(bodyText).toBeTruthy()

    console.log(`✓ 404 page handled correctly`)
  })
})

test.describe('Basic Page Tests', () => {
  const testPages = [
    { path: '/', name: 'Homepage' },
    { path: '/tips', name: 'Tips' },
    { path: '/guides', name: 'Guides' },
  ]

  for (const { path, name } of testPages) {
    test(`should load ${name} page successfully`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' })

      expect(response?.status()).toBe(200)

      const title = await page.title()
      expect(title.length).toBeGreaterThan(0)

      console.log(`✓ ${name} loaded successfully (${path})`)
    })
  }
})
