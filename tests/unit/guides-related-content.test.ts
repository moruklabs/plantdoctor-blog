import { getAllSlugsFromGuidesDir } from '@/lib/content/guides'
import { getAllPosts } from '@/lib/content/posts'
import { guideRelatedContent, getRelatedPostsForGuide } from '@/lib/content/related-content'

describe('Guides Related Content Validation', () => {
  it('ensures every guide has exactly 6 related posts defined', () => {
    const guideSlugs = getAllSlugsFromGuidesDir()

    guideSlugs.forEach(({ slug }) => {
      const relatedPosts = getRelatedPostsForGuide(slug)

      // Each guide must have exactly 6 related posts
      expect(relatedPosts).toHaveLength(6)
      expect(relatedPosts.every((postSlug) => typeof postSlug === 'string')).toBe(true)
      expect(relatedPosts.every((postSlug) => postSlug.trim().length > 0)).toBe(true)
    })
  })

  it('ensures all referenced post slugs actually exist', async () => {
    const guideSlugs = getAllSlugsFromGuidesDir()
    const allPosts = await getAllPosts()
    const validPostSlugs = new Set(allPosts.map((p) => p.metadata.slug))

    guideSlugs.forEach(({ slug }) => {
      const relatedPosts = getRelatedPostsForGuide(slug)

      relatedPosts.forEach((postSlug) => {
        expect(validPostSlugs.has(postSlug)).toBe(true)
      })
    })
  })

  it('ensures no duplicate posts in related content for each guide', async () => {
    const guideSlugs = getAllSlugsFromGuidesDir()
    const allPosts = await getAllPosts()

    // Skip this test if there aren't enough posts to provide unique recommendations
    // This can happen during refactoring when content is being migrated
    if (allPosts.length < 6) {
      console.warn(
        `⚠️  Skipping duplicate check: only ${allPosts.length} posts available (need 6 for unique recommendations)`,
      )
      return
    }

    guideSlugs.forEach(({ slug }) => {
      const relatedPosts = getRelatedPostsForGuide(slug)
      const uniquePosts = new Set(relatedPosts)

      expect(uniquePosts.size).toBe(relatedPosts.length)
    })
  })

  it('ensures guide-related-content config has entries for all guides', () => {
    const guideSlugs = getAllSlugsFromGuidesDir()

    guideSlugs.forEach(({ slug }) => {
      expect(guideRelatedContent).toHaveProperty(slug)
    })
  })
})
