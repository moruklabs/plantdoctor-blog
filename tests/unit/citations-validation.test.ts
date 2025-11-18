/**
 * Citations Validation Test
 *
 * This test validates that all citations in blog posts and guides are accessible.
 * It helps catch broken citation links before deployment.
 *
 * ## What it tests:
 * 1. Extracts all citation links from References sections in blog posts and guides
 * 2. Validates that each citation link is accessible via HTTP request
 * 3. Reports any broken or inaccessible citation links
 * 4. Ensures no placeholder domains (example.org, example.com) are used
 *
 * ## How it works:
 * - Parses References sections in MDX files to find citation links
 * - Makes HTTP HEAD requests to validate link accessibility
 * - Implements retry logic for temporary failures
 * - Identifies placeholder/fake domains that should not be used
 *
 * ## Configuration:
 * - Some domains excluded from validation due to bot blocking (see EXCLUDED_DOMAINS)
 * - Parallel requests limited to avoid overwhelming servers
 * - Request timeout set to 10 seconds
 * - Retry logic with exponential backoff
 *
 * @example
 * // Valid citation format:
 * // [^1]: Author. (Year). [Title](https://real-domain.com/article). Publication.
 *
 * // Invalid - will fail test:
 * // [^1]: Author. (Year). [Title](https://example.org/article). Publication.
 */
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
  'youtube.com',
  'discord.com',
  'whatsapp.com',
]

// Placeholder domains that should NEVER be used in production
const PLACEHOLDER_DOMAINS = [
  'example.org',
  'example.com',
  'example.net',
  'test.com',
  'test.org',
  '.example', // Catches hingelabs.example, okcupid.example, etc.
]

interface Citation {
  url: string
  text: string
  source: string
  lineNumber?: number
}

interface ValidationResult {
  url: string
  source: string
  success: boolean
  error?: string
  status?: number
  skipped?: boolean
  skipReason?: string
  isPlaceholder?: boolean
}

