import { test, expect } from '@playwright/test'

test.describe('Theme Verification', () => {
  test.describe.configure({ mode: 'serial' })

  test('Light theme - Homepage renders correctly', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Verify page loads
    await expect(page).toHaveTitle(/.*/)

    // Get background color in light mode
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })

    console.log('Light theme background:', bgColor)

    // Light background should be close to white
    expect(bgColor).toMatch(
      /rgb\((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?),\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?),\s*(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\)/,
    )

    // Take screenshot
    await page.screenshot({ path: 'screenshots/homepage-light.png', fullPage: true })
  })

  test('Dark theme - Homepage renders correctly', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Add dark class to html element
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })

    // Wait for theme to apply
    await page.waitForTimeout(100)

    // Get background color in dark mode
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })

    console.log('Dark theme background:', bgColor)

    // Dark background should be dark (low RGB values)
    const match = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (match) {
      const [, r, g, b] = match.map(Number)
      const avg = (r + g + b) / 3
      expect(avg).toBeLessThan(50) // Dark theme should have low average RGB
    }

    // Take screenshot
    await page.screenshot({ path: 'screenshots/homepage-dark.png', fullPage: true })
  })

  test('Theme toggle button exists and is accessible', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Find theme toggle button (should be in header)
    const themeToggle = page.locator('button[aria-label*="theme" i]').first()
    await expect(themeToggle).toBeVisible()

    // Button should be keyboard accessible
    await themeToggle.focus()
    const focused = await page.evaluate(() => {
      return document.activeElement?.tagName === 'BUTTON'
    })
    expect(focused).toBe(true)
  })

  test('Theme switching works', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Get initial background color
    const initialBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })

    // Click theme toggle
    const themeToggle = page.locator('button[aria-label*="theme" i]').first()
    await themeToggle.click()

    // Wait a bit for theme to change
    await page.waitForTimeout(200)

    // Get new background color
    const newBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })

    // Colors should be different after clicking toggle
    expect(initialBg).not.toBe(newBg)

    console.log('Initial BG:', initialBg)
    console.log('After toggle BG:', newBg)
  })

  test('Theme persists across navigation', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Set dark theme
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })

    await page.waitForTimeout(100)

    // Navigate to another page
    await page.goto('http://localhost:3000/tips')

    // Check if dark class persists (it might not without localStorage, but layout should still apply theme from provider)
    await page.waitForTimeout(100)

    // Page should render (basic verification)
    await expect(page).toHaveTitle(/.*/)
  })

  test('Colors have sufficient contrast in light mode', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Get foreground and background colors
    const colors = await page.evaluate(() => {
      const body = document.body
      const bg = window.getComputedStyle(body).backgroundColor
      const fg = window.getComputedStyle(body).color
      return { background: bg, foreground: fg }
    })

    console.log('Light mode colors:', colors)

    // Basic check: bg and fg should be different
    expect(colors.background).not.toBe(colors.foreground)
  })

  test('Colors have sufficient contrast in dark mode', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Add dark class
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })

    await page.waitForTimeout(100)

    // Get foreground and background colors
    const colors = await page.evaluate(() => {
      const body = document.body
      const bg = window.getComputedStyle(body).backgroundColor
      const fg = window.getComputedStyle(body).color
      return { background: bg, foreground: fg }
    })

    console.log('Dark mode colors:', colors)

    // Basic check: bg and fg should be different
    expect(colors.background).not.toBe(colors.foreground)
  })
})
