/**
 * Metadata & Formatting Helpers
 *
 * Centralized utilities for generating metadata, formatting dates/times,
 * and creating consistent content presentation across the blog.
 *
 * DRY Principle: All formatting logic in one place.
 * i18n-Ready: Uses blogConfig for locale and format preferences.
 */

import type { Metadata } from 'next'
import { blogConfig } from '@/config'
import { BLOG_CONSTANTS } from '@/config/constants'
import { getBlogImage } from '@/lib/content/blog-images'
import type { PostMetadata } from '@/lib/content/posts'
import type { GuideMetadata } from '@/lib/content/guides'

// ==========================================================================
// DATE FORMATTING
// ==========================================================================

/**
 * Format a date according to configured locale and format
 * @param date - Date string or Date object
 * @param format - Format type: 'full', 'short', 'featured', 'recent'
 * @returns Formatted date string (e.g., "Jan 15, 2025" for 'short')
 */
export function formatDate(
  date: string | Date,
  format: 'full' | 'short' | 'featured' | 'recent' = 'short',
): string {
  const d = new Date(date)
  const opts = blogConfig.formatting.date.formats?.[format] ||
    blogConfig.formatting.date.formats?.['short'] || {
      year: 'numeric' as const,
      month: 'short' as const,
      day: 'numeric' as const,
    }
  const locale = blogConfig.formatting.date.locale
  return d.toLocaleDateString(locale, opts)
}

/**
 * Format a date for legal documents (e.g., "Effective Date: January 15, 2025")
 * @param date - Date string or Date object
 * @param prefix - Optional prefix text (default: "Effective Date")
 * @returns Formatted string with prefix
 */
export function formatLegalDate(date: string | Date, prefix: string = 'Effective Date'): string {
  const formatted = formatDate(date, 'full')
  return `${prefix}: ${formatted}`
}

/**
 * Format last updated date for legal documents
 * @param date - Date string or Date object
 * @returns Formatted string (e.g., "Last Updated: January 15, 2025")
 */
export function formatLastUpdated(date: string | Date): string {
  return formatLegalDate(date, 'Last Updated')
}

// ==========================================================================
// READING TIME FORMATTING
// ==========================================================================

/**
 * Format reading time with configured suffix
 * @param minutes - Reading time in minutes
 * @param useShortSuffix - Use short suffix ("min") instead of long ("min read")
 * @returns Formatted string (e.g., "5 min read" or "5 min")
 */
export function formatReadingTime(
  minutes: number | undefined,
  useShortSuffix: boolean = false,
): string {
  const { suffix, suffixShort, default: defaultMinutes } = blogConfig.formatting.readingTime
  const time = minutes || defaultMinutes
  const suffixToUse = useShortSuffix ? suffixShort : suffix
  return `${time} ${suffixToUse}`
}

/**
 * Format published line for article cards (date + reading time)
 * @param date - Publication date
 * @param readingTime - Reading time in minutes
 * @param dateFormat - Date format to use (default: 'short')
 * @returns Formatted string (e.g., "Jan 15, 2025 • 5 min read")
 */
export function formatPublishedLine(
  date: string | Date,
  readingTime: number,
  dateFormat: 'full' | 'short' | 'featured' | 'recent' = 'short',
): string {
  const formattedDate = formatDate(date, dateFormat)
  const formattedTime = formatReadingTime(readingTime, true)
  return `${formattedDate} • ${formattedTime}`
}

// ==========================================================================
// OG IMAGE HELPERS
// ==========================================================================

/**
 * Get Open Graph image for a post
 * Priority: metadata.ogImage > metadata.coverImage > auto-generated from slug
 * @param metadata - Post metadata
 * @param slug - Post slug (used for auto-generated image)
 * @returns Absolute URL to OG image
 */
export function getPostOgImage(metadata: PostMetadata, slug: string): string {
  return metadata.ogImage || metadata.coverImage || getBlogImage(slug).src
}

/**
 * Get Open Graph image for a guide
 * Priority: metadata.ogImage > metadata.coverImage > auto-generated from slug
 * @param metadata - Guide metadata
 * @param slug - Guide slug (used for auto-generated image)
 * @returns Absolute URL to OG image
 */
export function getGuideOgImage(metadata: GuideMetadata, slug: string): string {
  return metadata.ogImage || metadata.coverImage || getBlogImage(slug).src
}

/**
 * Get default Open Graph image for the site
 * @returns Absolute URL to default OG image
 */
export function getDefaultOgImage(): string {
  return blogConfig.seo.ogImage || ''
}

// ==========================================================================
// URL HELPERS
// ==========================================================================

/**
 * Get canonical URL for a given path
 * @param path - Path relative to site root (e.g., '/about', '/tips/my-post')
 * @returns Absolute canonical URL
 */
export function getCanonicalUrl(path: string = ''): string {
  return `${blogConfig.site.url}${path}`
}

/**
 * Get absolute URL for a given path
 * Alias for getCanonicalUrl for clarity in different contexts
 * @param path - Path relative to site root
 * @returns Absolute URL
 */
