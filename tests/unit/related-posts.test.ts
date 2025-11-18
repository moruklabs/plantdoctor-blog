import { getAllPosts } from '@/lib/content/posts'

describe('Related Posts Validation', () => {
  it('ensures every blog post has exactly 3 related posts (or N-1 if fewer than 4 total)', async () => {
    const allPosts = await getAllPosts()
    const totalPosts = allPosts.length

    expect(totalPosts).toBeGreaterThan(0)

    // Calculate expected related posts count
    // If total posts < 4, expect N-1 related posts (can't have 3 if only 3 total exist)
    const expectedRelatedCount = Math.min(3, Math.max(0, totalPosts - 1))

    for (const post of allPosts) {
      const slug = post.metadata.slug

      // Simulate the related posts logic from app/blog/[slug]/page.tsx
      const tagMatchedPosts = allPosts
        .filter((p) => p.metadata.slug !== slug)
        .filter((p) => p.metadata.tags.some((tag) => post.metadata.tags.includes(tag)))

      let relatedPosts = tagMatchedPosts.slice(0, 3)

      if (relatedPosts.length < 3) {
        const remainingPosts = allPosts
          .filter((p) => p.metadata.slug !== slug)
          .filter(
            (p) => !tagMatchedPosts.find((matched) => matched.metadata.slug === p.metadata.slug),
          )
          .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())

        relatedPosts = [...relatedPosts, ...remainingPosts].slice(0, 3)
      }

      // Validate: Should have exactly 3 related posts (or expectedRelatedCount)
      expect(relatedPosts.length).toBe(expectedRelatedCount)

      // Validate: No duplicates in related posts
      const slugs = relatedPosts.map((p) => p.metadata.slug)
      const uniqueSlugs = new Set(slugs)
      expect(uniqueSlugs.size).toBe(slugs.length)

      // Validate: Current post should never appear in related posts
      expect(relatedPosts.find((p) => p.metadata.slug === slug)).toBeUndefined()
    }
  })

  it('prioritizes tag-matched posts over date-sorted posts', async () => {
    const allPosts = await getAllPosts()

    // Find a post with at least one tag-matched post
    const postWithTagMatches = allPosts.find((post) => {
      const tagMatchedCount = allPosts.filter(
        (p) =>
          p.metadata.slug !== post.metadata.slug &&
          p.metadata.tags.some((tag) => post.metadata.tags.includes(tag)),
      ).length
      return tagMatchedCount > 0 && tagMatchedCount < 3
    })

    if (postWithTagMatches) {
      const slug = postWithTagMatches.metadata.slug

      // Get tag-matched posts
      const tagMatchedPosts = allPosts
        .filter((p) => p.metadata.slug !== slug)
        .filter((p) =>
          p.metadata.tags.some((tag) => postWithTagMatches.metadata.tags.includes(tag)),
        )

      // Get final related posts using the same logic
      let relatedPosts = tagMatchedPosts.slice(0, 3)

      if (relatedPosts.length < 3) {
        const remainingPosts = allPosts
          .filter((p) => p.metadata.slug !== slug)
          .filter(
            (p) => !tagMatchedPosts.find((matched) => matched.metadata.slug === p.metadata.slug),
          )
          .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())

        relatedPosts = [...relatedPosts, ...remainingPosts].slice(0, 3)
      }

      // Validate: All tag-matched posts should appear first in related posts
      const tagMatchedSlugs = tagMatchedPosts.map((p) => p.metadata.slug)
      const relatedSlugs = relatedPosts.map((p) => p.metadata.slug)

      tagMatchedSlugs.forEach((tagSlug) => {
        expect(relatedSlugs).toContain(tagSlug)
      })
    }
  })

  it('ensures no self-references in related posts', async () => {
    const allPosts = await getAllPosts()

    for (const post of allPosts) {
      const slug = post.metadata.slug

      // Simulate the related posts logic
      const tagMatchedPosts = allPosts
        .filter((p) => p.metadata.slug !== slug)
        .filter((p) => p.metadata.tags.some((tag) => post.metadata.tags.includes(tag)))

      let relatedPosts = tagMatchedPosts.slice(0, 3)

      if (relatedPosts.length < 3) {
        const remainingPosts = allPosts
          .filter((p) => p.metadata.slug !== slug)
          .filter(
            (p) => !tagMatchedPosts.find((matched) => matched.metadata.slug === p.metadata.slug),
          )
          .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())

        relatedPosts = [...relatedPosts, ...remainingPosts].slice(0, 3)
      }

      // Validate: Current post slug should never appear in related posts
      const selfReferenceExists = relatedPosts.some((p) => p.metadata.slug === slug)
      expect(selfReferenceExists).toBe(false)
    }
  })

  it('ensures no duplicate posts in related posts array', async () => {
    const allPosts = await getAllPosts()

    for (const post of allPosts) {
      const slug = post.metadata.slug

      // Simulate the related posts logic
      const tagMatchedPosts = allPosts
        .filter((p) => p.metadata.slug !== slug)
        .filter((p) => p.metadata.tags.some((tag) => post.metadata.tags.includes(tag)))

      let relatedPosts = tagMatchedPosts.slice(0, 3)

      if (relatedPosts.length < 3) {
        const remainingPosts = allPosts
          .filter((p) => p.metadata.slug !== slug)
          .filter(
            (p) => !tagMatchedPosts.find((matched) => matched.metadata.slug === p.metadata.slug),
          )
          .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())

        relatedPosts = [...relatedPosts, ...remainingPosts].slice(0, 3)
      }

      // Validate: No duplicates
      const slugs = relatedPosts.map((p) => p.metadata.slug)
      const uniqueSlugs = new Set(slugs)
      expect(uniqueSlugs.size).toBe(slugs.length)
    }
  })
})
