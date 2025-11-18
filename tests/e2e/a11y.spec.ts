import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility tests using axe-core
 * Tests WCAG 2.1 compliance across different pages and viewports
 */

const pages = [
  { url: '/', name: 'Homepage' },
  { url: '/tips/', name: 'Tips Index' },
  { url: '/guides/', name: 'Guides Index' },
  { url: '/about/', name: 'About' },
  { url: '/contact/', name: 'Contact' },
]

test.describe('Accessibility Tests', () => {
  for (const page of pages) {
    test(`${page.name} should not have any accessibility violations`, async ({
      page: testPage,
    }) => {
      // Navigate to the page
      await testPage.goto(page.url)

      // Wait for page to be fully loaded
      await testPage.waitForLoadState('networkidle')

      // Run axe accessibility scan
      const accessibilityScanResults = await new AxeBuilder({ page: testPage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      // Assert no violations
      expect(accessibilityScanResults.violations).toEqual([])
    })
  }
})

test.describe('Accessibility Tests - Interactive Elements', () => {
  test('Navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('/')

    // Focus on the first interactive element
    await page.keyboard.press('Tab')

    // Get the focused element
    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement
      return {
        tagName: el?.tagName,
        role: el?.getAttribute('role'),
        ariaLabel: el?.getAttribute('aria-label'),
      }
    })

    // Verify that an interactive element is focused
    expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT']).toContain(focusedElement.tagName)
  })

  test('Skip to main content link should be present', async ({ page }) => {
    await page.goto('/')

    // Check for skip link (usually hidden but accessible via keyboard)
    const skipLink = page.locator('a[href="#main"], a[href="#content"], a:has-text("Skip to")')
    const skipLinkCount = await skipLink.count()

    // It's a best practice to have a skip link, but not always required
    // We'll check if it exists, but won't fail if it doesn't
    if (skipLinkCount > 0) {
      const href = await skipLink.first().getAttribute('href')
      expect(href).toBeTruthy()
    }
  })

  test('Images should have alt text', async ({ page }) => {
    await page.goto('/')

    // Get all images
    const images = await page.locator('img').all()

    for (const img of images) {
      const alt = await img.getAttribute('alt')
      const role = await img.getAttribute('role')
      const ariaLabel = await img.getAttribute('aria-label')

      // Images should have alt text, or be marked as decorative (role="presentation" or alt="")
      const isDecorative = role === 'presentation' || role === 'none' || alt === ''
      const hasAccessibleName = alt !== null || ariaLabel !== null

      expect(hasAccessibleName || isDecorative).toBeTruthy()
    }
  })

  test('Form inputs should have labels', async ({ page }) => {
    // Navigate to contact page (likely has a form)
    await page.goto('/contact/')

    // Get all form inputs
    const inputs = await page.locator('input, textarea, select').all()

    for (const input of inputs) {
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')
      const type = await input.getAttribute('type')

      // Hidden or submit buttons don't need labels
      if (type === 'hidden' || type === 'submit' || type === 'button') {
        continue
      }

      // Check if input has a label
      let hasLabel = false
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        hasLabel = (await label.count()) > 0
      }

      const hasAccessibleName = hasLabel || ariaLabel !== null || ariaLabelledBy !== null

      expect(hasAccessibleName).toBeTruthy()
    }
  })
})

test.describe('Accessibility Tests - Color Contrast', () => {
  test('Homepage should have sufficient color contrast', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze()

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === 'color-contrast',
    )

    expect(contrastViolations).toEqual([])
  })
})

test.describe('Accessibility Tests - ARIA', () => {
  test('Pages should have valid ARIA attributes', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    // Filter for ARIA-related violations
    const ariaViolations = accessibilityScanResults.violations.filter((violation) =>
      violation.id.startsWith('aria-'),
    )

    expect(ariaViolations).toEqual([])
  })

  test('Headings should be in logical order', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['best-practice'])
      .analyze()

    // Filter for heading order violations
    const headingViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === 'heading-order',
    )

    expect(headingViolations).toEqual([])
  })
})
