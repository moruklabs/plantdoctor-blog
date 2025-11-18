/**
 * @deprecated This file is deprecated. Please import from '@/config' instead.
 *
 * Backwards compatibility wrapper for old config system.
 * This re-exports from the new centralized configuration in /config
 *
 * Migration guide:
 * - Old: import { siteConfig } from '@/lib/config'
 * - New: import { blogConfig } from '@/config'
 *
 * This file will be removed in a future version.
 */

import { blogConfig, getCanonicalUrl as getCanonical, isExternalUrl as isExternal } from '../config'

// Backwards compatibility: Map new config structure to old siteConfig shape
export const siteConfig = {
  // Basic info (mapped from blogConfig.site)
  appName: blogConfig.site.name,
  name: blogConfig.site.name,
  tagline: blogConfig.site.tagline,
  description: blogConfig.site.description,
  baseUrl: blogConfig.site.url,
  domain: blogConfig.site.domain,
  email: blogConfig.site.email,
  title: `${blogConfig.site.name} - ${blogConfig.site.tagline}`,
  keywords: blogConfig.seo.keywords,

  // Paths
  baseDomain: blogConfig.site.domain,

  // Internal app URLs (mapped from blogConfig.content.types)
  app: {
    main: '/',
    tips: blogConfig.content.types.posts.path,
    guides: blogConfig.content.types.guides.path,
    news: blogConfig.content.types.news.path,
  },

  // Static pages (from blogConfig.navigation)
  pages: {
    about: '/about',
    contact: '/contact',
    support: '/support',
    privacy: '/privacy-policy',
    terms: '/terms-and-conditions',
    cookies: '/cookie-policy',
  },

  // Legacy fields (kept for compatibility, may not be used)
  downloadUrl: '#', // No longer used
  ios: {
    app: '#', // No longer used
  },
}

// Re-export helper functions with backwards compatibility
export const getCanonicalUrl = getCanonical
export const isExternalUrl = isExternal

// Helper function to check if URL is subdomain
export function isSubdomainUrl(url: string): boolean {
  return url.includes(`.${siteConfig.domain}`) && !url.includes(`www.${siteConfig.domain}`)
}

// Re-export new config for those who want to migrate gradually
export { blogConfig } from '../config'
