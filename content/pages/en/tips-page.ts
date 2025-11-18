/**
 * Tips Page Content (English)
 *
 * This file contains all text content for the Tips/Blog Posts listing page.
 * Organized for easy translation (i18n-ready).
 */

export const tipsPageContent = {
  // Hero Section
  hero: {
    emoji: '✨',
    title: 'Latest Articles',
    description:
      'Practical insights, expert analysis, and actionable advice on AI, technology, and innovation.',
  },

  // UI Labels
  ui: {
    noPostsFound: 'No posts found',
    browseAllPosts: 'Browse All Posts',
    readArticle: 'Read Article',
    minutesRead: 'min read',
    publishedOn: 'Published on',
    latestArticles: 'Latest Articles',
    featuredPosts: 'Featured Posts',
  },

  // Categories (if needed for future filtering)
  categories: {
    all: 'All Posts',
    ai: 'Artificial Intelligence',
    ml: 'Machine Learning',
    tech: 'Technology Trends',
    tutorials: 'Tutorials',
  },

  // Empty State
  emptyState: {
    title: 'No Posts Yet',
    description: 'Check back soon for the latest articles and insights.',
    cta: 'Browse Guides',
    ctaHref: '/guides',
  },
} as const
