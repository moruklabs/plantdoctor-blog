#!/usr/bin/env node
/**
 * precommit.ts - Wrapper for bash/precommit.sh
 *
 * Platform-aware wrapper that:
 * - On Unix (Mac/Linux): Executes bash script directly for speed
 * - On Windows: Falls back to TypeScript implementation
 */

import { platform } from 'os'
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { resolve } from 'path'
import { execa } from 'execa'
import chalk from 'chalk'

const isUnix = platform() === 'darwin' || platform() === 'linux'
const bashScript = resolve(__dirname, 'bash/precommit.sh')

if (isUnix && existsSync(bashScript)) {
  try {
    execSync(`bash "${bashScript}"`, { stdio: 'inherit' })
    process.exit(0)
  } catch (error) {
    process.exit(1)
  }
}

// Windows fallback - TypeScript implementation
async function runPrecommit() {
  try {
    // Run commands using concurrently (easier approach)
    await execa(
      'npx',
      [
        'concurrently',
        '--kill-others-on-fail',
        '--prefix-colors',
        'cyan,magenta,blue,purple',
        '--prefix',
        '[{name}]',
        '--names',
        'build,lint,typecheck,test',
        'pnpm build',
        'pnpm lint',
        'pnpm type-check',
        'pnpm test',
      ],
      {
        stdio: 'inherit',
        cwd: process.cwd(),
      },
    )

    console.log(chalk.green('✅ Pre-commit validation completed successfully!'))
  } catch (error) {
    console.error(chalk.red('❌ Pre-commit validation failed'))
    process.exit(1)
  }
}

runPrecommit()
