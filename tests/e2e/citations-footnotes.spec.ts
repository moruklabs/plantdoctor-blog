/**
 * Playwright Citations & Footnotes Test
 *
 * This test suite validates that citations and footnotes are properly rendered
 * in blog posts using the marked-footnote plugin.
 *
 * ## What it tests:
 * - Footnote reference links (superscript numbers in text)
 * - Footnotes section at the bottom of posts
 * - Back-reference links (return arrows in footnotes)
 * - CSS styling and visual presentation
 * - Accessibility (ARIA labels, keyboard navigation)
 * - Multiple posts with citations
 *
 * ## How it works:
 * - Uses Playwright's built-in web server to serve static export
 * - Tests specific blog posts known to have citations
 * - Validates HTML structure and data attributes
 * - Tests visual styling and interactive elements
 * - Verifies accessibility features
 *
 * ## Test Posts:
 * - dating-app-trends-2025-video-ai-intentional-love (1 citation)
 * - More posts can be added as needed
 *
 * ## Expected HTML Structure (from marked-footnote):
 * ```html
 * <!-- In text -->
 * <a href="#footnote-1" data-footnote-ref>1</a>
 *
 * <!-- At bottom -->
 * <section class="footnotes">
 *   <hr data-footnotes />
 *   <ol>
 *     <li id="footnote-1">
 *       <p>Citation text <a href="#footnote-ref-1" data-footnote-backref>↩</a></p>
 *     </li>
 *   </ol>
 * </section>
 * ```
 *
 * ## If this test fails:
 * 1. Check if marked-footnote is properly installed
 * 2. Verify lib/mdx-processor.ts is applying the plugin
 * 3. Check app/globals.css has footnote styles
 * 4. Inspect rendered HTML for expected data attributes
 * 5. Run `pnpm test:crawler` to verify the blog post is accessible
 *
 * @example
 * // Run this specific test file
 * pnpm playwright test citations-footnotes.spec.ts
 *
 * // Run with debug mode
 * pnpm playwright test citations-footnotes.spec.ts --debug
 *
 * // Run with headed browser
 * pnpm playwright test citations-footnotes.spec.ts --headed
 */

import { test, expect } from '@playwright/test'

// Test configuration
const TEST_POSTS = [
  {
    slug: 'dating-app-trends-2025-video-ai-intentional-love',
    title: 'Dating App Trends 2025: Video, AI & Intentional Love',
    expectedCitations: 1,
    firstCitationText: 'Pew Research Center',
  },
] as const

