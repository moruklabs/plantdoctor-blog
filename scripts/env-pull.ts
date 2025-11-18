#!/usr/bin/env node
/**
 * env-pull.ts - Pull environment variables from Vercel
 * Executes bash script to download .env.local
 */

import { execSync } from 'child_process'
import { resolve } from 'path'

const bashScript = resolve(__dirname, 'bash/env-pull.sh')

try {
  execSync(`bash "${bashScript}"`, { stdio: 'inherit' })
  process.exit(0)
} catch (error) {
  process.exit(1)
}
