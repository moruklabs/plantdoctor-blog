#!/usr/bin/env node

/**
 * distribute-tests-weighted.js
 * Capacity-aware distributed Playwright testing
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
  log(`${'='.repeat(60)}`, 'cyan')
  log(`  ${title}`, 'bright')
  log(`${'='.repeat(60)}`, 'cyan')
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

async function runShardOnMachine(machine, shard) {
  const shardArg = `--shard=${shard}/${TOTAL_SHARDS}`
  const command =
    machine.host === 'localhost'
      ? `cd ${machine.path} && pnpm e2e ${shardArg}`
      : `ssh ${machine.host} "bash -i -c 'cd ${machine.path} && pnpm e2e ${shardArg}'"`

  log(`[${machine.name}] Running shard ${shard}/${TOTAL_SHARDS}...`, 'blue')

  try {
    await execAsync(command, { shell: '/bin/bash' })
    return { machine, shard, success: true }
  } catch (error) {
    return { machine, shard, success: false, error: error.message }
  }
}

async function runMachineShards(machineConfig) {
  log(
    `[${machineConfig.name}] Starting ${machineConfig.shardCount} shards (${machineConfig.capacity.cpu_cores} cores)...`,
    'yellow',
  )

  // Run all shards for this machine in parallel
  const shardPromises = machineConfig.shards.map((shard) => runShardOnMachine(machineConfig, shard))

  const results = await Promise.allSettled(shardPromises)

  const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success).length
  const failed = results.filter(
    (r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success),
  ).length

  if (failed === 0) {
    log(`[${machineConfig.name}] ✅ All ${successful} shards completed`, 'green')
  } else {
    log(`[${machineConfig.name}] ⚠️  ${successful} succeeded, ${failed} failed`, 'red')
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
  logSection('🚀 Capacity-Aware Distributed Test Execution')

  log(`Total machines: ${machines.length}`, 'bright')
  log(`Total CPU cores: ${totalCores}`, 'bright')
  log(`Total shards: ${TOTAL_SHARDS}`, 'bright')
  log(`Distribution: Weighted by CPU cores`, 'bright')
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

  // Step 1: Verify connectivity
  logSection('📡 Verifying Connectivity')

  for (const machine of machines) {
    if (machine.host === 'localhost') {
      log(`[${machine.name}] Local machine ✅`, 'green')
      continue
    }

    try {
      await execAsync(`ssh -q ${machine.host} "bash -i -c exit"`)
      log(`[${machine.name}] Connected ✅`, 'green')
    } catch (error) {
      log(`[${machine.name}] Cannot connect ❌`, 'red')
      log(`Error: ${error.message}`, 'red')
      process.exit(1)
    }
  }

  // Step 2: Run tests on all machines in parallel
  logSection('🧪 Running Tests (Capacity-Weighted Distribution)')

  log(`Each machine will run its assigned shards in parallel...`, 'yellow')
  console.log('')

  const machinePromises = machineShards.map(runMachineShards)
  const allResults = await Promise.allSettled(machinePromises)

  // Step 3: Report results
  logSection('📊 Test Results')

  const totalTests = allResults.reduce((sum, r) => {
    if (r.status === 'fulfilled') {
      return sum + r.value.filter((t) => t.status === 'fulfilled' && t.value.success).length
    }
    return sum
  }, 0)

  const totalFailed = allResults.reduce((sum, r) => {
    if (r.status === 'fulfilled') {
      return (
        sum +
        r.value.filter(
          (t) => t.status === 'rejected' || (t.status === 'fulfilled' && !t.value.success),
        ).length
      )
    }
    return sum
  }, 0)

  log(`Total shards: ${totalTests + totalFailed}`, 'bright')
  log(`Passed: ${totalTests}`, totalFailed === 0 ? 'green' : 'yellow')
  log(`Failed: ${totalFailed}`, totalFailed > 0 ? 'red' : 'green')

  // Step 4: Merge reports if requested
  if (generateReport && totalTests > 0) {
    logSection('📈 Merging Reports')
    await mergeReports()
  }

  // Exit with appropriate code
  if (totalFailed > 0) {
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
