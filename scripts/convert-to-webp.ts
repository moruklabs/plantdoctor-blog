#!/usr/bin/env node
/**
 * convert-to-webp.ts - Convert images to WebP format
 * Executes bash script using cwebp
 */

import { execSync } from 'child_process'
import { resolve } from 'path'

const bashScript = resolve(__dirname, 'bash/convert-to-webp.sh')
const args = process.argv.slice(2).join(' ')

try {
  execSync(`bash "${bashScript}" ${args}`, { stdio: 'inherit' })
  process.exit(0)
} catch (error) {
  process.exit(1)
}
