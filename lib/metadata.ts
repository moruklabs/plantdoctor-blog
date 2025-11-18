/**
 * Metadata Helper Functions
 *
 * Reusable functions for generating consistent metadata across all pages.
 * Reduces duplication and ensures SEO best practices.
 */

import type { Metadata } from 'next'
import { blogConfig, getCanonicalUrl } from '@/config'

/**
 * Generate base metadata for a page
 */
export function generatePageMetadata({
  title,
  description,
  path = '',
  ogImage,
  keywords,
  noIndex = false,
}: {
  title?: string
  description?: string
  path?: string
  ogImage?: string
  keywords?: string[]
  noIndex?: boolean
}): Metadata {
  const pageTitle = title ? `${title} | ${blogConfig.site.name}` : blogConfig.seo.defaultTitle
  const pageDescription = description || blogConfig.seo.defaultDescription
  const canonicalUrl = getCanonicalUrl(path)
  const imageUrl =
    ogImage || blogConfig.seo.ogImage || `${blogConfig.site.url}/images/og-default.jpg`

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords || blogConfig.seo.keywords,
    authors: [{ name: blogConfig.author.name, url: blogConfig.author.url }],
    creator: blogConfig.author.name,
    publisher: blogConfig.author.name,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonicalUrl,
      siteName: blogConfig.site.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      locale: blogConfig.site.language,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
      creator: blogConfig.seo.twitterHandle ? `@${blogConfig.seo.twitterHandle}` : undefined,
    },
  }
}

/**
 * Generate metadata for blog post/article pages
 */
export function generateArticleMetadata({
  title,
  description,
  slug,
  publishedTime,
  modifiedTime,
  authors,
  tags,
  ogImage,
}: {
  title: string
  description: string
  slug: string
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
  ogImage?: string
}): Metadata {
  const pageTitle = `${title} | ${blogConfig.site.name}`
  const canonicalUrl = getCanonicalUrl(`/tips/${slug}`)
  const imageUrl =
    ogImage || blogConfig.seo.ogImage || `${blogConfig.site.url}/images/og-default.jpg`

  return {
    title: pageTitle,
    description,
    keywords: tags || blogConfig.seo.keywords,
    authors: authors?.map((name) => ({ name })) || [{ name: blogConfig.author.name }],
    creator: blogConfig.author.name,
    publisher: blogConfig.author.name,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: blogConfig.site.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: blogConfig.site.language,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: authors || [blogConfig.author.name],
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [imageUrl],
      creator: blogConfig.seo.twitterHandle ? `@${blogConfig.seo.twitterHandle}` : undefined,
    },
  }
}

/**
 * Generate metadata for legal pages (privacy, terms, cookies)
 */
export function generateLegalPageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  return generatePageMetadata({
    title,
    description,
    path,
    noIndex: true, // Legal pages typically don't need SEO indexing
  })
}

/**
 * Format date for display
 */
export function formatDate(
  date: Date | string,
  format: 'full' | 'short' | 'featured' | 'recent' = 'full',
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const formatOptions =
    blogConfig.formatting.date.formats?.[format] || blogConfig.formatting.date.formats?.full

  return dateObj.toLocaleDateString(
    blogConfig.formatting.date.locale,
    formatOptions as Intl.DateTimeFormatOptions,
  )
}

/**
 * Format reading time
 */
export function formatReadingTime(minutes: number, short = false): string {
  const suffix = short
    ? blogConfig.formatting.readingTime.suffixShort
    : blogConfig.formatting.readingTime.suffix
  return `${minutes} ${suffix}`
}

/**
 * Get default reading time
 */
export function getDefaultReadingTime(): number {
  return blogConfig.formatting.readingTime.default
}
