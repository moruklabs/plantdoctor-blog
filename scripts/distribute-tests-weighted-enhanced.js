#!/usr/bin/env node

/**
 * distribute-tests-weighted-enhanced.js
 * Enhanced capacity-aware distributed Playwright testing with:
 * - Pre-flight health checks
 * - Real-time progress tracking
 * - Automatic retry logic (up to 2 retries with exponential backoff)
 * - Better error handling and recovery
 *
 * Distributes tests based on machine capacity (CPU cores) rather than equally.
 * More powerful machines get more test shards to run.
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'
import { runHealthChecks } from './distributed-test-health-monitor.js'
import { ProgressTracker } from './distributed-test-progress.js'

const execAsync = promisify(exec)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.dirname(__dirname)

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logSection(title) {
  console.log('')
  log(`${'='.repeat(70)}`, 'cyan')
  log(`  ${title}`, 'bright')
  log(`${'='.repeat(70)}`, 'cyan')
  console.log('')
}

// Load config
const configPath = path.join(projectRoot, 'distributed-test-config.yaml')
const config = yaml.load(fs.readFileSync(configPath, 'utf8'))

// Parse CLI args
const args = process.argv.slice(2)
const machineCount = parseInt(
  args.find((a) => a.startsWith('--machines='))?.split('=')[1] || config.machines.length,
)
const generateReport = !args.includes('--no-report')
const skipHealthChecks = args.includes('--skip-health-checks')
const maxRetries = parseInt(args.find((a) => a.startsWith('--max-retries='))?.split('=')[1] || '2')

const machines = config.machines.slice(0, machineCount)

// Calculate shard distribution based on CPU cores
const totalCores = machines.reduce((sum, m) => sum + m.capacity.cpu_cores, 0)
const TOTAL_SHARDS = totalCores // One shard per core for optimal distribution

// Assign shards to machines based on their core count
let currentShard = 1
const machineShards = machines.map((machine) => {
  const shardCount = machine.capacity.cpu_cores
  const shards = []
  for (let i = 0; i < shardCount; i++) {
    shards.push(currentShard++)
  }
  return {
    ...machine,
    shards,
    shardCount,
  }
})

/**
 * Run a single shard with retry logic
 */
async function runShardWithRetry(machine, shard, progressTracker, attempt = 1) {
  const shardArg = `--shard=${shard}/${TOTAL_SHARDS}`
  const command =
    machine.host === 'localhost'
      ? `cd ${machine.path} && pnpm e2e ${shardArg}`
      : `ssh ${machine.host} "bash -i -c 'cd ${machine.path} && pnpm e2e ${shardArg}'"`

  if (attempt === 1) {
    log(`[${machine.name}] Running shard ${shard}/${TOTAL_SHARDS}...`, 'blue')
    progressTracker?.updateShard(machine.name, shard, 'running')
  } else {
    log(
      `[${machine.name}] Retry ${attempt}/${maxRetries} for shard ${shard}/${TOTAL_SHARDS}...`,
      'yellow',
    )
  }

  try {
    await execAsync(command, { shell: '/bin/bash' })
    progressTracker?.updateShard(machine.name, shard, 'passed')
    return { machine, shard, success: true, attempts: attempt }
  } catch (error) {
    // If we have retries left, try again with exponential backoff
    if (attempt < maxRetries) {
      const backoffMs = Math.pow(2, attempt - 1) * 5000 // 5s, 10s
      log(`[${machine.name}] Shard ${shard} failed, retrying in ${backoffMs / 1000}s...`, 'yellow')

      await new Promise((resolve) => setTimeout(resolve, backoffMs))
      return runShardWithRetry(machine, shard, progressTracker, attempt + 1)
    }

    // No more retries
    progressTracker?.updateShard(machine.name, shard, 'failed')
    return {
      machine,
      shard,
      success: false,
      error: error.message,
      attempts: attempt,
    }
  }
}

async function runMachineShards(machineConfig, progressTracker) {
  log(
    `[${machineConfig.name}] Starting ${machineConfig.shardCount} shards (${machineConfig.capacity.cpu_cores} cores)...`,
    'yellow',
  )

  // Initialize progress tracker for this machine
  progressTracker?.initMachine(machineConfig.name, machineConfig.shards)

  // Run all shards for this machine in parallel
  const shardPromises = machineConfig.shards.map((shard) =>
    runShardWithRetry(machineConfig, shard, progressTracker),
  )

  const results = await Promise.allSettled(shardPromises)

  const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success).length
  const failed = results.filter(
    (r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success),
  ).length

  // Count total retry attempts
  const totalRetries = results.reduce((sum, r) => {
    if (r.status === 'fulfilled' && r.value.attempts) {
      return sum + (r.value.attempts - 1)
    }
    return sum
  }, 0)

  if (failed === 0) {
    log(`[${machineConfig.name}] ✅ All ${successful} shards completed`, 'green')
    if (totalRetries > 0) {
      log(`[${machineConfig.name}] 🔄 ${totalRetries} retries needed`, 'yellow')
    }
  } else {
    log(`[${machineConfig.name}] ⚠️  ${successful} succeeded, ${failed} failed`, 'red')
    if (totalRetries > 0) {
      log(`[${machineConfig.name}] 🔄 ${totalRetries} retries attempted`, 'yellow')
    }
  }

  return results
}

