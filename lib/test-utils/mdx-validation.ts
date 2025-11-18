/**
 * Test Utilities for MDX Content Validation
 *
 * This module provides reusable test helpers for validating MDX content
 * across different content types (posts, guides, etc.).
 *
 * Benefits:
 * - DRY: Eliminates duplicate test code
 * - Consistent: Same validation logic across all content types
 * - Maintainable: Update validation rules in one place
 * - Readable: Declarative test configuration
 */

import fs from 'fs'
import path from 'path'
import { processMDX, validateFrontmatter } from '@/lib/content/mdx-processor'

/**
 * Configuration for MDX content validation
 */
export interface MDXValidationConfig {
  /** Directory name where content files are stored */
  directory: string
  /** Expected canonical URL prefix (e.g., 'https://blog.plantdoctor.app/blog') */
  canonicalPrefix: string
  /** Optional: Minimum number of MDX files expected */
  minFiles?: number
}

/**
 * Validate all MDX files in a directory
 *
 * This function performs comprehensive validation of MDX frontmatter and content:
 * - Frontmatter delimiter (---) at start
 * - Valid title (non-empty string)
 * - Valid tags (non-empty array of strings)
 * - Valid date (YYYY-MM-DD format)
 * - Correct canonical URL format
 * - Valid draft flag (boolean)
 * - Valid reading time (positive integer)
 * - Valid language (non-empty string)
 * - Meta description exists
 * - Content exists
 * - HTML exists
 *
 * @param config - Validation configuration
 */
export function validateMDXFiles(config: MDXValidationConfig): void {
  const directory = path.join(process.cwd(), config.directory)

  // Handle missing directory gracefully
  const mdxFiles = fs.existsSync(directory)
    ? fs.readdirSync(directory).filter((file) => file.endsWith('.mdx'))
    : []

  if (mdxFiles.length === 0) {
    // Allow empty directories for new content types
    if (config.minFiles && config.minFiles > 0) {
      throw new Error(
        `No MDX files found in ${config.directory} (expected at least ${config.minFiles})`,
      )
    }
    return
  }

  if (config.minFiles) {
    expect(mdxFiles.length).toBeGreaterThanOrEqual(config.minFiles)
  }

  mdxFiles.forEach((file) => {
    const slug = file.replace(/\.mdx$/, '')
    const filePath = path.join(directory, file)
    const source = fs.readFileSync(filePath, 'utf8')

    // Should start with frontmatter delimiter
    expect(source.trim().startsWith('---')).toBe(true)

    const processed = processMDX(source, slug)
    const frontmatter = validateFrontmatter(processed.frontmatter)

    // Title validation
    expect(typeof frontmatter.title).toBe('string')
    expect(frontmatter.title.trim().length).toBeGreaterThan(0)

    // Tags validation
    expect(Array.isArray(frontmatter.tags)).toBe(true)
    expect(frontmatter.tags.length).toBeGreaterThan(0)
    expect(frontmatter.tags.every((tag) => typeof tag === 'string' && tag.trim().length > 0)).toBe(
      true,
    )

    // Date validation
    expect(frontmatter.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(Number.isNaN(new Date(frontmatter.date).getTime())).toBe(false)

    // Canonical URL validation
    expect(frontmatter.canonical).toBe(`${config.canonicalPrefix}/${slug}`)

    // Draft flag validation
    expect(typeof frontmatter.draft).toBe('boolean')

    // Reading time validation
    expect(typeof frontmatter.readingTime).toBe('number')
    expect(Number.isInteger(frontmatter.readingTime)).toBe(true)
    expect(frontmatter.readingTime).toBeGreaterThan(0)

    // Language validation
    expect(typeof frontmatter.lang).toBe('string')
    expect((frontmatter.lang ?? '').trim().length).toBeGreaterThan(0)

    // Meta description validation
    const hasMetaDescription = Boolean(
      (processed.frontmatter.description && processed.frontmatter.description.trim()) ||
        (processed.frontmatter.meta_desc && processed.frontmatter.meta_desc.trim()),
    )
    expect(hasMetaDescription).toBe(true)

    // Content validation
    expect(processed.content.trim().length).toBeGreaterThan(0)
    expect(processed.html.trim().length).toBeGreaterThan(0)
  })
}

/**
 * Create a standard MDX structure validation test
 *
 * Use this in your test files to create consistent validation tests:
 *
 * @example
 * ```typescript
 * import { createMDXValidationTest } from '@/lib/test-utils/mdx-validation'
 *
 * describe('Blog MDX structure', () => {
 *   createMDXValidationTest({
 *     directory: 'posts',
 *     canonicalPrefix: 'https://blog.plantdoctor.app/blog',
 *     minFiles: 1,
 *   })
 * })
 * ```
 */
export function createMDXValidationTest(config: MDXValidationConfig): void {
  it('ensures every file has valid frontmatter and content', () => {
    validateMDXFiles(config)
  })
}
