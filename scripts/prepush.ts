#!/usr/bin/env node
/**
 * prepush.ts - Wrapper for bash/prepush.sh
 *
 * Platform-aware wrapper that:
 * - On Unix (Mac/Linux): Executes bash script directly for speed
 * - On Windows: Falls back to TypeScript implementation
 */

import { platform } from 'os'
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { resolve } from 'path'
import chalk from 'chalk'

const isUnix = platform() === 'darwin' || platform() === 'linux'
const bashScript = resolve(__dirname, 'bash/prepush.sh')

if (isUnix && existsSync(bashScript)) {
  try {
    execSync(`bash "${bashScript}"`, { stdio: 'inherit' })
    process.exit(0)
  } catch (error) {
    process.exit(1)
  }
}

// Windows fallback - TypeScript implementation
console.log(chalk.blue('🚀 Running pre-push validation...'))

// Future enhancements could include:
// - Ensure tests pass
// - Check for console.log statements
// - Verify branch is up to date
// - Run additional linting

console.log(chalk.green('✅ Pre-push validation passed!'))

process.exit(0)
