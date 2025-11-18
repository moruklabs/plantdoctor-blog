import { test } from '@playwright/test'

test('Debug theme system', async ({ page }) => {
  const messages: string[] = []
  const errors: string[] = []

  // Capture console messages
  page.on('console', (msg) => {
    const text = `[${msg.type()}] ${msg.text()}`
    messages.push(text)
    console.log(text)
  })

  // Capture errors
  page.on('pageerror', (err) => {
    const text = `[PAGE ERROR] ${err.message}`
    errors.push(text)
    console.log(text)
  })

  await page.goto('http://localhost:3000')
  await page.waitForLoadState('networkidle')

  // Check React context
  const themeContext = await page.evaluate(() => {
    // Check if next-themes is working
    const html = document.documentElement
    const bodyClasses = document.body.className
    const htmlClasses = html.className

    return {
      htmlClasses,
      bodyClasses,
      localStorage: {
        theme: localStorage.getItem('theme'),
        allKeys: Object.keys(localStorage),
      },
      themeToggleExists: !!document.querySelector('button[aria-label*="theme" i]'),
      themeProviderScript:
        !!document.querySelector('script[data-next-themes]') ||
        !!document.querySelector('script:not([src])')?.textContent?.includes('theme'),
    }
  })

  console.log('Theme Context:', JSON.stringify(themeContext, null, 2))

  // Click theme toggle
  const themeToggle = page
    .locator('button')
    .filter({ has: page.locator('svg') })
    .first()

  if ((await themeToggle.count()) > 0) {
    console.log('Found theme toggle button')
    await themeToggle.click()
    await page.waitForTimeout(1000)

    const afterClick = await page.evaluate(() => {
      return {
        htmlClasses: document.documentElement.className,
        bodyClasses: document.body.className,
        theme: localStorage.getItem('theme'),
        computedBg: window.getComputedStyle(document.body).backgroundColor,
        cssVarBackground: getComputedStyle(document.documentElement).getPropertyValue(
          '--background',
        ),
      }
    })

    console.log('After click:', JSON.stringify(afterClick, null, 2))
  } else {
    console.log('Theme toggle button NOT FOUND')
  }

  console.log('\n=== Console Messages ===')
  messages.forEach((msg) => console.log(msg))

  console.log('\n=== Errors ===')
  errors.forEach((err) => console.log(err))
})
