/**
 * Theme System E2E Tests
 *
 * Tests theme switching functionality across:
 * - 3 themes (light, dark, system)
 * - 3 viewports (mobile, tablet, desktop)
 * - Theme persistence (localStorage)
 * - No FOUC (Flash of Unstyled Content)
 * - Accessibility (ARIA labels, keyboard navigation)
 * - Visual appearance verification
 */

import { test, expect, Page } from '@playwright/test'

const PAGES_TO_TEST = [
  { name: 'Homepage', path: '/' },
  { name: 'Tips', path: '/tips' },
  { name: 'Guides', path: '/guides' },
  { name: 'About', path: '/about' },
]

/**
 * Helper: Set theme by clicking theme toggle button
 */
async function clickThemeToggle(page: Page) {
  const themeToggle = page.locator('[aria-label*="theme" i], [aria-label*="mode" i]')
  await themeToggle.click()
  // Wait for theme transition
  await page.waitForTimeout(300)
}

/**
 * Helper: Get current theme from HTML class
 */
async function getCurrentTheme(page: Page): Promise<'light' | 'dark'> {
  const isDark = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark')
  })
  return isDark ? 'dark' : 'light'
}

/**
 * Helper: Get theme from localStorage
 */
async function getStoredTheme(page: Page): Promise<string | null> {
  return await page.evaluate(() => {
    return localStorage.getItem('theme')
  })
}

/**
 * Helper: Verify theme colors match expected theme
 */
async function verifyThemeColors(page: Page, expectedTheme: 'light' | 'dark') {
  const bgColor = await page.evaluate(() => {
    // Check body element instead of html (theme colors applied to body)
    const bodyEl = document.body
    return window.getComputedStyle(bodyEl).backgroundColor
  })

  // Handle both rgb() and rgba() formats
  const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)

  if (!rgbMatch) {
    throw new Error(`Unexpected background color format: ${bgColor}`)
  }

  const [, r, g, b] = rgbMatch.map(Number)

  if (expectedTheme === 'dark') {
    // Dark theme: all RGB values should be < 50
    expect(r, `Dark theme red channel should be < 50, got ${r}`).toBeLessThan(50)
    expect(g, `Dark theme green channel should be < 50, got ${g}`).toBeLessThan(50)
    expect(b, `Dark theme blue channel should be < 50, got ${b}`).toBeLessThan(50)
  } else {
    // Light theme: all RGB values should be > 200
    expect(r, `Light theme red channel should be > 200, got ${r}`).toBeGreaterThan(200)
    expect(g, `Light theme green channel should be > 200, got ${g}`).toBeGreaterThan(200)
    expect(b, `Light theme blue channel should be > 200, got ${b}`).toBeGreaterThan(200)
  }
}

// ======================
// Desktop Tests
// ======================

test.describe('Desktop - Theme System', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
  })

  test('should have theme toggle button visible', async ({ page }) => {
    await page.goto('/')
    const themeToggle = page.locator('[aria-label*="theme" i], [aria-label*="mode" i]')
    await expect(themeToggle).toBeVisible()
  })

  test('should toggle between light and dark themes', async ({ page }) => {
    await page.goto('/')

    // Get initial theme
    const initialTheme = await getCurrentTheme(page)

    // Click toggle
    await clickThemeToggle(page)

    // Verify theme changed
    const newTheme = await getCurrentTheme(page)
    expect(newTheme).not.toBe(initialTheme)

    // Verify colors match theme
    await verifyThemeColors(page, newTheme)
  })

  test('should persist theme across page navigations', async ({ page }) => {
    await page.goto('/')

    // Set to dark mode
    await clickThemeToggle(page)
    const theme = await getCurrentTheme(page)

    // Navigate to another page
    await page.goto('/about')

    // Verify theme persisted
    const persistedTheme = await getCurrentTheme(page)
    expect(persistedTheme).toBe(theme)
  })

  test('should store theme preference in localStorage', async ({ page }) => {
    await page.goto('/')

    // Toggle theme
    await clickThemeToggle(page)

    // Check localStorage
    const storedTheme = await getStoredTheme(page)
    expect(storedTheme).toBeTruthy()
  })

  test('should toggle between light and dark (two-state cycle)', async ({ page }) => {
    await page.goto('/')

    const themes: string[] = []

    // Collect 4 theme states (should toggle: light → dark → light → dark)
    for (let i = 0; i < 4; i++) {
      themes.push(await getCurrentTheme(page))
      await clickThemeToggle(page)
    }

    // With 2-state toggle, themes[0] should equal themes[2]
    expect(themes[0]).toBe(themes[2])
    // And themes[1] should equal themes[3]
    expect(themes[1]).toBe(themes[3])
    // And they should be different from each other
    expect(themes[0]).not.toBe(themes[1])
  })

  test('should not have FOUC (Flash of Unstyled Content) on reload', async ({ page }) => {
    await page.goto('/')

    // Set dark theme
    await clickThemeToggle(page)
    await page.waitForTimeout(100)

    // Reload page
    await page.reload()

    // Immediately check theme (should be dark, not flashing to light first)
    const themeAfterReload = await getCurrentTheme(page)
    expect(themeAfterReload).toBe('dark')

    // Check background color is dark immediately
    await verifyThemeColors(page, 'dark')
  })

  test('should have accessible theme toggle with ARIA label', async ({ page }) => {
    await page.goto('/')

    const themeToggle = page.locator('[aria-label*="theme" i], [aria-label*="mode" i]')
    const ariaLabel = await themeToggle.getAttribute('aria-label')

    expect(ariaLabel).toBeTruthy()
    expect(ariaLabel?.toLowerCase()).toContain('theme')
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')

    // Tab to theme toggle (assumes it's in header navigation)
    await page.keyboard.press('Tab')
    // May need multiple tabs to reach theme toggle
    for (let i = 0; i < 10; i++) {
      const focused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))
      if (focused?.toLowerCase().includes('theme')) {
        break
      }
      await page.keyboard.press('Tab')
    }

    // Press Enter to activate
    const initialTheme = await getCurrentTheme(page)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    // Verify theme changed
    const newTheme = await getCurrentTheme(page)
    expect(newTheme).not.toBe(initialTheme)
  })

  PAGES_TO_TEST.forEach((pageInfo) => {
    test(`should apply dark theme correctly on ${pageInfo.name}`, async ({ page }) => {
      await page.goto(pageInfo.path)

      // Set dark theme
      await clickThemeToggle(page)
      const theme = await getCurrentTheme(page)

      if (theme === 'dark') {
        await verifyThemeColors(page, 'dark')
      } else {
        // Click again to get to dark
        await clickThemeToggle(page)
        await verifyThemeColors(page, 'dark')
      }
    })
  })
})

