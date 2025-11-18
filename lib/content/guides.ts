import {
  type ContentTypeConfig,
  type ContentMetadata,
  type ContentItem,
  getAllSlugsFromDirectory,
  getContentBySlug,
  getAllContent,
  getUniqueTags as getUniqueTagsFromContent,
  isContentPublished,
} from './content-utils'
import { getGuideStructuredData } from '@/lib/seo/guide-structured-data'

// Type aliases for guides
export type GuideMetadata = ContentMetadata

export type Guide = ContentItem<GuideMetadata>

// Content type configuration for guides
const guidesConfig: ContentTypeConfig = {
  directory: 'content/guides',
  pathPrefix: 'guides',
  schemaType: 'Article',
  schemaExtras: {
    articleSection: 'Dating Guide',
  },
}

/**
 * Get all slugs from guides directory
 */
export function getAllSlugsFromGuidesDir(): { slug: string }[] {
  return getAllSlugsFromDirectory(guidesConfig.directory)
}

/**
 * Get a guide by slug
 */
export async function getGuideBySlug(slug: string): Promise<Guide> {
  return getContentBySlug<GuideMetadata>(slug, guidesConfig, (frontmatter, slug) =>
    getGuideStructuredData(frontmatter, slug),
  )
}

/**
 * Check if a guide should be published based on its date.
 * Guides are published if their date is today or in the past.
 *
 * @param dateString - The guide date in ISO format (YYYY-MM-DD)
 * @returns true if the guide should be published, false if it's a future guide
 */
export function isGuidePublished(dateString: string): boolean {
  return isContentPublished(dateString)
}

/**
 * Get all published guides, sorted by date descending
 */
export async function getAllGuides(): Promise<Guide[]> {
  return getAllContent<GuideMetadata>(guidesConfig, (frontmatter, slug) =>
    getGuideStructuredData(frontmatter, slug),
  )
}

/**
 * Get unique tags from guides
 */
export function getUniqueTags(guides: Guide[]): string[] {
  return getUniqueTagsFromContent(guides)
}

/**
 * Get the URL path for a guide by its slug
 */
export function getUrlForGuide(slug: string): string {
  return `/${guidesConfig.pathPrefix}/${slug}`
}
