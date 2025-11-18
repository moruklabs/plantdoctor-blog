/**
 * SEO Utilities - Centralized Exports
 *
 * Barrel export for all SEO-related utilities including:
 * - Type-safe schema factories
 * - TypeScript interfaces for schema.org types
 */

// Export all factory functions
export {
  createOrganizationSchema,
  createEntryPoint,
  createDownloadAction,
  createJoinAction,
  createViewAction,
  createCreativeWork,
  createWebPageSchema,
} from './structured-data'

// Export all TypeScript types
export type {
  BaseSchema,
  OrganizationSchema,
  EntryPoint,
  DownloadActionSchema,
  JoinActionSchema,
  ViewActionSchema,
  CreativeWorkSchema,
  WebPageSchema,
} from './schemas'

// Export guide-specific structured data
export * from './guide-structured-data'
