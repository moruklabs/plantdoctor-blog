#!/usr/bin/env node
/**
 * check-package-manager.ts - Wrapper for bash/check-package-manager.sh
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
const bashScript = resolve(__dirname, 'bash/check-package-manager.sh')

if (isUnix && existsSync(bashScript)) {
  try {
    execSync(`bash "${bashScript}"`, { stdio: 'inherit' })
    process.exit(0)
  } catch (error) {
    process.exit(1)
  }
}

// Windows fallback - TypeScript implementation
console.log(chalk.blue('Checking package manager...'))

// Check for package-lock.json (npm)
if (existsSync('package-lock.json')) {
  console.log(chalk.red('❌ Error: package-lock.json found!'))
  console.log(chalk.yellow('This is a pnpm project. Please remove package-lock.json and use pnpm.'))
  console.log(chalk.yellow('Run: rm package-lock.json && pnpm install'))
  process.exit(1)
}

// Check for yarn.lock (yarn)
if (existsSync('yarn.lock')) {
  console.log(chalk.red('❌ Error: yarn.lock found!'))
  console.log(chalk.yellow('This is a pnpm project. Please remove yarn.lock and use pnpm.'))
  console.log(chalk.yellow('Run: rm yarn.lock && pnpm install'))
  process.exit(1)
}

// Warn if pnpm-lock.yaml missing
if (!existsSync('pnpm-lock.yaml')) {
  console.log(
    chalk.yellow("⚠️  Warning: pnpm-lock.yaml not found. Run 'pnpm install' to generate it."),
  )
}

console.log(chalk.green('✅ Package manager check passed!'))
