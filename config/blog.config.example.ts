/**
 * Blog Configuration Template
 *
 * INSTRUCTIONS:
 * 1. Copy this file to `blog.config.ts`
 * 2. Fill in all the values marked with TODO
 * 3. Run `pnpm validate:config` to check for errors
 * 4. Deploy your new blog!
 *
 * This template shows all available configuration options.
 * Remove or comment out any sections you don't need.
 */

import type { BlogConfig } from './schema'

export const blogConfig: BlogConfig = {
  // ==========================================================================
  // SITE CONFIGURATION
  // ==========================================================================
  site: {
    // TODO: Update these with your blog information
    name: 'My Awesome Blog',
    tagline: 'Sharing knowledge and insights',
    description:
      'A blog about technology, programming, and everything in between. Share your expertise and connect with readers.',

    // TODO: Update with your actual domain
    url: 'https://blog.example.com',
    domain: 'blog.example.com',

    // TODO: Update with your contact email
    email: 'hello@example.com',

    // Localization
    language: 'en', // ISO 639-1 code
    timezone: 'UTC', // IANA timezone
  },

  // ==========================================================================
  // AUTHOR CONFIGURATION
  // ==========================================================================
  author: {
    // TODO: Update with author information
    name: 'Your Name',
    email: 'you@example.com',
    url: 'https://example.com',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'A brief bio about yourself or your team.',
    social: {
      twitter: '@yourhandle', // Without @ symbol
      github: 'yourusername',
      linkedin: 'in/yourprofile',
    },
  },

  // ==========================================================================
  // CONTENT CONFIGURATION
  // ==========================================================================
  content: {
    types: {
      // Blog posts
      posts: {
        enabled: true,
        path: '/blog', // Or '/posts', '/articles', etc.
        title: 'Blog Posts',
        perPage: 12,
      },

      // Long-form guides
      guides: {
        enabled: true, // Set to false if you don't need guides
        path: '/guides',
        title: 'Guides',
        perPage: 10,
      },

      // News articles
      news: {
        enabled: true, // Set to false if you don't need news
        path: '/news',
        title: 'News',
        perPage: 12,
      },
    },

    // Default author (if not specified in frontmatter)
    defaultAuthor: 'Your Name',

    // Date display format (see date-fns format)
    dateFormat: 'MMM dd, yyyy',

    // Excerpt length for previews
    excerptLength: 160,
  },

  // ==========================================================================
  // SEO CONFIGURATION
  // ==========================================================================
  seo: {
    // TODO: Update SEO defaults
    defaultTitle: 'My Awesome Blog',
    titleTemplate: '%s | My Awesome Blog',
    defaultDescription:
      'A blog about technology, programming, and everything in between. Share your expertise and connect with readers.',

    // TODO: Add relevant keywords (minimum 3)
    keywords: [
      'technology',
      'programming',
      'web development',
      'software engineering',
      'tutorials',
      // Add more keywords relevant to your niche
    ],

    // Open Graph image (shown when shared on social media)
    ogImage: 'https://example.com/images/og-default.jpg',

    // Twitter handle (without @)
    twitterHandle: 'yourhandle',

    // Structured data for search engines
    structuredData: {
      organizationName: 'Your Organization',
      organizationType: 'Organization', // or 'Person', 'Company', etc.
      logo: 'https://example.com/logo.png',
    },
  },

  // ==========================================================================
  // NAVIGATION CONFIGURATION
  // ==========================================================================
  navigation: {
    // Header navigation
    header: [
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: 'Guides', href: '/guides' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      // Add more navigation items as needed
    ],

    // Footer navigation (organized in sections)
    footer: {
      sections: [
        {
          title: 'Content',
          links: [
            { label: 'Blog Posts', href: '/blog' },
            { label: 'Guides', href: '/guides' },
            { label: 'Archive', href: '/archive' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'About', href: '/about' },
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
        // Add more footer sections as needed
      ],
    },
  },

  // ==========================================================================
  // THEME CONFIGURATION
  // ==========================================================================
  theme: {
    // Default theme when user first visits
    default: 'system', // 'light', 'dark', or 'system'

    // Available theme options
    available: ['light', 'dark', 'system'],

    // Enable theme toggle button in UI
    enableToggle: true,
  },

  // ==========================================================================
  // COMPANY CONFIGURATION
  // ==========================================================================
  company: {
    // Legal entity information (for legal pages)
    legal: {
      name: 'Your Company LLC', // TODO: Update with legal business name
      address: '123 Main Street', // TODO: Update with company address
      city: 'San Francisco', // TODO: Update with city
      state: 'California', // TODO: Update with state/province
      country: 'United States', // TODO: Update with country
      postalCode: '94101', // TODO: Update with postal code
    },

    // Contact information
    contact: {
      email: 'hello@example.com', // TODO: Update with contact email
      phone: '+1 (555) 123-4567', // TODO: Update with phone (optional)
      phoneHref: 'tel:+15551234567', // TODO: Update with tel: link (optional)
    },

    // Legal documents metadata
    legalDocs: {
      effectiveDate: '2024-01-01', // TODO: Update with effective date (ISO format)
      privacy: { lastUpdated: '2024-01-01' }, // TODO: Update when privacy policy changes
      terms: { lastUpdated: '2024-01-01' }, // TODO: Update when terms change
      cookies: { lastUpdated: '2024-01-01' }, // TODO: Update when cookie policy changes
    },
  },

  // ==========================================================================
  // FORMATTING PREFERENCES
  // ==========================================================================
  formatting: {
    // Date formatting
    date: {
      locale: 'en-US', // IETF BCP 47 language tag
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
      suffix: 'min read', // Full suffix: "5 min read"
      suffixShort: 'min', // Short suffix: "5 min"
      default: 5, // Default reading time if not calculated
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

// Keep the helper functions from blog.config.ts
export function getCanonicalUrl(path: string = ''): string {
  return `${blogConfig.site.url}${path}`
}

export function isExternalUrl(url: string): boolean {
  return url.startsWith('http') && !url.includes(blogConfig.site.domain)
}

export function getPageTitle(pageTitle?: string): string {
  if (!pageTitle) return blogConfig.seo.defaultTitle
  return blogConfig.seo.titleTemplate
    .replace('%s', pageTitle)
    .replace('{siteName}', blogConfig.site.name)
}

export function getAuthorInfo() {
  return blogConfig.author
}

export function getContentType(type: 'posts' | 'guides') {
  return blogConfig.content.types[type]
}
