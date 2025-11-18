/**
 * Configuration Schema & Types
 *
 * Defines TypeScript types and Zod schemas for blog configuration.
 * This ensures type safety and runtime validation.
 */

import { z } from 'zod'

// ============================================================================
// Site Configuration Schema
// ============================================================================

export const SiteConfigSchema = z.object({
  name: z.string().min(1, 'Site name is required'),
  tagline: z.string().min(1, 'Tagline is required'),
  description: z.string().min(50, 'Description should be at least 50 characters'),
  url: z.string().url('Must be a valid URL'),
  domain: z.string().min(1, 'Domain is required'),
  email: z.string().email('Must be a valid email'),
  language: z.string().default('en'),
  timezone: z.string().default('UTC'),
})

export type SiteConfig = z.infer<typeof SiteConfigSchema>

// ============================================================================
// Author Configuration Schema
// ============================================================================

export const AuthorConfigSchema = z.object({
  name: z.string().min(1, 'Author name is required'),
  email: z.string().email('Must be a valid email'),
  url: z.string().url().optional(),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
  social: z
    .object({
      twitter: z.string().optional(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
})

export type AuthorConfig = z.infer<typeof AuthorConfigSchema>

// ============================================================================
// Content Configuration Schema
// ============================================================================

export const ContentConfigSchema = z.object({
  types: z.object({
    posts: z.object({
      enabled: z.boolean().default(true),
      path: z.string().default('/tips'),
      title: z.string().default('Blog Posts'),
      perPage: z.number().default(12),
    }),
    guides: z.object({
      enabled: z.boolean().default(true),
      path: z.string().default('/guides'),
      title: z.string().default('Guides'),
      perPage: z.number().default(10),
    }),
    news: z.object({
      enabled: z.boolean().default(true),
      path: z.string().default('/news'),
      title: z.string().default('News'),
      perPage: z.number().default(12),
    }),
  }),
  defaultAuthor: z.string().optional(),
  dateFormat: z.string().default('MMM dd, yyyy'),
  excerptLength: z.number().default(160),
})

export type ContentConfig = z.infer<typeof ContentConfigSchema>

// ============================================================================
// SEO Configuration Schema
// ============================================================================

export const SEOConfigSchema = z.object({
  defaultTitle: z.string().min(1),
  titleTemplate: z.string().default('%s | {siteName}'),
  defaultDescription: z.string().min(50),
  keywords: z.array(z.string()).min(3, 'At least 3 keywords required'),
  ogImage: z.string().url().optional(),
  twitterHandle: z.string().optional(),
  structuredData: z.object({
    organizationName: z.string(),
    organizationType: z.string().default('Organization'),
    logo: z.string().url().optional(),
  }),
})

export type SEOConfig = z.infer<typeof SEOConfigSchema>

// ============================================================================
// Navigation Configuration Schema
// ============================================================================

// Define the schema without circular type reference
const NavItemBaseSchema = z.object({
  label: z.string(),
  href: z.string(),
  external: z.boolean().optional(),
})

export const NavItemSchema: z.ZodType<
  z.infer<typeof NavItemBaseSchema> & {
    children?: Array<z.infer<typeof NavItemBaseSchema> & { children?: unknown }>
  }
> = NavItemBaseSchema.extend({
  children: z.array(z.lazy(() => NavItemSchema)).optional(),
})

export const NavigationConfigSchema = z.object({
  header: z.array(NavItemSchema),
  footer: z.object({
    sections: z.array(
      z.object({
        title: z.string(),
        links: z.array(NavItemSchema),
      }),
    ),
  }),
})

export type NavItem = z.infer<typeof NavItemSchema>
export type NavigationConfig = z.infer<typeof NavigationConfigSchema>

// ============================================================================
// Theme Configuration Schema
// ============================================================================

export const ThemeConfigSchema = z.object({
  default: z.enum(['light', 'dark', 'system']).default('system'),
  available: z.array(z.string()).default(['light', 'dark', 'system']),
  enableToggle: z.boolean().default(true),
})

export type ThemeConfig = z.infer<typeof ThemeConfigSchema>

// ============================================================================
// Company Configuration Schema
// ============================================================================

export const CompanyConfigSchema = z.object({
  legal: z.object({
    name: z.string().min(1, 'Company legal name is required'),
    address: z.string().min(1, 'Company address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State/Province is required'),
    country: z.string().min(1, 'Country is required'),
    postalCode: z.string().optional(),
  }),
  contact: z.object({
    email: z.string().email('Must be a valid email'),
    phone: z.string().optional(),
    phoneHref: z.string().optional(),
  }),
  legalDocs: z.object({
    effectiveDate: z.string(), // ISO date string
    privacy: z.object({ lastUpdated: z.string() }).optional(),
    terms: z.object({ lastUpdated: z.string() }).optional(),
    cookies: z.object({ lastUpdated: z.string() }).optional(),
  }),
})

export type CompanyConfig = z.infer<typeof CompanyConfigSchema>

// ============================================================================
// Formatting Configuration Schema
// ============================================================================

export const FormattingConfigSchema = z.object({
  date: z.object({
    locale: z.string().default('en-US'),
    formats: z
      .object({
        full: z.record(z.string(), z.unknown()).optional(),
        short: z.record(z.string(), z.unknown()).optional(),
        featured: z.record(z.string(), z.unknown()).optional(),
        recent: z.record(z.string(), z.unknown()).optional(),
      })
      .optional(),
  }),
  readingTime: z.object({
    suffix: z.string().default('min read'),
    suffixShort: z.string().default('min'),
    default: z.number().default(5),
  }),
})

export type FormattingConfig = z.infer<typeof FormattingConfigSchema>

// ============================================================================
// UI Configuration Schema
// ============================================================================

export const UIConfigSchema = z.object({
  labels: z.object({
    readArticle: z.string().default('Read Article'),
    viewAll: z.string().default('View All'),
    publishedOn: z.string().default('Published on'),
    latestArticles: z.string().default('Latest Articles'),
    readMore: z.string().default('Read More'),
    backToHome: z.string().default('Back to Home'),
  }),
})

export type UIConfig = z.infer<typeof UIConfigSchema>

// ============================================================================
// Complete Blog Configuration Schema
// ============================================================================

export const BlogConfigSchema = z.object({
  site: SiteConfigSchema,
  author: AuthorConfigSchema,
  content: ContentConfigSchema,
  seo: SEOConfigSchema,
  navigation: NavigationConfigSchema,
  theme: ThemeConfigSchema,
  company: CompanyConfigSchema,
  formatting: FormattingConfigSchema,
  ui: UIConfigSchema,
})

export type BlogConfig = z.infer<typeof BlogConfigSchema>

// ============================================================================
// Validation Helper
// ============================================================================

export function validateConfig(config: unknown): BlogConfig {
  return BlogConfigSchema.parse(config)
}
