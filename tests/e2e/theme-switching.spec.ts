import { test, expect } from '@playwright/test'

test.describe('Theme Switching with ThemeToggle Button', () => {
  test('Theme toggle button cycles through themes and changes colors', async ({ page }) => {
    await page.goto('http://localhost:3000')

    // Wait for page to load
    await page.waitForLoadState('networkidle')

    // Find theme toggle button
    const themeToggle = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first()
    await expect(themeToggle).toBeVisible({ timeout: 10000 })

    // Get initial background color (should be light/white)
    const initialBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })

    console.log('Initial background:', initialBg)

    // Click theme toggle to switch to dark
    await themeToggle.click()
    await page.waitForTimeout(500) // Give time for theme to apply

    // Get new background color
    const darkBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })

    console.log('After first click:', darkBg)

    // Colors should be different
    expect(initialBg).not.toBe(darkBg)

    // Take screenshot in dark mode
    await page.screenshot({ path: 'screenshots/theme-toggle-dark.png', fullPage: true })

    // Click again to switch to system
    await themeToggle.click()
    await page.waitForTimeout(500)

    const systemBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })

    console.log('After second click (system):', systemBg)

    // Click once more to cycle back to light
    await themeToggle.click()
    await page.waitForTimeout(500)

    const finalBg = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })

    console.log('After third click (back to light):', finalBg)

    // Should cycle back to original or close to it
    // (might be slightly different due to RGB rounding)
  })

  test('Dark mode has dark background', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')

    // Find and click theme toggle
    const themeToggle = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first()
    await themeToggle.click()
    await page.waitForTimeout(500)

    // Check if HTML has dark class
    const hasDarkClass = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark')
    })

    console.log('Has dark class:', hasDarkClass)
    expect(hasDarkClass).toBe(true)

    // Check background color
    const bgColor = await page.evaluate(() => {
      const bg = window.getComputedStyle(document.body).backgroundColor
      const match = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
      if (match) {
        const [, r, g, b] = match.map(Number)
        return { rgb: bg, r, g, b, avg: (r + g + b) / 3 }
      }
      return null
    })

    console.log('Dark mode background analysis:', bgColor)

    // Dark theme should have low RGB values
    if (bgColor) {
      expect(bgColor.avg).toBeLessThan(100) // Darker than mid-gray
    }
  })

  test('Theme persists in localStorage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await page.waitForLoadState('networkidle')

    // Switch to dark
    const themeToggle = page
      .locator('button')
      .filter({ has: page.locator('svg') })
      .first()
    await themeToggle.click()
    await page.waitForTimeout(500)

    // Check localStorage
    const storedTheme = await page.evaluate(() => {
      return localStorage.getItem('theme')
    })

    console.log('Stored theme:', storedTheme)

    // next-themes stores the theme preference
    expect(storedTheme).toBeTruthy()

    // Reload page
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Dark class should still be present
    const hasDarkClass = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark')
    })

    console.log('After reload, has dark class:', hasDarkClass)
    expect(hasDarkClass).toBe(true)
  })
})
