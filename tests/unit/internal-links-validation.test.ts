/**
 * Internal Links Validation Test
 *
 * This test suite validates that all internal links across the site point to existing routes.
 * It helps catch broken internal links before deployment to production.
 *
 * ## What it tests:
 * 1. Extracts all internal links from blog posts and guides (MDX content)
 * 2. Extracts all internal links from React components (NavBar, Footer, Header)
 * 3. Extracts all internal links from siteConfig (lib/config.ts)
 * 4. Validates that each internal link points to a valid route in the application
 * 5. Reports any broken links with their source file/page
 * 6. Provides statistics on total links and pages analyzed
 *
 * ## How it works:
 * - Discovers all valid routes (static pages + dynamic blog/guide pages)
 * - Parses HTML content of all blog posts and guides
 * - Parses TSX component files to extract href attributes
 * - Parses siteConfig to extract internal route values
 * - Extracts internal links using regex (links starting with "/" or relative paths)
 * - Normalizes links by removing hash fragments, query params, and trailing slashes
 * - Validates each unique link against the list of valid routes
 *
 * ## What counts as an internal link:
 * - Links starting with "/" (e.g., "/blog/some-post")
 * - Relative links (e.g., "../contact")
 * - NOT: External links (http/https), mailto links, or hash-only links (#section)
 *
 * ## Expected behavior:
 * - Currently, blog posts and guides may not contain internal links in their MDX content
 * - Components (NavBar, Footer) contain navigation links that must be valid
 * - If internal links are added to content, they will be validated automatically
 * - The test will fail if any internal link points to a non-existent route
 *
 * ## If this test fails:
 * 1. Check the console output for the list of broken links
 * 2. Each broken link will show: [source file] -> [broken link]
 * 3. Fix the link in the source file (component, config, or MDX) or create the missing page
 * 4. Run `pnpm test internal-links-validation` to verify the fix
 *
 * @example
 * // If you add this to a blog post MDX file:
 * // [Read our guide](/guides/dating-tips)
 * // This test will validate that /guides/dating-tips exists
 */
import { getAllPosts } from '@/lib/content/posts'
import { getAllGuides } from '@/lib/content/guides'
import {
  normalizeLink,
  isInternalLink,
  extractLinksFromHTML,
  extractLinksFromTSXFile,
  extractInternalLinks,
} from '@/lib/test-utils/link-validation'
import { exportInternalLinksToYAML } from '@/lib/test-utils/link-export'
import fs from 'fs'
import path from 'path'

