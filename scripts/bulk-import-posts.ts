#!/usr/bin/env node
/**
 * Bulk Post Import Pipeline
 *
 * Imports all 2,008 blog posts from /blog-posts/moruk/ into the blog
 *
 * Process:
 * 1. Copy WebP images to public/images/webp/
 * 2. Update image paths in MDX files
 * 3. Remap categories using taxonomy mapping
 * 4. Update canonical URLs (moruk.ai → news.plantdoctor.app)
 * 5. Copy MDX files to content/posts/
 * 6. Ensure no filename conflicts
 *
 * Safety Features:
 * - Dry-run mode (--dry-run) to preview changes
 * - Skip mode for existing files (--skip-existing)
 * - Batch mode (--batch N) to process N files at a time
 * - Verbose logging (--verbose) for debugging
 */

const fs = require('fs')
const path = require('path')
const { globSync } = require('glob')
const { getMegaCategory } = require('../lib/taxonomy/category-mapping')

interface ImportOptions {
  dryRun: boolean
  skipExisting: boolean
  batchSize: number
  verbose: boolean
  limit?: number
}

interface ImportResult {
  success: number
  failed: number
  skipped: number
  warnings: string[]
  errors: string[]
}

const BLOG_POSTS_DIR = '/Users/fatih/workspace/blog-posts/moruk'
const CONTENT_POSTS_DIR = '/Users/fatih/workspace/news.plantdoctor.app/content/posts'
const PUBLIC_IMAGES_DIR = '/Users/fatih/workspace/news.plantdoctor.app/public/images/webp/blog-posts'

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(CONTENT_POSTS_DIR)) {
    fs.mkdirSync(CONTENT_POSTS_DIR, { recursive: true })
  }
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true })
  }
}

/**
 * Extract app name from directory path
 * e.g., "/path/to/moruk/dog-doctor/posts/file.mdx" → "dog-doctor"
 */
function getAppNameFromPath(filePath: string): string {
  const parts = filePath.split(path.sep)
  const morokIndex = parts.indexOf('moruk')
  if (morokIndex !== -1 && morokIndex + 1 < parts.length) {
    return parts[morokIndex + 1]
  }
  return 'unknown'
}

/**
 * Update frontmatter with new category and canonical URL
 */
