#!/usr/bin/env tsx
/**
 * File Watcher & Tree Generator
 *
 * Watches the project directory for file changes and automatically generates
 * a tree structure that can be referenced from CLAUDE.md for AI context.
 *
 * Features:
 * - Efficient file watching with chokidar (no polling)
 * - Smart filtering (excludes node_modules, .git, build artifacts, etc.)
 * - Debounced updates (1000ms default)
 * - Clear console output with timestamps
 * - Excludes itself and the output file from the tree
 * - Production-ready error handling
 * - One-time generation mode (--once flag)
 *
 * Usage:
 *   pnpm watch:tree          # Start watching
 *   pnpm tree:generate       # Generate once and exit
 */

import chokidar from 'chokidar'
import fs from 'fs/promises'
import path from 'path'
import ignore from 'ignore'

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  // Root directory to watch (current working directory)
  rootDir: process.cwd(),

  // Output file path
  outputFile: 'PROJECT_STRUCTURE.md',

  // Paths to watch (relative to rootDir)
  watchPaths: [
    'app',
    'components',
    'lib',
    'content',
    'tests',
    'public',
    'scripts',
    '.github',
    '.claude',
    '*.md',
    '*.json',
    '*.ts',
    '*.js',
    '*.mjs',
    '*.config.*',
  ],

  // Note: Ignore patterns are now loaded from .gitignore
  // Only critical patterns are kept as fallback in shouldIgnore()

  // Patterns to ignore during watching (for chokidar performance)
  ignorePaths: ['**/node_modules/**', '**/.next/**', '**/.git/**', '**/dist/**', '**/build/**'],

  // Maximum depth for tree (0 = unlimited)
  maxDepth: 0,

  // Debounce delay in milliseconds (how long to wait after last change)
  debounceMs: 1000,

  // Show hidden files (starting with .)
  showHidden: true,

  // File extensions to highlight in summary
  importantExtensions: ['.md', '.ts', '.tsx', '.js', '.jsx', '.json'],
}

// ============================================================================
// GITIGNORE HANDLING
// ============================================================================

let gitignoreInstance: ReturnType<typeof ignore> | null = null

/**
 * Load and parse .gitignore file
 */
async function loadGitignore(): Promise<void> {
  try {
    const gitignorePath = path.join(CONFIG.rootDir, '.gitignore')
    const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8')

    gitignoreInstance = ignore()
    gitignoreInstance.add(gitignoreContent)

    // Always exclude the output file and this script
    gitignoreInstance.add([CONFIG.outputFile, 'scripts/watch-tree.ts'])

    console.log('📋 Loaded .gitignore patterns')
  } catch (error) {
    console.warn('⚠️  Could not load .gitignore, using built-in patterns only')

    // Create a minimal gitignore instance with just our essential excludes
    gitignoreInstance = ignore()
    gitignoreInstance.add([CONFIG.outputFile, 'scripts/watch-tree.ts'])
  }
}

// ============================================================================
// TREE GENERATION
// ============================================================================

interface TreeNode {
  name: string
  path: string
  isDirectory: boolean
  children?: TreeNode[]
  size?: number
}

/**
 * Recursively build a tree structure from a directory
 */
async function buildTree(dirPath: string, depth: number = 0): Promise<TreeNode[]> {
  // Check max depth
  if (CONFIG.maxDepth > 0 && depth >= CONFIG.maxDepth) {
    return []
  }

  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    const nodes: TreeNode[] = []

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      const relativePath = path.relative(CONFIG.rootDir, fullPath)

      // Skip if matches ignore patterns
      if (shouldIgnore(relativePath, entry.isDirectory())) {
        continue
      }

      // Skip hidden files if configured (unless they're explicitly in watchPaths)
      if (!CONFIG.showHidden && entry.name.startsWith('.')) {
        continue
      }

      const node: TreeNode = {
        name: entry.name,
        path: relativePath,
        isDirectory: entry.isDirectory(),
      }

      if (entry.isDirectory()) {
        node.children = await buildTree(fullPath, depth + 1)
      } else {
        try {
          const stats = await fs.stat(fullPath)
          node.size = stats.size
        } catch {
          // File might have been deleted, skip
          continue
        }
      }

      nodes.push(node)
    }

    // Sort: directories first, then files, both alphabetically
    return nodes.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1
      if (!a.isDirectory && b.isDirectory) return 1
      return a.name.localeCompare(b.name)
    })
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error)
    return []
  }
}

