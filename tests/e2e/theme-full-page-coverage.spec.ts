/**
 * Theme Full Page Coverage Test
 *
 * Verifies that theme changes apply to ALL page elements, not just header.
 * This test was created after discovering dark mode only applied to header,
 * while main content stayed light.
 */

import { test, expect, Page } from '@playwright/test'

/**
 * Helper: Get computed background color of an element
 */
async function getBackgroundColor(page: Page, selector: string): Promise<string> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel)
    if (!element) throw new Error(`Element not found: ${sel}`)
    return window.getComputedStyle(element).backgroundColor
  }, selector)
}

/**
 * Helper: Parse RGB/RGBA color to numeric values
 */
function parseRgb(color: string): { r: number; g: number; b: number } {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) throw new Error(`Could not parse color: ${color}`)
  const [, r, g, b] = match.map(Number)
  return { r, g, b }
}

/**
 * Helper: Check if color is dark (all RGB < 50)
 */
function isDarkColor(color: string): boolean {
  const { r, g, b } = parseRgb(color)
  return r < 50 && g < 50 && b < 50
}

/**
 * Helper: Check if color is light (all RGB > 200)
 */
function isLightColor(color: string): boolean {
  const { r, g, b } = parseRgb(color)
  return r > 200 && g > 200 && b > 200
}

/**
 * Helper: Toggle theme by clicking theme toggle button
 */
async function toggleTheme(page: Page) {
  const themeToggle = page.locator('[aria-label*="theme" i]')
  await themeToggle.click()
  await page.waitForTimeout(300) // Wait for theme transition
}

