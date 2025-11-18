/**
 * Link Extraction and Validation Utilities for Tests
 *
 * This module provides reusable utilities for extracting and validating links
 * from MDX content and TSX components.
 *
 * Benefits:
 * - DRY: Eliminates duplicate link extraction logic across test files
 * - Consistent: Same parsing rules across all tests
 * - Maintainable: Update link extraction in one place
 * - Testable: Well-defined, isolated functions
 */

import fs from 'fs'

/**
 * Normalize a link by removing hash, query params, and trailing slashes
 *
 * @param href - Link to normalize
 * @returns Normalized link or null if invalid
 */
export function normalizeLink(href: string): string | null {
  // Remove hash fragments (#section)
  // Remove query parameters (?param=value)
  let normalizedHref = href.split('#')[0].split('?')[0]

  // Remove trailing slashes (except for root path "/")
  if (normalizedHref.endsWith('/') && normalizedHref.length > 1) {
    normalizedHref = normalizedHref.slice(0, -1)
  }

  return normalizedHref || null
}

/**
 * Check if a URL is an internal link
 *
 * @param href - Link to check
 * @returns true if the link is internal (starts with "/")
 */
export function isInternalLink(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//')
}

/**
 * Check if a URL is an external link
 *
 * @param href - Link to check
 * @returns true if the link is external (http/https/mailto/etc.)
 */
export function isExternalLink(href: string): boolean {
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('ftp://')
  )
}

/**
 * Extract all links from HTML content
 *
 * @param html - HTML content to parse
 * @returns Array of href values found in anchor tags
 */
export function extractLinksFromHTML(html: string): string[] {
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/gi
  const links: string[] = []
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(html)) !== null) {
    if (match[1]) {
      links.push(match[1])
    }
  }

  return links
}

/**
 * Extract all href values from a TSX/JSX file
 *
 * @param filePath - Path to TSX/JSX file
 * @returns Array of href values found in the file
 */
export function extractLinksFromTSXFile(filePath: string): string[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const links: string[] = []

  // Match href="..." or href={'...'} or href={`...`}
  const hrefRegex = /href=["'`]([^"'`]+)["'`]/g
  let match: RegExpExecArray | null

  while ((match = hrefRegex.exec(fileContent)) !== null) {
    if (match[1] && !match[1].startsWith('{')) {
      // Skip dynamic hrefs like {siteConfig.url}
      links.push(match[1])
    }
  }

  return links
}

/**
 * Extract internal links from multiple sources
 *
 * @param sources - Array of objects with source identifier and links
 * @returns Map of normalized links to their source files
 */
export function extractInternalLinks(
  sources: Array<{ source: string; links: string[] }>,
): Map<string, string[]> {
  const internalLinksMap = new Map<string, string[]>()

  sources.forEach(({ source, links }) => {
    links.forEach((link) => {
      if (isInternalLink(link)) {
        const normalized = normalizeLink(link)
        if (normalized) {
          const sources = internalLinksMap.get(normalized) || []
          sources.push(source)
          internalLinksMap.set(normalized, sources)
        }
      }
    })
  })

  return internalLinksMap
}

/**
 * Extract external links from multiple sources
 *
 * @param sources - Array of objects with source identifier and links
 * @returns Array of objects with URL and source
 */
export function extractExternalLinks(
  sources: Array<{ source: string; links: string[] }>,
): Array<{ url: string; source: string }> {
  const externalLinks: Array<{ url: string; source: string }> = []
  const seen = new Set<string>() // Deduplicate by URL

  sources.forEach(({ source, links }) => {
    links.forEach((link) => {
      if (isExternalLink(link)) {
        const key = `${link}|${source}`
        if (!seen.has(key)) {
          seen.add(key)
          externalLinks.push({ url: link, source })
        }
      }
    })
  })

  return externalLinks
}

/**
 * Check if a domain should be excluded from external link validation
 *
 * @param url - URL to check
 * @param excludedDomains - Array of domain strings to exclude
 * @returns true if the domain should be excluded
 */
export function shouldExcludeDomain(url: string, excludedDomains: string[]): boolean {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    return excludedDomains.some((domain) => {
      const domainLower = domain.toLowerCase()
      return hostname === domainLower || hostname.endsWith(`.${domainLower}`)
    })
  } catch {
    return false
  }
}

/**
 * Validate external link with retry logic
 *
 * @param url - URL to validate
 * @param options - Validation options
 * @returns Promise that resolves to validation result
 */
export async function validateExternalLink(
  url: string,
  options: {
    timeout?: number
    maxRetries?: number
    retryDelayBase?: number
  } = {},
): Promise<{ success: boolean; status?: number; error?: string }> {
  const { timeout = 10000, maxRetries = 2, retryDelayBase = 1000 } = options

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'follow',
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        return { success: true, status: response.status }
      } else {
        return { success: false, status: response.status, error: `HTTP ${response.status}` }
      }
    } catch (error) {
      if (attempt < maxRetries) {
        // Exponential backoff
        const delay = retryDelayBase * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: errorMessage }
    }
  }

  return { success: false, error: 'Max retries exceeded' }
}

/**
 * Batch validate external links with concurrency control
 *
 * @param links - Array of links to validate
 * @param options - Validation options
 * @returns Promise that resolves to array of validation results
 */
export async function batchValidateExternalLinks(
  links: Array<{ url: string; source: string }>,
  options: {
    timeout?: number
    maxRetries?: number
    retryDelayBase?: number
    maxConcurrent?: number
    excludedDomains?: string[]
  } = {},
): Promise<
  Array<{
    url: string
    source: string
    success: boolean
    status?: number
    error?: string
    skipped?: boolean
    skipReason?: string
  }>
> {
  const { maxConcurrent = 5, excludedDomains = [] } = options
  const results: Array<{
    url: string
    source: string
    success: boolean
    status?: number
    error?: string
    skipped?: boolean
    skipReason?: string
  }> = []

  // Process links in batches to avoid overwhelming servers
  for (let i = 0; i < links.length; i += maxConcurrent) {
    const batch = links.slice(i, i + maxConcurrent)
    const batchResults = await Promise.all(
      batch.map(async ({ url, source }) => {
        // Check if domain should be excluded
        if (shouldExcludeDomain(url, excludedDomains)) {
          return {
            url,
            source,
            success: true,
            skipped: true,
            skipReason: 'Domain excluded from validation',
          }
        }

        const result = await validateExternalLink(url, options)
        return {
          url,
          source,
          ...result,
        }
      }),
    )

    results.push(...batchResults)
  }

  return results
}
