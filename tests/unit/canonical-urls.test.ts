/**
 * Canonical URL Validation Test
 *
 * Ensures all content (tips, guides, news) has valid canonical URLs
 * following the pattern: {BLOG_URL}/{tips,guides,news}/{slug}
 */

import { getAllPosts } from '@/lib/content/posts'
import { getAllGuides } from '@/lib/content/guides'
import { getAllNews } from '@/lib/content/news'
import { blogConfig } from '@/config'

// Extract base URL from config for consistent testing
const BASE_URL = blogConfig.site.url

// Helper to create URL regex pattern (escapes special regex characters)
const urlPattern = (path: string) =>
  new RegExp(`^${BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}${path}$`)

describe('Canonical URLs for Content', () => {
  describe('Tips/Posts Canonical URLs', () => {
    test('all posts should have canonical URLs starting with ${BASE_URL}/tips/', async () => {
      const posts = await getAllPosts()

      expect(posts.length).toBeGreaterThan(0)

      const invalidPosts: Array<{ slug: string; canonical: string }> = []

      posts.forEach((post) => {
        const canonical = post.metadata.canonical
        const expectedPattern = new RegExp(
          `^${BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/tips/.+`,
        )

        if (!expectedPattern.test(canonical)) {
          invalidPosts.push({
            slug: post.metadata.slug,
            canonical,
          })
        }
      })

      if (invalidPosts.length > 0) {
        const message = invalidPosts.map((p) => `  - ${p.slug}: "${p.canonical}"`).join('\n')
        throw new Error(`${invalidPosts.length} posts have invalid canonical URLs:\n${message}`)
      }
    })

    test('each post canonical should match pattern ${BASE_URL}/tips/{slug}', async () => {
      const posts = await getAllPosts()

      posts.forEach((post) => {
        expect(post.metadata.canonical).toMatch(urlPattern(`/tips/.+`))
        expect(post.metadata.canonical).toBe(`${BASE_URL}/tips/${post.metadata.slug}`)
      })
    })
  })

  describe('Guides Canonical URLs', () => {
    test('all guides should have canonical URLs starting with ${BASE_URL}/guides/', async () => {
      const guides = await getAllGuides()

      expect(guides.length).toBeGreaterThan(0)

      const invalidGuides: Array<{ slug: string; canonical: string }> = []

      guides.forEach((guide) => {
        const canonical = guide.metadata.canonical
        const expectedPattern = new RegExp(
          `^${BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/guides/.+`,
        )

        if (!expectedPattern.test(canonical)) {
          invalidGuides.push({
            slug: guide.metadata.slug,
            canonical,
          })
        }
      })

      if (invalidGuides.length > 0) {
        const message = invalidGuides.map((g) => `  - ${g.slug}: "${g.canonical}"`).join('\n')
        throw new Error(`${invalidGuides.length} guides have invalid canonical URLs:\n${message}`)
      }
    })

    test('each guide canonical should match pattern ${BASE_URL}/guides/{slug}', async () => {
      const guides = await getAllGuides()

      guides.forEach((guide) => {
        expect(guide.metadata.canonical).toMatch(urlPattern('/guides/.+'))
        expect(guide.metadata.canonical).toBe(`${BASE_URL}/guides/${guide.metadata.slug}`)
      })
    })
  })

  describe('News Canonical URLs', () => {
    test('all news articles should have canonical URLs starting with ${BASE_URL}/news/', async () => {
      const news = await getAllNews()

      expect(news.length).toBeGreaterThan(0)

      const invalidNews: Array<{ slug: string; canonical: string }> = []

      news.forEach((article) => {
        const canonical = article.metadata.canonical
        const expectedPattern = new RegExp(
          `^${BASE_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/news/.+`,
        )

        if (!expectedPattern.test(canonical)) {
          invalidNews.push({
            slug: article.metadata.slug,
            canonical,
          })
        }
      })

      if (invalidNews.length > 0) {
        const message = invalidNews.map((n) => `  - ${n.slug}: "${n.canonical}"`).join('\n')
        throw new Error(
          `${invalidNews.length} news articles have invalid canonical URLs:\n${message}`,
        )
      }
    })

    test('each news article canonical should match pattern ${BASE_URL}/news/{slug}', async () => {
      const news = await getAllNews()

      news.forEach((article) => {
        expect(article.metadata.canonical).toMatch(urlPattern('/news/.+'))
        expect(article.metadata.canonical).toBe(`${BASE_URL}/news/${article.metadata.slug}`)
      })
    })
  })

  describe('All Content Canonical URLs', () => {
    test('all content should use ${BASE_URL} domain', async () => {
      const posts = await getAllPosts()
      const guides = await getAllGuides()
      const news = await getAllNews()

      const allContent = [
        ...posts.map((p) => ({ type: 'post', ...p })),
        ...guides.map((g) => ({ type: 'guide', ...g })),
        ...news.map((n) => ({ type: 'news', ...n })),
      ]

      const invalidContent = allContent.filter(
        (item) => !item.metadata.canonical.startsWith(`${BASE_URL}/`),
      )

      if (invalidContent.length > 0) {
        const message = invalidContent
          .map((item) => `  - [${item.type}] ${item.metadata.slug}: "${item.metadata.canonical}"`)
          .join('\n')
        throw new Error(`${invalidContent.length} items have invalid domain:\n${message}`)
      }
    })

    test('canonical URLs should be properly formatted and contain no duplicates', async () => {
      const posts = await getAllPosts()
      const guides = await getAllGuides()
      const news = await getAllNews()

      const canonicalUrls = [
        ...posts.map((p) => p.metadata.canonical),
        ...guides.map((g) => g.metadata.canonical),
        ...news.map((n) => n.metadata.canonical),
      ]

      const duplicates = canonicalUrls.filter((url, index) => canonicalUrls.indexOf(url) !== index)

      if (duplicates.length > 0) {
        throw new Error(
          `Found ${duplicates.length} duplicate canonical URLs: ${[...new Set(duplicates)].join(', ')}`,
        )
      }
    })

    test('all canonical URLs should have https protocol', async () => {
      const posts = await getAllPosts()
      const guides = await getAllGuides()
      const news = await getAllNews()

      const allContent = [
        ...posts.map((p) => ({ type: 'post', canonical: p.metadata.canonical })),
        ...guides.map((g) => ({ type: 'guide', canonical: g.metadata.canonical })),
        ...news.map((n) => ({ type: 'news', canonical: n.metadata.canonical })),
      ]

      const nonHttps = allContent.filter((item) => !item.canonical.startsWith('https://'))

      if (nonHttps.length > 0) {
        const message = nonHttps.map((item) => `  - [${item.type}] "${item.canonical}"`).join('\n')
        throw new Error(`${nonHttps.length} canonical URLs are not HTTPS:\n${message}`)
      }
    })
  })
})