// ======================
// Mobile Tests
// ======================

test.describe('Mobile - Theme System', () => {
  test.use({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
  })

  test('should have theme toggle accessible on mobile', async ({ page }) => {
    await page.goto('/')

    const themeToggle = page.locator('[aria-label*="theme" i], [aria-label*="mode" i]')
    await expect(themeToggle).toBeVisible()
  })

  test('should toggle themes on mobile', async ({ page }) => {
    await page.goto('/')

    const initialTheme = await getCurrentTheme(page)
    await clickThemeToggle(page)
    const newTheme = await getCurrentTheme(page)

    expect(newTheme).not.toBe(initialTheme)
    await verifyThemeColors(page, newTheme)
  })

  test('should persist theme across mobile navigations', async ({ page }) => {
    await page.goto('/')

    await clickThemeToggle(page)
    const theme = await getCurrentTheme(page)

    await page.goto('/tips')

    const persistedTheme = await getCurrentTheme(page)
    expect(persistedTheme).toBe(theme)
  })
})

// ======================
// Tablet Tests
// ======================

test.describe('Tablet - Theme System', () => {
  test.use({
    viewport: { width: 768, height: 1024 },
  })

  test('should have theme toggle accessible on tablet', async ({ page }) => {
    await page.goto('/')

    const themeToggle = page.locator('[aria-label*="theme" i], [aria-label*="mode" i]')
    await expect(themeToggle).toBeVisible()
  })

  test('should toggle themes on tablet', async ({ page }) => {
    await page.goto('/')

    const initialTheme = await getCurrentTheme(page)
    await clickThemeToggle(page)
    const newTheme = await getCurrentTheme(page)

    expect(newTheme).not.toBe(initialTheme)
    await verifyThemeColors(page, newTheme)
  })
})

// ======================
// System Theme Tests
// ======================

test.describe('System Theme Detection', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
    colorScheme: 'dark', // Emulate dark system preference
  })

  test('should detect system dark mode preference', async ({ page }) => {
    // Clear localStorage to force system theme
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.removeItem('theme')
    })
    await page.reload()

    // Should respect system preference (dark)
    const theme = await getCurrentTheme(page)
    expect(theme).toBe('dark')
  })
})

test.describe('System Theme Detection - Light', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
    colorScheme: 'light', // Emulate light system preference
  })

  test('should detect system light mode preference', async ({ page }) => {
    // Clear localStorage to force system theme
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.removeItem('theme')
    })
    await page.reload()

    // Should respect system preference (light)
    const theme = await getCurrentTheme(page)
    expect(theme).toBe('light')
  })
})

// ======================
// Performance Tests
// ======================

test.describe('Theme System Performance', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
  })

  test('should switch themes quickly (< 500ms)', async ({ page }) => {
    await page.goto('/')

    const startTime = Date.now()
    await clickThemeToggle(page)
    const endTime = Date.now()

    const duration = endTime - startTime
    expect(duration).toBeLessThan(500)
  })

  test('should not cause layout shift when switching themes', async ({ page }) => {
    await page.goto('/')

    // Get initial layout metrics
    const initialMetrics = await page.evaluate(() => {
      const body = document.body
      return {
        width: body.offsetWidth,
        height: body.offsetHeight,
      }
    })

    // Toggle theme
    await clickThemeToggle(page)

    // Get new layout metrics
    const newMetrics = await page.evaluate(() => {
      const body = document.body
      return {
        width: body.offsetWidth,
        height: body.offsetHeight,
      }
    })

    // Layout should not change (allow 1px difference for rounding)
    expect(Math.abs(newMetrics.width - initialMetrics.width)).toBeLessThanOrEqual(1)
    expect(Math.abs(newMetrics.height - initialMetrics.height)).toBeLessThanOrEqual(1)
  })
})
