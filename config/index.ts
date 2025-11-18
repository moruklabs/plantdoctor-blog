/**
 * Configuration Module
 *
 * Central export point for all blog configuration.
 * Import from here to access configuration throughout the app.
 *
 * @example
 * ```ts
 * import { blogConfig, getCanonicalUrl } from '@/config'
 *
 * const siteName = blogConfig.site.name
 * const homeUrl = getCanonicalUrl('/')
 * ```
 */

// Export main configuration
export {
  blogConfig,
  getCanonicalUrl,
  isExternalUrl,
  getPageTitle,
  getAuthorInfo,
  getContentType,
} from './blog.config'

// Export types and schemas for validation
export type {
  BlogConfig,
  SiteConfig,
  AuthorConfig,
  ContentConfig,
  SEOConfig,
  NavigationConfig,
  ThemeConfig,
  NavItem,
} from './schema'

export { validateConfig, BlogConfigSchema } from './schema'

// Re-export for backwards compatibility with old lib/config.ts
// This allows gradual migration
/* eslint-disable @typescript-eslint/no-require-imports */
export const siteConfig = {
  get name() {
    const { blogConfig } = require('./blog.config')
    return blogConfig.site.name
  },
  get tagline() {
    const { blogConfig } = require('./blog.config')
    return blogConfig.site.tagline
  },
  get description() {
    const { blogConfig } = require('./blog.config')
    return blogConfig.site.description
  },
  get baseUrl() {
    const { blogConfig } = require('./blog.config')
    return blogConfig.site.url
  },
  get domain() {
    const { blogConfig } = require('./blog.config')
    return blogConfig.site.domain
  },
  get email() {
    const { blogConfig } = require('./blog.config')
    return blogConfig.site.email
  },
  // Add more getters as needed for backwards compatibility
}
/* eslint-enable @typescript-eslint/no-require-imports */
