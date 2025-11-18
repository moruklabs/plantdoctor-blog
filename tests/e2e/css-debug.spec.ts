import { test } from '@playwright/test'

test('Debug CSS variables and dark mode', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await page.waitForLoadState('networkidle')

  // Check initial CSS state
  const initialState = await page.evaluate(() => {
    const root = document.documentElement
    const body = document.body

    return {
      rootClasses: root.className,
      bodyClasses: body.className,
      rootStyles: {
        background: getComputedStyle(root).getPropertyValue('--background').trim(),
        foreground: getComputedStyle(root).getPropertyValue('--foreground').trim(),
      },
      bodyStyles: {
        backgroundColor: getComputedStyle(body).backgroundColor,
        color: getComputedStyle(body).color,
      },
    }
  })

  console.log('=== INITIAL (Light) ===')
  console.log(JSON.stringify(initialState, null, 2))

  // Click theme toggle
  const themeToggle = page
    .locator('button')
    .filter({ has: page.locator('svg') })
    .first()
  await themeToggle.click()
  await page.waitForTimeout(500)

  // Check CSS state after switching to dark
  const darkState = await page.evaluate(() => {
    const root = document.documentElement
    const body = document.body

    return {
      rootClasses: root.className,
      bodyClasses: body.className,
      rootStyles: {
        background: getComputedStyle(root).getPropertyValue('--background').trim(),
        foreground: getComputedStyle(root).getPropertyValue('--foreground').trim(),
      },
      bodyStyles: {
        backgroundColor: getComputedStyle(body).backgroundColor,
        color: getComputedStyle(body).color,
      },
      // Check if dark class CSS rules exist
      darkRuleExists: Array.from(document.styleSheets).some((sheet) => {
        try {
          return Array.from(sheet.cssRules || []).some((rule) => rule.cssText?.includes('.dark'))
        } catch {
          return false
        }
      }),
    }
  })

  console.log('\n=== AFTER CLICK (Dark) ===')
  console.log(JSON.stringify(darkState, null, 2))
})
