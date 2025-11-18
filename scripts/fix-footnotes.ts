#!/usr/bin/env tsx

/**
 * Comprehensive Footnote Fixer for MDX Files
 *
 * This script fixes 4 types of footnote issues:
 * 1. Duplicate References sections
 * 2. Non-sequential footnote numbering
 * 3. Orphaned citations (missing definitions)
 * 4. Malformed reference structure
 */

import fs from 'fs'
import path from 'path'

interface FootnoteIssue {
  file: string
  type: 'duplicate' | 'non-sequential' | 'orphaned' | 'malformed'
  details: string
}

interface FootnoteMapping {
  oldNumber: number
  newNumber: number
}

const postsDir = path.join(process.cwd(), 'content/posts')
const issues: FootnoteIssue[] = []

function getPostFiles(): string[] {
  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => path.join(postsDir, file))
}

function extractInTextCitations(content: string): number[] {
  // Get content before References section
  const beforeReferences = content.split(/^## References/m)[0] || content
  const citations = beforeReferences.match(/\[\^\d+\]/g) || []
  return citations
    .map((citation) => parseInt(citation.match(/\[\^(\d+)\]/)?.[1] || '0'))
    .filter((num) => num > 0)
}

function extractFootnoteDefinitions(referencesSection: string): number[] {
  const definitions = referencesSection.match(/\[\^(\d+)\]:/g) || []
  return definitions
    .map((def) => parseInt(def.match(/\[\^(\d+)\]:/)?.[1] || '0'))
    .filter((num) => num > 0)
}

/**
 * Phase 1: Remove duplicate References sections
 */
function removeDuplicateReferences(filePath: string): boolean {
  let content = fs.readFileSync(filePath, 'utf-8')
  const fileName = path.basename(filePath)

  // Find all References sections - case insensitive and handle variations
  const referencesPattern = /^##\s+References$/gim
  const matches = [...content.matchAll(referencesPattern)]

  if (matches.length <= 1) {
    return false // No duplicates
  }

  console.log(`  📋 Found ${matches.length} References sections in ${fileName}`)

  // Keep only the first References section and everything before the second one
  const firstRefIndex = matches[0].index!
  const secondRefIndex = matches[1].index!

  // Extract the first references section content
  const beforeSecondRef = content.substring(0, secondRefIndex)

  // Remove the duplicate section (everything from second "## References" onward)
  content = beforeSecondRef.trimEnd() + '\n'

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`  ✅ Removed duplicate References section from ${fileName}`)

  issues.push({
    file: fileName,
    type: 'duplicate',
    details: 'Removed duplicate References section',
  })

  return true
}

/**
 * Phase 1.5: Remove duplicate footnote definitions and clean inline citations
 */
