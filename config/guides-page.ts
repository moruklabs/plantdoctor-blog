import { blogConfig } from '@/config'

export const guidesPageTexts = {
  hero: {
    title: 'Complete Dating & Relationship Guides',
    description:
      'In-depth, comprehensive guides designed to help you master every aspect of modern dating. From profile optimization to building lasting connections, find everything you need in one place.',
  },
  emptyState: {
    message: 'No guides available yet. Check back soon for comprehensive dating advice!',
  },
  cta: {
    heading: 'Put These Guides Into Action',
    description: `Apply what you&apos;ve learned with ${blogConfig.site.name}&apos;s AI assistant. Get instant photo ratings, personalized conversation starters, and profile optimization tailored to your goals.`,
    buttonText: 'Start Your Dating Transformation',
  },
} as const

export const guidesPageMetadata = {
  title: `Dating Guides - ${blogConfig.site.name}`,
  description:
    'Comprehensive guides covering profile optimization, conversation mastery, and relationship success. In-depth advice to transform your life.',
  path: blogConfig.content.types.guides.path,
} as const
