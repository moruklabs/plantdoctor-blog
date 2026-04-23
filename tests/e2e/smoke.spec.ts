/**
 * Smoke E2E tests — critical user journeys across mobile and desktop
 *
 * Covers:
 * - Homepage: h1, nav links, footer
 * - Tips index: post cards with links
 * - Guides index: loads without errors
 * - Post page: has <article> tag
 * - Footer: present with links
 * - No console errors (third-party noise filtered)
 * - Viewports: mobile (375px) and desktop (1280px)
 */

import { test, expect, type Page } from '@playwright/test'

// A stable post slug that exists in content/posts/
const SAMPLE_POST = '/tips/21-day-quarantine-plan-houseplants/'

// Known third-party console noise to ignore
const IGNORED_CONSOLE_PATTERNS = [
  /gtag/i,
  /google-analytics/i,
  /googletagmanager/i,
  /clarity/i,
  /hotjar/i,
  /intercom/i,
  /facebook/i,
  /twitter/i,
  /sentry/i,
  /datadog/i,
]

function isIgnoredConsoleError(message: string): boolean {
  return IGNORED_CONSOLE_PATTERNS.some((pattern) => pattern.test(message))
}

async function collectConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error' && !isIgnoredConsoleError(msg.text())) {
      errors.push(msg.text())
    }
  })
  return errors
}

// ─── Desktop (1280px) ─────────────────────────────────────────────────────────

test.describe('Smoke — Desktop (1280px)', () => {
  test.use({ viewport: { width: 1280, height: 800 } })

  test('Homepage loads, has h1, nav has at least 3 links', async ({ page }) => {
    const errors = await collectConsoleErrors(page)
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' })

    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()
    expect(await page.locator('h1').count()).toBe(1)

    // Nav should have at least 3 links
    const navLinks = page.locator('nav a')
    await expect(navLinks.first()).toBeVisible()
    expect(await navLinks.count()).toBeGreaterThanOrEqual(3)

    expect(errors).toEqual([])
  })

  test('Tips index loads and shows post cards with links', async ({ page }) => {
    const errors = await collectConsoleErrors(page)
    const response = await page.goto('/tips/', { waitUntil: 'domcontentloaded' })

    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()

    // Post cards should have links to individual posts
    const postLinks = page.locator('a[href^="/tips/"]')
    expect(await postLinks.count()).toBeGreaterThan(0)

    // Each post card link should be visible
    await expect(postLinks.first()).toBeVisible()

    expect(errors).toEqual([])
  })

  test('Guides index loads', async ({ page }) => {
    const errors = await collectConsoleErrors(page)
    const response = await page.goto('/guides/', { waitUntil: 'domcontentloaded' })

    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()

    expect(errors).toEqual([])
  })

  test('Post page loads and has article tag', async ({ page }) => {
    const errors = await collectConsoleErrors(page)
    const response = await page.goto(SAMPLE_POST, { waitUntil: 'domcontentloaded' })

    expect(response?.status()).toBe(200)

    // Post should be wrapped in <article>
    await expect(page.locator('article')).toBeVisible()

    // Should have a title heading
    await expect(page.locator('h1')).toBeVisible()

    expect(errors).toEqual([])
  })

  test('Footer is present with links', async ({ page }) => {
    const errors = await collectConsoleErrors(page)
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    const footerLinks = footer.locator('a')
    expect(await footerLinks.count()).toBeGreaterThan(0)

    expect(errors).toEqual([])
  })

  test('No console errors on homepage', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !isIgnoredConsoleError(msg.text())) {
        errors.push(msg.text())
      }
    })

    await page.goto('/', { waitUntil: 'networkidle' })
    expect(errors).toEqual([])
  })

  test('No console errors on post page', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !isIgnoredConsoleError(msg.text())) {
        errors.push(msg.text())
      }
    })

    await page.goto(SAMPLE_POST, { waitUntil: 'networkidle' })
    expect(errors).toEqual([])
  })
})

// ─── Mobile (375px) ──────────────────────────────────────────────────────────

test.describe('Smoke — Mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('Homepage loads, has h1, nav is accessible', async ({ page }) => {
    const errors = await collectConsoleErrors(page)
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' })

    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()

    // On mobile there should still be nav or a hamburger/nav region
    const hasNav =
      (await page.locator('nav').count()) > 0 || (await page.locator('header').count()) > 0
    expect(hasNav).toBe(true)

    expect(errors).toEqual([])
  })

  test('Tips index loads and shows post cards with links', async ({ page }) => {
    const errors = await collectConsoleErrors(page)
    const response = await page.goto('/tips/', { waitUntil: 'domcontentloaded' })

    expect(response?.status()).toBe(200)

    const postLinks = page.locator('a[href^="/tips/"]')
    expect(await postLinks.count()).toBeGreaterThan(0)

    expect(errors).toEqual([])
  })

  test('Guides index loads', async ({ page }) => {
    const errors = await collectConsoleErrors(page)
    const response = await page.goto('/guides/', { waitUntil: 'domcontentloaded' })

    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toBeVisible()

    expect(errors).toEqual([])
  })

  test('Post page loads and has article tag', async ({ page }) => {
    const errors = await collectConsoleErrors(page)
    const response = await page.goto(SAMPLE_POST, { waitUntil: 'domcontentloaded' })

    expect(response?.status()).toBe(200)
    await expect(page.locator('article')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()

    expect(errors).toEqual([])
  })

  test('Footer is present with links', async ({ page }) => {
    const errors = await collectConsoleErrors(page)
    await page.goto('/', { waitUntil: 'domcontentloaded' })

    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    const footerLinks = footer.locator('a')
    expect(await footerLinks.count()).toBeGreaterThan(0)

    expect(errors).toEqual([])
  })
})

// ─── Cross-viewport consistency ───────────────────────────────────────────────

test.describe('Smoke — Cross-viewport page title consistency', () => {
  const viewports = [
    { width: 375, height: 667 },
    { width: 1280, height: 800 },
  ]

  for (const vp of viewports) {
    test(`Homepage title is set at ${vp.width}px`, async ({ page }) => {
      await page.setViewportSize(vp)
      await page.goto('/', { waitUntil: 'domcontentloaded' })

      const title = await page.title()
      expect(title.length).toBeGreaterThan(0)
    })
  }
})