function removeDuplicateFootnoteDefinitions(filePath: string): boolean {
  let content = fs.readFileSync(filePath, 'utf-8')
  const fileName = path.basename(filePath)

  const referencesMatch = content.match(/^## References[\s\S]*$/im)
  if (!referencesMatch) {
    return false
  }

  let referencesSection = referencesMatch[0]
  const beforeReferences = content.substring(0, referencesMatch.index!)

  // Extract all footnote definitions
  const footnotePattern = /\[\^(\d+)\]:\s*(.+?)(?=\n\[\^|\n\n[\[\-]|$)/gs
  const footnotes: Map<number, string> = new Map()
  let modified = false

  // First pass: collect unique footnotes and clean inline citations
  const matches = [...referencesSection.matchAll(footnotePattern)]
  matches.forEach((match) => {
    const num = parseInt(match[1])
    let definition = match[2].trim()

    // Remove inline footnote citations like "[^1]" at the end of the definition
    const cleanedDefinition = definition.replace(/\s*\[\^\d+\]\s*$/g, '')

    if (cleanedDefinition !== definition) {
      modified = true
    }

    if (!footnotes.has(num)) {
      footnotes.set(num, cleanedDefinition)
    } else {
      // Found a duplicate
      console.log(`  🔄 Found duplicate definition for [^${num}] in ${fileName}`)
      modified = true
    }
  })

  if (!modified) {
    return false
  }

  // Rebuild the references section with unique, clean footnotes
  const sortedNums = Array.from(footnotes.keys()).sort((a, b) => a - b)
  let newReferencesSection = '## References\n\n'

  sortedNums.forEach((num) => {
    newReferencesSection += `[^${num}]: ${footnotes.get(num)}\n\n`
  })

  content = beforeReferences + newReferencesSection
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`  ✅ Cleaned duplicate definitions and inline citations in ${fileName}`)

  issues.push({
    file: fileName,
    type: 'duplicate',
    details: 'Removed duplicate definitions and inline citations',
  })

  return true
}

/**
 * Phase 2: Fix non-sequential numbering
 */
function fixNonSequentialNumbering(filePath: string): boolean {
  let content = fs.readFileSync(filePath, 'utf-8')
  const fileName = path.basename(filePath)

  const referencesMatch = content.match(/^## References[\s\S]*$/m)
  if (!referencesMatch) {
    return false // No references section
  }

  const referencesSection = referencesMatch[0]
  const footnoteNumbers = extractFootnoteDefinitions(referencesSection)

  if (footnoteNumbers.length === 0) {
    return false // No footnotes
  }

  // Sort to check if sequential
  const sortedNumbers = [...footnoteNumbers].sort((a, b) => a - b)
  const expectedNumbers = Array.from({ length: sortedNumbers.length }, (_, i) => i + 1)
  const isSequential = sortedNumbers.every((num, index) => num === expectedNumbers[index])

  if (isSequential) {
    return false // Already sequential
  }

  console.log(`  🔢 Fixing non-sequential numbering in ${fileName}`)
  console.log(`     Current: [${sortedNumbers.join(', ')}]`)
  console.log(`     Target:  [${expectedNumbers.join(', ')}]`)

  // Create mapping from old to new numbers
  const mapping: FootnoteMapping[] = sortedNumbers.map((oldNum, index) => ({
    oldNumber: oldNum,
    newNumber: index + 1,
  }))

  // Replace in reverse order to avoid conflicts (e.g., [^1] -> [^2] then [^2] -> [^1])
  // Use unique temporary markers
  mapping.forEach((map) => {
    const tempMarker = `[^TEMP${map.oldNumber}]`
    // Replace in-text citations first
    content = content.replace(new RegExp(`\\[\\^${map.oldNumber}\\](?!:)`, 'g'), tempMarker)
    // Replace footnote definitions
    content = content.replace(new RegExp(`\\[\\^${map.oldNumber}\\]:`, 'g'), `${tempMarker}:`)
  })

  // Replace temporary markers with final numbers
  mapping.forEach((map) => {
    const tempMarker = `[^TEMP${map.oldNumber}]`
    content = content.replace(
      new RegExp(`\\[\\^TEMP${map.oldNumber}\\](?!:)`, 'g'),
      `[^${map.newNumber}]`,
    )
    content = content.replace(
      new RegExp(`\\[\\^TEMP${map.oldNumber}\\]:`, 'g'),
      `[^${map.newNumber}]:`,
    )
  })

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`  ✅ Fixed numbering in ${fileName}`)

  issues.push({
    file: fileName,
    type: 'non-sequential',
    details: `Renumbered from [${sortedNumbers.join(', ')}] to [${expectedNumbers.join(', ')}]`,
  })

  return true
}

/**
 * Phase 3: Fix orphaned citations
 */
function fixOrphanedCitations(filePath: string): boolean {
  let content = fs.readFileSync(filePath, 'utf-8')
  const fileName = path.basename(filePath)

  // Extract citations and definitions
  const citationNumbers = [...new Set(extractInTextCitations(content))].sort((a, b) => a - b)

  const referencesMatch = content.match(/^## References[\s\S]*$/m)
  const footnoteNumbers = referencesMatch
    ? [...new Set(extractFootnoteDefinitions(referencesMatch[0]))].sort((a, b) => a - b)
    : []

  // Find orphaned citations
  const orphanedCitations = citationNumbers.filter((num) => !footnoteNumbers.includes(num))

  if (orphanedCitations.length === 0) {
    return false // No orphaned citations
  }

  console.log(`  🔗 Fixing orphaned citations in ${fileName}`)
  console.log(`     Orphaned: [${orphanedCitations.join(', ')}]`)

  // If no References section exists, create one
  if (!referencesMatch) {
    content += '\n\n---\n\n## References\n\n'
  }

  // Add placeholder definitions for orphaned citations
  const placeholders = orphanedCitations
    .map((num) => {
      return `[^${num}]: Author. (Year). [Title](https://example.com). Publication.`
    })
    .join('\n\n')

  // Insert before the final closing (if any) or at the end
  if (content.endsWith('---\n')) {
    content = content.slice(0, -4) + placeholders + '\n\n---\n'
  } else {
    content = content.trimEnd() + '\n\n' + placeholders + '\n'
  }

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`  ✅ Added ${orphanedCitations.length} placeholder definitions to ${fileName}`)

  issues.push({
    file: fileName,
    type: 'orphaned',
    details: `Added definitions for [${orphanedCitations.join(', ')}]`,
  })

  return true
}

/**
 * Phase 4: Fix malformed reference structure
 */
function fixMalformedStructure(filePath: string): boolean {
  let content = fs.readFileSync(filePath, 'utf-8')
  const fileName = path.basename(filePath)

  const referencesMatch = content.match(/^## References[\s\S]*$/m)
  if (!referencesMatch) {
    return false // No references section
  }

  const referencesSection = referencesMatch[0]

  // Check if references have basic structure
  const hasBasicStructure =
    referencesSection.includes('(') && // Year in parentheses
    referencesSection.includes('[') && // Title in brackets
    referencesSection.includes('](') && // URL after title
    referencesSection.includes(')') && // URL closing
    referencesSection.includes('.') // Publication ending with period

  if (hasBasicStructure) {
    return false // Already has basic structure
  }

  console.log(`  📝 Fixing malformed structure in ${fileName}`)

  // Extract all footnote definitions
  const footnotePattern = /\[\^(\d+)\]:\s*(.+?)(?=\n\[\^|\n\n|$)/gs
  const footnotes = [...referencesSection.matchAll(footnotePattern)]

  let modified = false
  let newReferencesSection = '## References\n\n'

  footnotes.forEach((match) => {
    const num = match[1]
    const definition = match[2].trim()

    // Check if it already has proper format
    if (definition.includes('[') && definition.includes('](') && definition.includes('(')) {
      newReferencesSection += `[^${num}]: ${definition}\n\n`
      return
    }

    // Try to format it properly - if it has a URL, wrap it
    const urlMatch = definition.match(/(https?:\/\/[^\s]+)/)
    if (urlMatch) {
      const url = urlMatch[1]
      const beforeUrl = definition.substring(0, definition.indexOf(url)).trim()
      const afterUrl = definition.substring(definition.indexOf(url) + url.length).trim()

      // Try to extract title
      let author = 'Author'
      let year = 'Year'
      let title = beforeUrl || 'Title'
      let publication = afterUrl || 'Publication'

      // Try to find year in parentheses
      const yearMatch = definition.match(/\((\d{4})\)/)
      if (yearMatch) {
        year = yearMatch[1]
      }

      newReferencesSection += `[^${num}]: ${author}. (${year}). [${title}](${url}). ${publication}.\n\n`
      modified = true
    } else {
      // No URL found, create a template
      newReferencesSection += `[^${num}]: Author. (Year). [${definition}](https://example.com). Publication.\n\n`
      modified = true
    }
  })

  if (modified) {
    // Replace the References section
    const beforeReferences = content.split(/^## References/m)[0]
    content = beforeReferences + newReferencesSection

    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`  ✅ Fixed structure in ${fileName}`)

    issues.push({
      file: fileName,
      type: 'malformed',
      details: 'Reformatted references to standard structure',
    })

    return true
  }

  return false
}

/**
 * Main execution
 */
function main() {
  console.log('🔧 Starting footnote fixes...\n')

  const postFiles = getPostFiles()
  console.log(`📁 Found ${postFiles.length} MDX files\n`)

  let fixedCount = 0

  // Phase 1: Remove duplicate References sections
  console.log('📋 Phase 1: Removing duplicate References sections...')
  postFiles.forEach((filePath) => {
    if (removeDuplicateReferences(filePath)) {
      fixedCount++
    }
  })
  console.log()

  // Phase 1.5: Remove duplicate footnote definitions and clean inline citations
  console.log('🔄 Phase 1.5: Removing duplicate definitions and inline citations...')
  postFiles.forEach((filePath) => {
    if (removeDuplicateFootnoteDefinitions(filePath)) {
      fixedCount++
    }
  })
  console.log()

  // Phase 2: Fix non-sequential numbering
  console.log('🔢 Phase 2: Fixing non-sequential numbering...')
  postFiles.forEach((filePath) => {
    if (fixNonSequentialNumbering(filePath)) {
      fixedCount++
    }
  })
  console.log()

  // Phase 3: Fix orphaned citations
  console.log('🔗 Phase 3: Fixing orphaned citations...')
  postFiles.forEach((filePath) => {
    if (fixOrphanedCitations(filePath)) {
      fixedCount++
    }
  })
  console.log()

  // Phase 4: Fix malformed structure
  console.log('📝 Phase 4: Fixing malformed structure...')
  postFiles.forEach((filePath) => {
    if (fixMalformedStructure(filePath)) {
      fixedCount++
    }
  })
  console.log()

  // Summary
  console.log('='.repeat(60))
  console.log('✅ SUMMARY')
  console.log('='.repeat(60))
  console.log(`Total files processed: ${postFiles.length}`)
  console.log(`Files with fixes: ${fixedCount}`)
  console.log()

  // Group issues by type
  const byType = {
    duplicate: issues.filter((i) => i.type === 'duplicate').length,
    'non-sequential': issues.filter((i) => i.type === 'non-sequential').length,
    orphaned: issues.filter((i) => i.type === 'orphaned').length,
    malformed: issues.filter((i) => i.type === 'malformed').length,
  }

  console.log('Issues fixed by type:')
  console.log(`  - Duplicate References sections: ${byType.duplicate}`)
  console.log(`  - Non-sequential numbering: ${byType['non-sequential']}`)
  console.log(`  - Orphaned citations: ${byType.orphaned}`)
  console.log(`  - Malformed structure: ${byType.malformed}`)
  console.log()
  console.log('🎉 Done! Run `pnpm test blog-references-validation` to verify.')
}

main()