test.describe('Theme Full Page Coverage', () => {
  test.use({ viewport: { width: 1920, height: 1080 } })

  test('should apply dark theme to ENTIRE page, not just header', async ({ page }) => {
    await page.goto('/')

    // Toggle to dark mode
    await toggleTheme(page)

    // Wait for theme to apply
    await page.waitForTimeout(500)

    // Verify dark mode is applied
    const htmlClass = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    expect(htmlClass, 'HTML element should have "dark" class').toBe(true)

    // ===== CRITICAL CHECKS =====

    // 1. Body background should be dark
    const bodyBg = await getBackgroundColor(page, 'body')
    expect(isDarkColor(bodyBg), `Body background should be dark, got ${bodyBg}`).toBe(true)

    // 2. Header/nav should be dark
    const headerBg = await getBackgroundColor(page, 'header')
    expect(isDarkColor(headerBg), `Header background should be dark, got ${headerBg}`).toBe(true)

    // 3. Main content area should be dark
    const mainBg = await getBackgroundColor(page, 'main')
    expect(isDarkColor(mainBg), `Main content area should be dark, got ${mainBg}`).toBe(true)

    // 4. Featured post section should be dark
    const hasFeaturedPost = await page
      .locator('article')
      .first()
      .isVisible()
      .catch(() => false)
    if (hasFeaturedPost) {
      const articleBg = await getBackgroundColor(page, 'article')
      // Article can be dark or have a subtle dark variant (< 100 for dark themes)
      const { r, g, b } = parseRgb(articleBg)
      expect(
        r,
        `Article background red channel should be < 100 in dark mode, got ${r}`,
      ).toBeLessThan(100)
      expect(
        g,
        `Article background green channel should be < 100 in dark mode, got ${g}`,
      ).toBeLessThan(100)
      expect(
        b,
        `Article background blue channel should be < 100 in dark mode, got ${b}`,
      ).toBeLessThan(100)
    }

    // 5. Footer should be dark
    const footerBg = await getBackgroundColor(page, 'footer')
    expect(isDarkColor(footerBg), `Footer background should be dark, got ${footerBg}`).toBe(true)
  })

  test('should apply light theme to ENTIRE page', async ({ page }) => {
    await page.goto('/')

    // Ensure we're in light mode (toggle if needed)
    const currentTheme = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    })

    if (currentTheme === 'dark') {
      await toggleTheme(page)
      await page.waitForTimeout(500)
    }

    // Verify light mode is applied
    const htmlClass = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    expect(htmlClass, 'HTML element should NOT have "dark" class').toBe(false)

    // ===== CRITICAL CHECKS =====

    // 1. Body background should be light
    const bodyBg = await getBackgroundColor(page, 'body')
    expect(isLightColor(bodyBg), `Body background should be light, got ${bodyBg}`).toBe(true)

    // 2. Header/nav should be light
    const headerBg = await getBackgroundColor(page, 'header')
    expect(isLightColor(headerBg), `Header background should be light, got ${headerBg}`).toBe(true)

    // 3. Main content area should be light
    const mainBg = await getBackgroundColor(page, 'main')
    expect(isLightColor(mainBg), `Main content area should be light, got ${mainBg}`).toBe(true)

    // 4. Footer should be light
    const footerBg = await getBackgroundColor(page, 'footer')
    expect(isLightColor(footerBg), `Footer background should be light, got ${footerBg}`).toBe(true)
  })

  test('should apply consistent theme across all major sections', async ({ page }) => {
    await page.goto('/')

    // Toggle to dark mode
    await toggleTheme(page)
    await page.waitForTimeout(500)

    // Get background colors of all major sections
    const sections = ['body', 'header', 'main', 'footer']
    const backgrounds: Record<string, string> = {}

    for (const section of sections) {
      backgrounds[section] = await getBackgroundColor(page, section)
    }

    // All sections should be consistently dark (all RGB < 100)
    for (const [section, bg] of Object.entries(backgrounds)) {
      const { r, g, b } = parseRgb(bg)
      expect(
        r < 100 && g < 100 && b < 100,
        `Section "${section}" should be dark (RGB < 100), got ${bg}`,
      ).toBe(true)
    }
  })

  test('should detect if only header changes theme (regression test)', async ({ page }) => {
    await page.goto('/')

    // Get initial backgrounds
    const initialHeaderBg = await getBackgroundColor(page, 'header')
    const initialMainBg = await getBackgroundColor(page, 'main')

    // Toggle theme
    await toggleTheme(page)
    await page.waitForTimeout(500)

    // Get new backgrounds
    const newHeaderBg = await getBackgroundColor(page, 'header')
    const newMainBg = await getBackgroundColor(page, 'main')

    // BOTH should change, not just header
    const headerChanged = initialHeaderBg !== newHeaderBg
    const mainChanged = initialMainBg !== newMainBg

    expect(headerChanged, 'Header background should change when theme toggles').toBe(true)
    expect(mainChanged, 'Main content background should change when theme toggles').toBe(true)

    // If main didn't change but header did, this is the bug we're testing for
    if (headerChanged && !mainChanged) {
      throw new Error(
        'BUG DETECTED: Theme only applied to header, not main content! ' +
          `Header changed from ${initialHeaderBg} to ${newHeaderBg}, ` +
          `but main stayed ${initialMainBg}`,
      )
    }
  })

  test('should have consistent text colors for readability', async ({ page }) => {
    await page.goto('/')

    // Toggle to dark mode
    await toggleTheme(page)
    await page.waitForTimeout(500)

    // Check text colors
    const headingColor = await page.evaluate(() => {
      const heading = document.querySelector('h1')
      if (!heading) return 'not-found'
      return window.getComputedStyle(heading).color
    })

    const bodyTextColor = await page.evaluate(() => {
      const p = document.querySelector('p')
      if (!p) return 'not-found'
      return window.getComputedStyle(p).color
    })

    // In dark mode, text should be light (RGB > 150)
    if (headingColor !== 'not-found') {
      const { r, g, b } = parseRgb(headingColor)
      expect(
        r > 150 && g > 150 && b > 150,
        `Heading text should be light in dark mode, got ${headingColor}`,
      ).toBe(true)
    }

    if (bodyTextColor !== 'not-found') {
      const { r, g, b } = parseRgb(bodyTextColor)
      expect(
        r > 150 && g > 150 && b > 150,
        `Body text should be light in dark mode, got ${bodyTextColor}`,
      ).toBe(true)
    }
  })
})
