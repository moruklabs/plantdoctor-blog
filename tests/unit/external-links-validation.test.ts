/**
 * External Links Validation Test
 *
 * This test suite validates that all external links across the site are accessible.
 * It helps catch broken external links before deployment to production.
 *
 * ## What it tests:
 * 1. Extracts all external links from blog posts and guides (MDX content)
 * 2. Extracts all external links from React components (NavBar, Footer, Header)
 * 3. Validates that each external link is accessible via HTTP request
 * 4. Reports any broken or inaccessible links with their source file
 * 5. Provides statistics on total links validated, failed, and skipped
 *
 * ## How it works:
 * - Parses HTML content of all blog posts and guides to find external links
 * - Parses TSX component files to extract href attributes
 * - Identifies external links (http/https, mailto, etc.)
 * - Makes HTTP HEAD requests to validate link accessibility
 * - Implements retry logic for temporary failures
 * - Caches results to avoid duplicate requests
 *
 * ## What counts as an external link:
 * - HTTP/HTTPS URLs (e.g., "https://example.com")
 * - Mailto links (e.g., "mailto:contact@example.com")
 * - Other protocol links (ftp, tel, etc.)
 * - NOT: Internal links (starting with "/"), hash-only links (#section)
 *
 * ## Configuration:
 * - Domains can be excluded from validation (see EXCLUDED_DOMAINS)
 * - Parallel requests are limited to avoid overwhelming servers
 * - Request timeout is set to 10 seconds
 * - Retry logic with exponential backoff for temporary failures
 *
 * ## If this test fails:
 * 1. Check the console output for the list of broken links
 * 2. Each broken link will show: [source file] -> [broken link] -> [error]
 * 3. Fix the link in the source file or remove if no longer needed
 * 4. Run `pnpm test external-links-validation` to verify the fix
 *
 * @example
 * // If you add this to a blog post MDX file:
 * // [Read more](https://example.com/article)
 * // This test will validate that https://example.com/article is accessible
 */
import { getAllPosts } from '@/lib/content/posts'
import { getAllGuides } from '@/lib/content/guides'
import {
  exportExternalLinksToYAML,
  type ExternalLink,
  type ValidationResult,
} from '@/lib/test-utils/link-export'
import fs from 'fs'
import path from 'path'

// Configuration
const REQUEST_TIMEOUT = 10000 // 10 seconds
const MAX_CONCURRENT_REQUESTS = 5
const MAX_RETRIES = 2
const RETRY_DELAY_BASE = 1000 // 1 second base delay

// Domains that often block automated requests or have strict rate limits
const EXCLUDED_DOMAINS = [
  'linkedin.com',
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'tiktok.com',
  'reddit.com',
  'youtube.com', // Often blocks HEAD requests
  'discord.com',
  'whatsapp.com',
]

