/**
 * Hardcoded related content configuration for guides
 *
 * Each guide maps to exactly 6 curated blog posts.
 * This provides more control over related content vs tag-based algorithms.
 */

export type GuideSlug = string
export type PostSlug = string

export interface GuideRelatedContent {
  /**
   * Exactly 6 blog post slugs that are most relevant to this guide
   */
  posts: [PostSlug, PostSlug, PostSlug, PostSlug, PostSlug, PostSlug]
}

/**
 * Map of guide slugs to their related content
 *
 * IMPORTANT: Each guide MUST have exactly 6 related posts defined.
 * This is validated by tests in __tests__/guides-related-content.test.ts
 *
 * These are curated related posts from each guide's topic cluster.
 * Updated in Phase 8: SEO Optimization with comprehensive hub guides.
 */
export const guideRelatedContent: Record<GuideSlug, GuideRelatedContent> = {
  'productivity-and-wellness-mastery': {
    posts: [
      '6-minute-morning-breath-circuit-to-kill-the-phone-habit-and-lower-cortisol',
      '3-2-1-micro-resets-a-portable-ritual-to-turn-misses-into-momentum',
      '3-minute-meeting-detox-a-practical-buffer-to-clear-cognitive-residue',
      '5-minute-metta-for-difficult-colleagues-a-practical-script-to-stay-calm-and-connected',
      '90-second-commuter-sunrise-quick-energy-rituals-for-short-journeys',
      '90-second-micro-handover-a-shift-change-breath-ritual-for-clinicians-and-nurses',
    ],
  },
  'pet-care-and-nutrition-guide': {
    posts: [
      '9-subtle-signs-your-cat-is-hurting-and-exactly-how-to-test-them-at-home',
      '48-hour-succulent-rescue-prioritized-checklist-to-save-soft-leaves',
      '3-minute-jaw-neck-micro-scan-invisible-relief-during-video-days',
      '7-day-coolant-detective-plan-systematic-steps-to-track-intermittent-losses',
      '60-second-photo-triage-tell-iron-chlorosis-from-natural-aging-or-overwatering',
      '7-day-diagnostic-plan-find-intermittent-coolant-loss-without-a-mechanic',
    ],
  },
  'diy-maintenance-and-optimization': {
    posts: [
      '20-minute-showroom-shine-the-express-wash-wax-routine-for-busy-drivers',
      '7-day-coolant-detective-plan-systematic-steps-to-track-intermittent-losses',
      '60-second-photo-triage-tell-iron-chlorosis-from-natural-aging-or-overwatering',
      '7-day-diagnostic-plan-find-intermittent-coolant-loss-without-a-mechanic',
      '3-minute-jaw-neck-micro-scan-invisible-relief-during-video-days',
      '48-hour-succulent-rescue-prioritized-checklist-to-save-soft-leaves',
    ],
  },
  'ai-tools-content-creation-mastery': {
    posts: [
      'adcreative-ai-getting-started-generating-high-converting-social-ad-images-from-text',
      'a-b-testing-menu-descriptions-how-menumuse-helps-you-optimize-descriptions-based-on-customer-feedback',
      'a-b-tests-that-prove-your-hook-privacy-first-experiments-to-measure-real-engagement',
      'accessible-font-pairings-for-the-web-a-practical-guide-for-marketers',
      'advanced-caption-techniques-personalization-and-style-consistency',
      'admock-ai-beginner-guide-create-high-converting-product-images-from-text',
    ],
  },
  'habit-building-and-behavior-change': {
    posts: [
      '3-2-1-micro-reset-a-portable-ritual-to-turn-slips-into-momentum',
      '3-2-1-micro-resets-a-portable-ritual-to-turn-misses-into-momentum',
      '5-minute-readiness-checks-how-to-know-when-your-warm-up-worked',
      '5-minute-metta-for-difficult-colleagues-a-practical-script-to-stay-calm-and-connected',
      '90-second-commuter-sunrise-quick-energy-rituals-for-short-journeys',
      '6-minute-morning-breath-circuit-to-kill-the-phone-habit-and-lower-cortisol',
    ],
  },
  'business-templates-monetization': {
    posts: [
      'a-b-testing-menu-descriptions-how-menumuse-helps-you-optimize-descriptions-based-on-customer-feedback',
      'a-b-tests-that-prove-your-hook-privacy-first-experiments-to-measure-real-engagement',
      'accessible-font-pairings-for-the-web-a-practical-guide-for-marketers',
      'accountability-agreements-that-don-t-feel-legalistic-simple-templates-you-can-use-today',
      'accurate-reading-time-formulas-scripts-and-ux-patterns-for-inclusive-estimates',
      'a-b-night-routine-3-low-energy-openers-to-test-for-faster-replies',
    ],
  },
}

/**
 * Get related posts for a specific guide
 *
 * @param guideSlug - The slug of the guide
 * @returns Array of exactly 6 post slugs, or empty array if guide not found
 */
export function getRelatedPostsForGuide(guideSlug: string): PostSlug[] {
  const content = guideRelatedContent[guideSlug]
  return content?.posts ?? []
}

/**
 * Check if a guide has related content defined
 *
 * @param guideSlug - The slug of the guide
 * @returns true if the guide has related content configuration
 */
export function hasRelatedContent(guideSlug: string): boolean {
  return guideSlug in guideRelatedContent
}
