#!/usr/bin/env node
/**
 * compress-webp.ts - Compress WebP images
 * Executes bash script using cwebp
 */

import { execSync } from 'child_process'
import { join } from 'path'

const scriptDir = __dirname
const args = process.argv.slice(2).join(' ')

try {
  const shellScript = join(scriptDir, 'bash/compress-webp.sh')
  execSync(`bash "${shellScript}" ${args}`, {
    stdio: 'inherit',
    cwd: process.cwd(),
  })
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const exitCode =
    error && typeof error === 'object' && 'status' in error
      ? (error as { status?: number }).status || 1
      : 1
  console.error('Error running shell script:', errorMessage)
  process.exit(exitCode)
}
