#!/usr/bin/env node
/**
 * fix-lib-imports.ts - Fix library imports
 * Executes bash script to update import paths
 */

import { execSync } from 'child_process'
import { resolve } from 'path'

const bashScript = resolve(__dirname, 'bash/fix-lib-imports.sh')

try {
  execSync(`bash "${bashScript}"`, { stdio: 'inherit' })
  process.exit(0)
} catch (error) {
  process.exit(1)
}
