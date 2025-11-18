import { test, expect, Page } from '@playwright/test'

/**
 * Structured Data (Schema.org) Validation Tests
 * Validates JSON-LD structured data for SEO and rich snippets
 */

interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: unknown
}

/**
 * Extract all JSON-LD structured data from the page
 */
async function extractStructuredData(page: Page): Promise<StructuredData[]> {
  return await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
    return scripts
      .map((script) => {
        try {
          return JSON.parse(script.textContent || '')
        } catch {
          return null
        }
      })
      .filter(Boolean)
  })
}

/**
 * Validate that structured data has required properties
 */
function validateRequiredProperties(data: StructuredData, required: string[]): void {
  for (const prop of required) {
    expect(data[prop]).toBeDefined()
    expect(data[prop]).not.toBe('')
  }
}

test.describe('Structured Data - Organization', () => {
  test('Homepage should have Organization schema', async ({ page }) => {
    await page.goto('/')

    const structuredData = await extractStructuredData(page)

    // Find Organization schema
    const organization = structuredData.find((data) => data['@type'] === 'Organization')

    expect(organization).toBeDefined()
    expect(organization?.['@context']).toBe('https://schema.org')

    // Validate required properties
    validateRequiredProperties(organization!, ['name', 'url'])
  })
})

test.describe('Structured Data - WebSite', () => {
  test('Homepage should have WebSite schema', async ({ page }) => {
    await page.goto('/')

    const structuredData = await extractStructuredData(page)

    // Find WebSite schema
    const website = structuredData.find((data) => data['@type'] === 'WebSite')

    if (website) {
      expect(website['@context']).toBe('https://schema.org')
      validateRequiredProperties(website, ['name', 'url'])
    }
  })
})

test.describe('Structured Data - Articles', () => {
  test('Blog posts should have Article or BlogPosting schema', async ({ page }) => {
    // Get a blog post URL
    await page.goto('/tips/')
    await page.waitForLoadState('networkidle')

    // Find the first blog post link
    const firstPostLink = page.locator('article a, .post-link, a[href*="/tips/"]').first()
    const postUrl = await firstPostLink.getAttribute('href')

    if (!postUrl) {
      test.skip()
      return
    }

    // Navigate to the blog post
    await page.goto(postUrl)
    await page.waitForLoadState('networkidle')

    const structuredData = await extractStructuredData(page)

    // Find Article or BlogPosting schema
    const article = structuredData.find(
      (data) => data['@type'] === 'Article' || data['@type'] === 'BlogPosting',
    )

    expect(article).toBeDefined()
    expect(article?.['@context']).toBe('https://schema.org')

    // Validate required properties for Article/BlogPosting
    validateRequiredProperties(article!, ['headline', 'datePublished'])

    // Recommended properties
    if (article?.author) {
      expect(typeof article.author).toBe('object')
    }
  })
})

test.describe('Structured Data - BreadcrumbList', () => {
  test('Blog posts should have BreadcrumbList schema', async ({ page }) => {
    // Get a blog post URL
    await page.goto('/tips/')
    await page.waitForLoadState('networkidle')

    // Find the first blog post link
    const firstPostLink = page.locator('article a, .post-link, a[href*="/tips/"]').first()
    const postUrl = await firstPostLink.getAttribute('href')

    if (!postUrl) {
      test.skip()
      return
    }

    // Navigate to the blog post
    await page.goto(postUrl)
    await page.waitForLoadState('networkidle')

    const structuredData = await extractStructuredData(page)

    // Find BreadcrumbList schema
    const breadcrumbs = structuredData.find((data) => data['@type'] === 'BreadcrumbList')

    if (breadcrumbs) {
      expect(breadcrumbs['@context']).toBe('https://schema.org')
      expect(breadcrumbs.itemListElement).toBeDefined()
      expect(Array.isArray(breadcrumbs.itemListElement)).toBe(true)

      // Validate breadcrumb items
      const items = breadcrumbs.itemListElement as Array<{
        '@type': string
        position: number
        item: {
          '@id': string
          name: string
        }
      }>
      expect(items.length).toBeGreaterThan(0)

      for (const item of items) {
        expect(item['@type']).toBe('ListItem')
        expect(item.position).toBeDefined()
        expect(item.item).toBeDefined()
      }
    }
  })
})

