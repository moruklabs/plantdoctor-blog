# Content and Test Utilities

This directory contains reusable utilities for content management and testing.

## Overview

These utilities eliminate code duplication and provide a consistent, maintainable approach to:

- Managing different content types (posts, guides, podcasts, etc.)
- Validating MDX content in tests
- Extracting and validating links in tests

## Modules

### `mdx-validation.ts`

Reusable utilities for validating MDX content across different content types.

**Key Functions:**

- `validateMDXFiles(config)` - Validates all MDX files in a directory
- `createMDXValidationTest(config)` - Creates a standard test for MDX validation

**Usage Example:**

```typescript
import { createMDXValidationTest } from '@/lib/test-utils/mdx-validation'

describe('Blog MDX structure', () => {
  createMDXValidationTest({
    directory: 'posts',
    canonicalPrefix: 'https://blog.plantdoctor.app/blog',
    minFiles: 1,
  })
})
```

**Configuration Options:**

- `directory` - Directory name where content files are stored (e.g., 'posts', 'guides')
- `canonicalPrefix` - Expected canonical URL prefix (e.g., 'https://blog.plantdoctor.app/blog')
- `minFiles` - Optional minimum number of MDX files expected

**Validations Performed:**

- Frontmatter delimiter (---) at start
- Valid title (non-empty string)
- Valid tags (non-empty array of strings)
- Valid date (YYYY-MM-DD format)
- Correct canonical URL format
- Valid draft flag (boolean)
- Valid reading time (positive integer)
- Valid language (non-empty string)
- Meta description exists
- Content exists
- HTML exists

### `link-validation.ts`

Reusable utilities for extracting and validating links from MDX content and TSX components.

**Key Functions:**

#### Link Normalization and Detection

- `normalizeLink(href)` - Normalize a link by removing hash, query params, trailing slashes
- `isInternalLink(href)` - Check if a URL is an internal link (starts with "/")
- `isExternalLink(href)` - Check if a URL is an external link (http/https/mailto/etc.)

#### Link Extraction

- `extractLinksFromHTML(html)` - Extract all links from HTML content
- `extractLinksFromTSXFile(filePath)` - Extract all href values from a TSX/JSX file
- `extractInternalLinks(sources)` - Extract internal links from multiple sources
- `extractExternalLinks(sources)` - Extract external links from multiple sources

#### Link Validation

- `shouldExcludeDomain(url, excludedDomains)` - Check if domain should be excluded
- `validateExternalLink(url, options)` - Validate external link with retry logic
- `batchValidateExternalLinks(links, options)` - Batch validate with concurrency control

**Usage Example:**

```typescript
import {
  extractLinksFromHTML,
  isInternalLink,
  extractInternalLinks,
} from '@/lib/test-utils/link-validation'

// Extract links from content
const links = extractLinksFromHTML(htmlContent)
const internalOnly = links.filter(isInternalLink)

// Group by source
const sources = posts.map((post) => ({
  source: `/blog/${post.metadata.slug}`,
  links: extractLinksFromHTML(post.html).filter(isInternalLink),
}))

const linksMap = extractInternalLinks(sources)
// Returns Map<link, sources[]>
```

**Validation Options:**

```typescript
{
  timeout?: number          // Request timeout (default: 10000ms)
  maxRetries?: number       // Max retry attempts (default: 2)
  retryDelayBase?: number   // Base delay for exponential backoff (default: 1000ms)
  maxConcurrent?: number    // Max concurrent requests (default: 5)
  excludedDomains?: string[]  // Domains to skip validation
}
```

## Benefits

### DRY (Don't Repeat Yourself)

- Eliminates duplicate validation logic across test files
- Single source of truth for common operations
- Test file reduction: 86-91% smaller

### Consistency

- Same validation rules across all content types
- Consistent link extraction and normalization
- Standardized error handling and reporting

### Maintainability

- Update validation logic in one place
- Easy to understand and modify
- Well-documented with TypeScript types

### Extensibility

- Easy to add new content types
- Simple to add new validation rules
- Flexible configuration options

### Template-Ready

- Copy utilities to new projects
- Configure for different domains
- Adapt to different content structures

## Migration Guide

### Before (Duplicate Code)

```typescript
// __tests__/blog-mdx-structure.test.ts (57 lines)
import fs from 'fs'
import path from 'path'
import { processMDX, validateFrontmatter } from '@/lib/mdx-processor'

describe('Blog MDX structure', () => {
  const postsDirectory = path.join(process.cwd(), 'content/posts')
  const mdxFiles = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx'))

  it('ensures every post has valid frontmatter and content', () => {
    expect(mdxFiles.length).toBeGreaterThan(0)

    mdxFiles.forEach((file) => {
      // ... 40+ lines of validation logic ...
    })
  })
})
```

### After (Reusable Utilities)

```typescript
// __tests__/blog-mdx-structure.test.ts (8 lines)
import { createMDXValidationTest } from '@/lib/test-utils/mdx-validation'

describe('Blog MDX structure', () => {
  createMDXValidationTest({
    directory: 'posts',
    canonicalPrefix: 'https://blog.plantdoctor.app/blog',
    minFiles: 1,
  })
})
```

## Best Practices

1. **Use Configuration Over Code**
   - Define content types via configuration objects
   - Avoid hardcoding validation rules

2. **Favor Composition**
   - Combine small, focused utilities
   - Build complex validations from simple functions

3. **Type Safety**
   - Use TypeScript interfaces for configuration
   - Leverage type inference where possible

4. **Error Handling**
   - Gracefully handle missing directories
   - Provide meaningful error messages
   - Use optional validations for flexibility

5. **Performance**
   - Batch operations when possible
   - Use concurrency control for network requests
   - Cache validation results

## Future Enhancements

- [ ] Add support for podcast content validation
- [ ] Create utilities for sitemap validation
- [ ] Add performance benchmarking utilities
- [ ] Create utilities for heading structure validation
- [ ] Add utilities for frontmatter schema validation
- [ ] Support for custom validation rules via plugins

## Related Documentation

- [Content Utilities](../content-utils.ts) - Generic content management utilities
- [Guide Structured Data](../guide-structured-data.ts) - Guide-specific SEO schemas
- [AGENTS.md](../../AGENTS.md) - Repository overview and guidelines
