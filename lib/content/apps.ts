import {
  type ContentTypeConfig,
  type ContentMetadata,
  type ContentItem,
  getAllSlugsFromDirectory,
  getContentBySlug,
  getUniqueTags as getUniqueTagsFromContent,
  isContentPublished,
} from './content-utils'

// Extended metadata interface for apps
export interface AppMetadata extends ContentMetadata {
  category: string
  platform: string[]
  appStoreUrl?: string
  playStoreUrl?: string
  websiteUrl?: string
  status: 'live' | 'beta' | 'coming-soon'
  technologies: string[]
  features: string[]
}

export type App = ContentItem<AppMetadata>

// Content type configuration for apps
const appsConfig: ContentTypeConfig = {
  directory: 'content/apps',
  pathPrefix: 'apps',
  schemaType: 'SoftwareApplication',
  schemaExtras: {
    applicationCategory: 'Productivity',
  },
}

/**
 * Get all slugs from apps directory
 */
export function getAllSlugsFromAppsDir(): { slug: string }[] {
  return getAllSlugsFromDirectory(appsConfig.directory)
}

/**
 * Get an app by slug
 */
export async function getAppBySlug(slug: string): Promise<App> {
  return getContentBySlug<AppMetadata>(slug, appsConfig)
}

/**
 * Check if an app should be published based on its date.
 * Apps are published if their date is today or in the past.
 *
 * @param dateString - The app date in ISO format (YYYY-MM-DD)
 * @returns true if the app should be published, false if it's a future app
 */
export function isAppPublished(dateString: string): boolean {
  return isContentPublished(dateString)
}

/**
 * Get all published apps, sorted by date descending
 *
 * Note: Apps are not filtered by build window (unlike posts) because they are evergreen content.
 * All published apps should be available regardless of their date.
 */
export async function getAllApps(): Promise<App[]> {
  const slugs = getAllSlugsFromDirectory(appsConfig.directory)
  const items = await Promise.allSettled(
    slugs.map(({ slug }) => getContentBySlug<AppMetadata>(slug, appsConfig)),
  )

  // Filter out failed items and extract successful ones
  const successfulItems = items
    .filter((result): result is PromiseFulfilledResult<App> => result.status === 'fulfilled')
    .map((result) => result.value)

  // Log any failures for debugging
  items.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error(`Failed to load app ${slugs[index]?.slug}:`, result.reason)
    }
  })

  // Filter by draft and publication date, but NOT by build window
  // Apps are evergreen content and should always be available
  return successfulItems
    .filter((item) => !item.metadata.draft)
    .filter((item) => isContentPublished(item.metadata.date))
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
}

/**
 * Get unique tags from apps
 */
export function getUniqueTags(apps: App[]): string[] {
  return getUniqueTagsFromContent(apps)
}

/**
 * Get unique categories from apps
 */
export function getUniqueCategories(apps: App[]): string[] {
  const categories = apps.map((app) => app.metadata.category).filter(Boolean)
  return Array.from(new Set(categories)).sort()
}

/**
 * Get unique technologies from apps
 */
export function getUniqueTechnologies(apps: App[]): string[] {
  const allTechnologies = apps.flatMap((app) => app.metadata.technologies || [])
  return Array.from(new Set(allTechnologies)).sort()
}

/**
 * Filter apps by category
 */
export function getAppsByCategory(apps: App[], category: string): App[] {
  return apps.filter((app) => app.metadata.category === category)
}

/**
 * Filter apps by status
 */
export function getAppsByStatus(apps: App[], status: 'live' | 'beta' | 'coming-soon'): App[] {
  return apps.filter((app) => app.metadata.status === status)
}

/**
 * Filter apps by platform
 */
export function getAppsByPlatform(apps: App[], platform: string): App[] {
  return apps.filter((app) => app.metadata.platform.includes(platform))
}

/**
 * Get URL for an app
 */
export function getUrlForApp(slug: string): string {
  return `/${appsConfig.pathPrefix}/${slug}`
}