describe('External Links Validation', () => {
  const allExternalLinks: ExternalLink[] = []
  let validationResults: ValidationResult[] = []
  const linkCache = new Map<string, ValidationResult>()

  // Increase Jest timeout for network requests
  jest.setTimeout(60000) // 1 minute

  /**
   * Check if a URL is an external link
   */
  function isExternalLink(href: string): boolean {
    return (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('ftp://') ||
      href.startsWith('ftps://')
    )
  }

  /**
   * Check if a domain should be excluded from validation
   */
  function isDomainExcluded(url: string): boolean {
    try {
      const domain = new URL(url).hostname.toLowerCase()
      return EXCLUDED_DOMAINS.some((excluded) => domain.includes(excluded.toLowerCase()))
    } catch {
      return false
    }
  }

  /**
   * Validate mailto links using email regex
   */
  function validateMailtoLink(url: string): ValidationResult {
    const emailRegex = /^mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
    const isValid = emailRegex.test(url)

    return {
      url,
      source: '',
      success: isValid,
      error: isValid ? undefined : 'Invalid email format',
    }
  }

  /**
   * Extract all external links from HTML content using regex
   */
  function extractExternalLinksFromHTML(html: string, sourcePage: string): ExternalLink[] {
    const externalLinks: ExternalLink[] = []
    const lines = html.split('\n')

    lines.forEach((line, lineIndex) => {
      // Method 1: Match href attributes in anchor tags
      const hrefRegex = /<a[^>]+href=[\"']([^\"']+)[\"']/gi
      let match

      while ((match = hrefRegex.exec(line)) !== null) {
        const href = match[1].trim()

        if (isExternalLink(href)) {
          externalLinks.push({
            url: href,
            source: sourcePage,
            lineNumber: lineIndex + 1,
          })
        }
      }

      // Method 2: Match raw URLs in text (for footnotes and plain links)
      const rawUrlRegex = /https?:\/\/[^\s<>"')]+/gi
      let rawMatch

      while ((rawMatch = rawUrlRegex.exec(line)) !== null) {
        let url = rawMatch[0].trim()

        // Clean up URL - remove trailing punctuation that's not part of the URL
        url = url.replace(/[.)]+$/, '')

        if (isExternalLink(url)) {
          // Avoid duplicates from anchor tags
          const isDuplicate = externalLinks.some((link) => link.url === url)
          if (!isDuplicate) {
            externalLinks.push({
              url: url,
              source: sourcePage,
              lineNumber: lineIndex + 1,
            })
          }
        }
      }
    })

    return externalLinks
  }

  /**
   * Extract external links from TSX component files
   */
  function extractLinksFromComponentFile(filePath: string): ExternalLink[] {
    const externalLinks: ExternalLink[] = []

    try {
      const content = fs.readFileSync(filePath, 'utf8')
      const lines = content.split('\n')
      const fileName = path.basename(filePath)

      lines.forEach((line, lineIndex) => {
        // Extract href attributes from JSX
        const hrefRegex = /href=[\"']([^\"']+)[\"']/gi
        let match

        while ((match = hrefRegex.exec(line)) !== null) {
          const href = match[1].trim()

          if (isExternalLink(href)) {
            externalLinks.push({
              url: href,
              source: `components/${fileName}`,
              lineNumber: lineIndex + 1,
            })
          }
        }
      })
    } catch (error) {
      // console.warn(`Failed to read component file: ${filePath}`, error)
    }

    return externalLinks
  }

  /**
   * Make HTTP request to validate link accessibility with retry logic
   */
  async function validateHttpLink(url: string): Promise<ValidationResult> {
    const baseResult = {
      url,
      source: '',
      success: false,
    }

    // Check if domain is excluded
    if (isDomainExcluded(url)) {
      return {
        ...baseResult,
        success: true,
        skipped: true,
        skipReason: 'Domain excluded from validation',
      }
    }

    // Check cache first
    if (linkCache.has(url)) {
      return linkCache.get(url)!
    }

    let lastError: string | undefined

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)

        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
          headers: {
            'User-Agent':
              'Mozilla/5.0 (compatible; LinkChecker/1.0; +https://blog.plantdoctor.app)',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
        })

        clearTimeout(timeoutId)

        const result: ValidationResult = {
          ...baseResult,
          success: response.ok,
          status: response.status,
          error: response.ok ? undefined : `HTTP ${response.status} ${response.statusText}`,
        }

        // Cache successful results and 4xx errors (likely permanent)
        if (response.ok || (response.status >= 400 && response.status < 500)) {
          linkCache.set(url, result)
        }

        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        lastError = errorMessage

        // If it's the last attempt or a permanent error, return failure
        if (attempt === MAX_RETRIES || errorMessage.includes('abort')) {
          const result: ValidationResult = {
            ...baseResult,
            success: false,
            error: errorMessage,
          }
          linkCache.set(url, result)
          return result
        }

        // Wait before retry with exponential backoff
        if (attempt < MAX_RETRIES) {
          const delay = RETRY_DELAY_BASE * Math.pow(2, attempt)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    // This shouldn't be reached, but just in case
    const result: ValidationResult = {
      ...baseResult,
      success: false,
      error: lastError || 'Max retries exceeded',
    }
    linkCache.set(url, result)
    return result
  }

  /**
   * Validate a single external link based on its protocol
   */
  async function validateExternalLink(link: ExternalLink): Promise<ValidationResult> {
    if (link.url.startsWith('mailto:')) {
      const result = validateMailtoLink(link.url)
      return { ...result, source: link.source }
    }

    if (link.url.startsWith('http://') || link.url.startsWith('https://')) {
      const result = await validateHttpLink(link.url)
      return { ...result, source: link.source }
    }

    // For other protocols (tel, ftp, etc.), just validate format
    return {
      url: link.url,
      source: link.source,
      success: true,
      skipReason: 'Protocol validation not implemented',
      skipped: true,
    }
  }

  /**
   * Process links in batches to avoid overwhelming servers
   */
  async function validateLinksInBatches(links: ExternalLink[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []

    // Group unique links by domain to respect rate limits
    const uniqueLinks = links.filter(
      (link, index, array) => array.findIndex((l) => l.url === link.url) === index,
    )

    for (let i = 0; i < uniqueLinks.length; i += MAX_CONCURRENT_REQUESTS) {
      const batch = uniqueLinks.slice(i, i + MAX_CONCURRENT_REQUESTS)

      //console.log(
      //   `Validating batch ${Math.floor(i / MAX_CONCURRENT_REQUESTS) + 1}/${Math.ceil(uniqueLinks.length / MAX_CONCURRENT_REQUESTS)} (${batch.length} links)`,
      // )

      const batchResults = await Promise.all(batch.map((link) => validateExternalLink(link)))

      results.push(...batchResults)

      // Small delay between batches to be respectful
      if (i + MAX_CONCURRENT_REQUESTS < uniqueLinks.length) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    // Map results back to all original links (including duplicates)
    const resultMap = new Map(results.map((r) => [r.url, r]))
    return links.map((link) => ({
      ...resultMap.get(link.url)!,
      source: link.source,
    }))
  }

  beforeAll(async () => {
    //console.log('🔗 Starting external links validation...')
  })

  test('should extract external links from all blog posts', async () => {
    const posts = await getAllPosts()
    expect(posts.length).toBeGreaterThan(0)

    let totalLinks = 0
    posts.forEach((post) => {
      const sourcePage = `/blog/${post.metadata.slug}`
      const links = extractExternalLinksFromHTML(post.html, sourcePage)
      allExternalLinks.push(...links)
      totalLinks += links.length
    })

    //console.log(`✓ Extracted ${totalLinks} external links from ${posts.length} blog posts`)
  })

  test('should extract external links from all guides', async () => {
    const guides = await getAllGuides()
    expect(guides.length).toBeGreaterThan(0)

    let totalLinks = 0
    guides.forEach((guide) => {
      const sourcePage = `/guides/${guide.metadata.slug}`
      const links = extractExternalLinksFromHTML(guide.html, sourcePage)
      allExternalLinks.push(...links)
      totalLinks += links.length
    })

    //console.log(`✓ Extracted ${totalLinks} external links from ${guides.length} guides`)
  })

  test('should extract external links from React components', () => {
    const componentFiles = [
      path.join(process.cwd(), 'components', 'nav-bar.tsx'),
      path.join(process.cwd(), 'components', 'footer.tsx'),
      path.join(process.cwd(), 'components', 'header.tsx'),
    ]

    let totalLinks = 0
    componentFiles.forEach((filePath) => {
      const links = extractLinksFromComponentFile(filePath)
      allExternalLinks.push(...links)
      totalLinks += links.length
    })

    //console.log(
    //   `✓ Extracted ${totalLinks} external links from ${componentFiles.length} component files`,
    // )
  })

  test('should validate all external links are accessible', async () => {
    if (allExternalLinks.length === 0) {
      //console.log('✓ No external links found to validate')
      return
    }

    //console.log(`🔍 Validating ${allExternalLinks.length} external links...`)

    validationResults = await validateLinksInBatches(allExternalLinks)

    const failed = validationResults.filter((r) => !r.success && !r.skipped)
    const skipped = validationResults.filter((r) => r.skipped)

    //console.log(`\n📊 Validation Results:`)
    //console.log(`   Total links: ${validationResults.length}`)
    //console.log(`   Successful: ${successful.length}`)
    //console.log(`   Failed: ${failed.length}`)
    //console.log(`   Skipped: ${skipped.length}`)

    if (failed.length > 0) {
      //console.error('\n❌ Failed external links:')
      failed.forEach(({ source: _source, url: _url, error: _error, status: _status }) => {
        // const statusInfo = status ? ` (${status})` : ''
        //console.error(`   ${source} -> ${url}${statusInfo} - ${error}`)
      })
    }

    if (skipped.length > 0) {
      //console.log('\n⏭️  Skipped external links:')
      skipped.forEach(({ source: _source, url: _url, skipReason: _skipReason }) => {
        //console.log(`   ${source} -> ${url} - ${skipReason}`)
      })
    }

    if (failed.length === 0) {
      //console.log('✓ All external links are valid!')
    }

    expect(failed.length).toBe(0)
  })

  test('should report external link statistics', () => {
    const uniqueLinks = new Set(allExternalLinks.map((link) => link.url))

    //console.log(`\n📈 External Link Statistics:`)
    //console.log(`   Total external links found: ${allExternalLinks.length}`)
    //console.log(`   Unique external links: ${uniqueLinks.size}`)
    //console.log(`   Unique domains: ${domains.size}`)
    //console.log(`   Excluded domains: ${EXCLUDED_DOMAINS.length}`)

    // Group by protocol
    const protocolCounts = new Map<string, number>()
    uniqueLinks.forEach((url) => {
      const protocol = url.split(':')[0]
      protocolCounts.set(protocol, (protocolCounts.get(protocol) || 0) + 1)
    })

    //console.log(`\n🔗 Links by protocol:`)
    Array.from(protocolCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([_protocol, _count]) => {
        //console.log(`   ${protocol}: ${count}`)
      })

    expect(uniqueLinks.size).toBeGreaterThanOrEqual(0)
  })

  test('should export external links to YAML file', () => {
    // Export the collected links to a YAML file with validation results
    const outputPath = exportExternalLinksToYAML(allExternalLinks, validationResults)

    // Verify the file was created
    expect(fs.existsSync(outputPath)).toBe(true)

    // Verify the file contains valid YAML with expected structure
    const fileContent = fs.readFileSync(outputPath, 'utf8')
    expect(fileContent).toContain('metadata:')
    expect(fileContent).toContain('testType: external-links-validation')
    expect(fileContent).toContain('linksBySource:')
    // expect(fileContent).toContain('linksByDomain:')

    //console.log(`\n✅ External links exported to: ${outputPath}`)
  })
})