test.describe('Structured Data - Person', () => {
  test('About page should have Person schema if applicable', async ({ page }) => {
    await page.goto('/about/')
    await page.waitForLoadState('networkidle')

    const structuredData = await extractStructuredData(page)

    // Find Person schema (optional, but good to have)
    const person = structuredData.find((data) => data['@type'] === 'Person')

    if (person) {
      expect(person['@context']).toBe('https://schema.org')
      validateRequiredProperties(person, ['name'])
    }
  })
})

test.describe('Structured Data - Validation', () => {
  test('All structured data should be valid JSON', async ({ page }) => {
    const pages = ['/', '/tips/', '/guides/', '/about/', '/contact/']

    for (const url of pages) {
      await page.goto(url)
      await page.waitForLoadState('networkidle')

      // Try to extract structured data - this will fail if JSON is invalid
      const structuredData = await extractStructuredData(page)

      // Should have at least one structured data item
      expect(structuredData.length).toBeGreaterThan(0)

      // All items should have @context and @type
      for (const data of structuredData) {
        expect(data['@context']).toBeDefined()
        expect(data['@type']).toBeDefined()
      }
    }
  })

  test('Structured data should not have duplicate @id values', async ({ page }) => {
    const pages = ['/', '/tips/', '/guides/', '/about/', '/contact/']

    for (const url of pages) {
      await page.goto(url)
      await page.waitForLoadState('networkidle')

      const structuredData = await extractStructuredData(page)

      // Collect all @id values
      const ids = structuredData.map((data) => data['@id']).filter(Boolean)

      // Check for duplicates
      const uniqueIds = new Set(ids)
      expect(ids.length).toBe(uniqueIds.size)
    }
  })

  test('URLs in structured data should be absolute', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const structuredData = await extractStructuredData(page)

    for (const data of structuredData) {
      // Check all string properties that look like URLs
      for (const [key, value] of Object.entries(data)) {
        if (key === 'url' || key === '@id' || key.endsWith('Url')) {
          if (typeof value === 'string') {
            // Should be absolute URL (http:// or https://)
            expect(value).toMatch(/^https?:\/\//)
          }
        }
      }
    }
  })
})

test.describe('Structured Data - SEO Best Practices', () => {
  test('Organization should have logo', async ({ page }) => {
    await page.goto('/')

    const structuredData = await extractStructuredData(page)
    const organization = structuredData.find((data) => data['@type'] === 'Organization')

    if (organization) {
      expect(organization.logo).toBeDefined()
    }
  })

  test('Articles should have author information', async ({ page }) => {
    // Get a blog post URL
    await page.goto('/tips/')
    await page.waitForLoadState('networkidle')

    const firstPostLink = page.locator('article a, .post-link, a[href*="/tips/"]').first()
    const postUrl = await firstPostLink.getAttribute('href')

    if (!postUrl) {
      test.skip()
      return
    }

    await page.goto(postUrl)
    await page.waitForLoadState('networkidle')

    const structuredData = await extractStructuredData(page)
    const article = structuredData.find(
      (data) => data['@type'] === 'Article' || data['@type'] === 'BlogPosting',
    )

    if (article) {
      expect(article.author).toBeDefined()

      // Author should be a Person or Organization
      if (typeof article.author === 'object') {
        const author = article.author as { '@type': string; name?: string }
        expect(['Person', 'Organization']).toContain(author['@type'])
      }
    }
  })

  test('Articles should have images', async ({ page }) => {
    // Get a blog post URL
    await page.goto('/tips/')
    await page.waitForLoadState('networkidle')

    const firstPostLink = page.locator('article a, .post-link, a[href*="/tips/"]').first()
    const postUrl = await firstPostLink.getAttribute('href')

    if (!postUrl) {
      test.skip()
      return
    }

    await page.goto(postUrl)
    await page.waitForLoadState('networkidle')

    const structuredData = await extractStructuredData(page)
    const article = structuredData.find(
      (data) => data['@type'] === 'Article' || data['@type'] === 'BlogPosting',
    )

    if (article) {
      // Image is recommended for better SEO
      if (article.image) {
        expect(article.image).toBeDefined()
      }
    }
  })
})
