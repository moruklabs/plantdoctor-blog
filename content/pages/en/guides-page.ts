/**
 * Guides Page Content (English)
 *
 * This file contains all text content for the Guides listing page.
 * Organized for easy translation (i18n-ready).
 */

export const guidesPageContent = {
  // Hero Section
  hero: {
    emoji: '📚',
    title: 'Comprehensive Guides',
    description:
      'In-depth tutorials and step-by-step guides to help you master AI, machine learning, and emerging technologies.',
  },

  // UI Labels
  ui: {
    noGuidesFound: 'No guides found',
    browseAllGuides: 'Browse All Guides',
    readGuide: 'Read Guide',
    minutesRead: 'min read',
    publishedOn: 'Published on',
  },

  // Categories (if needed for future filtering)
  categories: {
    all: 'All Guides',
    tutorials: 'Tutorials',
    fundamentals: 'Fundamentals',
    advanced: 'Advanced Topics',
  },

  // Empty State
  emptyState: {
    title: 'No Guides Yet',
    description: 'Check back soon for comprehensive guides and tutorials.',
    cta: 'Browse Blog Posts',
    ctaHref: '/tips',
  },
} as const
