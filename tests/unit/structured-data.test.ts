/**
 * Unit tests for createStructuredData in content-utils.ts
 *
 * Covers the Article/BlogPosting schema fields added for SEO:
 * - image (ImageObject with fallback to getBlogImage placeholder)
 * - keywords from post tags
 * - url field
 * - description fallback chain (meta_desc → description)
 */
import { createStructuredData } from '@/lib/content/content-utils'
import type { ContentTypeConfig } from '@/lib/content/content-utils'

const postsConfig: ContentTypeConfig = {
  directory: 'content/posts',
  pathPrefix: 'tips',
  schemaType: 'BlogPosting',
}

const baseFrontmatter = {
  title: 'How to Fix Basil Cold Damage',
  meta_desc: 'Step-by-step guide for basil cold damage',
  description: 'Learn how to rescue basil plants',
  tags: ['basil', 'cold damage', 'plant care'],
  date: '2024-01-15',
  canonical: 'https://blog.plantdoctor.app/tips/basil-cold-damage',
}

describe('createStructuredData - Article schema fields', () => {
  describe('image field', () => {
    it('should include coverImage when set', () => {
      const result = createStructuredData(
        postsConfig,
        { ...baseFrontmatter, coverImage: 'https://example.com/cover.jpg' },
        'basil-cold-damage',
      )
      expect(result.image).toEqual({
        '@type': 'ImageObject',
        url: 'https://example.com/cover.jpg',
        width: 1200,
        height: 630,
      })
    })

    it('should fall back to ogImage when coverImage is not set', () => {
      const result = createStructuredData(
        postsConfig,
        { ...baseFrontmatter, ogImage: 'https://example.com/og.jpg' },
        'basil-cold-damage',
      )
      expect(result.image).toMatchObject({
        '@type': 'ImageObject',
        url: 'https://example.com/og.jpg',
      })
    })

    it('should fall back to getBlogImage placeholder when no image is set', () => {
      const result = createStructuredData(postsConfig, baseFrontmatter, 'basil-cold-damage')
      expect(result.image).toMatchObject({
        '@type': 'ImageObject',
        url: expect.stringContaining('basil'),
        width: 1200,
        height: 630,
      })
    })

    it('should not include image when no image fields and no slug provided', () => {
      const result = createStructuredData(postsConfig, baseFrontmatter)
      expect(result.image).toBeUndefined()
    })

    it('should not include image when slug is empty string', () => {
      const result = createStructuredData(postsConfig, baseFrontmatter, '')
      expect(result.image).toBeUndefined()
    })

    it('should not include image when slug is whitespace only', () => {
      const result = createStructuredData(postsConfig, baseFrontmatter, '   ')
      expect(result.image).toBeUndefined()
    })
  })

  describe('keywords field', () => {
    it('should join tags as comma-separated keywords', () => {
      const result = createStructuredData(postsConfig, baseFrontmatter, 'basil-cold-damage')
      expect(result.keywords).toBe('basil, cold damage, plant care')
    })

    it('should omit keywords when tags array is empty', () => {
      const result = createStructuredData(postsConfig, { ...baseFrontmatter, tags: [] })
      expect(result.keywords).toBeUndefined()
    })
  })

  describe('description fallback', () => {
    it('should use meta_desc as primary description', () => {
      const result = createStructuredData(
        postsConfig,
        { ...baseFrontmatter, meta_desc: 'Primary SEO description', description: 'Secondary' },
        'test-slug',
      )
      expect(result.description).toBe('Primary SEO description')
    })

    it('should fall back to description when meta_desc is empty', () => {
      const result = createStructuredData(
        postsConfig,
        { ...baseFrontmatter, meta_desc: '', description: 'Fallback description' },
        'test-slug',
      )
      expect(result.description).toBe('Fallback description')
    })

    it('should use empty string when both meta_desc and description are empty', () => {
      const result = createStructuredData(
        postsConfig,
        { ...baseFrontmatter, meta_desc: '', description: '' },
        'test-slug',
      )
      expect(result.description).toBe('')
    })
  })

  describe('url field', () => {
    it('should include url equal to canonical URL', () => {
      const result = createStructuredData(postsConfig, baseFrontmatter, 'basil-cold-damage')
      expect(result.url).toBe('https://blog.plantdoctor.app/tips/basil-cold-damage')
    })
  })

  describe('required schema fields', () => {
    it('should always include @context, @type, headline, datePublished, author, publisher', () => {
      const result = createStructuredData(postsConfig, baseFrontmatter, 'basil-cold-damage')
      expect(result['@context']).toBe('https://schema.org')
      expect(result['@type']).toBe('BlogPosting')
      expect(result.headline).toBe(baseFrontmatter.title)
      expect(result.datePublished).toBe(baseFrontmatter.date)
      expect(result.author).toBeDefined()
      expect(result.publisher).toBeDefined()
      expect(result.mainEntityOfPage).toBeDefined()
    })
  })
})
