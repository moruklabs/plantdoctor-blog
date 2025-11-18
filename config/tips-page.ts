import { blogConfig } from '@/config'

export const tipsPageTexts = {
  hero: {
    title: blogConfig.content.types.posts.title,
    description:
      'Explore our latest articles on AI, machine learning, and technology trends. Expert insights and practical guides to help you stay ahead.',
  },
  cta: {
    heading: 'Stay Updated',
    description:
      'Get the latest AI insights delivered to your inbox. Subscribe to our newsletter for weekly updates.',
    buttonText: 'Subscribe to Newsletter',
  },
} as const

export const tipsPageMetadata = {
  title: blogConfig.content.types.posts.title,
  description:
    'Explore our latest articles on AI, machine learning, and technology trends. Expert insights and practical guides.',
  path: blogConfig.content.types.posts.path,
} as const
