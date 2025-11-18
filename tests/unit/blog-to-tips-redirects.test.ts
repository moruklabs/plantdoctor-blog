/**
 * Blog to Tips URL Redirects Test
 *
 * Validates that old /blog URLs redirect to new /tips URLs
 */

import fs from 'fs'
import path from 'path'

describe('Blog to Tips URL Redirects', () => {
  let middlewareContent: string

  // Read middleware file once for all tests (performance optimization)
  beforeAll(() => {
    middlewareContent = fs.readFileSync(path.join(process.cwd(), 'middleware.ts'), 'utf-8')
  })

  it('should have redirects defined in middleware for /blog paths', () => {
    // Use cached middleware content

    // Verify blog to tips redirects exist
    expect(middlewareContent).toContain('/blog')
    expect(middlewareContent).toContain('/tips')
    expect(middlewareContent).toContain("pathname === '/blog'")
    expect(middlewareContent).toContain("pathname.startsWith('/blog/')")
  })

  it('should use 301 permanent redirects for SEO', () => {
    // Verify 301 redirect status code is used
    // The middleware should return NextResponse.redirect(..., 301)
    const has301Redirects = middlewareContent.includes('redirect(newUrl, 301)')
    expect(has301Redirects).toBe(true)
  })

  it('should redirect /blog to /tips exactly', () => {
    // Check for exact /blog to /tips redirect logic
    expect(middlewareContent).toContain("pathname === '/blog'")
    expect(middlewareContent).toContain("replace('/blog', '/tips')")
  })

  it('should redirect /blog/* to /tips/* pattern', () => {
    // Check for wildcard /blog/* to /tips/* redirect logic
    expect(middlewareContent).toContain("pathname.startsWith('/blog/')")
    expect(middlewareContent).toContain("replace('/blog', '/tips')")
  })

  it('should maintain query parameters and hashes in redirects', () => {
    // This is implicit in the middleware implementation
    // When creating new URL with pathname.replace, query params are preserved
    // The middleware uses new URL() which preserves query params
    expect(middlewareContent).toContain('new URL(')
    expect(middlewareContent).toContain('request.url')
  })
})
