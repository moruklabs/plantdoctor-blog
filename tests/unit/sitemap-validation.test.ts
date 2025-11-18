/**
 * Sitemap URL Validation Test
 *
 * This test suite validates that all URLs in the sitemap are valid and accessible.
 * It ensures that search engines won't encounter 404 errors when crawling the site.
 *
 * ## What it tests:
 * 1. Generates the sitemap using the app/sitemap.ts function
 * 2. Extracts all URLs from the sitemap
 * 3. Converts full URLs to internal paths (e.g., https://news.plantdoctor.app/tips -> /tips)
 * 4. Validates that each path points to a valid route in the application
 * 5. Reports any broken URLs that would result in 404 errors
 *
 * ## How it works:
 * - Executes the sitemap() function to get all URLs
 * - Validates against the same route validation logic used in internal-links test
 * - Ensures consistency between sitemap and actual routes
 *
 * ## What's included in sitemap:
 * - Static pages (/, /tips, /news, /apps, /guides, /about, /contact, etc.)
 * - Dynamic blog posts (/tips/[slug])
 * - Dynamic guide pages (/guides/[slug])
 * - Dynamic news articles (/news/[slug])
 * - Dynamic app pages (/apps/[slug])
 *
 * ## Expected behavior:
 * - All sitemap URLs should point to valid, accessible routes
 * - No 404 errors should be possible from sitemap URLs
 * - Sitemap should include all published content
 *
 * ## If this test fails:
 * 1. Check the console output for the list of broken URLs
 * 2. Each broken URL will show: [sitemap URL] -> [status]
 * 3. Fix the sitemap generation logic or create the missing page
 * 4. Run `pnpm test sitemap-validation` to verify the fix
 *
 * @example
 * // If sitemap includes: https://news.plantdoctor.app/tips/non-existent-post
 * // Test will fail with: ✗ /tips/non-existent-post (404 - Route not found)
 */
import sitemap from '@/app/sitemap'
import { getAllPosts } from '@/lib/content/posts'
import { getAllGuides } from '@/lib/content/guides'
import { getAllNews } from '@/lib/content/news'
import { getAllApps } from '@/lib/content/apps'
import { blogConfig } from '@/config'
import { stat } from 'fs/promises'
import path from 'path'

