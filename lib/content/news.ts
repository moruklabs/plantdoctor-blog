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

// Type aliases for news
export type NewsMetadata = ContentMetadata

export type NewsArticle = ContentItem<NewsMetadata>

// Content type configuration for news
const newsConfig: ContentTypeConfig = {
  directory: 'content/news',
  pathPrefix: 'news',
  schemaType: 'NewsArticle',
}

/**
 * Get all slugs from news directory
 */
export function getAllSlugsFromNewsDir(): { slug: string }[] {
  return getAllSlugsFromDirectory(newsConfig.directory)
}

/**
 * Get a news article by slug
 */
export async function getNewsBySlug(slug: string): Promise<NewsArticle> {
  return getContentBySlug<NewsMetadata>(slug, newsConfig)
}

/**
 * Check if a news article should be published based on its date.
 * News articles are published if their date is today or in the past.
 *
 * @param dateString - The news article date in ISO format (YYYY-MM-DD)
 * @returns true if the news article should be published, false if it's a future article
 */
export function isNewsPublished(dateString: string): boolean {
  return isContentPublished(dateString)
}

/**
 * Get all published news articles, sorted by date descending
 */
export async function getAllNews(): Promise<NewsArticle[]> {
  return getAllContent<NewsMetadata>(newsConfig)
}

/**
 * Get unique tags from news articles
 */
export function getUniqueTags(news: NewsArticle[]): string[] {
  return getUniqueTagsFromContent(news)
}

export function getUrlForNews(slug: string): string {
  return `/${newsConfig.pathPrefix}/${slug}`
}
