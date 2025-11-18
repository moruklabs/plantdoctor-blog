import { test, expect } from '@playwright/test'

const CORE_PATHS = [
  '/', // homepage
  '/tips', // tips landing
  '/guides', // guides landing
]

test.describe('Console errors on core pages', () => {
  test.describe.configure({ mode: 'parallel' })

  CORE_PATHS.forEach((path) => {
    test(`no console errors on ${path}`, async ({ page }) => {
      const errors: string[] = []

      page.on('console', (msg) => {
        if (msg.type() === 'error') errors.push(`[console] ${msg.text()}`)
      })
      page.on('pageerror', (err) => {
        // Ignore Turnstile configuration errors (environment variable setup issue)
        if (err.message?.includes('[Cloudflare Turnstile]') && err.message?.includes('sitekey')) {
          return
        }
        errors.push(`[pageerror] ${err.message}`)
      })

      // Navigate and wait for load
      await page.goto(path, { waitUntil: 'load', timeout: 15000 })

      // small wait to allow async client-side logs to arrive
      await page.waitForTimeout(250)

      expect(errors, `Console errors detected on ${path}:\n  - ${errors.join('\n  - ')}`).toEqual(
        [],
      )
    })
  })
})
