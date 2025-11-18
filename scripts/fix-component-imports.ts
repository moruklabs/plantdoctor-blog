#!/usr/bin/env node
/**
 * fix-component-imports.ts - Fix component imports
 * Executes bash script to update import paths
 */

import { execSync } from 'child_process'
import { resolve } from 'path'

const bashScript = resolve(__dirname, 'bash/fix-component-imports.sh')

try {
  execSync(`bash "${bashScript}"`, { stdio: 'inherit' })
  process.exit(0)
} catch (error) {
  process.exit(1)
}
