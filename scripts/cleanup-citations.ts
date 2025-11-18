#!/usr/bin/env node
/**
 * Citation Cleanup Script
 *
 * Removes jibberish citations (example.com, example.org, etc.)
 * Keeps legitimate citations (real domains like oecd.org, google.com, etc.)
 */

const fs = require('fs')
const path = require('path')
const { globSync } = require('glob')

// Real domains to keep (whitelist approach)
const LEGITIMATE_DOMAINS = [
  'oecd.org',
  'google.com',
  'reddit.com',
  'twitter.com',
  'linkedin.com',
  'github.com',
  'medium.com',
  'researchgate.net',
  'arxiv.org',
  'doi.org',
  'scholar.google.com',
  'jstor.org',
  'sciencedirect.com',
  'tandfonline.com',
  'springer.com',
  'nature.com',
  'science.org',
  'jama.jamanetwork.com',
  'nejm.org',
  'bmj.com',
  'thelancet.com',
  'plos.org',
  'frontiersin.org',
  'mdpi.com',
  'wiley.com',
  'elsevier.com',
  'cambridge.org',
  'oxford.org',
  'harvard.edu',
  'mit.edu',
  'stanford.edu',
  'berkeley.edu',
  'yale.edu',
  'nytimes.com',
  'washingtonpost.com',
  'bbc.com',
  'economist.com',
  'forbes.com',
  'wired.com',
  'techcrunch.com',
  'arstechnica.com',
  'theverge.com',
  'adweek.com',
  'marketingland.com',
  'growthhackers.com',
  'producthunt.com',
  'fastcompany.com',
  'hbr.org',
  'mckinsey.com',
  'bain.com',
  'bcg.com',
]

interface CleanupResult {
  file: string
  removed: number
  kept: number
  changes: string[]
}

function isLegitimateUrl(url: string): boolean {
  return LEGITIMATE_DOMAINS.some((domain) => url.includes(domain))
}

function cleanupFile(filePath: string): CleanupResult {
  const content = fs.readFileSync(filePath, 'utf8')
  let updatedContent = content
  const changes: string[] = []
  let removedCount = 0
  let keptCount = 0

  // Pattern 1: Remove footnote definitions with example.com
  const footnoteRegex = /^\[\^(\d+)\]:\s+.+?https?:\/\/example\.(com|org)\/.+?$/gm
  updatedContent = updatedContent.replace(footnoteRegex, (match: string) => {
    removedCount++
    changes.push(`Removed jibberish footnote: ${match.substring(0, 80)}...`)
    return ''
  })

  // Pattern 2: Remove inline citation references [^N] that point to removed footnotes
  // This is tricky - we'd need to parse which footnotes were removed
  // For now, just count legitimate citations

  // Count legitimate citations
  const legitCitationRegex = /https?:\/\/[^\s)]+/g
  const matches = updatedContent.match(legitCitationRegex) || []
  matches.forEach((url: string) => {
    if (isLegitimateUrl(url)) {
      keptCount++
    }
  })

  // Clean up multiple blank lines created by removal
  updatedContent = updatedContent.replace(/\n\n\n+/g, '\n\n')

  // Only write if changes were made
  if (removedCount > 0) {
    fs.writeFileSync(filePath, updatedContent, 'utf8')
  }

  return {
    file: filePath,
    removed: removedCount,
    kept: keptCount,
    changes,
  }
}

function main() {
  const blogPostsDir = '/Users/fatih/workspace/blog-posts/moruk'

  // Find all MDX files
  const mdxFiles = globSync(`${blogPostsDir}/**/posts/*.mdx`)

  console.log(`\n📝 Citation Cleanup Script`)
  console.log(`=`.repeat(60))
  console.log(`Found ${mdxFiles.length} posts to process\n`)

  let totalRemoved = 0
  let totalKept = 0
  const results: CleanupResult[] = []

  // Process each file
  for (const file of mdxFiles) {
    const result = cleanupFile(file)
    if (result.removed > 0) {
      results.push(result)
      totalRemoved += result.removed
      totalKept += result.kept
    }
  }

  // Print summary
  console.log(`\n✅ Cleanup Complete`)
  console.log(`=`.repeat(60))
  console.log(`Total jibberish citations removed: ${totalRemoved}`)
  console.log(`Total legitimate citations kept: ${totalKept}`)
  console.log(`Files modified: ${results.length}`)

  // Show sample changes
  if (results.length > 0) {
    console.log(`\n📋 Sample Changes (first 5 files):`)
    console.log(`=`.repeat(60))
    results.slice(0, 5).forEach((result) => {
      console.log(`\n📄 ${path.basename(result.file)}`)
      console.log(`   Removed: ${result.removed}, Kept: ${result.kept}`)
      if (result.changes.length > 0) {
        result.changes.slice(0, 2).forEach((change) => {
          console.log(`   - ${change}`)
        })
      }
    })
  }

  console.log(
    `\n${totalRemoved > 0 ? '✨ Changes applied successfully' : '✨ No jibberish citations found'}`,
  )
}

try {
  main()
} catch (err) {
  console.error('Error:', err)
  process.exit(1)
}