async function mergeReports() {
  log('Merging test reports...', 'yellow')

  const reportDirs = machines
    .map((m) => path.join(projectRoot, 'playwright-report'))
    .filter((dir) => fs.existsSync(dir))

  if (reportDirs.length === 0) {
    log('No reports found to merge', 'yellow')
    return
  }

  try {
    await execAsync(`npx playwright merge-reports --reporter html ${reportDirs.join(' ')}`, {
      cwd: projectRoot,
    })
    log('✅ Reports merged successfully', 'green')
    log(`📊 View report: file://${projectRoot}/playwright-report/index.html`, 'cyan')
  } catch (error) {
    log(`⚠️  Could not merge reports: ${error.message}`, 'yellow')
  }
}

async function main() {
  logSection('🚀 Enhanced Distributed Test Execution')

  log(`Total machines: ${machines.length}`, 'bright')
  log(`Total CPU cores: ${totalCores}`, 'bright')
  log(`Total shards: ${TOTAL_SHARDS}`, 'bright')
  log(`Distribution: Weighted by CPU cores`, 'bright')
  log(`Max retries: ${maxRetries}`, 'bright')
  console.log('')

  log('Machine Distribution:', 'yellow')
  machineShards.forEach((m) => {
    const shardRange =
      m.shards.length > 0 ? `${m.shards[0]}-${m.shards[m.shards.length - 1]}` : 'none'
    log(
      `  ${m.name.padEnd(20)} ${m.capacity.cpu_cores} cores → ${m.shardCount} shards (${shardRange})`,
      'cyan',
    )
  })
  console.log('')

  // Step 1: Pre-flight Health Checks
  if (!skipHealthChecks) {
    logSection('🏥 Pre-flight Health Checks')

    const healthResults = await runHealthChecks(machines)
    const unhealthyMachines = healthResults.filter((r) => !r.healthy)

    if (unhealthyMachines.length > 0) {
      log('\n⚠️  WARNING: Some machines are unhealthy!', 'yellow')
      log('You can continue anyway, but tests may fail.', 'yellow')
      log('To skip health checks: --skip-health-checks', 'yellow')

      // In CI or automated environments, we might want to exit here
      if (process.env.CI && unhealthyMachines.length === machines.length) {
        log('\n❌ All machines unhealthy, aborting in CI mode', 'red')
        process.exit(1)
      }
    }
  } else {
    log('⚠️  Skipping health checks (--skip-health-checks)', 'yellow')
  }

  // Step 2: Initialize Progress Tracker
  const progressTracker = new ProgressTracker(machines, TOTAL_SHARDS)

  // Step 3: Run tests on all machines in parallel
  logSection('🧪 Running Tests (Capacity-Weighted Distribution)')

  log(`Starting progress tracker...`, 'yellow')
  progressTracker.start()

  const machinePromises = machineShards.map((m) => runMachineShards(m, progressTracker))
  const allResults = await Promise.allSettled(machinePromises)

  progressTracker.stop()

  // Step 4: Report results
  logSection('📊 Test Results')

  const stats = progressTracker.getStats()

  log(`Total shards: ${stats.total}`, 'bright')
  log(`Passed: ${stats.passed}`, stats.failed === 0 ? 'green' : 'yellow')
  log(`Failed: ${stats.failed}`, stats.failed > 0 ? 'red' : 'green')

  // Show per-machine stats
  console.log('')
  log('Per-Machine Results:', 'yellow')
  stats.machines.forEach((m) => {
    const color = m.failed === 0 ? 'green' : 'yellow'
    log(
      `  ${m.name.padEnd(20)} ${m.passed}/${m.total} passed${m.failed > 0 ? `, ${m.failed} failed` : ''}`,
      color,
    )
  })

  // Step 5: Merge reports if requested
  if (generateReport && stats.passed > 0) {
    logSection('📈 Merging Reports')
    await mergeReports()
  }

  // Exit with appropriate code
  if (stats.failed > 0) {
    logSection('❌ Some Tests Failed')
    process.exit(1)
  } else {
    logSection('✅ All Tests Passed')
    process.exit(0)
  }
}

main().catch((error) => {
  log(`Unexpected error: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})
