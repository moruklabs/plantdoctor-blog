/**
 * Blog Configuration
 *
 * IMPORTANT: This is the SINGLE SOURCE OF TRUTH for all blog settings.
 * To create a new blog, copy this file and update all values below.
 *
 * All hardcoded values should be removed from the codebase and referenced from here.
 */

import type { BlogConfig } from './schema'
import { BLOG_CONSTANTS } from './constants'

// ==========================================================================
// METADATA CONSTANTS (Shared across configuration)
// ==========================================================================

const {
  // Brand names
  BRAND_NAME,
  SITE_NAME,
  AUTHOR_NAME,
  ORGANIZATION_NAME,
  // URLs and domains
  BLOG_DOMAIN,
  BLOG_URL,
  COMPANY_URL,
  // Contact
  COMPANY_EMAIL,
  // Social URLs
  TWITTER_URL,
  GITHUB_URL,
  LINKEDIN_URL,
  // Site info
  SITE_TAGLINE,
  // Descriptions / SEO
  DEFAULT_DESCRIPTION,
  AUTHOR_BIO,
  SEO_KEYWORDS,
  // Company address
  COMPANY_ADDRESS,
  COMPANY_CITY,
  COMPANY_STATE,
  COMPANY_COUNTRY,
  COMPANY_POSTAL_CODE,
  // Company contact
  COMPANY_PHONE,
  COMPANY_PHONE_HREF,
  // Localization
  SITE_LANGUAGE,
  SITE_TIMEZONE,
  // Legal documents
  LEGAL_DOCS_DATE,
  // Assets
  AUTHOR_AVATAR,
  OG_IMAGE,
  LOGO,
} = BLOG_CONSTANTS

// Company email (provided via BLOG_CONSTANTS)

// ==========================================================================
// CONFIGURATION OBJECT
// ==========================================================================

