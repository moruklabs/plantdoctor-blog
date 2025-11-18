#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { join } from 'path'

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
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  skip: (msg: string) => console.log(`${colors.yellow}⊘${colors.reset} ${msg}`),
  error: (msg: string) => console.error(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg: string) => console.warn(`${colors.yellow}⚠${colors.reset} ${msg}`),
  header: (msg: string) => console.log(`\n${colors.cyan}${msg}${colors.reset}`),
}

interface EnvVars {
  [key: string]: string
}

// Unused - reserved for future use
// interface VercelEnvVar {
//   name: string
//   environments: string[]
// }

const ENVIRONMENTS = ['production', 'preview', 'development'] as const
type Environment = (typeof ENVIRONMENTS)[number]

/**
 * Parse .env file manually to handle quoted values correctly
 */
function parseEnvFile(filePath: string): EnvVars {
  const content = readFileSync(filePath, 'utf-8')
  const envVars: EnvVars = {}

  content.split('\n').forEach((line) => {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) {
      return
    }

    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      let value = match[2].trim()

      // Remove surrounding quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }

      envVars[key] = value
    }
  })

  return envVars
}

/**
 * Get list of existing environment variables from Vercel
 */
function getExistingVercelEnvVars(): Map<string, Set<Environment>> {
  try {
    const output = execSync('vercel env ls', { encoding: 'utf-8' })
    const lines = output.split('\n')

    const envMap = new Map<string, Set<Environment>>()

    // Parse the table output from vercel env ls
    for (const line of lines) {
      // Skip header, empty lines, and CLI metadata
      if (
        !line.trim() ||
        line.includes('Vercel CLI') ||
        line.includes('Retrieving') ||
        line.includes('Environment Variables found') ||
        (line.includes('name') && line.includes('value') && line.includes('environments'))
      ) {
        continue
      }

      // Extract variable name and environment
      // Format: " VAR_NAME    Encrypted    Production    time ago"
      // The variable name can contain letters, numbers, and underscores
      const parts = line.trim().split(/\s{2,}/)

      if (parts.length >= 3) {
        const varName = parts[0]
        const envValue = parts[2] // The environment column

        // Map Vercel's capitalized environment names to our lowercase constants
        const envMapping: { [key: string]: Environment } = {
          Production: 'production',
          Preview: 'preview',
          Development: 'development',
        }

        const normalizedEnv = envMapping[envValue]

        if (normalizedEnv && varName) {
          if (!envMap.has(varName)) {
            envMap.set(varName, new Set())
          }
          envMap.get(varName)!.add(normalizedEnv)
        }
      }
    }

    return envMap
  } catch (error) {
    log.error('Failed to fetch existing Vercel environment variables')
    throw error
  }
}

/**
 * Add environment variable to Vercel
 */
function addEnvToVercel(
  key: string,
  value: string,
  environments: Environment[],
  dryRun: boolean,
): boolean {
  const envFlags = environments.join(', ')

  if (dryRun) {
    log.info(`[DRY RUN] Would add ${colors.gray}${key}${colors.reset} to ${envFlags}`)
    return true
  }

  // Vercel CLI requires adding to each environment separately
  let allSucceeded = true
  const failedEnvs: string[] = []

  for (const env of environments) {
    try {
      // Use echo to pipe the value to vercel env add to avoid interactive prompts
      // The format is: echo "value" | vercel env add KEY environment
      const escapedValue = value.replace(/"/g, '\\"').replace(/$/g, '\$')
      const command = `echo "${escapedValue}" | vercel env add ${key} ${env}`

      execSync(command, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: '/bin/zsh',
      })
    } catch (error) {
      allSucceeded = false
      failedEnvs.push(env)
      const errorMsg = error instanceof Error ? error.message : String(error)
      log.error(`Failed to add ${key} to ${env}: ${errorMsg}`)
    }
  }

  return allSucceeded
}

/**
 * Main sync function
 */
async function syncEnvToVercel(dryRun: boolean = false) {
  const envFilePath = join(process.cwd(), '.env')

  log.header('🚀 Syncing Environment Variables to Vercel')

  if (dryRun) {
    log.warn('Running in DRY RUN mode - no changes will be made')
  }

  // Step 1: Parse local .env file
  log.info('Reading local .env file...')
  let localEnvVars: EnvVars
  try {
    localEnvVars = parseEnvFile(envFilePath)
    log.success(`Found ${Object.keys(localEnvVars).length} environment variables in .env`)
  } catch (error) {
    log.error(`Failed to read .env file: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }

  // Step 2: Get existing Vercel env vars
  log.info('Fetching existing Vercel environment variables...')
  let existingVars: Map<string, Set<Environment>>
  try {
    existingVars = getExistingVercelEnvVars()
    log.success(`Found ${existingVars.size} environment variables on Vercel`)
  } catch (error) {
    log.error('Make sure you are logged in to Vercel CLI (run: vercel login)')
    process.exit(1)
  }

  // Step 3: Determine which vars need to be added to which environments
  log.header('\n📋 Analysis')

  const toAdd: Array<{ key: string; value: string; environments: Environment[] }> = []
  const toSkip: string[] = []

  for (const [key, value] of Object.entries(localEnvVars)) {
    const existingEnvs = existingVars.get(key)

    if (existingEnvs && existingEnvs.size === ENVIRONMENTS.length) {
      // Variable exists in all environments
      toSkip.push(key)
      log.skip(`${colors.gray}${key}${colors.reset} (exists in all environments)`)
    } else if (existingEnvs) {
      // Variable exists but not in all environments
      const missingEnvs = ENVIRONMENTS.filter((env) => !existingEnvs.has(env))
      toAdd.push({ key, value, environments: missingEnvs })
      log.info(
        `${colors.gray}${key}${colors.reset} needs to be added to: ${missingEnvs.join(', ')}`,
      )
    } else {
      // Variable doesn't exist at all
      toAdd.push({ key, value, environments: [...ENVIRONMENTS] })
      log.info(`${colors.gray}${key}${colors.reset} will be added to all environments`)
    }
  }

  // Step 4: Summary
  log.header('\n📊 Summary')
  console.log(`  Variables to add/update: ${colors.cyan}${toAdd.length}${colors.reset}`)
  console.log(`  Variables to skip:       ${colors.yellow}${toSkip.length}${colors.reset}`)

  if (toAdd.length === 0) {
    log.success('\n✨ All environment variables are already synced!')
    process.exit(0)
  }

  // Step 5: Push new variables
  log.header('\n⬆️  Pushing Environment Variables')

  let successCount = 0
  let failCount = 0

  for (const { key, value, environments } of toAdd) {
    const success = addEnvToVercel(key, value, environments, dryRun)
    if (success) {
      successCount++
      if (!dryRun) {
        log.success(`Added ${colors.gray}${key}${colors.reset} to ${environments.join(', ')}`)
      }
    } else {
      failCount++
    }
  }

  // Step 6: Final summary
  log.header('\n✨ Sync Complete')
  console.log(`  Successfully added: ${colors.green}${successCount}${colors.reset}`)
  if (failCount > 0) {
    console.log(`  Failed:            ${colors.red}${failCount}${colors.reset}`)
  }
  console.log(`  Skipped:           ${colors.yellow}${toSkip.length}${colors.reset}`)

  if (dryRun) {
    log.info('\n💡 Run without --dry-run flag to apply changes')
  }

  process.exit(failCount > 0 ? 1 : 0)
}

// Parse command line arguments
const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run') || args.includes('-d')

// Run the script
syncEnvToVercel(dryRun).catch((error) => {
  log.error(`Fatal error: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
})
