/**
 * Alt Text Improvement Script
 *
 * Improves alt text for blog post images by:
 * 1. Analyzing post frontmatter and title
 * 2. Generating contextual alt text based on category/topic
 * 3. Updating MDX files with improved alt text
 * 4. Defaulting to title when specific context unavailable
 *
 * Usage:
 * pnpm tsx scripts/improve-alt-text.ts --category dog-doctor --limit 10
 * pnpm tsx scripts/improve-alt-text.ts --all  # Update all files
 * pnpm tsx scripts/improve-alt-text.ts --file tips/specific-slug
 */

import fs from 'fs'
import path from 'path'

/**
 * Category-specific alt text templates
 */
const ALT_TEXT_PATTERNS: Record<string, (title: string) => string> = {
  // Pet care - focus on animal, condition, or behavior
  'dog-doctor': (title: string) =>
    `Dog showing ${extractKeyword(title, ['car restraint', 'motion sickness', 'health', 'training', 'care']).toLowerCase() || 'healthcare advice being applied'}`,
  'cat-doctor': (title: string) =>
    `Cat displaying ${extractKeyword(title, ['behavior', 'health', 'stress', 'injury', 'care']).toLowerCase() || 'common health signs'}`,
  'plant-doctor': (title: string) =>
    `Plant showing ${extractKeyword(title, ['humidity', 'stress', 'nutrients', 'watering', 'light']).toLowerCase() || 'care needs'}`,

  // Wellness - focus on activity or condition
  breathe: (title: string) =>
    `Person performing ${extractKeyword(title, ['breathing', 'breathwork', 'meditation', 'exercise']).toLowerCase() || 'breathing technique'}`,
  meditate: (title: string) =>
    `Person in meditation pose ${extractKeyword(title, ['sitting', 'ritual', 'mindfulness', 'practice']).toLowerCase() || 'during meditation practice'}`,
  'habit-tracker': (title: string) =>
    `${extractKeyword(title, ['micro', 'ritual', 'habit', 'challenge']).toLowerCase() || 'person'} demonstrating habit-building technique`,

  // Business/productivity
  'car-doctor': (title: string) =>
    `${extractKeyword(title, ['diagnostic', 'maintenance', 'repair', 'wash']).toLowerCase() || 'car'} showing ${extractKeyword(title, ['coolant', 'issue', 'problem', 'care']).toLowerCase() || 'maintenance needs'}`,
  openpod: (title: string) =>
    `Podcast setup or strategy showing ${extractKeyword(title, ['launch', 'growth', 'content', 'audience']).toLowerCase() || 'podcast optimization'}`,
  invoicing: (title: string) =>
    `Invoice template or screenshot showing ${extractKeyword(title, ['template', 'automation', 'design', 'feature']).toLowerCase() || 'invoice features'}`,

  // AI tools - focus on tool name and output/feature
  promptcanvas: (title: string) =>
    `PromptCanvas interface showing ${extractKeyword(title, ['prompt', 'settings', 'output', 'feature']).toLowerCase() || 'image generation features'}`,
  'pet-portrait-ai': (title: string) =>
    `${extractKeyword(title, ['dog', 'cat', 'pet', 'animal']).toLowerCase() || 'pet'} as AI-generated portrait in ${extractKeyword(title, ['style', 'renaissance', 'anime', 'art']).toLowerCase() || 'custom art style'}`,
  adcreative: (title: string) =>
    `AdCreative.ai generated social media ad image showing ${extractKeyword(title, ['campaign', 'design', 'product']).toLowerCase() || 'advertisement'}`,
}

/**
 * Extract relevant keyword from title
 */
function extractKeyword(title: string, keywords: string[]): string {
  const lowerTitle = title.toLowerCase()
  for (const keyword of keywords) {
    if (lowerTitle.includes(keyword)) {
      return keyword
    }
  }
  return ''
}

/**
 * Generate improved alt text based on post metadata
 */
function generateAltText(title: string, appCategory?: string): string {
  // If we have a pattern for this app category, use it
  if (appCategory && ALT_TEXT_PATTERNS[appCategory]) {
    try {
      const generated = ALT_TEXT_PATTERNS[appCategory](title)
      return generated.length > 10 ? generated : title
    } catch {
      return title
    }
  }

  // Fallback: Use intelligent title shortening
  // If title is too long, try to extract main concept
  if (title.length > 100) {
    const parts = title.split(':')
    return parts[0].trim() // Use first part before colon
  }

  return title
}

/**
 * Extract frontmatter from MDX file
 */