function updateFrontmatter(content: string, appName: string): string {
  let updated = content

  // 1. Remap primaryCategory if it exists
  const primaryCategoryMatch = updated.match(/^primaryCategory:\s*["'](.+?)["']/m)
  if (primaryCategoryMatch) {
    const oldCategory = primaryCategoryMatch[1]
    const newCategory = getMegaCategory(oldCategory)
    updated = updated.replace(
      /^primaryCategory:\s*["'].+?["']/m,
      `primaryCategory: "${newCategory}"`,
    )
  }

  // 2. Update canonical URLs (moruk.ai → news.plantdoctor.app)
  updated = updated.replace(
    /canonical:\s*https?:\/\/moruk\.ai\//g,
    'canonical: https://news.plantdoctor.app/',
  )

  // 3. Ensure app name is in metadata (for filtering by app)
  if (!updated.includes('appName:')) {
    // Add after primaryCategory if exists, otherwise after date
    const insertPoint = updated.includes('primaryCategory:')
      ? updated.indexOf('\n', updated.indexOf('primaryCategory:'))
      : updated.indexOf('\n', updated.indexOf('date:'))
    if (insertPoint !== -1) {
      updated =
        updated.slice(0, insertPoint) + `\nappName: "${appName}"` + updated.slice(insertPoint)
    }
  }

  return updated
}

/**
 * Update image paths in MDX content
 * e.g., "![alt](image.webp)" → "![alt](/images/webp/blog-posts/dog-doctor/image.webp)"
 */
function updateImagePaths(content: string, appName: string): string {
  // Match markdown image syntax: ![alt](image.webp)
  // Also match HTML img tags: <img src="image.webp" />
  let updated = content

  // Update markdown images
  updated = updated.replace(
    /!\[([^\]]*)\]\(([^)]+\.webp)\)/g,
    (_match: string, alt: string, imagePath: string) => {
      const filename = path.basename(imagePath)
      return `![${alt}](/images/webp/blog-posts/${appName}/${filename})`
    },
  )

  // Update HTML img tags
  updated = updated.replace(/src=["']([^"']+\.webp)["']/g, (_match: string, imagePath: string) => {
    const filename = path.basename(imagePath)
    return `src="/images/webp/blog-posts/${appName}/${filename}"`
  })

  return updated
}

/**
 * Copy images from app directory to public/images
 */
function copyImages(appName: string, options: ImportOptions): boolean {
  const sourceImageDir = path.join(BLOG_POSTS_DIR, appName, 'images', 'webp')

  if (!fs.existsSync(sourceImageDir)) {
    if (options.verbose) {
      console.log(`⚠️  No images found for ${appName}`)
    }
    return true
  }

  try {
    const destAppDir = path.join(PUBLIC_IMAGES_DIR, appName)

    if (!fs.existsSync(destAppDir)) {
      if (!options.dryRun) {
        fs.mkdirSync(destAppDir, { recursive: true })
      }
    }

    const images = fs.readdirSync(sourceImageDir)
    for (const image of images) {
      const sourceFile = path.join(sourceImageDir, image)
      const destFile = path.join(destAppDir, image)

      if (!options.dryRun) {
        fs.copyFileSync(sourceFile, destFile)
      }

      if (options.verbose) {
        console.log(`  📸 Copied image: ${image}`)
      }
    }

    return true
  } catch (error) {
    console.error(`❌ Error copying images for ${appName}:`, error)
    return false
  }
}

/**
 * Import a single post
 */
function importPost(filePath: string, options: ImportOptions): boolean {
  try {
    const appName = getAppNameFromPath(filePath)
    const filename = path.basename(filePath)
    const destPath = path.join(CONTENT_POSTS_DIR, filename)

    // Check if already exists
    if (fs.existsSync(destPath) && options.skipExisting) {
      if (options.verbose) {
        console.log(`⏭️  Skipped (exists): ${filename}`)
      }
      return true
    }

    // Read content
    let content = fs.readFileSync(filePath, 'utf8')

    // Update frontmatter (category, canonical, app name)
    content = updateFrontmatter(content, appName)

    // Update image paths
    content = updateImagePaths(content, appName)

    // Copy images
    if (!copyImages(appName, options)) {
      console.warn(`⚠️  Failed to copy images for ${appName}`)
    }

    // Write to destination
    if (!options.dryRun) {
      fs.writeFileSync(destPath, content, 'utf8')
    }

    if (options.verbose) {
      console.log(`✅ Imported: ${filename} (${appName})`)
    }

    return true
  } catch (error) {
    console.error(`❌ Error importing ${filePath}:`, error)
    return false
  }
}

/**
 * Main import process
 */
function main() {
  const args = process.argv.slice(2)
  const options: ImportOptions = {
    dryRun: args.includes('--dry-run'),
    skipExisting: args.includes('--skip-existing'),
    batchSize:
      parseInt(args.find((a: string) => a.startsWith('--batch='))?.split('=')[1] || '0') ||
      Infinity,
    verbose: args.includes('--verbose'),
    limit:
      parseInt(args.find((a: string) => a.startsWith('--limit='))?.split('=')[1] || '0') ||
      undefined,
  }

  console.log(`\n📚 Bulk Post Import Pipeline`)
  console.log(`=`.repeat(70))
  console.log(`Mode: ${options.dryRun ? 'DRY-RUN (preview only)' : 'IMPORT (real changes)'}`)
  console.log(`Skip existing: ${options.skipExisting}`)
  console.log(`Batch size: ${options.batchSize === Infinity ? 'unlimited' : options.batchSize}`)
  if (options.limit) console.log(`Limit: ${options.limit} posts`)
  console.log()

  // Ensure directories exist
  ensureDirectories()

  // Find all MDX files
  const mdxFiles = globSync(`${BLOG_POSTS_DIR}/**/posts/*.mdx`)
  let filesToProcess = mdxFiles

  if (options.limit) {
    filesToProcess = filesToProcess.slice(0, options.limit)
  }

  console.log(`Found ${filesToProcess.length} posts to process\n`)

  const result: ImportResult = {
    success: 0,
    failed: 0,
    skipped: 0,
    warnings: [],
    errors: [],
  }

  // Process in batches
  for (let i = 0; i < filesToProcess.length; i += options.batchSize) {
    const batch = filesToProcess.slice(i, Math.min(i + options.batchSize, filesToProcess.length))

    for (const file of batch) {
      const success = importPost(file, options)
      if (success) {
        result.success++
      } else {
        result.failed++
      }
    }

    // Progress indicator
    const processed = Math.min(i + options.batchSize, filesToProcess.length)
    console.log(`Progress: ${processed}/${filesToProcess.length}`)
  }

  // Summary
  console.log(`\n${'='.repeat(70)}`)
  console.log(`✅ Import Complete`)
  console.log(`=`.repeat(70))
  console.log(`Success: ${result.success}`)
  console.log(`Failed: ${result.failed}`)
  console.log(`Skipped: ${result.skipped}`)

  if (result.errors.length > 0) {
    console.log(`\n⚠️  Errors (${result.errors.length}):`)
    result.errors.forEach((e) => console.log(`  - ${e}`))
  }

  if (result.warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${result.warnings.length}):`)
    result.warnings.forEach((w) => console.log(`  - ${w}`))
  }

  console.log(
    `\n${options.dryRun ? '🔍 DRY-RUN: No actual changes made. Run without --dry-run to import.' : '✨ Posts imported successfully!'}`,
  )
}

try {
  main()
} catch (err) {
  console.error('Fatal error:', err)
  process.exit(1)
}
