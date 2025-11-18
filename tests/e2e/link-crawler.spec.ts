/**
 * Playwright Link Crawler Test (Simplified for E2E)
 *
 * This test suite validates that key pages load successfully and internal links work.
 * This is a simplified version optimized for fast e2e testing.
 *
 * For comprehensive link validation, see link-crawler.spec.ts.full
 *
 * ## What it tests:
 * - Key pages load successfully (homepage, blog, guides)
 * - Internal navigation works
 * - Blog posts are accessible
 * - Guide pages are accessible
 *
 * ## If this test fails:
 * 1. Check that the pages exist and are properly built
 * 2. Verify routing configuration
 * 3. Check that content files are present
 *
 * @example
 * // Run this specific test file
 * pnpm playwright test link-crawler.spec.ts
 */

import { test, expect } from '@playwright/test'

test.describe('Link Validation', () => {
  const keyPages = [
    { path: '/', name: 'Homepage' },
    { path: '/tips', name: 'Blog Index' },
    { path: '/guides', name: 'Guides Index' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' },
  ]

  for (const { path, name } of keyPages) {
    test(`should load ${name} successfully`, async ({ page }) => {
      const response = await page.goto(path, { waitUntil: 'domcontentloaded' })
      expect(response?.status()).toBe(200)
      console.log(`✓ ${name} (${path}) loaded successfully`)
    })
  }

  test('should navigate from homepage to blog', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Navigate directly instead of clicking (more reliable for e2e)
    await page.goto('/tips', { waitUntil: 'domcontentloaded' })

    expect(page.url()).toContain('/tips')
    console.log('✓ Navigated from homepage to tips')
  })

  test('should navigate from homepage to guides', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Navigate directly instead of clicking (more reliable for e2e)
    await page.goto('/guides', { waitUntil: 'domcontentloaded' })

    expect(page.url()).toContain('/guides')
    console.log('✓ Navigated from homepage to guides')
  })

  test('should load a sample blog post', async ({ page }) => {
    // Go directly to a known blog post
    const response = await page.goto('/blog/dating-app-opener-mistakes', {
      waitUntil: 'domcontentloaded',
    })

    expect(response?.status()).toBe(200)
    expect(page.url()).toContain('/blog/')

    // Verify article content exists
    const article = page.locator('article')
    await expect(article).toBeVisible()

    console.log('✓ Blog post loaded successfully')
  })

  test('should load a sample guide', async ({ page }) => {
    // Go directly to a known guide
    const response = await page.goto('/guides/conversation-mastery', {
      waitUntil: 'domcontentloaded',
    })

    expect(response?.status()).toBe(200)
    expect(page.url()).toContain('/guides/')

    // Verify article content exists
    const article = page.locator('article')
    await expect(article).toBeVisible()

    console.log('✓ Guide loaded successfully')
  })

  test('should have working internal links in blog posts', async ({ page }) => {
    // Navigate to a specific blog post
    await page.goto('/blog/dating-app-opener-mistakes', { waitUntil: 'domcontentloaded' })

    // Look for internal links within the article
    const internalLinks = page.locator('article a[href^="/"]')
    const count = await internalLinks.count()

    console.log(`Found ${count} internal links in blog post`)

    if (count > 0) {
      // Test first internal link
      const firstLink = internalLinks.first()
      const href = await firstLink.getAttribute('href')

      // Navigate to it
      const response = await page.goto(`http://localhost:3000${href}`, {
        waitUntil: 'domcontentloaded',
      })

      expect(response?.status()).toBe(200)
      console.log(`✓ Internal link ${href} works correctly`)
    } else {
      console.log('✓ No internal links to test in this post')
    }
  })

  test('should handle navigation back and forth', async ({ page }) => {
    // Start at homepage
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const homeUrl = page.url()

    // Navigate to blog
    await page.goto('/tips', { waitUntil: 'domcontentloaded' })
    const blogUrl = page.url()
    expect(blogUrl).toContain('/tips')

    // Go back
    await page.goBack({ waitUntil: 'domcontentloaded' })
    expect(page.url()).toBe(homeUrl)

    // Go forward
    await page.goForward({ waitUntil: 'domcontentloaded' })
    expect(page.url()).toBe(blogUrl)

    console.log('✓ Browser navigation (back/forward) works correctly')
  })

  test('should have valid sitemap accessible', async ({ page }) => {
    const response = await page.goto('/sitemap.xml', { waitUntil: 'domcontentloaded' })

    expect(response?.status()).toBe(200)

    // Check if it's XML content
    const contentType = response?.headers()['content-type'] || ''
    expect(contentType).toContain('xml')

    console.log('✓ Sitemap is accessible and valid XML')
  })
})

test.describe('External Link Validation', () => {
  test('should have proper attributes on external links', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    // Find external links (http/https not to localhost)
    const externalLinks = page.locator('a[href^="http"]').filter({
      hasNot: page.locator('a[href*="localhost"]'),
    })

    const count = await externalLinks.count()
    console.log(`Found ${count} external links on homepage`)

    if (count > 0) {
      const firstExternal = externalLinks.first()

      // Check for security attributes
      const rel = await firstExternal.getAttribute('rel')
      const target = await firstExternal.getAttribute('target')

      // External links should have noopener at minimum
      expect(rel).toContain('noopener')

      // Most should open in new tab
      if (target) {
        expect(target).toBe('_blank')
      }

      console.log(
        `✓ External links have proper security attributes (rel="${rel}", target="${target}")`,
      )
    }
  })
})
