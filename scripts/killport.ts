#!/usr/bin/env node
/**
 * killport.ts - Wrapper for bash/killport.sh
 *
 * Platform-aware wrapper that:
 * - On Unix (Mac/Linux): Executes bash script directly for speed
 * - On Windows: Falls back to TypeScript implementation using kill-port package
 *
 * Usage: tsx scripts/killport.ts <port_number>
 * Example: tsx scripts/killport.ts 3000
 *
 * This script is used by `pnpm dev` to ensure port 3000 is available before
 * starting the Next.js development server. It prevents "port already in use" errors.
 */

import { platform } from 'os'
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { resolve } from 'path'
// @ts-expect-error - kill-port has no type definitions
import kill from 'kill-port'

const port = parseInt(process.argv[2])

if (!port || isNaN(port)) {
  console.error('Usage: tsx scripts/killport.ts <port>')
  process.exit(1)
}

const isUnix = platform() === 'darwin' || platform() === 'linux'
const bashScript = resolve(__dirname, 'bash/killport.sh')

if (isUnix && existsSync(bashScript)) {
  try {
    execSync(`bash "${bashScript}" ${port}`, { stdio: 'inherit' })
    process.exit(0)
  } catch (error) {
    // Suppress errors (port might already be free)
    process.exit(0)
  }
}

// Windows fallback - TypeScript implementation using kill-port package
// The kill-port package works cross-platform by using:
// - Windows: netstat + taskkill
// - macOS/Linux: lsof + kill (fallback if bash script fails)
kill(port, 'tcp')
  .then(() => {
    // Silent on success, matching original behavior
  })
  .catch(() => {
    // Suppress errors (port might already be free)
    // Match original script behavior: 2>/dev/null || true
  })