/**
 * Check if a path should be ignored
 */
function shouldIgnore(relativePath: string, isDirectory: boolean = false): boolean {
  // Normalize path separators for consistent matching
  const normalizedPath = relativePath.replace(/\\/g, '/')

  // Check gitignore patterns
  if (gitignoreInstance) {
    // For directories, we need to check both the directory itself and with a trailing slash
    if (isDirectory) {
      if (
        gitignoreInstance.ignores(normalizedPath) ||
        gitignoreInstance.ignores(normalizedPath + '/')
      ) {
        return true
      }
    } else {
      if (gitignoreInstance.ignores(normalizedPath)) {
        return true
      }
    }
  }

  // Fallback to built-in patterns for critical exclusions
  // (kept as a safety net in case gitignore is missing important patterns)
  const criticalIgnores = [
    'node_modules',
    '.git',
    '.next',
    'dist',
    'build',
    'out',
    '.turbo',
    CONFIG.outputFile,
    'scripts/watch-tree.ts',
  ]

  return criticalIgnores.some((pattern) => {
    return normalizedPath === pattern || normalizedPath.startsWith(pattern + '/')
  })
}

/**
 * Generate tree structure as text
 */
function generateTreeText(nodes: TreeNode[], prefix: string = '', _isLast: boolean = true): string {
  let output = ''

  nodes.forEach((node, index) => {
    const isLastChild = index === nodes.length - 1
    const connector = isLastChild ? '└── ' : '├── '
    const childPrefix = prefix + (isLastChild ? '    ' : '│   ')

    // Format node name
    let nodeName = node.name
    if (node.isDirectory) {
      nodeName += '/'

      // Add file count for directories with children
      if (node.children && node.children.length > 0) {
        const fileCount = countFiles(node.children)
        const dirCount = countDirectories(node.children)
        const summary = []
        if (fileCount > 0) summary.push(`${fileCount} file${fileCount !== 1 ? 's' : ''}`)
        if (dirCount > 0) summary.push(`${dirCount} dir${dirCount !== 1 ? 's' : ''}`)
        if (summary.length > 0) {
          nodeName += ` (${summary.join(', ')})`
        }
      }
    }

    output += prefix + connector + nodeName + '\n'

    // Recursively add children
    if (node.children && node.children.length > 0) {
      output += generateTreeText(node.children, childPrefix, isLastChild)
    }
  })

  return output
}

/**
 * Count total files in tree
 */
function countFiles(nodes: TreeNode[]): number {
  return nodes.reduce((count, node) => {
    if (node.isDirectory) {
      return count + (node.children ? countFiles(node.children) : 0)
    }
    return count + 1
  }, 0)
}

/**
 * Count directories in tree
 */
function countDirectories(nodes: TreeNode[]): number {
  return nodes.reduce((count, node) => {
    if (node.isDirectory) {
      return count + 1 + (node.children ? countDirectories(node.children) : 0)
    }
    return count
  }, 0)
}

/**
 * Generate statistics about the project
 */
function generateStats(nodes: TreeNode[]): string {
  const totalFiles = countFiles(nodes)
  const totalDirs = countDirectories(nodes)

  // Count by extension
  const extCounts: Record<string, number> = {}

  function countExtensions(nodes: TreeNode[]) {
    nodes.forEach((node) => {
      if (node.isDirectory && node.children) {
        countExtensions(node.children)
      } else if (!node.isDirectory) {
        const ext = path.extname(node.name) || '(no extension)'
        extCounts[ext] = (extCounts[ext] || 0) + 1
      }
    })
  }

  countExtensions(nodes)

  // Sort by count
  const sortedExts = Object.entries(extCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10) // Top 10

  let stats = `\n**Project Statistics:**\n\n`
  stats += `- Total Files: ${totalFiles}\n`
  stats += `- Total Directories: ${totalDirs}\n`
  stats += `\n**File Types:**\n\n`

  sortedExts.forEach(([ext, count]) => {
    stats += `- ${ext}: ${count} file${count !== 1 ? 's' : ''}\n`
  })

  return stats
}

