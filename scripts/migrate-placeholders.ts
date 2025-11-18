#!/usr/bin/env tsx
/**
 * Automated Placeholder Migration Script
 *
 * Finds and replaces all [[REPLACE_ME_*]] placeholders with references
 * to the centralized configuration system.
 *
 * Usage:
 *   pnpm tsx scripts/migrate-placeholders.ts [--dry-run]
 */

import fs from 'fs'
import path from 'path'
import { glob } from 'glob'
import chalk from 'chalk'

// =============================================================================
// Configuration
// =============================================================================

const DRY_RUN = process.argv.includes('--dry-run')

// Placeholder to config mapping
const PLACEHOLDER_MAP: Record<string, { configPath: string; importNeeded: boolean }> = {
  '[[REPLACE_ME_APP_NAME]]': {
    configPath: 'blogConfig.site.name',
    importNeeded: true,
  },
  '[[REPLACE_ME_SITE_NAME]]': {
    configPath: 'blogConfig.site.name',
    importNeeded: true,
  },
  '[[REPLACE_ME_SUBTITLE]]': {
    configPath: 'blogConfig.site.tagline',
    importNeeded: true,
  },
  '[[REPLACE_ME_TAGLINE]]': {
    configPath: 'blogConfig.site.tagline',
    importNeeded: true,
  },
  '[[REPLACE_ME_DESCRIPTION]]': {
    configPath: 'blogConfig.site.description',
    importNeeded: true,
  },
  '[[REPLACE_ME_SITE_DESCRIPTION]]': {
    configPath: 'blogConfig.site.description',
    importNeeded: true,
  },
  '[[REPLACE_ME_URL]]': {
    configPath: 'blogConfig.site.url',
    importNeeded: true,
  },
  '[[REPLACE_ME_SITE_URL]]': {
    configPath: 'blogConfig.site.url',
    importNeeded: true,
  },
  '[[REPLACE_ME_BASE_URL]]': {
    configPath: 'blogConfig.site.url',
    importNeeded: true,
  },
  '[[REPLACE_ME_DOMAIN]]': {
    configPath: 'blogConfig.site.domain',
    importNeeded: true,
  },
  '[[REPLACE_ME_EMAIL]]': {
    configPath: 'blogConfig.site.email',
    importNeeded: true,
  },
  '[[REPLACE_ME_CONTACT_EMAIL]]': {
    configPath: 'blogConfig.site.email',
    importNeeded: true,
  },
  '[[REPLACE_ME_AUTHOR_NAME]]': {
    configPath: 'blogConfig.author.name',
    importNeeded: true,
  },
  '[[REPLACE_ME_AUTHOR]]': {
    configPath: 'blogConfig.author.name',
    importNeeded: true,
  },
  '[[REPLACE_ME_AUTHOR_EMAIL]]': {
    configPath: 'blogConfig.author.email',
    importNeeded: true,
  },
  '[[REPLACE_ME_AUTHOR_URL]]': {
    configPath: 'blogConfig.author.url',
    importNeeded: true,
  },
  '[[REPLACE_ME_AUTHOR_BIO]]': {
    configPath: 'blogConfig.author.bio',
    importNeeded: true,
  },
  '[[REPLACE_ME_TWITTER]]': {
    configPath: 'blogConfig.author.social?.twitter',
    importNeeded: true,
  },
  '[[REPLACE_ME_GITHUB]]': {
    configPath: 'blogConfig.author.social?.github',
    importNeeded: true,
  },
  '[[REPLACE_ME_LINKEDIN]]': {
    configPath: 'blogConfig.author.social?.linkedin',
    importNeeded: true,
  },
  '[[REPLACE_ME_ORG_NAME]]': {
    configPath: 'blogConfig.seo.structuredData.organizationName',
    importNeeded: true,
  },
  '[[REPLACE_ME_ORGANIZATION]]': {
    configPath: 'blogConfig.seo.structuredData.organizationName',
    importNeeded: true,
  },
  '[[REPLACE_ME_LOGO_URL]]': {
    configPath: 'blogConfig.seo.structuredData.logo',
    importNeeded: true,
  },
  '[[REPLACE_ME_OG_IMAGE]]': {
    configPath: 'blogConfig.seo.ogImage',
    importNeeded: true,
  },
  '[[REPLACE_ME_LANGUAGE]]': {
    configPath: 'blogConfig.site.language',
    importNeeded: true,
  },
  '[[REPLACE_ME_TIMEZONE]]': {
    configPath: 'blogConfig.site.timezone',
    importNeeded: true,
  },
}

// File patterns to search
const FILE_PATTERNS = [
  'app/**/*.{ts,tsx,js,jsx}',
  'components/**/*.{ts,tsx,js,jsx}',
  'lib/**/*.{ts,tsx,js,jsx}',
  'content/**/*.{md,mdx}',
]

// Files to exclude
const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/.next/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/*.test.{ts,tsx,js,jsx}',
  '**/*.spec.{ts,tsx,js,jsx}',
  '**/config/**', // Don't modify config files
  '**/scripts/**', // Don't modify this script
]

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get relative import path for @/config
 */
function getImportPath(filePath: string): string | null {
  // For files in app/, components/, lib/, use @/config
  if (
    filePath.includes('/app/') ||
    filePath.includes('/components/') ||
    filePath.includes('/lib/')
  ) {
    return '@/config'
  }

  // For MDX files, they don't support aliases, so use relative path
  if (filePath.endsWith('.mdx') || filePath.endsWith('.md')) {
    return null // MDX files will use literal values
  }

  return '@/config'
}

