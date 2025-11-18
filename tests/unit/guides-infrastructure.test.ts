import fs from 'fs'
import path from 'path'
import { getAllSlugsFromGuidesDir, getGuideBySlug, getAllGuides } from '@/lib/content/guides'

describe('Guides Infrastructure', () => {
  const guidesDirectory = path.join(process.cwd(), 'content/guides')

  beforeAll(() => {
    // Ensure guides directory exists for testing
    if (!fs.existsSync(guidesDirectory)) {
      fs.mkdirSync(guidesDirectory, { recursive: true })
    }
  })

  describe('getAllSlugsFromGuidesDir', () => {
    it('should return an array of guide slugs', () => {
      const slugs = getAllSlugsFromGuidesDir()
      expect(Array.isArray(slugs)).toBe(true)
      slugs.forEach((item) => {
        expect(item).toHaveProperty('slug')
        expect(typeof item.slug).toBe('string')
      })
    })

    it('should only include .mdx files', () => {
      const slugs = getAllSlugsFromGuidesDir()
      slugs.forEach((item) => {
        const filePath = path.join(guidesDirectory, `${item.slug}.mdx`)
        expect(fs.existsSync(filePath)).toBe(true)
      })
    })
  })

  describe('getGuideBySlug', () => {
    it('should return guide with correct structure', async () => {
      const slugs = getAllSlugsFromGuidesDir()
      if (slugs.length === 0) {
        // console.warn('No guides found for testing')
        return
      }

      const guide = await getGuideBySlug(slugs[0].slug)

      // Check guide structure
      expect(guide).toHaveProperty('metadata')
      expect(guide).toHaveProperty('content')
      expect(guide).toHaveProperty('html')
      expect(guide).toHaveProperty('excerpt')

      // Check metadata structure
      expect(guide.metadata).toHaveProperty('slug')
      expect(guide.metadata).toHaveProperty('title')
      expect(guide.metadata).toHaveProperty('tags')
      expect(guide.metadata).toHaveProperty('date')
      expect(guide.metadata).toHaveProperty('canonical')
      expect(guide.metadata).toHaveProperty('structuredData')

      // Verify content types
      expect(typeof guide.content).toBe('string')
      expect(typeof guide.html).toBe('string')
      expect(typeof guide.excerpt).toBe('string')
    })

    it('should have canonical URL starting with /guides/', async () => {
      const slugs = getAllSlugsFromGuidesDir()
      if (slugs.length === 0) return

      const guide = await getGuideBySlug(slugs[0].slug)
      expect(guide.metadata.canonical).toMatch(/^https:\/\/news.plantdoctor.app\/guides\//)
    })

    it('should have structured data with Article type', async () => {
      const slugs = getAllSlugsFromGuidesDir()
      if (slugs.length === 0) return

      const guide = await getGuideBySlug(slugs[0].slug)

      // Check if structured data has Article type
      // Some guides may use @graph for multiple schemas
      const structuredData = guide.metadata.structuredData as Record<string, unknown> | undefined
      if (structuredData?.['@graph']) {
        expect(structuredData).toHaveProperty('@graph')
        const graph = structuredData['@graph'] as Array<{ '@type': string }>
        const articleSchema = graph.find((item) => item['@type'] === 'Article')
        expect(articleSchema).toBeDefined()
      } else if (structuredData) {
        expect(structuredData).toHaveProperty('@type')
        expect(structuredData['@type']).toBe('Article')
      }
    })
  })

  describe('getAllGuides', () => {
    it('should return an array of guides', async () => {
      const guides = await getAllGuides()
      expect(Array.isArray(guides)).toBe(true)
    })

    it('should filter out draft guides', async () => {
      const guides = await getAllGuides()
      guides.forEach((guide) => {
        expect(guide.metadata.draft).toBe(false)
      })
    })

    it('should filter out future-dated guides', async () => {
      const guides = await getAllGuides()
      const today = new Date()
      today.setUTCHours(0, 0, 0, 0)

      guides.forEach((guide) => {
        const guideDate = new Date(guide.metadata.date)
        guideDate.setUTCHours(0, 0, 0, 0)
        expect(guideDate.getTime()).toBeLessThanOrEqual(today.getTime())
      })
    })

    it('should sort guides by date (newest first)', async () => {
      const guides = await getAllGuides()
      if (guides.length < 2) return

      for (let i = 0; i < guides.length - 1; i++) {
        const currentDate = new Date(guides[i].metadata.date).getTime()
        const nextDate = new Date(guides[i + 1].metadata.date).getTime()
        expect(currentDate).toBeGreaterThanOrEqual(nextDate)
      }
    })
  })
})
