/**
 * Structured Data Factory Functions
 *
 * Type-safe factory functions for creating schema.org JSON-LD structured data.
 * Implements Single Responsibility Principle - each factory creates one schema type.
 * Enables IntelliSense support and compile-time type checking.
 */

import type {
  OrganizationSchema,
  WebPageSchema,
  DownloadActionSchema,
  JoinActionSchema,
  ViewActionSchema,
  EntryPoint,
  CreativeWorkSchema,
  ContactPointSchema,
  WebSiteSchema,
  ArticleSchema,
  PersonSchema,
  ImageObjectSchema,
  BreadcrumbListSchema,
  BreadcrumbListItemSchema,
} from './schemas'

/**
 * Create Organization Schema
 * Used for: Social media profiles, company information
 *
 * @example
 * ```tsx
 * const schema = createOrganizationSchema({
 *   name: blogConfig.site.name,
 *   url: blogConfig.site.url,
 *   sameAs: []
 * })
 * ```
 */
export function createOrganizationSchema(
  data: Omit<OrganizationSchema, '@context' | '@type'>,
): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...data,
  }
}

/**
 * Create Entry Point
 * Used for: Defining action targets
 *
 * @example
 * ```tsx
 * const entryPoint = createEntryPoint({
 *   urlTemplate: 'https://blog.plantdoctor.app/app',
 *   actionPlatform: ['http://schema.org/MobileWebPlatform']
 * })
 * ```
 */
export function createEntryPoint(data: Omit<EntryPoint, '@type'>): EntryPoint {
  return {
    '@type': 'EntryPoint',
    ...data,
  }
}

/**
 * Create Download Action Schema
 * Used for: App download CTAs
 *
 * @example
 * ```tsx
 * const action = createDownloadAction({
 *   name: 'Download {blogConfig.site.name} App',
 *   target: createEntryPoint({
 *     urlTemplate: 'https://blog.plantdoctor.app',
 *     actionPlatform: ['http://schema.org/DesktopWebPlatform']
 *   })
 * })
 * ```
 */
export function createDownloadAction(
  data: Omit<DownloadActionSchema, '@type'>,
): DownloadActionSchema {
  return {
    '@type': 'DownloadAction',
    ...data,
  }
}

/**
 * Create Join Action Schema
 * Used for: Community join CTAs (Discord, social media)
 *
 * @example
 * ```tsx
 * const action = createJoinAction({
 *   name: 'Join Discord Community',
 *   target: createEntryPoint({
 *     urlTemplate: 'https://discord.gg/blog.plantdoctor.app'
 *   })
 * })
 * ```
 */
export function createJoinAction(data: Omit<JoinActionSchema, '@type'>): JoinActionSchema {
  return {
    '@type': 'JoinAction',
    ...data,
  }
}

/**
 * Create View Action Schema
 * Used for: Navigation CTAs
 *
 * @example
 * ```tsx
 * const action = createViewAction({
 *   name: 'Start Reading Our Advice',
 *   target: createEntryPoint({
 *     urlTemplate: 'https://blog.plantdoctor.app/tips'
 *   })
 * })
 * ```
 */
export function createViewAction(data: Omit<ViewActionSchema, '@type'>): ViewActionSchema {
  return {
    '@type': 'ViewAction',
    ...data,
  }
}

/**
 * Create Creative Work Schema
 * Used for: Content descriptions in structured data
 *
 * @example
 * ```tsx
 * const work = createCreativeWork({
 *   name: 'Dating Advice Tips',
 *   description: 'Expert dating advice for modern relationships'
 * })
 * ```
 */
export function createCreativeWork(data: Omit<CreativeWorkSchema, '@type'>): CreativeWorkSchema {
  return {
    '@type': 'CreativeWork',
    ...data,
  }
}

/**
 * Create Web Page Schema
 * Used for: Page-level structured data with actions
 *
 * @example
 * ```tsx
 * const schema = createWebPageSchema({
 *   mainEntity: createCreativeWork({
 *     name: 'Dating Tips',
 *     description: 'Learn modern dating strategies'
 *   }),
 *   potentialAction: createViewAction({
 *     name: 'Read Tips',
 *     target: createEntryPoint({ urlTemplate: 'https://blog.plantdoctor.app/tips' })
 *   })
 * })
 * ```
 */
export function createWebPageSchema(
  data: Omit<WebPageSchema, '@context' | '@type'>,
): WebPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    ...data,
  }
}