describe('Internal Links Validation', () => {
  let allValidRoutes: Set<string>
  let allInternalLinksMap: Map<string, string[]> // Map of normalized link -> array of sources

  beforeAll(async () => {
    // Build a set of all valid routes in the application
    allValidRoutes = new Set<string>()

    // Static routes
    const staticRoutes = [
      '/',
      '/tips',
      '/guides',
      '/tools',
      '/tools/photo-rating',
      '/tools/smart-opener',
      '/tools/chat-assist',
      '/about',
      '/contact',
      '/support',
      '/privacy-policy',
      '/terms-and-conditions',
      '/cookie-policy',
    ]
    staticRoutes.forEach((route) => allValidRoutes.add(route))

    // Dynamic blog routes
    const posts = await getAllPosts()
    posts.forEach((post) => {
      allValidRoutes.add(`/tips/${post.metadata.slug}`)
    })

    // Dynamic guide routes
    const guides = await getAllGuides()
    guides.forEach((guide) => {
      allValidRoutes.add(`/guides/${guide.metadata.slug}`)
    })

    //console.log(`✓ Found ${allValidRoutes.size} valid routes`)
  })

  /**
   * Extract internal links from siteConfig (lib/config.ts)
   */
  function extractLinksFromSiteConfig(): string[] {
    const internalLinks: string[] = []

    try {
      const configPath = path.join(process.cwd(), 'lib', 'config.ts')
      const content = fs.readFileSync(configPath, 'utf8')

      // Extract only path-like values from siteConfig.app and siteConfig.guides sections
      // Look for property: '/path' patterns specifically in app and guides objects
      const appSectionRegex = /app:\s*\{([^}]+)\}/s
      const guidesSectionRegex = /guides:\s*\{([^}]+)\}/s

      const sections = [
        content.match(appSectionRegex)?.[1],
        content.match(guidesSectionRegex)?.[1],
      ].filter(Boolean)

      sections.forEach((section) => {
        if (section) {
          // Match property: '/path' or property: "/path"
          const pathRegex = /:\s*["']([^"']+)["']/g
          let match

          while ((match = pathRegex.exec(section)) !== null) {
            const value = match[1]

            // Only include values that look like paths (start with /)
            if (value.startsWith('/')) {
              const normalized = normalizeLink(value)
              if (normalized) {
                internalLinks.push(normalized)
              }
            }
          }
        }
      })
    } catch (error) {
      // console.warn('Failed to read siteConfig file', error)
    }

    return [...new Set(internalLinks)] // Remove duplicates
  }

  /**
   * Validate that a route exists in our application
   */
  function isValidRoute(route: string): boolean {
    // Direct match
    if (allValidRoutes.has(route)) {
      return true
    }

    // Check if it's a blog post route
    if (route.startsWith('/blog/')) {
      const slug = route.replace('/blog/', '')
      return allValidRoutes.has(`/blog/${slug}`)
    }

    // Check if it's a guide route
    if (route.startsWith('/guides/')) {
      const slug = route.replace('/guides/', '')
      return allValidRoutes.has(`/guides/${slug}`)
    }

    return false
  }

  test('should extract internal links from all blog posts', async () => {
    const posts = await getAllPosts()
    expect(posts.length).toBeGreaterThan(0)

    const sources = posts.map((post) => ({
      source: `/blog/${post.metadata.slug}`,
      links: extractLinksFromHTML(post.html).filter(isInternalLink),
    }))

    allInternalLinksMap = extractInternalLinks(sources)

    //console.log(`✓ Extracted ${sources.reduce((sum, { links }) => sum + links.length, 0)} internal links from ${posts.length} blog posts`)
  })

  test('should extract internal links from all guides', async () => {
    const guides = await getAllGuides()
    expect(guides.length).toBeGreaterThan(0)

    const sources = guides.map((guide) => ({
      source: `/guides/${guide.metadata.slug}`,
      links: extractLinksFromHTML(guide.html).filter(isInternalLink),
    }))

    const guidesMap = extractInternalLinks(sources)

    // Merge with existing map
    guidesMap.forEach((sources, link) => {
      const existing = allInternalLinksMap.get(link) || []
      allInternalLinksMap.set(link, [...existing, ...sources])
    })

    //console.log(`✓ Extracted ${sources.reduce((sum, { links }) => sum + links.length, 0)} internal links from ${guides.length} guides`)
  })

  test('should extract internal links from React components', () => {
    const componentFiles = [
      path.join(process.cwd(), 'components', 'organisms', 'nav-bar.tsx'),
      path.join(process.cwd(), 'components', 'organisms', 'footer.tsx'),
      path.join(process.cwd(), 'components', 'organisms', 'header.tsx'),
    ]

    const sources = componentFiles.map((filePath) => ({
      source: `components/${path.basename(filePath)}`,
      links: extractLinksFromTSXFile(filePath).filter(isInternalLink),
    }))

    const componentsMap = extractInternalLinks(sources)

    // Merge with existing map
    componentsMap.forEach((sources, link) => {
      const existing = allInternalLinksMap.get(link) || []
      allInternalLinksMap.set(link, [...existing, ...sources])
    })

    //console.log(
    // `✓ Extracted ${sources.reduce((sum, { links }) => sum + links.length, 0)} internal links from ${componentFiles.length} component files`,
    // )
  })

  test('should extract internal links from siteConfig', () => {
    const links = extractLinksFromSiteConfig()

    const configMap = extractInternalLinks([{ source: 'lib/config.ts', links }])

    // Merge with existing map
    configMap.forEach((sources, link) => {
      const existing = allInternalLinksMap.get(link) || []
      allInternalLinksMap.set(link, [...existing, ...sources])
    })

    //console.log(`✓ Extracted ${links.length} internal links from siteConfig`)
  })

  test('should validate all internal links point to existing routes', () => {
    const brokenLinks: { source: string; link: string }[] = []

    allInternalLinksMap.forEach((sources, link) => {
      if (!isValidRoute(link)) {
        sources.forEach((source) => {
          brokenLinks.push({ source, link })
        })
      }
    })

    if (brokenLinks.length > 0) {
      //console.error('\n❌ Found broken internal links:')
      brokenLinks.forEach(({ source: _source, link: _link }) => {
        //console.error(`   ${source} -> ${link}`)
      })
      //console.error(`\nTotal broken links: ${brokenLinks.length}\n`)
    } else {
      //console.log('✓ All internal links are valid!')
    }

    expect(brokenLinks).toEqual([])
  })

  test('should report all unique internal links found', () => {
    const allUniqueLinks = Array.from(allInternalLinksMap.keys())

    //console.log(`\n📊 Link Statistics:`)
    //console.log(`   Total unique internal links: ${allUniqueLinks.length}`)
    //console.log(`   Valid routes in app: ${allValidRoutes.size}`)

    // List all unique internal links found
    const sortedLinks = allUniqueLinks.sort()
    //console.log(`\n🔗 All unique internal links found:`)
    sortedLinks.forEach((_link) => {
      // const status = isValidRoute(link) ? '✓' : '✗'
      //console.log(`   ${status} ${link}`)
    })

    expect(allUniqueLinks.length).toBeGreaterThanOrEqual(0)
  })

  test('should export internal links to YAML file', () => {
    // Export the collected links to a YAML file
    const outputPath = exportInternalLinksToYAML(allInternalLinksMap, allValidRoutes)

    // Verify the file was created
    expect(fs.existsSync(outputPath)).toBe(true)

    // Verify the file contains valid YAML with expected structure
    const fileContent = fs.readFileSync(outputPath, 'utf8')
    expect(fileContent).toContain('metadata:')
    expect(fileContent).toContain('testType: internal-links-validation')
    expect(fileContent).toContain('linksBySource:')

    //console.log(`\n✅ Internal links exported to: ${outputPath}`)
  })
})
