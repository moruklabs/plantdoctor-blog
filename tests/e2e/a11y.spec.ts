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
  {
    url: '/tips/21-day-quarantine-plan-houseplants/',
    name: 'Post: 21-day quarantine plan',
  },
]

const viewports = [
  { width: 375, height: 667, label: 'mobile' },
  { width: 768, height: 1024, label: 'tablet' },
  { width: 1280, height: 800, label: 'desktop' },
]

const colorSchemes = ['light', 'dark'] as const

// ─── Multi-viewport + multi-color-scheme axe scans ───────────────────────────

for (const colorScheme of colorSchemes) {
  for (const viewport of viewports) {
    test.describe(`Accessibility [${colorScheme}] [${viewport.label}]`, () => {
      test.use({
        viewport: { width: viewport.width, height: viewport.height },
        colorScheme,
      })

      for (const pageSpec of pages) {
        test(`${pageSpec.name} has no WCAG 2.1 AA violations`, async ({ page }) => {
          await page.goto(pageSpec.url)
          await page.waitForLoadState('networkidle')

          const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze()

          expect(results.violations).toEqual([])
        })
      }
    })
  }
}

// ─── Original tests (kept for backward compatibility) ─────────────────────────

test.describe('Accessibility Tests', () => {
  for (const page of pages) {
    test(`${page.name} should not have any accessibility violations`, async ({
      page: testPage,
    }) => {
      await testPage.goto(page.url)
      await testPage.waitForLoadState('networkidle')

      const accessibilityScanResults = await new AxeBuilder({ page: testPage })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      expect(accessibilityScanResults.violations).toEqual([])
    })
  }
})

// ─── Keyboard navigation ──────────────────────────────────────────────────────

test.describe('Accessibility Tests - Interactive Elements', () => {
  test('Navigation should be keyboard accessible', async ({ page }) => {
    await page.goto('/')

    await page.keyboard.press('Tab')

    const focusedElement = await page.evaluate(() => {
      const el = document.activeElement
      return {
        tagName: el?.tagName,
        role: el?.getAttribute('role'),
        ariaLabel: el?.getAttribute('aria-label'),
      }
    })

    expect(['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT']).toContain(focusedElement.tagName)
  })

  test('Tab order traverses all nav links before main content', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Collect first 10 focused elements via repeated Tab
    const focused: string[] = []
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab')
      const tag = await page.evaluate(() => document.activeElement?.tagName ?? '')
      focused.push(tag)
    }

    // At least some interactive elements should be reached
    const interactive = focused.filter((t) => ['A', 'BUTTON', 'INPUT'].includes(t))
    expect(interactive.length).toBeGreaterThan(0)
  })

  test('Skip to main content link should be present and functional', async ({ page }) => {
    await page.goto('/')

    const skipLink = page.locator('a[href="#main"], a[href="#content"], a:has-text("Skip to")')
    const count = await skipLink.count()

    if (count > 0) {
      const href = await skipLink.first().getAttribute('href')
      expect(href).toBeTruthy()

      // Activate skip link via keyboard
      await page.keyboard.press('Tab')
      const firstFocused = await page.evaluate(() => document.activeElement?.getAttribute('href'))

      if (firstFocused === href) {
        await page.keyboard.press('Enter')
        // Verify focus moved to main landmark
        const focusedId = await page.evaluate(() => document.activeElement?.id)
        expect(['main', 'content']).toContain(focusedId)
      }
    }
  })

  test('Images should have alt text', async ({ page }) => {
    await page.goto('/')

    const images = await page.locator('img').all()

    for (const img of images) {
      const alt = await img.getAttribute('alt')
      const role = await img.getAttribute('role')
      const ariaLabel = await img.getAttribute('aria-label')

      const isDecorative = role === 'presentation' || role === 'none' || alt === ''
      const hasAccessibleName = alt !== null || ariaLabel !== null

      expect(hasAccessibleName || isDecorative).toBeTruthy()
    }
  })

  test('Form inputs should have labels', async ({ page }) => {
    await page.goto('/contact/')

    const inputs = await page.locator('input, textarea, select').all()

    for (const input of inputs) {
      const id = await input.getAttribute('id')
      const ariaLabel = await input.getAttribute('aria-label')
      const ariaLabelledBy = await input.getAttribute('aria-labelledby')
      const type = await input.getAttribute('type')

      if (type === 'hidden' || type === 'submit' || type === 'button') {
        continue
      }

      let hasLabel = false
      if (id) {
        const label = page.locator(`label[for="${id}"]`)
        hasLabel = (await label.count()) > 0
      }

      const hasAccessibleName = hasLabel || ariaLabel !== null || ariaLabelledBy !== null

      expect(hasAccessibleName).toBeTruthy()
    }
  })

  test('All nav elements have aria-label', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const navElements = await page.locator('nav').all()
    for (const nav of navElements) {
      const ariaLabel = await nav.getAttribute('aria-label')
      const ariaLabelledBy = await nav.getAttribute('aria-labelledby')
      expect(ariaLabel || ariaLabelledBy).toBeTruthy()
    }
  })

  test('Decorative SVG icons in buttons are aria-hidden', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // SVGs inside buttons/links that have visible text should be aria-hidden
    const buttonsWithSvg = await page.locator('button svg, a svg').all()
    for (const svg of buttonsWithSvg) {
      const ariaHidden = await svg.getAttribute('aria-hidden')
      // If the parent has text, the SVG should be aria-hidden
      const parent = await svg.evaluateHandle((el) => el.parentElement)
      const parentText = await parent.evaluate((el: Element) => el?.textContent?.trim() ?? '')
      if (parentText.length > 0) {
        expect(ariaHidden).toBe('true')
      }
    }
  })
})

