import { getAllSlugsFromPostsDir, getPostBySlug } from '@/lib/content/posts'

describe('Blog Page Rendering', () => {
  const slugs = getAllSlugsFromPostsDir().map((s) => s.slug)

  slugs.forEach((slug) => {
    test(`renders blog page '${slug}' without console errors`, async () => {
      // Spy on //console.error to catch any rendering errors
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const post = await getPostBySlug(slug)
      // HTML content should be a non-empty string
      expect(typeof post.html).toBe('string')
      expect(post.html.length).toBeGreaterThan(0)

      // No console errors should have been logged
      expect(consoleErrorSpy).not.toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })
  })
})
