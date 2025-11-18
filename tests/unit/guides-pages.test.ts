import { getAllSlugsFromGuidesDir, getGuideBySlug } from '@/lib/content/guides'

describe('Guides Page Rendering', () => {
  it('should handle empty guides directory gracefully', () => {
    const slugs = getAllSlugsFromGuidesDir()
    expect(Array.isArray(slugs)).toBe(true)
  })

  it('renders guide pages without console errors', async () => {
    const slugs = getAllSlugsFromGuidesDir().map((s) => s.slug)

    if (slugs.length === 0) {
      // console.warn('No guides found for rendering test')
      return
    }

    for (const slug of slugs) {
      // Spy on //console.error to catch any rendering errors
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const guide = await getGuideBySlug(slug)

      // HTML content should be a non-empty string
      expect(typeof guide.html).toBe('string')
      expect(guide.html.length).toBeGreaterThan(0)

      // Metadata should be properly structured
      expect(guide.metadata).toBeDefined()
      expect(guide.metadata.slug).toBe(slug)

      // No console errors should have been logged
      expect(consoleErrorSpy).not.toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    }
  })
})