/**
 * Create Contact Point Schema
 * Used for: Organization contact information
 *
 * @example
 * ```tsx
 * const contactPoint = createContactPoint({
 *   contactType: 'Customer Support',
 *   url: 'https://blog.plantdoctor.app/support',
 *   email: 'support@blog.plantdoctor.app'
 * })
 * ```
 */
export function createContactPoint(data: Omit<ContactPointSchema, '@type'>): ContactPointSchema {
  return {
    '@type': 'ContactPoint',
    ...data,
  }
}

/**
 * Create WebSite Schema
 * Used for: Site-wide information
 *
 * @example
 * ```tsx
 * const schema = createWebSiteSchema({
 *   name: blogConfig.site.name,
 *   url: blogConfig.site.url,
 *   description: blogConfig.site.description,
 *   publisher: createOrganizationSchema({
 *     name: blogConfig.site.name,
 *     url: blogConfig.site.url
 *   })
 * })
 * ```
 */
export function createWebSiteSchema(
  data: Omit<WebSiteSchema, '@context' | '@type'>,
): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    ...data,
  }
}

/**
 * Create Article Schema
 * Used for: Blog posts and articles
 *
 * @example
 * ```tsx
 * const schema = createArticleSchema({
 *   headline: 'How to Optimize Your Profile',
 *   description: 'A comprehensive guide...',
 *   datePublished: '2025-01-15',
 *   author: createPersonSchema({
 *     name: 'John Doe',
 *     url: 'https://blog.plantdoctor.app/authors/john'
 *   }),
 *   publisher: createOrganizationSchema({
 *     name: blogConfig.site.name,
 *     url: blogConfig.site.url
 *   })
 * })
 * ```
 */
export function createArticleSchema(
  data: Omit<ArticleSchema, '@context' | '@type'>,
  articleType: 'Article' | 'BlogPosting' | 'NewsArticle' = 'Article',
): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': articleType,
    ...data,
  }
}

/**
 * Create Person Schema
 * Used for: Author information
 *
 * @example
 * ```tsx
 * const person = createPersonSchema({
 *   name: 'John Doe',
 *   url: 'https://blog.plantdoctor.app/authors/john',
 *   email: 'john@example.com',
 *   image: 'https://blog.plantdoctor.app/images/authors/john.jpg'
 * })
 * ```
 */
export function createPersonSchema(data: Omit<PersonSchema, '@type'>): PersonSchema {
  return {
    '@type': 'Person',
    ...data,
  }
}

/**
 * Create Image Object Schema
 * Used for: Image metadata in structured data
 *
 * @example
 * ```tsx
 * const image = createImageObject({
 *   url: 'https://blog.plantdoctor.app/images/post.jpg',
 *   width: 1200,
 *   height: 630,
 *   caption: 'Post cover image'
 * })
 * ```
 */
export function createImageObject(data: Omit<ImageObjectSchema, '@type'>): ImageObjectSchema {
  return {
    '@type': 'ImageObject',
    ...data,
  }
}

/**
 * Create Breadcrumb List Schema
 * Used for: Navigation breadcrumbs
 *
 * @example
 * ```tsx
 * const breadcrumbs = createBreadcrumbList([
 *   { name: 'Home', item: 'https://blog.plantdoctor.app' },
 *   { name: 'Tips', item: 'https://blog.plantdoctor.app/tips' },
 *   { name: 'Current Post' }
 * ])
 * ```
 */
export function createBreadcrumbList(
  items: Array<{ name: string; item?: string }>,
): BreadcrumbListSchema {
  const itemListElement: BreadcrumbListItemSchema[] = items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    ...(item.item && { item: item.item }),
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  }
}

/**
 * Create Organization Schema with Contact Point
 * Convenience function for homepage organization with contact information
 *
 * @example
 * ```tsx
 * const schema = createOrganizationWithContactPoint({
 *   name: blogConfig.site.name,
 *   url: blogConfig.site.url,
 *   logo: `${blogConfig.site.url}/favicon.svg`,
 *   description: blogConfig.site.description,
 *   contactPoint: {
 *     contactType: 'Customer Support',
 *     url: `${blogConfig.site.url}/support`
 *   }
 * })
 * ```
 */
export function createOrganizationWithContactPoint(
  data: Omit<OrganizationSchema, '@context' | '@type' | 'contactPoint'> & {
    contactPoint?: Omit<ContactPointSchema, '@type'>
  },
): OrganizationSchema {
  const { contactPoint, ...organizationData } = data

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    ...organizationData,
    ...(contactPoint && { contactPoint: createContactPoint(contactPoint) }),
  }
}
