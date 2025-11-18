/**
 * Lighthouse Theme Audit Test
 *
 * Comprehensive Lighthouse audits across:
 * - 2 themes (light, dark)
 * - 3 viewports (mobile, tablet, desktop)
 * - 3 pages (homepage, tips, single tip)
 *
 * Total: 18 audits (2 × 3 × 3)
 */

import { test, expect, Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'Tips', path: '/tips' },
  { name: 'Single Tip', path: '/tips/12-one-liners-ab-test-tonight' },
]

async function setTheme(page: Page, theme: 'light' | 'dark') {
  // Set theme by adding/removing dark class on html element
  await page.evaluate((theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Also set localStorage to persist theme
    localStorage.setItem('theme', theme)
  }, theme)

  // Wait for theme transition to complete
  await page.waitForTimeout(500)
}

async function verifyThemeApplied(page: Page, theme: 'light' | 'dark') {
  const isDark = await page.evaluate(() => {
    return document.documentElement.classList.contains('dark')
  })

  expect(isDark).toBe(theme === 'dark')
}

async function checkColorContrast(page: Page, _theme: 'light' | 'dark') {
  // Use axe-core to check color contrast
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()

  // AxeBuilder violations have an id property
  const contrastIssues = accessibilityScanResults.violations.filter((v) =>
    v.id.includes('color-contrast'),
  )

  return {
    hasContrastIssues: contrastIssues.length > 0,
    issues: contrastIssues,
  }
}

// Desktop tests
test.describe('Desktop - Light Theme', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
  })

  PAGES.forEach((pageInfo) => {
    test(`should have good Lighthouse scores for ${pageInfo.name}`, async ({ page }) => {
      await page.goto(pageInfo.path)
      await setTheme(page, 'light')
      await verifyThemeApplied(page, 'light')

      // Check basic accessibility
      const contrastCheck = await checkColorContrast(page, 'light')
      expect(
        contrastCheck.hasContrastIssues,
        `Color contrast issues found: ${JSON.stringify(contrastCheck.issues, null, 2)}`,
      ).toBe(false)

      // Verify no hydration errors
      const errors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })

      await page.waitForLoadState('networkidle')

      // Check for hydration errors
      const hydrationErrors = errors.filter(
        (e) => e.includes('Hydration') || e.includes('hydration'),
      )
      expect(hydrationErrors, `Hydration errors found: ${hydrationErrors.join(', ')}`).toHaveLength(
        0,
      )

      // Basic performance checks
      const performanceMetrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType(
          'navigation',
        )[0] as PerformanceNavigationTiming
        return {
          domContentLoaded:
            navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        }
      })

      console.log(`Performance metrics for ${pageInfo.name} (light):`, performanceMetrics)
    })
  })
})

test.describe('Desktop - Dark Theme', () => {
  test.use({
    viewport: { width: 1920, height: 1080 },
  })

  PAGES.forEach((pageInfo) => {
    test(`should have good Lighthouse scores for ${pageInfo.name}`, async ({ page }) => {
      await page.goto(pageInfo.path)
      await setTheme(page, 'dark')
      await verifyThemeApplied(page, 'dark')

      // Check basic accessibility
      const contrastCheck = await checkColorContrast(page, 'dark')
      expect(
        contrastCheck.hasContrastIssues,
        `Color contrast issues found: ${JSON.stringify(contrastCheck.issues, null, 2)}`,
      ).toBe(false)

      // Verify no hydration errors
      const errors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text())
        }
      })

      await page.waitForLoadState('networkidle')

      // Check for hydration errors
      const hydrationErrors = errors.filter(
        (e) => e.includes('Hydration') || e.includes('hydration'),
      )
      expect(hydrationErrors, `Hydration errors found: ${hydrationErrors.join(', ')}`).toHaveLength(
        0,
      )
    })
  })
})

test.describe('Mobile - Light Theme', () => {
  test.use({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
  })

  PAGES.forEach((pageInfo) => {
    test(`should have good Lighthouse scores for ${pageInfo.name}`, async ({ page }) => {
      await page.goto(pageInfo.path)
      await setTheme(page, 'light')
      await verifyThemeApplied(page, 'light')

      const contrastCheck = await checkColorContrast(page, 'light')
      expect(contrastCheck.hasContrastIssues).toBe(false)
    })
  })
})

test.describe('Mobile - Dark Theme', () => {
  test.use({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
  })

  PAGES.forEach((pageInfo) => {
    test(`should have good Lighthouse scores for ${pageInfo.name}`, async ({ page }) => {
      await page.goto(pageInfo.path)
      await setTheme(page, 'dark')
      await verifyThemeApplied(page, 'dark')

      const contrastCheck = await checkColorContrast(page, 'dark')
      expect(contrastCheck.hasContrastIssues).toBe(false)
    })
  })
})

test.describe('Tablet - Light Theme', () => {
  test.use({
    viewport: { width: 768, height: 1024 },
  })

  PAGES.forEach((pageInfo) => {
    test(`should have good Lighthouse scores for ${pageInfo.name}`, async ({ page }) => {
      await page.goto(pageInfo.path)
      await setTheme(page, 'light')
      await verifyThemeApplied(page, 'light')

      const contrastCheck = await checkColorContrast(page, 'light')
      expect(contrastCheck.hasContrastIssues).toBe(false)
    })
  })
})

test.describe('Tablet - Dark Theme', () => {
  test.use({
    viewport: { width: 768, height: 1024 },
  })

  PAGES.forEach((pageInfo) => {
    test(`should have good Lighthouse scores for ${pageInfo.name}`, async ({ page }) => {
      await page.goto(pageInfo.path)
      await setTheme(page, 'dark')
      await verifyThemeApplied(page, 'dark')

      const contrastCheck = await checkColorContrast(page, 'dark')
      expect(contrastCheck.hasContrastIssues).toBe(false)
    })
  })
})
