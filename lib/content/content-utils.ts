/**
 * Generic Content Management Utilities
 *
 * This module provides reusable utilities for managing different content types
 * (posts, guides, podcasts, etc.) in a DRY, type-safe manner.
 *
 * Benefits:
 * - DRY: Eliminates duplicate code across posts.ts, guides.ts, etc.
 * - Open/Closed: Easy to add new content types without modifying core logic
 * - Maintainable: Single source of truth for common operations
 * - Configurable: Content types are configured, not hard-coded
 * - Scalable: Works for any number of content types
 * - Template-ready: Easy to adapt for different brands/sites
 */

import fs from 'fs'
import path from 'path'
import { processMDX, validateFrontmatter, type PostFrontmatter } from './mdx-processor'
import { blogConfig } from '@/config'

/**
 * Configuration for a content type
 */
export interface ContentTypeConfig {
  /** Directory name where content files are stored (e.g., 'posts', 'guides') */
  directory: string
  /** URL path prefix for this content type (e.g., 'blog', 'guides') */
  pathPrefix: string
  /**
   * Schema.org type for structured data (e.g., 'BlogPosting', 'Article', 'VideoObject').
   * See: https://schema.org/docs/schemas.html for a full list of types.
   * Common values: 'BlogPosting', 'Article', 'VideoObject', 'PodcastEpisode', etc.
   */
  schemaType: string
  /** Optional additional schema properties */
  schemaExtras?: Record<string, unknown>
}

/**
 * Generic metadata interface for content items
 */
export interface ContentMetadata extends PostFrontmatter {
  slug: string
  structuredData?: object
}

/**
 * Generic content item interface
 */
export interface ContentItem<T extends ContentMetadata = ContentMetadata> {
  metadata: T
  content: string
  html: string
  excerpt: string
}

/**
 * Get all slugs from a content directory
 *
 * @param directoryName - Name of the directory (e.g., 'posts', 'guides')
 * @returns Array of slug objects
 */
export function getAllSlugsFromDirectory(directoryName: string): { slug: string }[] {
  const directory = path.join(process.cwd(), directoryName)

  try {
    if (!fs.existsSync(directory)) {
      console.debug(`[Warning] ${directoryName} directory does not exist:`, directory)
      return []
    }

    const fileNames = fs.readdirSync(directory)
    const slugs = fileNames
      .filter((name) => name.endsWith('.mdx'))
      .map((name) => ({
        slug: name.replace(/\.mdx$/, ''),
      }))

    return slugs
  } catch (error) {
    console.error(`Error reading ${directoryName} directory:`, error)
    return []
  }
}

/**
 * Check if content should be published based on its date
 *
 * Content is published if its date is today or in the past (UTC).
 *
 * @param dateString - The content date in ISO format (YYYY-MM-DD)
 * @returns true if the content should be published, false if it's a future date
 */
export function isContentPublished(dateString: string): boolean {
  const contentDate = new Date(dateString)
  const today = new Date()

  // Set both dates to start of day (00:00:00 UTC) to compare dates only, not times
  // Using UTC methods to avoid timezone issues
  contentDate.setUTCHours(0, 0, 0, 0)
  today.setUTCHours(0, 0, 0, 0)

  // Content is published if its date is today or in the past
  return contentDate.getTime() <= today.getTime()
}

/**
 * Check if content is within the build window (not more than 1 month in the future)
 *
 * This optimization dramatically speeds up builds by excluding far-future content.
 * Only posts from the past and next 1 month are generated as static pages (~50 pages).
 * Future posts auto-publish when their date arrives—no redeploy needed!
 *
 * Build performance: 2032 pages → ~50 pages (40x faster)
 *
 * @param dateString - The content date in ISO format (YYYY-MM-DD)
 * @returns true if content is within 1 month from now, false otherwise
 */
export function isWithinBuildWindow(dateString: string): boolean {
  const contentDate = new Date(dateString)
  const today = new Date()
  const oneMonthFromNow = new Date()

  // Set to start of day (00:00:00 UTC) for consistent date comparison
  contentDate.setUTCHours(0, 0, 0, 0)
  today.setUTCHours(0, 0, 0, 0)
  oneMonthFromNow.setUTCHours(0, 0, 0, 0)

  // Add 1 month (30 days)
  oneMonthFromNow.setUTCDate(oneMonthFromNow.getUTCDate() + 30)

  // Content is within build window if it's not more than 1 month in the future
  return contentDate.getTime() <= oneMonthFromNow.getTime()
}