export const blogConfig: BlogConfig = {
  // ==========================================================================
  // SITE CONFIGURATION
  // ==========================================================================
  site: {
    // Basic site information
    name: SITE_NAME,
    tagline: SITE_TAGLINE,
    description: DEFAULT_DESCRIPTION,

    // URLs and domain
    url: BLOG_URL,
    domain: BLOG_DOMAIN,

    // Contact
    email: COMPANY_EMAIL,

    // Localization
    language: SITE_LANGUAGE,
    timezone: SITE_TIMEZONE,
  },

  // ==========================================================================
  // AUTHOR CONFIGURATION
  // ==========================================================================
  author: {
    name: AUTHOR_NAME,
    email: COMPANY_EMAIL,
    url: COMPANY_URL,
    avatar: AUTHOR_AVATAR,
    bio: AUTHOR_BIO,
    social: {
      twitter: `@${TWITTER_URL}`,
      github: GITHUB_URL,
      linkedin: LINKEDIN_URL,
    },
  },

  // ==========================================================================
  // CONTENT CONFIGURATION
  // ==========================================================================
  content: {
    types: {
      // Blog posts (formerly "tips")
      posts: {
        enabled: true,
        path: '/tips',
        title: 'Blog Posts',
        perPage: 12,
      },

      // Long-form guides
      guides: {
        enabled: true,
        path: '/guides',
        title: 'Guides',
        perPage: 10,
      },

      // News articles
      news: {
        enabled: true,
        path: '/news',
        title: 'News',
        perPage: 12,
      },
    },

    // Default author for content (if not specified in frontmatter)
    defaultAuthor: AUTHOR_NAME,

    // Date formatting
    dateFormat: 'MMM dd, yyyy',

    // Excerpt length for previews
    excerptLength: 160,
  },

  // ==========================================================================
  // SEO CONFIGURATION
  // ==========================================================================
  seo: {
    // Default meta tags
    defaultTitle: SITE_NAME,
    titleTemplate: `%s | ${SITE_NAME}`,
    defaultDescription: DEFAULT_DESCRIPTION,

    // Keywords for SEO
    keywords: [...SEO_KEYWORDS],

    // Open Graph image
    ogImage: OG_IMAGE,

    // Twitter handle (without @)
    twitterHandle: TWITTER_URL,

    // Structured data (Schema.org)
    structuredData: {
      organizationName: BRAND_NAME,
      organizationType: 'Organization',
      logo: LOGO,
    },
  },

  // ==========================================================================
  // NAVIGATION CONFIGURATION
  // ==========================================================================
  navigation: {
    // Header navigation
    header: [
      { label: 'Home', href: '/' },
      { label: 'Blog Posts', href: '/tips' },
      { label: 'Guides', href: '/guides' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],

    // Footer navigation (organized in sections)
    footer: {
      sections: [
        {
          title: 'Content',
          links: [
            { label: 'Blog Posts', href: '/tips' },
            { label: 'Guides', href: '/guides' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Support', href: '/support' },
          ],
        },
        {
          title: 'Legal',
          links: [
            { label: 'Privacy Policy', href: '/privacy-policy' },
            { label: 'Terms & Conditions', href: '/terms-and-conditions' },
            { label: 'Cookie Policy', href: '/cookie-policy' },
          ],
        },
      ],
    },
  },

  // ==========================================================================
  // THEME CONFIGURATION
  // ==========================================================================
  theme: {
    default: 'system',
    available: ['light', 'dark', 'system'],
    enableToggle: true,
  },

  // ==========================================================================
  // COMPANY CONFIGURATION
  // ==========================================================================
  company: {
    // Legal entity information
    legal: {
      name: ORGANIZATION_NAME,
      address: COMPANY_ADDRESS,
      city: COMPANY_CITY,
      state: COMPANY_STATE,
      country: COMPANY_COUNTRY,
      postalCode: COMPANY_POSTAL_CODE,
    },

    // Contact information
    contact: {
      email: COMPANY_EMAIL,
      phone: COMPANY_PHONE,
      phoneHref: COMPANY_PHONE_HREF,
    },

    // Legal documents metadata
    legalDocs: {
      effectiveDate: LEGAL_DOCS_DATE,
      privacy: { lastUpdated: LEGAL_DOCS_DATE },
      terms: { lastUpdated: LEGAL_DOCS_DATE },
      cookies: { lastUpdated: LEGAL_DOCS_DATE },
    },
  },

  // ==========================================================================
  // FORMATTING PREFERENCES
  // ==========================================================================
  formatting: {
    // Date formatting
    date: {
      locale: 'en-US',
      formats: {
        // Full date: "January 15, 2025"
        full: {
          year: 'numeric' as const,
          month: 'long' as const,
          day: 'numeric' as const,
        },
        // Short date: "Jan 15, 2025"
        short: {
          year: 'numeric' as const,
          month: 'short' as const,
          day: 'numeric' as const,
        },
        // Featured post date format
        featured: {
          year: 'numeric' as const,
          month: 'long' as const,
          day: 'numeric' as const,
        },
        // Recent posts date format
        recent: {
          year: 'numeric' as const,
          month: 'short' as const,
          day: 'numeric' as const,
        },
      },
    },

    // Reading time formatting
    readingTime: {
      suffix: 'min read',
      suffixShort: 'min',
      default: 5,
    },
  },

  // ==========================================================================
  // UI LABELS & TEXT
  // ==========================================================================
  ui: {
    labels: {
      readArticle: 'Read Article',
      viewAll: 'View All',
      publishedOn: 'Published on',
      latestArticles: 'Latest Articles',
      readMore: 'Read More',
      backToHome: 'Back to Home',
    },
  },
}

// ==========================================================================
// HELPER FUNCTIONS
// ==========================================================================

/**
 * Get canonical URL for a given path
 */
export function getCanonicalUrl(path: string = ''): string {
  return `${blogConfig.site.url}${path}`
}

/**
 * Check if URL is external to this site
 */
export function isExternalUrl(url: string): boolean {
  return url.startsWith('http') && !url.includes(blogConfig.site.domain)
}

/**
 * Get full page title with template
 */
export function getPageTitle(pageTitle?: string): string {
  if (!pageTitle) return blogConfig.seo.defaultTitle

  return blogConfig.seo.titleTemplate
    .replace('%s', pageTitle)
    .replace('{siteName}', blogConfig.site.name)
}

/**
 * Get author information
 */
export function getAuthorInfo() {
  return blogConfig.author
}

/**
 * Get content type configuration
 */
export function getContentType(type: 'posts' | 'guides') {
  return blogConfig.content.types[type]
}