describe('Citations Validation', () => {
  const postsDir = path.join(process.cwd(), 'content/posts')
  const guidesDir = path.join(process.cwd(), 'content/guides')

  const allCitations: Citation[] = []
  let validationResults: ValidationResult[] = []
  const linkCache = new Map<string, ValidationResult>()

  // Increase Jest timeout for network requests
  jest.setTimeout(90000) // 1.5 minutes

  /**
   * Get all MDX files from a directory
   */
  function getMdxFiles(dir: string): string[] {
    return fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => path.join(dir, file))
  }

  /**
   * Check if a URL uses a placeholder domain
   */
  function isPlaceholderDomain(url: string): boolean {
    const lowercaseUrl = url.toLowerCase()
    return PLACEHOLDER_DOMAINS.some((domain) => lowercaseUrl.includes(domain.toLowerCase()))
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
   * Extract citations from References section of an MDX file
   */
  function extractCitations(filePath: string): Citation[] {
    const content = fs.readFileSync(filePath, 'utf-8')
    const fileName = path.basename(filePath)
    const citations: Citation[] = []

    // Find References section
    const referencesMatch = content.match(/## References[\s\S]*$/m)
    if (!referencesMatch) {
      return citations
    }

    const referencesSection = referencesMatch[0]
    const lines = referencesSection.split('\n')

    lines.forEach((line, index) => {
      // Match Markdown links in format: [text](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
      let match

      while ((match = linkRegex.exec(line)) !== null) {
        const text = match[1]
        const url = match[2]

        // Only include http/https URLs
        if (url.startsWith('http://') || url.startsWith('https://')) {
          citations.push({
            url,
            text,
            source: fileName,
            lineNumber: index + 1,
          })
        }
      }
    })

    return citations
  }

  /**
   * Validate HTTP link with retry logic
   */
  async function validateHttpLink(url: string): Promise<ValidationResult> {
    const baseResult = {
      url,
      source: '',
      success: false,
    }

    // Check if it's a placeholder domain
    if (isPlaceholderDomain(url)) {
      return {
        ...baseResult,
        success: false,
        isPlaceholder: true,
        error: 'Placeholder domain detected (example.org, example.com, etc.)',
      }
    }

    // Check if domain is excluded
    if (isDomainExcluded(url)) {
      return {
        ...baseResult,
        success: true,
        skipped: true,
        skipReason: 'Domain excluded from validation (social media)',
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
   * Validate citations in batches
   */
  async function validateCitationsInBatches(citations: Citation[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = []

    // Get unique citations by URL
    const uniqueCitations = citations.filter(
      (citation, index, array) => array.findIndex((c) => c.url === citation.url) === index,
    )

    //console.log(`\n🔍 Validating ${uniqueCitations.length} unique citations...`)

    for (let i = 0; i < uniqueCitations.length; i += MAX_CONCURRENT_REQUESTS) {
      const batch = uniqueCitations.slice(i, i + MAX_CONCURRENT_REQUESTS)

      //console.log(
      // `   Batch ${Math.floor(i / MAX_CONCURRENT_REQUESTS) + 1}/${Math.ceil(uniqueCitations.length / MAX_CONCURRENT_REQUESTS)} (${batch.length} citations)`,
      // )

      const batchResults = await Promise.all(
        batch.map((citation) => validateHttpLink(citation.url)),
      )

      results.push(...batchResults)

      // Small delay between batches
      if (i + MAX_CONCURRENT_REQUESTS < uniqueCitations.length) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    // Map results back to all citations (including duplicates)
    const resultMap = new Map(results.map((r) => [r.url, r]))
    return citations.map((citation) => ({
      ...resultMap.get(citation.url)!,
      source: citation.source,
    }))
  }

  beforeAll(() => {
    //console.log('\n📚 Starting citations validation...')
  })

  test('should extract citations from all blog posts', () => {
    const postFiles = getMdxFiles(postsDir)
    expect(postFiles.length).toBeGreaterThan(0)

    let totalCitations = 0
    postFiles.forEach((filePath) => {
      const citations = extractCitations(filePath)
      allCitations.push(...citations)
      totalCitations += citations.length
    })

    //console.log(`✓ Extracted ${totalCitations} citations from ${postFiles.length} blog posts`)
  })

  test('should extract citations from all guides', () => {
    const guideFiles = getMdxFiles(guidesDir)
    expect(guideFiles.length).toBeGreaterThan(0)

    let totalCitations = 0
    guideFiles.forEach((filePath) => {
      const citations = extractCitations(filePath)
      allCitations.push(...citations)
      totalCitations += citations.length
    })

    //console.log(`✓ Extracted ${totalCitations} citations from ${guideFiles.length} guides`)
  })

  test('should not use placeholder domains in citations', () => {
    const placeholderCitations = allCitations.filter((citation) =>
      isPlaceholderDomain(citation.url),
    )

    if (placeholderCitations.length > 0) {
      //console.error('\n❌ Found citations using placeholder domains:')
      // placeholderCitations.forEach(({ source, url, text }) => {
      //console.error(`   ${source}: "${text}" -> ${url}`)
      // })

      throw new Error(
        `Found ${placeholderCitations.length} citations using placeholder domains (example.org, example.com, etc.). These must be replaced with real URLs or removed.`,
      )
    }

    //console.log('✓ No placeholder domains found in citations')
  })

  test('should validate all citations are accessible', async () => {
    if (allCitations.length === 0) {
      //console.log('✓ No citations found to validate')
      return
    }

    validationResults = await validateCitationsInBatches(allCitations)

    const failed = validationResults.filter((r) => !r.success && !r.skipped)
    const skipped = validationResults.filter((r) => r.skipped)

    //console.log(`\n📊 Citation Validation Results:`)
    //console.log(`   Total citations: ${validationResults.length}`)
    //console.log(`   Successful: ${successful.length}`)
    //console.log(`   Failed: ${failed.length}`)
    //console.log(`   Skipped: ${skipped.length}`)
    //console.log(`   Placeholder domains: ${placeholders.length}`)

    if (failed.length > 0) {
      //console.error('\n❌ Failed citations:')
      failed.forEach(({ source: _source, url: _url, error: _error, status: _status }) => {
        // const statusInfo = status ? ` (${status})` : ''
        //console.error(`   ${source} -> ${url}${statusInfo} - ${error}`)
      })
    }

    if (skipped.length > 0) {
      //console.log('\n⏭️  Skipped citations:')
      skipped.forEach(({ source: _source, url: _url, skipReason: _skipReason }) => {
        //console.log(`   ${source} -> ${url} - ${skipReason}`)
      })
    }

    if (failed.length === 0) {
      //console.log('\n✅ All citations are valid and accessible!')
    }

    expect(failed.length).toBe(0)
  })

  test('should report citation statistics', () => {
    const uniqueUrls = new Set(allCitations.map((c) => c.url))

    //console.log(`\n📈 Citation Statistics:`)
    //console.log(`   Total citations: ${allCitations.length}`)
    //console.log(`   Unique URLs: ${uniqueUrls.size}`)
    //console.log(`   Unique domains: ${domains.size}`)

    expect(uniqueUrls.size).toBeGreaterThanOrEqual(0)
  })
})
