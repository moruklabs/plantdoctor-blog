import { stat } from 'fs/promises'
import path from 'path'
import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/content/posts'
import { getAllGuides } from '@/lib/content/guides'
import { getAllNews } from '@/lib/content/news'
import { getAllApps } from '@/lib/content/apps'
import { BLOG_CONSTANTS } from '@/config/constants'
import { getStaticPageConfigs } from '@/config/sitemap-config'
import { featureToggles } from '@/lib/feature-toggles'

// Required for static export
export const dynamic = 'force-static'

// Helper function to safely create Date objects with fallback
function safeDate(dateInput: unknown): Date {
  if (!dateInput) {
    return new Date() // Use current date as fallback
  }

  const date = new Date(dateInput as string)
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return new Date() // Use current date as fallback for invalid dates
  }

  return date
}

async function getLastModifiedFromFile(relativePath: string, fallback?: Date): Promise<Date> {
  try {
    const filePath = path.join(process.cwd(), relativePath)
    const fileStats = await stat(filePath)
    return fileStats.mtime
  } catch (error) {
    console.debug('[Warning] Unable to determine lastModified for', relativePath, ':', error)
    return fallback ?? new Date()
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = featureToggles.tips.enabled ? await getAllPosts() : []
  const guides = featureToggles.guides.enabled ? await getAllGuides() : []
  const newsArticles = await getAllNews()
  const apps = await getAllApps()
  const baseUrl = BLOG_CONSTANTS.BLOG_URL

  const staticPageConfigsBase = getStaticPageConfigs(baseUrl)
  const staticPageConfigs = staticPageConfigsBase.filter((cfg) => {
    if (cfg.url.endsWith('/tips') && !featureToggles.tips.enabled) return false
    if (cfg.url.endsWith('/guides') && !featureToggles.guides.enabled) return false
    return true
  })

  const staticPages = await Promise.all(
    staticPageConfigs.map(async ({ url, filePath, changeFrequency, priority }) => ({
      url,
      lastModified: await getLastModifiedFromFile(filePath),
      changeFrequency,
      priority,
    })),
  )

  // Guides - highest priority for comprehensive dating guides
  const guidePages = await Promise.all(
    guides.map(async (guide) => ({
      url: `${baseUrl}/guides/${guide.metadata.slug}`,
      lastModified: await getLastModifiedFromFile(
        `content/guides/${guide.metadata.slug}.mdx`,
        safeDate(guide.metadata.date),
      ),
      changeFrequency: 'daily' as const,
      priority: 0.8, // Highest content priority for comprehensive guides
    })),
  )

  // Blog posts - higher priority for blog content
  const blogPosts = await Promise.all(
    posts.map(async (post) => ({
      url: `${baseUrl}/tips/${post.metadata.slug}`,
      lastModified: await getLastModifiedFromFile(
        `content/posts/${post.metadata.slug}.mdx`,
        safeDate(post.metadata.date),
      ),
      changeFrequency: 'monthly' as const,
      priority: 0.8, // Increased priority for valuable content
    })),
  )

  // News articles - highest priority for timely content
  const newsPages = await Promise.all(
    newsArticles.map(async (article) => ({
      url: `${baseUrl}/news/${article.metadata.slug}`,
      lastModified: await getLastModifiedFromFile(
        `content/news/${article.metadata.slug}.mdx`,
        safeDate(article.metadata.date),
      ),
      changeFrequency: 'daily' as const,
      priority: 0.9, // Highest priority for news content
    })),
  )

  // Apps - high priority for portfolio showcase
  const appPages = await Promise.all(
    apps.map(async (app) => ({
      url: `${baseUrl}/apps/${app.metadata.slug}`,
      lastModified: await getLastModifiedFromFile(
        `content/apps/${app.metadata.slug}.mdx`,
        safeDate(app.metadata.date),
      ),
      changeFrequency: 'monthly' as const,
      priority: 0.8, // High priority for portfolio content
    })),
  )

  return [...newsPages, ...guidePages, ...appPages, ...staticPages, ...blogPosts]
}