/**
 * Generate the complete PROJECT_STRUCTURE.md content
 */
async function generateProjectStructure(): Promise<string> {
  console.log('🌲 Generating project tree...')

  const tree = await buildTree(CONFIG.rootDir)
  const treeText = generateTreeText(tree)
  const stats = generateStats(tree)

  const now = new Date()
  const timestamp = now.toISOString().replace('T', ' ').split('.')[0] + ' UTC'

  const content = `# Project Structure

**Last Updated:** ${timestamp}
**Auto-generated by:** \`scripts/watch-tree.ts\`

This file is automatically updated when project files change. It provides a high-level overview of the project structure for AI assistants and developers.

## 📁 Directory Tree

\`\`\`
${CONFIG.rootDir.split('/').pop()}/
${treeText}\`\`\`

${stats}

---

**Note:** This file is auto-generated. Do not edit manually. To regenerate:
- Watch mode: \`pnpm watch:tree\`
- One-time: \`pnpm tree:generate\`
`

  return content
}

/**
 * Write the tree structure to file
 */
async function writeProjectStructure() {
  try {
    const content = await generateProjectStructure()
    const outputPath = path.join(CONFIG.rootDir, CONFIG.outputFile)

    await fs.writeFile(outputPath, content, 'utf-8')

    const now = new Date().toLocaleTimeString()
    console.log(`✅ [${now}] Updated ${CONFIG.outputFile}`)
  } catch (error) {
    console.error('❌ Error writing project structure:', error)
  }
}

// ============================================================================
// FILE WATCHING
// ============================================================================

let debounceTimer: NodeJS.Timeout | null = null

/**
 * Handle file system events (debounced)
 */
function handleFileChange(eventType: string, filePath: string) {
  const relativePath = path.relative(CONFIG.rootDir, filePath)

  // Clear existing timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  // Set new timer
  debounceTimer = setTimeout(async () => {
    const now = new Date().toLocaleTimeString()
    console.log(`📝 [${now}] Change detected: ${eventType} ${relativePath}`)
    await writeProjectStructure()
  }, CONFIG.debounceMs)
}

/**
 * Start watching files
 */
function startWatching() {
  console.log('👀 Starting file watcher...\n')
  console.log('📂 Watching paths:')
  CONFIG.watchPaths.forEach((p) => console.log(`   - ${p}`))
  console.log('\n⏱️  Debounce delay:', CONFIG.debounceMs, 'ms\n')

  // Initial generation
  writeProjectStructure().then(() => {
    console.log('')
    console.log('👍 Watching for changes... (Press Ctrl+C to stop)\n')
  })

  // Create watcher
  const watcher = chokidar.watch(CONFIG.watchPaths, {
    cwd: CONFIG.rootDir,
    ignored: CONFIG.ignorePaths,
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 100,
    },
  })

  // Watch events
  watcher
    .on('add', (filePath) => handleFileChange('add', filePath))
    .on('change', (filePath) => handleFileChange('change', filePath))
    .on('unlink', (filePath) => handleFileChange('delete', filePath))
    .on('addDir', (dirPath) => handleFileChange('addDir', dirPath))
    .on('unlinkDir', (dirPath) => handleFileChange('deleteDir', dirPath))
    .on('error', (error) => console.error('❌ Watcher error:', error))

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n👋 Stopping file watcher...')
    watcher.close().then(() => {
      console.log('✅ File watcher stopped')
      process.exit(0)
    })
  })
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  const args = process.argv.slice(2)
  const onceMode = args.includes('--once') || args.includes('-o')

  // Load gitignore patterns at startup
  await loadGitignore()

  if (onceMode) {
    // One-time generation mode
    console.log('🌲 Generating project structure (one-time)...\n')
    await writeProjectStructure()
    console.log('\n✅ Done!\n')
    process.exit(0)
  } else {
    // Watch mode
    startWatching()
  }
}

// Run
main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
