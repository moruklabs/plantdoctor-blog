#!/usr/bin/env node

/**
 * Script to identify unused environment variables
 *
 * This script:
 * 1. Parses .env-sample to get all declared environment variables
 * 2. Searches the codebase for usage of each variable
 * 3. Reports which variables are unused
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warn: (msg) => console.warn(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.error(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
}

/**
 * Parse .env-sample file and extract variable names
 */
function parseEnvSample(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const envVars = []

  content.split('\n').forEach((line, index) => {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) {
      return
    }

    const match = line.match(/^([A-Z_][A-Z0-9_]*)=/)
    if (match) {
      envVars.push({
        name: match[1],
        line: index + 1,
      })
    }
  })

  return envVars
}

/**
 * Search for usage of an environment variable in the codebase
 */
function findUsage(varName) {
  const searchPatterns = [
    `process.env.${varName}`,
    `process.env['${varName}']`,
    `process.env["${varName}"]`,
    `env.${varName}`,
    `\${${varName}}`, // For shell scripts
    `$${varName}`, // For shell scripts
  ]

  const locations = []

  // Search in TypeScript/JavaScript files
  try {
    const result = execSync(
      `grep -rn "${varName}" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.mjs" --include="*.sh" --include="*.yml" --include="*.yaml" . 2>/dev/null | grep -v node_modules | grep -v ".next" | grep -v "pnpm-lock" | grep -v ".env-sample"`,
      { cwd: process.cwd(), encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 },
    )

    const lines = result
      .trim()
      .split('\n')
      .filter((line) => line.trim())

    for (const line of lines) {
      const [location, ...contentParts] = line.split(':')
      const content = contentParts.join(':').trim()

      // Check if the line actually references the env var (not just a substring match)
      const isActualUsage = searchPatterns.some((pattern) => {
        const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        return new RegExp(escaped).test(content)
      })

      if (isActualUsage) {
        locations.push({ location, content })
      }
    }
  } catch (error) {
    // grep returns non-zero exit code if no matches found, which is fine
    if (error.status !== 1) {
      log.warn(`Error searching for ${varName}: ${error.message}`)
    }
  }

  return locations
}

/**
 * Main function
 */
function main() {
  log.header('🔍 Analyzing Environment Variables')

  const envSamplePath = path.join(process.cwd(), '.env-sample')

  if (!fs.existsSync(envSamplePath)) {
    log.error('.env-sample file not found!')
    process.exit(1)
  }

  // Step 1: Parse .env-sample
  log.info('Parsing .env-sample...')
  const envVars = parseEnvSample(envSamplePath)
  log.success(`Found ${envVars.length} environment variables`)

  // Step 2: Search for usage of each variable
  log.header('\n📊 Usage Analysis')

  const usedVars = []
  const unusedVars = []

  for (const envVar of envVars) {
    const usage = findUsage(envVar.name)

    if (usage.length > 0) {
      usedVars.push({
        ...envVar,
        usage,
      })
      console.log(
        `${colors.green}✓${colors.reset} ${colors.gray}${envVar.name.padEnd(45)}${colors.reset} (${usage.length} reference${usage.length > 1 ? 's' : ''})`,
      )
    } else {
      unusedVars.push(envVar)
      console.log(
        `${colors.red}✗${colors.reset} ${colors.gray}${envVar.name.padEnd(45)}${colors.reset} ${colors.yellow}UNUSED${colors.reset}`,
      )
    }
  }

  // Step 3: Summary
  log.header('\n📋 Summary')
  console.log(`  Total variables:   ${colors.cyan}${envVars.length}${colors.reset}`)
  console.log(`  Used variables:    ${colors.green}${usedVars.length}${colors.reset}`)
  console.log(`  Unused variables:  ${colors.red}${unusedVars.length}${colors.reset}`)

  // Step 4: Detailed report of unused variables
  if (unusedVars.length > 0) {
    log.header('\n🗑️  Unused Environment Variables')
    console.log(
      '\nThe following environment variables are defined in .env-sample but not used anywhere in the codebase:\n',
    )

    for (const envVar of unusedVars) {
      console.log(
        `  ${colors.red}•${colors.reset} ${colors.gray}${envVar.name}${colors.reset} (line ${envVar.line})`,
      )
    }

    console.log(
      '\n' +
        colors.yellow +
        'These variables can likely be removed from .env-sample.' +
        colors.reset,
    )
  } else {
    log.success('\n✨ All environment variables are in use!')
  }

  // Step 5: Optional detailed usage report
  if (process.argv.includes('--verbose') || process.argv.includes('-v')) {
    log.header('\n📍 Detailed Usage Locations')

    for (const envVar of usedVars) {
      console.log(`\n${colors.cyan}${envVar.name}${colors.reset}:`)
      for (const { location, content } of envVar.usage.slice(0, 5)) {
        console.log(`  ${colors.gray}${location}${colors.reset}`)
        console.log(`    ${content.substring(0, 100)}${content.length > 100 ? '...' : ''}`)
      }
      if (envVar.usage.length > 5) {
        console.log(`  ${colors.gray}... and ${envVar.usage.length - 5} more${colors.reset}`)
      }
    }
  }

  // Exit with error code if there are unused vars (for CI)
  process.exit(unusedVars.length > 0 ? 1 : 0)
}

// Run the script
main()