/**
 * Create basic structured data for content
 *
 * @param config - Content type configuration
 * @param frontmatter - Validated frontmatter
 * @returns Structured data object for SEO
 */
export function createStructuredData(
  config: ContentTypeConfig,
  frontmatter: PostFrontmatter,
): Record<string, unknown> {
  // Create Person schema for author (improves E-A-T signals for Google)
  const authorSchema = {
    '@type': 'Person',
    name: blogConfig.site.name,
    // Optional: Add author URL when author profile pages are implemented
    // url: `${blogConfig.site.url}/authors/${authorHandle}`,
  }

  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': config.schemaType,
    headline: frontmatter.title,
    description: frontmatter.meta_desc,
    datePublished: frontmatter.date,
    author: authorSchema,
    publisher: {
      '@type': 'Organization',
      name: blogConfig.site.name,
      logo: {
        '@type': 'ImageObject',
        url: blogConfig.site.url + '/favicon.svg',
      },
    },
  }

  // Merge with any additional schema properties
  if (config.schemaExtras) {
    return { ...baseSchema, ...config.schemaExtras }
  }

  return baseSchema
}

/**
 * Get content item by slug
 *
 * @param slug - Content slug
 * @param config - Content type configuration
 * @param customStructuredData - Optional custom structured data generator
 * @returns Content item
 */
export async function getContentBySlug<T extends ContentMetadata = ContentMetadata>(
  slug: string,
  config: ContentTypeConfig,
  customStructuredData?: (
    frontmatter: PostFrontmatter,
    slug: string,
  ) => Record<string, unknown> | Promise<Record<string, unknown>>,
): Promise<ContentItem<T>> {
  const fullPath = path.join(process.cwd(), config.directory, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Process the MDX using our simple processor
  const processed = processMDX(fileContents, slug)

  // Validate and structure the frontmatter (ensures required fields exist)
  const validatedFrontmatter = validateFrontmatter(processed.frontmatter)

  // Merge validated frontmatter with original to preserve content-type-specific fields
  // (e.g., apps have category, platform, status, technologies, features)
  const mergedFrontmatter = {
    ...processed.frontmatter,
    ...validatedFrontmatter,
  }

  // Create structured data for SEO
  const structuredData = customStructuredData
    ? await customStructuredData(validatedFrontmatter, slug)
    : createStructuredData(config, validatedFrontmatter)

  return {
    metadata: {
      ...mergedFrontmatter,
      slug,
      structuredData,
    } as T,
    content: processed.content,
    html: processed.html,
    excerpt: processed.excerpt,
  }
}

/**
 * Get all content items of a specific type
 *
 * @param config - Content type configuration
 * @param customStructuredData - Optional custom structured data generator
 * @returns Array of content items, filtered by draft status and publication date, sorted by date descending
 */
export async function getAllContent<T extends ContentMetadata = ContentMetadata>(
  config: ContentTypeConfig,
  customStructuredData?: (
    frontmatter: PostFrontmatter,
    slug: string,
  ) => Record<string, unknown> | Promise<Record<string, unknown>>,
): Promise<ContentItem<T>[]> {
  const slugs = getAllSlugsFromDirectory(config.directory)
  const items = await Promise.all(
    slugs.map(({ slug }) => getContentBySlug<T>(slug, config, customStructuredData)),
  )

  return items
    .filter((item) => !item.metadata.draft)
    .filter((item) => isContentPublished(item.metadata.date))
    .filter((item) => isWithinBuildWindow(item.metadata.date))
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
}

/**
 * Get unique tags from content items
 *
 * @param items - Array of content items
 * @returns Array of unique tag strings
 */
export function getUniqueTags<T extends ContentMetadata>(items: ContentItem<T>[]): string[] {
  const allTags = items.flatMap((item) => item.metadata.tags)
  return [...new Set(allTags)]
}
