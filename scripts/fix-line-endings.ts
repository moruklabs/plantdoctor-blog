#!/usr/bin/env node
/**
 * fix-line-endings.ts - Normalize line endings to Unix style (LF)
 *
 * Recursively processes files and converts CRLF to LF for cross-platform compatibility.
 * Designed to work on Windows, macOS, and Linux.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import { program } from 'commander'

// Files and directories to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  '.git',
  '.pnpm-store',
  'dist',
  'build',
  '.turbo',
  'coverage',
  '.cache',
  'public/images',
  'public/podcasts',
  '.backup',
]

// File extensions to process
const INCLUDE_EXTENSIONS = [
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.mdx',
  '.yml',
  '.yaml',
  '.sh',
  '.css',
  '.scss',
  '.html',
  '.svg',
  '.txt',
  '.env',
  '.gitignore',
  '.gitattributes',
  '.editorconfig',
  '.prettierrc',
  '.eslintrc',
]

let fixedCount = 0
let skippedCount = 0
let errorCount = 0

function shouldExclude(path: string): boolean {
  const normalizedPath = path.replace(/\\/g, '/')
  return EXCLUDE_PATTERNS.some((pattern) => normalizedPath.includes(pattern))
}

function shouldInclude(filename: string): boolean {
  // Check if file has no extension (like Dockerfile, Makefile, etc.)
  if (!filename.includes('.')) {
    const baseNames = ['Dockerfile', 'Makefile', 'LICENSE', 'README']
    return baseNames.some((base) => filename.toUpperCase().includes(base))
  }

  return INCLUDE_EXTENSIONS.some((ext) => filename.endsWith(ext))
}

function hasWindowsLineEndings(content: Buffer): boolean {
  return content.includes(Buffer.from('\r\n'))
}

function fixLineEndings(filePath: string, dryRun: boolean): void {
  try {
    const content = readFileSync(filePath)

    // Check if file has Windows line endings (CRLF)
    if (!hasWindowsLineEndings(content)) {
      skippedCount++
      return
    }

    // Convert CRLF to LF
    const fixed = content.toString().replace(/\r\n/g, '\n')

    if (!dryRun) {
      writeFileSync(filePath, fixed, 'utf8')
      console.log(`Fixed: ${filePath}`)
      fixedCount++
    } else {
      console.log(`Would fix: ${filePath}`)
      fixedCount++
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Error processing ${filePath}: ${errorMessage}`)
    errorCount++
  }
}

function processDirectory(dirPath: string, dryRun: boolean): void {
  try {
    const entries = readdirSync(dirPath)

    for (const entry of entries) {
      const fullPath = join(dirPath, entry)

      if (shouldExclude(fullPath)) {
        continue
      }

      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        processDirectory(fullPath, dryRun)
      } else if (stat.isFile() && shouldInclude(entry)) {
        fixLineEndings(fullPath, dryRun)
      }
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Error reading directory ${dirPath}: ${errorMessage}`)
    errorCount++
  }
}

async function main() {
  program
    .option('-d, --dry-run', 'Show what would be fixed without making changes', false)
    .option('-p, --path <path>', 'Path to process (default: current directory)', '.')
    .parse()

  const options = program.opts()
  const dryRun = options.dryRun
  const targetPath = options.path

  console.log('==========================================')
  console.log('Line Endings Normalization')
  console.log('==========================================')
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'FIXING'}`)
  console.log(`Path: ${targetPath}`)
  console.log('------------------------------------------')
  console.log('')

  const startTime = Date.now()
  processDirectory(targetPath, dryRun)
  const endTime = Date.now()

  console.log('')
  console.log('==========================================')
  console.log('Summary')
  console.log('==========================================')
  console.log(`Files ${dryRun ? 'to fix' : 'fixed'}: ${fixedCount}`)
  console.log(`Files skipped (already LF): ${skippedCount}`)
  if (errorCount > 0) {
    console.log(`Errors: ${errorCount}`)
  }
  console.log(`Time: ${((endTime - startTime) / 1000).toFixed(2)}s`)
  console.log('==========================================')

  if (dryRun && fixedCount > 0) {
    console.log('')
    console.log('Run without --dry-run to apply changes')
  }

  process.exit(errorCount > 0 ? 1 : 0)
}

main()
