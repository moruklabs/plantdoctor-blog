import { existsSync, readdirSync, readFileSync } from 'fs'
import path from 'path'

/**
 * Test suite to validate static export build configuration
 *
 * This ensures that all dynamic routes have content to generate static paths
 * when building with NEXT_STATIC_EXPORT=true (used in Lighthouse CI builds)
 */
describe('Static Export Validation', () => {
  describe('Dynamic Routes', () => {
    it('should have content for all dynamic routes in app directory', () => {
      const appDir = path.join(process.cwd(), 'app')
      const dynamicRoutes = findDynamicRoutes(appDir)

      expect(dynamicRoutes.length).toBeGreaterThan(0)

      const routesWithoutContent: string[] = []

      for (const route of dynamicRoutes) {
        // Extract the content type from the route path
        // e.g., app/tips/[slug]/page.tsx -> tips
        const routeParts = route.split(path.sep)
        const appIndex = routeParts.indexOf('app')
        const routeType = routeParts[appIndex + 1]

        // Skip API routes - they don't generate static pages
        if (routeType === 'api') {
          continue
        }

        // Skip podcast routes - they use RSS feeds instead of MDX files
        if (routeType === 'podcasts') {
          continue
        }

        // Map route types to content directory names
        // tips -> content/posts, guides -> content/guides, news -> content/news
        const contentTypeMap: Record<string, string> = {
          tips: 'content/posts',
          guides: 'content/guides',
          news: 'content/news',
        }

        const contentType = contentTypeMap[routeType] || routeType

        // Check if corresponding content directory exists and has MDX files
        const contentDir = path.join(process.cwd(), contentType)
        const hasContent = checkContentDirectory(contentDir)

        if (!hasContent) {
          routesWithoutContent.push(route)
        }
      }

      // In static export mode, all dynamic routes MUST have at least one piece of content
      expect(routesWithoutContent).toEqual([])

      if (routesWithoutContent.length > 0) {
        //console.error(
        //   `The following dynamic routes exist but have no content to generate static paths:\n` +
        //     routesWithoutContent.map((r) => `  - ${r}`).join('\n') +
        //     `\n\nFor static export builds (NEXT_STATIC_EXPORT=true), all dynamic routes must have ` +
        //     `at least one static path generated. Either:\n` +
        //     `1. Add content to the corresponding directory, OR\n` +
        //     `2. Remove the unused dynamic route`,
        // )
      }
    })

    it('should validate generateStaticParams exists for all dynamic routes', () => {
      const appDir = path.join(process.cwd(), 'app')
      const dynamicRoutes = findDynamicRoutes(appDir)

      const routesWithoutStaticParams: string[] = []

      for (const route of dynamicRoutes) {
        const pageFile = path.join(route, 'page.tsx')

        // Skip API routes - they use route.ts, not page.tsx
        const routeFile = path.join(route, 'route.ts')
        if (existsSync(routeFile)) {
          continue
        }

        if (existsSync(pageFile)) {
          const content = readFileSync(pageFile, 'utf-8')

          // Check if generateStaticParams is exported
          if (!content.includes('generateStaticParams')) {
            routesWithoutStaticParams.push(route)
          }
        }
      }

      expect(routesWithoutStaticParams).toEqual([])

      if (routesWithoutStaticParams.length > 0) {
        //console.error(
        // `The following dynamic routes are missing generateStaticParams():\n` +
        //   routesWithoutStaticParams.map((r) => `  - ${r}`).join('\n') +
        //   `\n\nAll dynamic routes must export generateStaticParams() for static export builds.`,
        // )
      }
    })
  })

  describe('Content Directories', () => {
    it('should have corresponding routes for all content directories', () => {
      // Map content directories to their route names
      const contentToRouteMap: Record<string, string> = {
        posts: 'tips',
        guides: 'guides',
      }

      const appDir = path.join(process.cwd(), 'app')

      for (const [contentType, routeName] of Object.entries(contentToRouteMap)) {
        const contentDir = path.join(process.cwd(), contentType)
        const hasContent = checkContentDirectory(contentDir)

        if (hasContent) {
          // If content exists, the route should exist
          const routeDir = path.join(appDir, routeName, '[slug]')
          const routeExists = existsSync(path.join(routeDir, 'page.tsx'))

          if (!routeExists) {
            //console.error(
            //   `Content directory "${contentType}" has MDX files but no corresponding route at ` +
            //     `app/${routeName}/[slug]/page.tsx`,
            // )
          }
          expect(routeExists).toBe(true)
        }
      }
    })
  })
})

/**
 * Find all dynamic routes in the app directory
 * Returns array of absolute paths to directories containing [slug] or similar patterns
 */
function findDynamicRoutes(dir: string): string[] {
  const routes: string[] = []

  function traverse(currentDir: string) {
    if (!existsSync(currentDir)) return

    const entries = readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(currentDir, entry.name)

        // Check if this is a dynamic route (contains square brackets)
        if (entry.name.startsWith('[') && entry.name.endsWith(']')) {
          routes.push(fullPath)
        }

        // Continue traversing
        traverse(fullPath)
      }
    }
  }

  traverse(dir)
  return routes
}

/**
 * Check if a content directory exists and has at least one .mdx file
 */
function checkContentDirectory(dir: string): boolean {
  if (!existsSync(dir)) {
    return false
  }

  try {
    const files = readdirSync(dir)
    const mdxFiles = files.filter((f) => f.endsWith('.mdx'))
    return mdxFiles.length > 0
  } catch {
    return false
  }
}
