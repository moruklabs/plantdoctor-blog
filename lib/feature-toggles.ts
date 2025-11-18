/**
 * Feature Toggles Configuration
 *
 * Centralized feature toggle system for managing all feature states across the application.
 * This module provides a single source of truth for enabling/disabling features and their
 * nested components.
 *
 * ## Architecture
 *
 * - **Hierarchical Structure**: Features can have nested toggles (e.g., `podcasts.modelsEnabled`)
 * - **Parent-Child Relationships**: When a parent feature is disabled, all child features
 *   should be considered disabled regardless of their individual state
 * - **Type Safety**: Full TypeScript support for autocomplete and compile-time checking
 *
 * ## Usage Examples
 *
 * ### Basic Feature Check
 * ```typescript
 * import { featureToggles } from '@/lib/feature-toggles'
 *
 * if (featureToggles.blog.enabled) {
 *   // Show blog-related UI
 * }
 * ```
 *
 * ### Hierarchical Feature Check
 * ```typescript
 * import { featureToggles, isFeatureEnabled } from '@/lib/feature-toggles'
 *
 * // Check if podcasts feature is enabled
 * if (isFeatureEnabled('podcasts')) {
 *   // Check if models podcast is enabled (respects parent state)
 *   if (isFeatureEnabled('podcasts.modelsEnabled')) {
 *     // Show models podcast
 *   }
 * }
 * ```
 *
 * ### Component Integration
 * ```typescript
 * import { featureToggles } from '@/lib/feature-toggles'
 *
 * export function Header() {
 *   return (
 *     <nav>
 *       {featureToggles.blog.enabled && <Link href="/tips">Tips</Link>}
 *       {featureToggles.podcasts.enabled && <Link href="/podcasts">Podcasts</Link>}
 *       {featureToggles.guides.enabled && <Link href="/guides">Guides</Link>}
 *     </nav>
 *   )
 * }
 * ```
 *
 * ## Adding New Features
 *
 * 1. Add the feature to the `FeatureToggles` type definition
 * 2. Add the feature to the `featureToggles` object with a default state
 * 3. Add documentation comments explaining the feature and its scope
 * 4. Update components to reference the new toggle
 *
 * Example:
 * ```typescript
 * // In type definition
 * export interface FeatureToggles {
 *   myNewFeature: {
 *     enabled: boolean
 *     subFeature?: boolean
 *   }
 * }
 *
 * // In featureToggles object
 * export const featureToggles: FeatureToggles = {
 *   myNewFeature: {
 *     enabled: true,
 *     subFeature: true,
 *   },
 * }
 * ```
 */

/**
 * Guides Feature Configuration
 */
export interface GuidesToggles {
  /** Master toggle for all guides functionality */
  enabled: boolean
}

/**
 * Blog Feature Configuration
 */
export interface BlogToggles {
  /** Master toggle for all blog functionality */
  enabled: boolean
}

/**
 * Testimonials Feature Configuration
 */
export interface TestimonialsToggles {
  /** Master toggle for testimonials functionality */
  enabled: boolean
}

/**
 * Complete Feature Toggles Configuration
 */
export interface FeatureToggles {
  guides: GuidesToggles
  tips: BlogToggles
  testimonials: TestimonialsToggles
}

/**
 * Feature Toggles Configuration Object
 *
 * This is the single source of truth for all feature states in the application.
 * Modify these values to enable or disable features across the entire app.
 */
export const featureToggles: FeatureToggles = {
  /**
   * Guides
   *
   * Controls comprehensive guides including:
   * - Guide pages
   * - Navigation links
   * - Landing page guide sections
   * - Sitemap entries
   */
  guides: {
    enabled: true,
  },

  /**
   * Blog
   *
   * Controls all blog functionality including:
   * - Blog post pages
   * - Blog listing page
   * - Navigation links
   * - Landing page blog sections
   * - Sitemap entries
   */
  tips: {
    enabled: true,
  },

  /**
   * Testimonials
   *
   * Controls testimonials functionality and display
   */
  testimonials: {
    enabled: true,
  },
}

/**
 * Helper function to check if a feature is enabled
 *
 * Supports hierarchical feature paths using dot notation.
 * When checking nested features, this function respects parent feature states.
 *
 * @param featurePath - Dot-notation path to the feature (e.g., 'podcasts', 'podcasts.modelsEnabled')
 * @returns true if the feature is enabled, false otherwise
 *
 * @example
 * ```typescript
 * // Check top-level feature
 * isFeatureEnabled('podcasts') // true if podcasts.enabled === true
 *
 * // Check nested feature (respects parent state)
 * isFeatureEnabled('podcasts.modelsEnabled')
 * // Returns true only if both podcasts.enabled === true AND modelsEnabled === true
 * ```
 */
export function isFeatureEnabled(featurePath: string): boolean {
  const parts = featurePath.split('.')
  let current: unknown = featureToggles

  for (const part of parts) {
    if (current === undefined || current === null) {
      return false
    }

    // Type guard to ensure current is an object before accessing properties
    if (typeof current !== 'object') {
      return false
    }

    current = (current as Record<string, unknown>)[part]

    // Check if current level has an 'enabled' property
    if (typeof current === 'object' && current !== null && 'enabled' in current) {
      if (!(current as { enabled: boolean }).enabled) {
        return false
      }
    }
  }

  // If we got a boolean value, return it
  if (typeof current === 'boolean') {
    return current
  }

  // If we got an object with 'enabled', return that
  if (typeof current === 'object' && current !== null && 'enabled' in current) {
    return (current as { enabled: boolean }).enabled
  }

  // Default to false for undefined paths
  return false
}