function extractFrontmatter(content: string): Record<string, string | string[]> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return {}

  const frontmatterText = match[1]
  const frontmatter: Record<string, string | string[]> = {}

  frontmatterText.split('\n').forEach((line) => {
    if (!line.trim()) return
    const [key, ...rest] = line.split(':')
    const value = rest.join(':').trim()

    // Parse arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      frontmatter[key.trim()] = value
    } else if (value.startsWith("'") && value.endsWith("'")) {
      frontmatter[key.trim()] = value.slice(1, -1)
    } else {
      frontmatter[key.trim()] = value
    }
  })

  return frontmatter
}

/**
 * Update frontmatter with improved alt text
 */
function updateAltText(content: string, newAltText: string): string {
  // Check if altText field already exists
  if (content.includes('altText:')) {
    // Replace existing altText
    return content.replace(
      /altText:\s*['"](.*?)['"]/,
      `altText: '${newAltText.replace(/'/g, "\\'")}'`,
    )
  }

  // Add new altText field after coverImage
  return content.replace(
    /(coverImage:\s*['"](.*?)['"])/,
    `$1\naltText: '${newAltText.replace(/'/g, "\\'")}'`,
  )
}

/**
 * Process a single file
 */
async function processFile(
  filePath: string,
  dryRun: boolean = false,
): Promise<{ file: string; updated: boolean; oldAlt: string; newAlt: string }> {
  const content = fs.readFileSync(filePath, 'utf-8')
  const frontmatter = extractFrontmatter(content)
  const title = frontmatter.title as string
  const existingAltText = frontmatter.altText as string | undefined

  // Extract app category from filename or use generic
  const filename = path.basename(filePath, '.mdx')
  const appCategory = extractAppCategory(filename)

  // Generate new alt text
  const newAltText = generateAltText(title, appCategory)

  // If alt text already exists and is good, skip
  if (existingAltText && existingAltText !== title) {
    return {
      file: filename,
      updated: false,
      oldAlt: existingAltText,
      newAlt: newAltText,
    }
  }

  // Update file
  if (!dryRun) {
    const updatedContent = updateAltText(content, newAltText)
    fs.writeFileSync(filePath, updatedContent, 'utf-8')
  }

  return {
    file: filename,
    updated: true,
    oldAlt: existingAltText || title,
    newAlt: newAltText,
  }
}

/**
 * Extract app category from filename
 */
function extractAppCategory(filename: string): string | undefined {
  // Try to find known category in filename
  const categories = Object.keys(ALT_TEXT_PATTERNS)
  for (const category of categories) {
    if (filename.includes(category)) {
      return category
    }
  }
  return undefined
}

/**
 * Process multiple files
 */
async function processDirectory(
  directory: string,
  limit?: number,
  category?: string,
  dryRun: boolean = false,
): Promise<void> {
  const files = fs.readdirSync(directory)
  const mdxFiles = files
    .filter((f) => f.endsWith('.mdx'))
    .filter((f) => !category || f.includes(category))
    .slice(0, limit)

  console.log(`Processing ${mdxFiles.length} files...`)
  console.log(`Dry run: ${dryRun ? 'Yes' : 'No'}`)
  console.log('')

  let updatedCount = 0
  const results = []

  for (const file of mdxFiles) {
    const filePath = path.join(directory, file)
    const result = await processFile(filePath, dryRun)
    results.push(result)

    if (result.updated) {
      updatedCount++
      console.log(`✓ ${result.file}`)
      console.log(`  Old: "${result.oldAlt.substring(0, 60)}..."`)
      console.log(`  New: "${result.newAlt.substring(0, 60)}..."`)
    }
  }

  console.log('')
  console.log(`Summary:`)
  console.log(`- Total processed: ${mdxFiles.length}`)
  console.log(`- Updated: ${updatedCount}`)
  console.log(`- Skipped: ${mdxFiles.length - updatedCount}`)
  console.log('')

  if (dryRun) {
    console.log('(Dry run - no files modified)')
  }
}

// Main execution
const args = process.argv.slice(2)
const dryRun = !args.includes('--commit')
const limitArg = args.find((a) => a.startsWith('--limit='))
const categoryArg = args.find((a) => a.startsWith('--category='))
const allFlag = args.includes('--all')

const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : allFlag ? undefined : 50
const category = categoryArg ? categoryArg.split('=')[1] : undefined
const postsDir = path.join(process.cwd(), 'content/posts')

console.log(`
╔═══════════════════════════════════════════════════════════╗
║         Blog Alt Text Improvement Tool                    ║
║  Smart category-based alt text generation & updates       ║
╚═══════════════════════════════════════════════════════════╝
`)

processDirectory(postsDir, limit, category, dryRun)
