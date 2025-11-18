import { BLOG_CONSTANTS } from './constants'

export const FOOTER_COPY = {
  brandHeading: BLOG_CONSTANTS.SITE_NAME,
  brandDescription: 'High-signal insights and practical guides. Part of the Moruk ecosystem.',
  copyrightPrefix: 'All rights reserved.',
} as const

export const FOOTER_SECTIONS = {
  guides: {
    title: 'Guides',
    items: [
      { label: 'Dating Profile Optimization', key: 'guide1' },
      { label: 'AI Conversation Mastery', key: 'guide2' },
      { label: 'Modern Dating App Survival', key: 'guide3' },
    ],
  },
  legal: {
    title: 'Legal',
    items: [
      { label: 'Privacy Policy', key: 'privacy' },
      { label: 'Terms & Conditions', key: 'terms' },
      { label: 'Cookie Policy', key: 'cookies' },
      { label: 'Support', key: 'support' },
    ],
  },
} as const