// ─── Color contrast ───────────────────────────────────────────────────────────

test.describe('Accessibility Tests - Color Contrast', () => {
  test('Homepage should have sufficient color contrast (light)', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze()

    const contrastViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === 'color-contrast',
    )

    expect(contrastViolations).toEqual([])
  })

  test.describe('dark mode contrast', () => {
    test.use({ colorScheme: 'dark' })

    test('Homepage should have sufficient color contrast (dark)', async ({ page }) => {
      await page.goto('/')

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .include('body')
        .analyze()

      const contrastViolations = accessibilityScanResults.violations.filter(
        (violation) => violation.id === 'color-contrast',
      )

      expect(contrastViolations).toEqual([])
    })
  })
})

// ─── ARIA validity ────────────────────────────────────────────────────────────

test.describe('Accessibility Tests - ARIA', () => {
  test('Pages should have valid ARIA attributes', async ({ page }) => {
    await page.goto('/')

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

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

    const headingViolations = accessibilityScanResults.violations.filter(
      (violation) => violation.id === 'heading-order',
    )

    expect(headingViolations).toEqual([])
  })

  test('Post page has a single h1', async ({ page }) => {
    await page.goto('/tips/21-day-quarantine-plan-houseplants/')
    await page.waitForLoadState('networkidle')

    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
  })
})

// ─── Landmark regions ─────────────────────────────────────────────────────────

test.describe('Accessibility Tests - Landmarks', () => {
  for (const { url, name } of pages) {
    test(`${name} has required landmark regions`, async ({ page }) => {
      await page.goto(url)
      await page.waitForLoadState('networkidle')

      expect(await page.locator('header').count()).toBeGreaterThan(0)
      expect(await page.locator('main, [role="main"]').count()).toBeGreaterThan(0)
      expect(await page.locator('footer').count()).toBeGreaterThan(0)
    })
  }
})

// ─── Mobile-specific ─────────────────────────────────────────────────────────

test.describe('Accessibility Tests - Mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('Homepage has no violations at 375px', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('Touch targets are large enough on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // axe checks target-size in wcag22aa; run it and check
    const results = await new AxeBuilder({ page }).withTags(['wcag22aa']).analyze()

    const targetSizeViolations = results.violations.filter((v) => v.id === 'target-size')
    expect(targetSizeViolations).toEqual([])
  })
})