export function getAbsoluteUrl(path: string): string {
  return getCanonicalUrl(path)
}

/**
 * Check if URL is external to this site
 * @param url - URL to check
 * @returns True if URL is external
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http') && !url.includes(blogConfig.site.domain)
}

// ==========================================================================
// METADATA GENERATORS
// ==========================================================================

/**
 * Generate metadata for a standard page (About, Contact, etc.)
 * @param title - Page title
 * @param description - Page description
 * @param path - Page path (e.g., '/about')
 * @param additionalMetadata - Additional metadata to merge
 * @returns Next.js Metadata object
 */
export function generatePageMetadata(
  title: string,
  description: string,
  path: string,
  additionalMetadata?: Partial<Metadata>,
): Metadata {
  const fullTitle = title.includes(blogConfig.site.name)
    ? title
    : `${title} | ${blogConfig.site.name}`

  const canonical = getCanonicalUrl(path)

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: blogConfig.site.name,
      type: 'website',
      images: [
        {
          url: getDefaultOgImage(),
          width: 1200,
          height: 630,
          alt: blogConfig.site.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [getDefaultOgImage()],
    },
    ...additionalMetadata,
  }
}

/**
 * Generate metadata for a blog post (article)
 * @param post - Post object with metadata
 * @param slug - Post slug
 * @returns Next.js Metadata object
 */
export function generateArticleMetadata(post: { metadata: PostMetadata }, slug: string): Metadata {
  const { metadata } = post
  const fullTitle = `${metadata.title} | ${blogConfig.site.name}`
  const canonical = getCanonicalUrl(`/tips/${slug}`)
  const ogImage = getPostOgImage(metadata, slug)
  const description = metadata.description || metadata.meta_desc || ''

  return {
    title: fullTitle,
    description,
    authors: [{ name: blogConfig.author.name }],
    keywords: metadata.tags || blogConfig.seo.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: metadata.title,
      description,
      url: canonical,
      siteName: blogConfig.site.name,
      type: 'article',
      publishedTime: metadata.date,
      authors: [blogConfig.author.name],
      tags: metadata.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description,
      images: [ogImage],
      creator: `@${blogConfig.seo.twitterHandle}`,
    },
  }
}

/**
 * Generate metadata for a guide
 * @param guide - Guide object with metadata
 * @param slug - Guide slug
 * @returns Next.js Metadata object
 */
export function generateGuideMetadata(guide: { metadata: GuideMetadata }, slug: string): Metadata {
  const { metadata } = guide
  const fullTitle = `${metadata.title} | ${blogConfig.site.name}`
  const canonical = getCanonicalUrl(`/guides/${slug}`)
  const ogImage = getGuideOgImage(metadata, slug)
  const description = metadata.description || metadata.meta_desc || ''

  return {
    title: fullTitle,
    description,
    authors: [{ name: blogConfig.author.name }],
    keywords: metadata.tags || blogConfig.seo.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: metadata.title,
      description,
      url: canonical,
      siteName: blogConfig.site.name,
      type: 'article',
      publishedTime: metadata.date,
      authors: [blogConfig.author.name],
      tags: metadata.tags,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description,
      images: [ogImage],
      creator: `@${blogConfig.seo.twitterHandle}`,
    },
  }
}

/**
 * Generate metadata for legal pages (Terms, Privacy, Cookie Policy)
 * @param title - Page title
 * @param description - Page description
 * @param path - Page path
 * @returns Next.js Metadata object
 */
export function generateLegalPageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const fullTitle = `${title} | ${blogConfig.site.name} – ${blogConfig.company.legal.name}`
  const canonical = getCanonicalUrl(path)

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical,
    },
    robots: 'index, follow', // Legal pages should be indexed
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: blogConfig.site.name,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: fullTitle,
      description,
    },
  }
}

// ==========================================================================
// UTILITY HELPERS
// ==========================================================================

/**
 * Get site name for Open Graph
 * @returns Site name from config
 */
export function getSiteNameForOpenGraph(): string {
  return BLOG_CONSTANTS.SITE_NAME
}

/**
 * Get author information from config
 * @returns Author object with name, email, bio, etc.
 */
export function getAuthorInfo() {
  return blogConfig.author
}

/**
 * Get company contact information
 * @returns Company contact object with email, phone
 */
export function getCompanyContact() {
  return blogConfig.company.contact
}

/**
 * Get company legal information
 * @returns Company legal object with name, address, etc.
 */
export function getCompanyLegal() {
  return blogConfig.company.legal
}

/**
 * Get full page title with template
 * @param pageTitle - Page title (if undefined, returns default)
 * @returns Formatted page title
 */
export function getPageTitle(pageTitle?: string): string {
  if (!pageTitle) return blogConfig.seo.defaultTitle

  return blogConfig.seo.titleTemplate
    .replace('%s', pageTitle)
    .replace('{siteName}', blogConfig.site.name)
}