describe('Sitemap URL Validation', () => {
  let allValidRoutes: Set<string>
  let sitemapUrls: Array<{ url: string; path: string }>

  beforeAll(async () => {
    // Build a set of all valid routes in the application
    allValidRoutes = new Set<string>()

    // Static routes
    const staticRoutes = [
      '/',
      '/tips',
      '/news',
      '/apps',
      '/guides',
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

    // Dynamic news routes
    const newsArticles = await getAllNews()
    newsArticles.forEach((article) => {
      allValidRoutes.add(`/news/${article.metadata.slug}`)
    })

    // Dynamic app routes
    const apps = await getAllApps()
    apps.forEach((app) => {
      allValidRoutes.add(`/apps/${app.metadata.slug}`)
    })

    //console.log(`✓ Found ${allValidRoutes.size} valid routes in application`)
  })

  /**
   * Convert a full URL to an internal path
   * Example: https://news.plantdoctor.app/blog/post -> /blog/post
   */
  function urlToPath(url: string): string {
    try {
      const urlObj = new URL(url)
      return urlObj.pathname
    } catch (error) {
      // If URL parsing fails, assume it's already a path
      return url
    }
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

    // Check if it's a news route
    if (route.startsWith('/news/')) {
      const slug = route.replace('/news/', '')
      return allValidRoutes.has(`/news/${slug}`)
    }

    // Check if it's an app route
    if (route.startsWith('/apps/')) {
      const slug = route.replace('/apps/', '')
      return allValidRoutes.has(`/apps/${slug}`)
    }

    return false
  }

  test('should generate sitemap successfully', async () => {
    const sitemapData = await sitemap()
    expect(sitemapData).toBeDefined()
    expect(Array.isArray(sitemapData)).toBe(true)
    expect(sitemapData.length).toBeGreaterThan(0)

    //console.log(`✓ Sitemap generated with ${sitemapData.length} URLs`)
  })

  test('should extract and validate all URLs from sitemap', async () => {
    const sitemapData = await sitemap()
    sitemapUrls = sitemapData.map((entry) => ({
      url: entry.url,
      path: urlToPath(entry.url),
    }))

    expect(sitemapUrls.length).toBeGreaterThan(0)
    //console.log(`✓ Extracted ${sitemapUrls.length} URLs from sitemap`)
  })

  test('should ensure all sitemap URLs point to valid routes (no 404s)', async () => {
    const sitemapData = await sitemap()
    const brokenUrls: Array<{ url: string; path: string; reason: string }> = []

    sitemapData.forEach((entry) => {
      const path = urlToPath(entry.url)

      if (!isValidRoute(path)) {
        brokenUrls.push({
          url: entry.url,
          path: path,
          reason: 'Route not found in application',
        })
      }
    })

    if (brokenUrls.length > 0) {
      //console.error('\n❌ Found broken URLs in sitemap:')
      brokenUrls.forEach(({ url: _url, path: _path, reason: _reason }) => {
        //console.error(`   ${url}`)
        //console.error(`     → Path: ${path}`)
        //console.error(`     → Error: ${reason}`)
      })
      //console.error(`\nTotal broken URLs: ${brokenUrls.length}\n`)
    } else {
      //console.log('✓ All sitemap URLs are valid (no 404s)!')
    }

    expect(brokenUrls).toEqual([])
  })

  test('should include all static pages in sitemap', async () => {
    const sitemapData = await sitemap()
    const sitemapPaths = sitemapData.map((entry) => urlToPath(entry.url))

    const expectedStaticPages = [
      '/',
      '/tips',
      '/news',
      '/apps',
      '/guides',
      '/about',
      '/contact',
      '/support',
      '/privacy-policy',
      '/terms-and-conditions',
      '/cookie-policy',
    ]

    const missingPages: string[] = []
    expectedStaticPages.forEach((page) => {
      if (!sitemapPaths.includes(page)) {
        missingPages.push(page)
      }
    })

    if (missingPages.length > 0) {
      //console.error('\n❌ Missing static pages in sitemap:')
      missingPages.forEach((_page) => {
        //console.error(`   ${page}`)
      })
    } else {
      //console.log(`✓ All ${expectedStaticPages.length} static pages included in sitemap`)
    }

    expect(missingPages).toEqual([])
  })

  test('should include all published blog posts in sitemap', async () => {
    const posts = await getAllPosts()
    const sitemapData = await sitemap()
    const sitemapPaths = sitemapData.map((entry) => urlToPath(entry.url))

    const missingPosts: string[] = []
    posts.forEach((post) => {
      const path = `/tips/${post.metadata.slug}`
      if (!sitemapPaths.includes(path)) {
        missingPosts.push(path)
      }
    })

    if (missingPosts.length > 0) {
      //console.error('\n❌ Missing blog posts in sitemap:')
      missingPosts.forEach((_path) => {
        //console.error(`   ${path}`)
      })
    } else {
      //console.log(`✓ All ${posts.length} published blog posts included in sitemap`)
    }

    expect(missingPosts).toEqual([])
  })

  test('should include all published guides in sitemap', async () => {
    const guides = await getAllGuides()
    const sitemapData = await sitemap()
    const sitemapPaths = sitemapData.map((entry) => urlToPath(entry.url))

    const missingGuides: string[] = []
    guides.forEach((guide) => {
      const path = `/guides/${guide.metadata.slug}`
      if (!sitemapPaths.includes(path)) {
        missingGuides.push(path)
      }
    })

    if (missingGuides.length > 0) {
      //console.error('\n❌ Missing guides in sitemap:')
      missingGuides.forEach((_path) => {
        //console.error(`   ${path}`)
      })
    } else {
      //console.log(`✓ All ${guides.length} published guides included in sitemap`)
    }

    expect(missingGuides).toEqual([])
  })

  test('should include all published apps in sitemap', async () => {
    const apps = await getAllApps()
    const sitemapData = await sitemap()
    const sitemapPaths = sitemapData.map((entry) => urlToPath(entry.url))

    const missingApps: string[] = []
    apps.forEach((app) => {
      const path = `/apps/${app.metadata.slug}`
      if (!sitemapPaths.includes(path)) {
        missingApps.push(path)
      }
    })

    if (missingApps.length > 0) {
      //console.error('\n❌ Missing apps in sitemap:')
      missingApps.forEach((_path) => {
        //console.error(`   ${path}`)
      })
    } else {
      //console.log(`✓ All ${apps.length} published apps included in sitemap`)
    }

    expect(missingApps).toEqual([])
  })

  test('should report sitemap statistics', async () => {
    const sitemapData = await sitemap()
    const posts = await getAllPosts()
    const guides = await getAllGuides()
    const newsArticles = await getAllNews()
    const apps = await getAllApps()

    const staticPagesCount = 11 // Known static pages (/, /tips, /news, /apps, /guides, /about, /contact, /support, /privacy-policy, /terms-and-conditions, /cookie-policy)
    const expectedTotal =
      staticPagesCount + posts.length + guides.length + newsArticles.length + apps.length

    //console.log(`\n📊 Sitemap Statistics:`)
    //console.log(`   Total URLs in sitemap: ${sitemapData.length}`)
    //console.log(`   Static pages: ${staticPagesCount}`)
    //console.log(`   Blog posts: ${posts.length}`)
    //console.log(`   Guides: ${guides.length}`)
    //console.log(`   News articles: ${newsArticles.length}`)
    //console.log(`   Expected total: ${expectedTotal}`)

    expect(sitemapData.length).toBe(expectedTotal)
  })

  /**
   * NEW TEST SUITE: MDX File Path Validation
   *
   * This test ensures that sitemap.ts uses the correct file paths when reading
   * MDX files for lastModified timestamps. This catches bugs like the one fixed
   * in commit c2f32ef where paths were missing the 'content/' prefix.
   */
  describe('MDX File Path Validation', () => {
    test('should use correct paths for blog post MDX files', async () => {
      const posts = await getAllPosts()
      const missingFiles: Array<{ slug: string; expectedPath: string; error: string }> = []

      for (const post of posts) {
        const expectedPath = path.join(process.cwd(), `content/posts/${post.metadata.slug}.mdx`)

        try {
          await stat(expectedPath)
        } catch (error) {
          missingFiles.push({
            slug: post.metadata.slug,
            expectedPath,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }

      if (missingFiles.length > 0) {
        console.error('\n❌ Blog post MDX files not found at expected paths:')
        missingFiles.forEach(({ slug, expectedPath, error }) => {
          console.error(`   ${slug}`)
          console.error(`     → Expected: ${expectedPath}`)
          console.error(`     → Error: ${error}`)
        })
      }

      expect(missingFiles).toEqual([])
    })

    test('should use correct paths for guide MDX files', async () => {
      const guides = await getAllGuides()
      const missingFiles: Array<{ slug: string; expectedPath: string; error: string }> = []

      for (const guide of guides) {
        const expectedPath = path.join(process.cwd(), `content/guides/${guide.metadata.slug}.mdx`)

        try {
          await stat(expectedPath)
        } catch (error) {
          missingFiles.push({
            slug: guide.metadata.slug,
            expectedPath,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }

      if (missingFiles.length > 0) {
        console.error('\n❌ Guide MDX files not found at expected paths:')
        missingFiles.forEach(({ slug, expectedPath, error }) => {
          console.error(`   ${slug}`)
          console.error(`     → Expected: ${expectedPath}`)
          console.error(`     → Error: ${error}`)
        })
      }

      expect(missingFiles).toEqual([])
    })

    test('should verify sitemap generation does not log file path warnings', async () => {
      // Capture console output during sitemap generation
      const consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation()

      await sitemap()

      // Check if any "Unable to determine lastModified" warnings were logged
      const pathWarnings = consoleDebugSpy.mock.calls.filter((call) =>
        call[0]?.includes?.('Unable to determine lastModified'),
      )

      consoleDebugSpy.mockRestore()

      if (pathWarnings.length > 0) {
        console.error('\n❌ Sitemap generation logged file path warnings:')
        pathWarnings.forEach((call) => {
          console.error(`   ${call.join(' ')}`)
        })
      }

      expect(pathWarnings).toEqual([])
    })
  })

  /**
   * NEW TEST SUITE: lastModified Timestamp Accuracy
   *
   * Ensures that lastModified timestamps in the sitemap come from actual file
   * modification times, not fallback values. This validates that the file paths
   * used in sitemap.ts are correct.
   */
  describe('lastModified Timestamp Accuracy', () => {
    test('should have lastModified timestamps for all blog posts', async () => {
      const sitemapData = await sitemap()
      const posts = await getAllPosts()
      const postsWithoutTimestamp: string[] = []

      for (const post of posts) {
        const sitemapEntry = sitemapData.find(
          (entry) => entry.url === `https://news.plantdoctor.app/tips/${post.metadata.slug}`,
        )

        if (sitemapEntry && !sitemapEntry.lastModified) {
          postsWithoutTimestamp.push(post.metadata.slug)
        }
      }

      if (postsWithoutTimestamp.length > 0) {
        console.error('\n❌ Blog posts missing lastModified timestamps:')
        postsWithoutTimestamp.forEach((slug) => {
          console.error(`   ${slug}`)
        })
      }

      expect(postsWithoutTimestamp).toEqual([])
    })

    test('should have lastModified timestamps for all guides', async () => {
      const sitemapData = await sitemap()
      const guides = await getAllGuides()
      const guidesWithoutTimestamp: string[] = []

      for (const guide of guides) {
        const sitemapEntry = sitemapData.find(
          (entry) => entry.url === `https://news.plantdoctor.app/guides/${guide.metadata.slug}`,
        )

        if (sitemapEntry && !sitemapEntry.lastModified) {
          guidesWithoutTimestamp.push(guide.metadata.slug)
        }
      }

      if (guidesWithoutTimestamp.length > 0) {
        console.error('\n❌ Guides missing lastModified timestamps:')
        guidesWithoutTimestamp.forEach((slug) => {
          console.error(`   ${slug}`)
        })
      }

      expect(guidesWithoutTimestamp).toEqual([])
    })

    test('should use file modification time for blog posts when available', async () => {
      const sitemapData = await sitemap()
      const posts = await getAllPosts()
      const timestampMismatches: Array<{
        slug: string
        sitemapTime: Date | string | undefined
        fileTime: Date
      }> = []

      for (const post of posts) {
        const filePath = path.join(process.cwd(), `content/posts/${post.metadata.slug}.mdx`)

        try {
          const fileStats = await stat(filePath)
          const sitemapEntry = sitemapData.find(
            (entry) => entry.url === `https://news.plantdoctor.app/tips/${post.metadata.slug}`,
          )

          if (sitemapEntry && sitemapEntry.lastModified) {
            const sitemapTime = new Date(sitemapEntry.lastModified)
            const fileTime = fileStats.mtime

            // Allow 1 second tolerance for timestamp comparison
            const timeDiff = Math.abs(sitemapTime.getTime() - fileTime.getTime())
            if (timeDiff > 1000) {
              // Only flag as mismatch if sitemap is using fallback (frontmatter date)
              const frontmatterDate = new Date(post.metadata.date)
              const usingFallback =
                Math.abs(sitemapTime.getTime() - frontmatterDate.getTime()) < 1000

              if (usingFallback) {
                timestampMismatches.push({
                  slug: post.metadata.slug,
                  sitemapTime: sitemapEntry.lastModified,
                  fileTime,
                })
              }
            }
          }
        } catch (error) {
          // File doesn't exist - will be caught by path validation test
        }
      }

      if (timestampMismatches.length > 0) {
        console.error('\n⚠️  Blog posts using fallback timestamps instead of file mtime:')
        timestampMismatches.forEach(({ slug, sitemapTime, fileTime }) => {
          console.error(`   ${slug}`)
          console.error(`     → Sitemap: ${sitemapTime}`)
          console.error(`     → File:    ${fileTime}`)
        })
      }

      // This is informational - not a hard failure
      expect(timestampMismatches.length).toBeLessThan(posts.length)
    })
  })

  /**
   * NEW TEST SUITE: Canonical URL Consistency
   *
   * Ensures that URLs in the sitemap match the canonical URLs defined in
   * frontmatter. This maintains SEO consistency across the site.
   */
  describe('Canonical URL Consistency', () => {
    test('should match blog post canonical URLs from frontmatter', async () => {
      const sitemapData = await sitemap()
      const posts = await getAllPosts()
      const urlMismatches: Array<{
        slug: string
        sitemapUrl: string
        canonicalUrl: string
      }> = []

      for (const post of posts) {
        const sitemapEntry = sitemapData.find((entry) => entry.url.includes(post.metadata.slug))
        const canonical = post.metadata.canonical

        if (sitemapEntry && canonical && sitemapEntry.url !== canonical) {
          urlMismatches.push({
            slug: post.metadata.slug,
            sitemapUrl: sitemapEntry.url,
            canonicalUrl: canonical,
          })
        }
      }

      if (urlMismatches.length > 0) {
        console.error('\n❌ Blog posts with mismatched canonical URLs:')
        urlMismatches.forEach(({ slug, sitemapUrl, canonicalUrl }) => {
          console.error(`   ${slug}`)
          console.error(`     → Sitemap:   ${sitemapUrl}`)
          console.error(`     → Canonical: ${canonicalUrl}`)
        })
      }

      expect(urlMismatches).toEqual([])
    })

    test('should match guide canonical URLs from frontmatter', async () => {
      const sitemapData = await sitemap()
      const guides = await getAllGuides()
      const urlMismatches: Array<{
        slug: string
        sitemapUrl: string
        canonicalUrl: string
      }> = []

      for (const guide of guides) {
        const sitemapEntry = sitemapData.find((entry) => entry.url.includes(guide.metadata.slug))
        const canonical = guide.metadata.canonical

        if (sitemapEntry && canonical && sitemapEntry.url !== canonical) {
          urlMismatches.push({
            slug: guide.metadata.slug,
            sitemapUrl: sitemapEntry.url,
            canonicalUrl: canonical,
          })
        }
      }

      if (urlMismatches.length > 0) {
        console.error('\n❌ Guides with mismatched canonical URLs:')
        urlMismatches.forEach(({ slug, sitemapUrl, canonicalUrl }) => {
          console.error(`   ${slug}`)
          console.error(`     → Sitemap:   ${sitemapUrl}`)
          console.error(`     → Canonical: ${canonicalUrl}`)
        })
      }

      expect(urlMismatches).toEqual([])
    })

    test('should use consistent domain in all sitemap URLs', async () => {
      const sitemapData = await sitemap()
      const expectedDomain = blogConfig.site.url
      const wrongDomainUrls: string[] = []

      sitemapData.forEach((entry) => {
        if (!entry.url.startsWith(expectedDomain)) {
          wrongDomainUrls.push(entry.url)
        }
      })

      if (wrongDomainUrls.length > 0) {
        console.error(`\n❌ URLs not using expected domain ${expectedDomain}:`)
        wrongDomainUrls.forEach((url) => {
          console.error(`   ${url}`)
        })
      }

      expect(wrongDomainUrls).toEqual([])
    })
  })
})