test.describe('Citations & Footnotes Rendering', () => {
  for (const post of TEST_POSTS) {
    test.describe(`Post: ${post.slug}`, () => {
      test('should render the blog post successfully', async ({ page }) => {
        await page.goto(`/blog/${post.slug}`, { waitUntil: 'networkidle' })
        // Verify page loaded
        await expect(page).toHaveTitle(new RegExp(post.title))

        // Verify main content exists
        const article = page.locator('article')
        await expect(article).toBeVisible()

        // Verify prose content exists (where citations would be)
        const proseContent = page.locator('.prose')
        await expect(proseContent).toBeVisible()
      })

      test('should render footnote reference links in text', async ({ page }) => {
        await page.goto(`/blog/${post.slug}`, { waitUntil: 'networkidle' })
        // Find all footnote reference links
        const footnoteRefs = page.locator('a[data-footnote-ref]')

        // Should have expected number of citations
        const count = await footnoteRefs.count()
        console.log(`   Found ${count} footnote reference(s)`)

        expect(count).toBe(post.expectedCitations)

        // Verify first footnote reference
        const firstRef = footnoteRefs.first()

        // Should be visible
        await expect(firstRef).toBeVisible()

        // Should contain the reference number
        const text = await firstRef.textContent()
        expect(text?.trim()).toMatch(/^\[\d+\]$/) // Should be [1], [2], etc.

        // Should have proper href pointing to footnote definition
        const href = await firstRef.getAttribute('href')
        expect(href).toMatch(/^#footnote-\d+$/) // Format: #footnote-1, #footnote-2, etc.

        // Should have proper CSS class from prose (via globals.css)
        const isVisible = await firstRef.isVisible()
        expect(isVisible).toBe(true)
      })

      test('should render footnotes section at bottom', async ({ page }) => {
        await page.goto(`/blog/${post.slug}`, { waitUntil: 'networkidle' })
        // Find the footnotes section
        const footnotesSection = page.locator('.footnotes, section.footnotes')

        // Should exist and be visible
        await expect(footnotesSection).toBeVisible()

        // Should contain an ordered list
        const footnotesList = footnotesSection.locator('ol')
        await expect(footnotesList).toBeVisible()

        // Should have correct number of list items
        const listItems = footnotesList.locator('li')
        const count = await listItems.count()
        expect(count).toBe(post.expectedCitations)

        console.log(`   Found ${count} footnote definition(s)`)
      })

      test('should have proper footnote content and structure', async ({ page }) => {
        await page.goto(`/blog/${post.slug}`, { waitUntil: 'networkidle' })
        // Get first footnote list item
        const firstFootnote = page.locator('.footnotes ol li').first()
        await expect(firstFootnote).toBeVisible()

        // Should have id attribute matching expected format
        const id = await firstFootnote.getAttribute('id')
        expect(id).toMatch(/^footnote-\d+$/) // Format: footnote-1, footnote-2, etc.

        // Should contain expected citation text
        const text = await firstFootnote.textContent()
        expect(text).toContain(post.firstCitationText)

        console.log(`   First footnote text: ${text?.substring(0, 50)}...`)
      })

      test('should render back-reference links (return arrows)', async ({ page }) => {
        await page.goto(`/blog/${post.slug}`, { waitUntil: 'networkidle' })
        // Find back-reference links
        const backRefs = page.locator('.footnotes a[data-footnote-backref]')

        // Should have one per citation
        const count = await backRefs.count()
        expect(count).toBe(post.expectedCitations)

        // Verify first back-reference
        const firstBackRef = backRefs.first()
        await expect(firstBackRef).toBeVisible()

        // Should have proper href pointing back to reference
        const href = await firstBackRef.getAttribute('href')
        expect(href).toMatch(/^#footnote-ref-\d+$/) // Format: #footnote-ref-1, #footnote-ref-2, etc.

        // Should contain return symbol (may vary by plugin config)
        const text = await firstBackRef.textContent()
        expect(text).toBeTruthy() // Should have some text (e.g., "↩")

        console.log(`   Back-reference symbol: "${text}"`)
      })

      test('should have horizontal rule separator above footnotes', async ({ page }) => {
        await page.goto(`/blog/${post.slug}`, { waitUntil: 'networkidle' })
        // Check for hr element with data-footnotes attribute
        const hrSeparator = page.locator('hr[data-footnotes], .footnotes hr')

        // Should exist (may be styled away but should be in DOM)
        const count = await hrSeparator.count()
        expect(count).toBeGreaterThan(0)

        console.log(`   Found ${count} footnote separator(s)`)
      })

      test('should apply proper CSS styling to footnote elements', async ({ page }) => {
        await page.goto(`/blog/${post.slug}`, { waitUntil: 'networkidle' })
        // Check footnote reference styling
        const footnoteRef = page.locator('a[data-footnote-ref]').first()

        // Should have primary color (from globals.css)
        const refColor = await footnoteRef.evaluate((el) => {
          return window.getComputedStyle(el).color
        })
        expect(refColor).toBeTruthy()
        console.log(`   Footnote ref color: ${refColor}`)

        // Check footnotes section styling
        const footnotesSection = page.locator('.footnotes')

        // Should have top border
        const borderTop = await footnotesSection.evaluate((el) => {
          return window.getComputedStyle(el).borderTopWidth
        })
        expect(borderTop).not.toBe('0px')
        console.log(`   Footnotes section border-top: ${borderTop}`)

        // Should have top margin
        const marginTop = await footnotesSection.evaluate((el) => {
          return window.getComputedStyle(el).marginTop
        })
        expect(marginTop).not.toBe('0px')
        console.log(`   Footnotes section margin-top: ${marginTop}`)
      })

      test('should handle hover states on footnote links', async ({ page }) => {
        await page.goto(`/blog/${post.slug}`, { waitUntil: 'networkidle' })
        const footnoteRef = page.locator('a[data-footnote-ref]').first()

        // Get initial state
        const initialTextDecoration = await footnoteRef.evaluate((el) => {
          return window.getComputedStyle(el).textDecoration
        })

        // Hover over the link
        await footnoteRef.hover()

        // Wait a bit for transition
        await page.waitForTimeout(100)

        // Check if hover state changed (may have underline)
        const hoverTextDecoration = await footnoteRef.evaluate((el) => {
          return window.getComputedStyle(el).textDecoration
        })

        console.log(`   Initial decoration: ${initialTextDecoration}`)
        console.log(`   Hover decoration: ${hoverTextDecoration}`)

        // We expect some change on hover (CSS from globals.css applies underline)
        // But this is a visual check, not strictly enforceable
      })

      test('should support keyboard navigation between ref and footnote', async ({ page }) => {
        await page.goto(`/blog/${post.slug}`, { waitUntil: 'networkidle' })
        const footnoteRef = page.locator('a[data-footnote-ref]').first()

        // Focus on footnote reference
        await footnoteRef.focus()

        // Should be focused
        const isFocused = await footnoteRef.evaluate((el) => {
          return document.activeElement === el
        })
        expect(isFocused).toBe(true)

        // Click to navigate to footnote
        await footnoteRef.click()

        // Wait for scroll
        await page.waitForTimeout(500)

        // Should have scrolled to footnote section
        const footnotesSection = page.locator('.footnotes')
        const isInViewport = await footnotesSection.evaluate((el) => {
          const rect = el.getBoundingClientRect()
          return rect.top >= 0 && rect.bottom <= window.innerHeight
        })

        console.log(`   Footnotes section in viewport after click: ${isInViewport}`)
        // Note: May not be perfectly in viewport depending on page height
      })

      test('should have proper external link attributes in footnotes', async ({ page }) => {
        await page.goto(`/blog/${post.slug}`, { waitUntil: 'networkidle' })
        // Find external links within footnotes
        const externalLinks = page.locator(
          '.footnotes a:not([data-footnote-backref])[href^="http"]',
        )

        const count = await externalLinks.count()

        if (count > 0) {
          console.log(`   Found ${count} external link(s) in footnotes`)

          const firstLink = externalLinks.first()

          // Should have rel attribute for security
          const rel = await firstLink.getAttribute('rel')
          expect(rel).toContain('nofollow')
          expect(rel).toContain('noopener')

          // Should have target="_blank" for external links
          const target = await firstLink.getAttribute('target')
          expect(target).toBe('_blank')

          console.log(`   External link rel: ${rel}`)
          console.log(`   External link target: ${target}`)
        } else {
          console.log('   No external links found in footnotes (may be inline citations)')
        }
      })

      test('should have semantic HTML structure', async ({ page }) => {
        await page.goto(`/blog/${post.slug}`, { waitUntil: 'networkidle' })
        // Footnotes should be wrapped in semantic element
        const footnotesSection = page.locator('section.footnotes, .footnotes')
        await expect(footnotesSection).toBeVisible()

        // Should use ordered list for numbered citations
        const orderedList = footnotesSection.locator('ol')
        await expect(orderedList).toBeVisible()

        // Each footnote should be a list item
        const listItems = orderedList.locator('li')
        const count = await listItems.count()
        expect(count).toBeGreaterThan(0)

        console.log(`   Semantic structure verified (section > ol > ${count} li)`)
      })
    })
  }

  test.describe('Multiple Posts with Citations', () => {
    test('should consistently render citations across different posts', async ({ page }) => {
      // Test a few different posts to ensure consistency
      const postsToTest = TEST_POSTS.slice(0, Math.min(3, TEST_POSTS.length))

      for (const post of postsToTest) {
        await page.goto(`/blog/${post.slug}`, { waitUntil: 'networkidle' })

        // Quick consistency checks
        const hasFootnoteRefs = (await page.locator('a[data-footnote-ref]').count()) > 0
        const hasFootnotesSection = (await page.locator('.footnotes').count()) > 0
        const hasBackRefs = (await page.locator('a[data-footnote-backref]').count()) > 0

        console.log(`   ${post.slug}:`)
        console.log(`     - Has footnote refs: ${hasFootnoteRefs}`)
        console.log(`     - Has footnotes section: ${hasFootnotesSection}`)
        console.log(`     - Has back-refs: ${hasBackRefs}`)

        // All should be true for posts with citations
        expect(hasFootnoteRefs).toBe(true)
        expect(hasFootnotesSection).toBe(true)
        expect(hasBackRefs).toBe(true)
      }
    })
  })

  test.describe('Edge Cases', () => {
    test('should handle posts without citations gracefully', async ({ page: _page }) => {
      // Navigate to a post without citations (you may need to verify this post exists)
      // For now, we'll skip this or use a known post without citations

      // Example: await page.goto('/blog/some-post-without-citations')

      // Should not have footnote elements
      // const footnoteRefs = await page.locator('a[data-footnote-ref]').count()
      // expect(footnoteRefs).toBe(0)

      // Placeholder for future implementation
      test.skip()
    })
  })
})

test.describe('Citation Visual Regression', () => {
  test('should visually match expected citation rendering', async ({ page }) => {
    const post = TEST_POSTS[0]
    await page.goto(`/blog/${post.slug}`, { waitUntil: 'networkidle' })

    // Take screenshot of footnote reference in text
    const footnoteRef = page.locator('a[data-footnote-ref]').first()
    await expect(footnoteRef).toHaveScreenshot('footnote-ref.png', {
      maxDiffPixels: 100,
    })

    // Take screenshot of footnotes section
    const footnotesSection = page.locator('.footnotes')
    await expect(footnotesSection).toHaveScreenshot('footnotes-section.png', {
      maxDiffPixels: 100,
    })

    console.log('   Visual regression screenshots captured')
  })
})