/**
 * Add import statement if not already present
 */
function addImport(content: string, filePath: string): string {
  const importPath = getImportPath(filePath)

  // MDX files don't support imports
  if (!importPath) {
    return content
  }

  const importStatement = `import { blogConfig } from '${importPath}'`

  // Check if import already exists
  if (content.includes(importStatement) || content.includes(`from '${importPath}'`)) {
    return content
  }

  // For TSX/JSX files, add after first import or at top
  const lines = content.split('\n')
  const firstImportIndex = lines.findIndex((line) => line.trim().startsWith('import '))

  if (firstImportIndex !== -1) {
    // Add after last import
    let lastImportIndex = firstImportIndex
    for (let i = firstImportIndex + 1; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ') || lines[i].trim() === '') {
        lastImportIndex = i
      } else {
        break
      }
    }
    lines.splice(lastImportIndex + 1, 0, importStatement)
  } else {
    // Add at top
    lines.unshift(importStatement, '')
  }

  return lines.join('\n')
}

/**
 * Replace placeholders in content
 */
function replacePlaceholders(
  content: string,
  filePath: string,
): { content: string; count: number } {
  let newContent = content
  let totalReplacements = 0
  const isMDX = filePath.endsWith('.mdx') || filePath.endsWith('.md')

  for (const [placeholder, { configPath }] of Object.entries(PLACEHOLDER_MAP)) {
    const regex = new RegExp(placeholder.replace(/[[\]]/g, '\\$&'), 'g')
    const matches = content.match(regex)

    if (matches) {
      if (isMDX) {
        // For MDX files, we can't use imports, so we'll leave placeholders
        // These will need manual replacement or we use the actual values
        console.log(
          chalk.yellow(
            `   ⚠️  MDX file ${filePath} has ${matches.length} placeholder(s) - requires manual update`,
          ),
        )
      } else {
        // For TS/TSX files, replace with config reference
        newContent = newContent.replace(regex, `{${configPath}}`)
        totalReplacements += matches.length
      }
    }
  }

  return { content: newContent, count: totalReplacements }
}

// =============================================================================
// Main Migration Logic
// =============================================================================

async function main() {
  console.log(chalk.blue.bold('\n🔄 Placeholder Migration Script\n'))

  if (DRY_RUN) {
    console.log(chalk.yellow('🔍 DRY RUN MODE - No files will be modified\n'))
  }

  // Find all files
  console.log(chalk.gray('📁 Scanning files...\n'))

  const files: string[] = []
  for (const pattern of FILE_PATTERNS) {
    const matches = await glob(pattern, {
      ignore: EXCLUDE_PATTERNS,
      cwd: process.cwd(),
    })
    files.push(...matches)
  }

  console.log(chalk.gray(`   Found ${files.length} files to check\n`))

  // Process files
  const results: Array<{ file: string; replacements: number; hasImport: boolean }> = []
  let totalFiles = 0
  let totalReplacements = 0

  for (const file of files) {
    const filePath = path.join(process.cwd(), file)
    const originalContent = fs.readFileSync(filePath, 'utf-8')

    // Check if file has placeholders
    const hasPlaceholders = Object.keys(PLACEHOLDER_MAP).some((placeholder) =>
      originalContent.includes(placeholder),
    )

    if (!hasPlaceholders) {
      continue
    }

    // Replace placeholders
    const { content: replacedContent, count } = replacePlaceholders(originalContent, filePath)

    if (count === 0) {
      continue
    }

    // Add import if needed
    const needsImport = !filePath.endsWith('.mdx') && !filePath.endsWith('.md')
    const finalContent = needsImport ? addImport(replacedContent, filePath) : replacedContent

    // Write file (if not dry run)
    if (!DRY_RUN && finalContent !== originalContent) {
      fs.writeFileSync(filePath, finalContent, 'utf-8')
    }

    // Track results
    results.push({
      file,
      replacements: count,
      hasImport: needsImport,
    })

    totalFiles++
    totalReplacements += count

    console.log(chalk.green(`✅ ${file}`))
    console.log(
      chalk.gray(`   Replaced ${count} placeholder(s)${needsImport ? ' and added import' : ''}\n`),
    )
  }

  // Summary
  console.log(chalk.blue.bold('\n📊 Migration Summary\n'))
  console.log(chalk.white(`Files modified: ${totalFiles}`))
  console.log(chalk.white(`Total replacements: ${totalReplacements}\n`))

  if (results.length > 0) {
    console.log(chalk.blue('Files updated:'))
    results.forEach(({ file, replacements, hasImport }) => {
      console.log(
        chalk.gray(
          `  • ${file} (${replacements} replacement${replacements !== 1 ? 's' : ''}${hasImport ? ', import added' : ''})`,
        ),
      )
    })
    console.log()
  }

  if (DRY_RUN) {
    console.log(chalk.yellow('⚠️  This was a dry run. Run without --dry-run to apply changes.\n'))
  } else {
    console.log(chalk.green('✅ Migration complete! Run `pnpm build` to verify.\n'))
  }
}

// =============================================================================
// Execute
// =============================================================================

main().catch((error) => {
  console.error(chalk.red('\n❌ Migration failed:\n'))
  console.error(error)
  process.exit(1)
})
