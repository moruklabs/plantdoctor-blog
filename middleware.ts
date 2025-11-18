import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// TODO(#185): Consider dynamically generating this mapping at build time
// by reading podcast episode metadata from MDX files. This would make the
// redirect mapping automatically stay in sync with episode content.
// Suggested approach:
// 1. Create a build script that reads all episode MDX files
// 2. Extract episodeNumber and slug from frontmatter
// 3. Generate episodeRedirects.json during build
// 4. Import the generated JSON here
// Current hardcoded approach is maintainable for small podcast catalogs.
// Map of old numeric episode URLs to new slug-based URLs
const episodeRedirects: Record<string, string> = {
  '/podcasts/models/1': '/podcasts/models/the-problem-why-youre-not-getting-women',
  '/podcasts/models/2': '/podcasts/models/reality-check-the-charm-myth',
  '/podcasts/models/3': '/podcasts/models/pursuit-burnout-why-chasing-drains-you',
  '/podcasts/rizzcast/1': '/podcasts/rizzcast/building-authentic-dating-confidence',
  '/podcasts/rizzcast/2': '/podcasts/rizzcast/ai-for-dating-conversation-success',
  '/podcasts/rizzcast/3': '/podcasts/rizzcast/ai-dating-photo-analysis-guide',
  '/podcasts/models/s1/1': '/podcasts/models/the-problem-why-youre-not-getting-women',
  '/podcasts/models/s1/2': '/podcasts/models/reality-check-the-charm-myth',
  '/podcasts/models/s1/3': '/podcasts/models/pursuit-burnout-why-chasing-drains-you',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /blog to /tips (301 permanent redirect)
  // Redirect /blog and /blog/* to /tips (301 permanent redirect)
  if (pathname === '/blog' || pathname.startsWith('/blog/')) {
    const newPathname = pathname.replace('/blog', '/tips')
    const newUrl = new URL(newPathname, request.url)
    return NextResponse.redirect(newUrl, 301)
  }

  // Check for episode redirects (old numeric URLs to new slug-based URLs)
  if (episodeRedirects[pathname]) {
    const newUrl = new URL(episodeRedirects[pathname], request.url)
    return NextResponse.redirect(newUrl, 301) // Permanent redirect
  }

  // Redirect trailing slashes to non-trailing slash (except root)
  if (pathname !== '/' && pathname.endsWith('/')) {
    const newUrl = new URL(pathname.slice(0, -1), request.url)
    return NextResponse.redirect(newUrl, 301) // Permanent redirect
  }

  // Continue with request
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
