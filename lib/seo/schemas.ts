/**
 * TypeScript Type Definitions for Schema.org Structured Data
 *
 * Provides type-safe interfaces for common schema types used across the site.
 * Following schema.org vocabulary for SEO and rich snippets.
 */

/**
 * Base interface for all schema.org types
 */
export interface BaseSchema {
  '@context': 'https://schema.org'
  '@type': string
}

/**
 * Organization Schema
 * Used for: Social profiles, company information
 *
 * @see https://schema.org/Organization
 */
export interface OrganizationSchema extends BaseSchema {
  '@type': 'Organization'
  name: string
  url: string
  logo?: string
  sameAs?: string[]
  description?: string
  contactPoint?: ContactPointSchema | ContactPointSchema[]
}

/**
 * Entry Point for Actions
 * Used for: Defining action targets
 *
 * @see https://schema.org/EntryPoint
 */
export interface EntryPoint {
  '@type': 'EntryPoint'
  urlTemplate: string
  actionPlatform?: string[]
}

/**
 * Download Action Schema
 * Used for: App download CTAs
 *
 * @see https://schema.org/DownloadAction
 */
export interface DownloadActionSchema {
  '@type': 'DownloadAction'
  name: string
  target: EntryPoint
}

/**
 * Join Action Schema
 * Used for: Community join CTAs (Discord, etc.)
 *
 * @see https://schema.org/JoinAction
 */
export interface JoinActionSchema {
  '@type': 'JoinAction'
  name: string
  target: EntryPoint
}

/**
 * View Action Schema
 * Used for: Navigation CTAs
 *
 * @see https://schema.org/ViewAction
 */
export interface ViewActionSchema {
  '@type': 'ViewAction'
  name: string
  target: EntryPoint
}

/**
 * Creative Work Schema
 * Used for: Content descriptions
 *
 * @see https://schema.org/CreativeWork
 */
export interface CreativeWorkSchema {
  '@type': 'CreativeWork'
  name: string
  description: string
}

/**
 * Web Page Schema
 * Used for: Page-level metadata
 *
 * @see https://schema.org/WebPage
 */
export interface WebPageSchema extends BaseSchema {
  '@type': 'WebPage'
  mainEntity?: CreativeWorkSchema
  potentialAction?:
    | (DownloadActionSchema | JoinActionSchema | ViewActionSchema | false)[]
    | ViewActionSchema
}

/**
 * Contact Point Schema
 * Used for: Organization contact information
 *
 * @see https://schema.org/ContactPoint
 */
export interface ContactPointSchema {
  '@type': 'ContactPoint'
  contactType: string
  url?: string
  email?: string
  telephone?: string
  areaServed?: string | string[]
  availableLanguage?: string | string[]
}

/**
 * WebSite Schema
 * Used for: Site-wide information
 *
 * @see https://schema.org/WebSite
 */
export interface WebSiteSchema extends BaseSchema {
  '@type': 'WebSite'
  name: string
  url: string
  description?: string
  publisher?: OrganizationSchema
  potentialAction?: {
    '@type': 'SearchAction'
    target: {
      '@type': 'EntryPoint'
      urlTemplate: string
    }
    'query-input': string
  }
}

/**
 * Article Schema
 * Used for: Blog posts and articles
 *
 * @see https://schema.org/Article
 */
export interface ArticleSchema extends BaseSchema {
  '@type': 'Article' | 'BlogPosting' | 'NewsArticle'
  headline: string
  description?: string
  datePublished: string
  dateModified?: string
  author?: PersonSchema | OrganizationSchema
  publisher?: OrganizationSchema
  image?: string | ImageObjectSchema | Array<string | ImageObjectSchema>
  articleSection?: string
  keywords?: string
  // Google News specific fields
  articleBody?: string
  url?: string
}

/**
 * Person Schema
 * Used for: Author information
 *
 * @see https://schema.org/Person
 */
export interface PersonSchema {
  '@type': 'Person'
  name: string
  url?: string
  email?: string
  image?: string | ImageObjectSchema
  sameAs?: string[]
}

/**
 * Image Object Schema
 * Used for: Image metadata in structured data
 *
 * @see https://schema.org/ImageObject
 */
export interface ImageObjectSchema {
  '@type': 'ImageObject'
  url: string
  width?: number
  height?: number
  caption?: string
}

/**
 * Breadcrumb List Schema
 * Used for: Navigation breadcrumbs
 *
 * @see https://schema.org/BreadcrumbList
 */
export interface BreadcrumbListSchema extends BaseSchema {
  '@type': 'BreadcrumbList'
  itemListElement: BreadcrumbListItemSchema[]
}

/**
 * Breadcrumb List Item Schema
 * Used for: Individual breadcrumb items
 *
 * @see https://schema.org/BreadcrumbList
 */
export interface BreadcrumbListItemSchema {
  '@type': 'ListItem'
  position: number
  name: string
  item?: string
}
