#!/usr/bin/env node

/**
 * distribute-tests.js
 * Runs Playwright E2E tests across local and remote machines
 *
 * Usage:
 *   node scripts/distribute-tests.js [options]
 *
 * Options:
 *   --machines 2,4        Run 2-way or 4-way sharding (default: 2)
 *   --report              Generate HTML report (default: true)
 *   --bail                Stop on first failure (default: false)
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const execAsync = promisify(exec)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.dirname(__dirname)

// Configuration
const LOCAL_PATH = '/Users/fatih/workspace/news.plantdoctor.app'
const MACHINES = [
  {
    id: 1,
    name: 'local',
    host: 'localhost',
    path: LOCAL_PATH,
  },
  {
    id: 2,
    name: 'moruk (remote)',
    host: 'dev@moruk',
    path: '/home/dev/news.plantdoctor.app',
  },
  {
    id: 3,
    name: 'ilko1 (remote)',
    host: 'ilko1',
    path: '/home/yavuz1/news.plantdoctor.app',
  },
  {
    id: 4,
    name: 'ilko2 (remote)',
    host: 'ilko2',
    path: '/home/yavuz5/news.plantdoctor.app',
  },
  {
    id: 5,
    name: 'pi (remote)',
    host: 'pi',
    path: '/home/fatih/news.plantdoctor.app',
  },
  // {
  //   id: 4,
  //   name: 'machine4',
  //   host: 'dev@machine4',
  //   path: '/home/user/news.plantdoctor.app'
  // }
]

// Parse CLI args
const args = process.argv.slice(2)
const machineCount = parseInt(args.find((a) => a.startsWith('--machines='))?.split('=')[1] || '2')
const generateReport = !args.includes('--no-report')
const bailOnFailure = args.includes('--bail')

const activeMachines = MACHINES.slice(0, machineCount)

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

async function runTestShard(machine, totalShards) {
  const shardArg = `--shard=${machine.id}/${totalShards}`

  if (machine.host === 'localhost') {
    log(`[${machine.name}] Running locally...`, 'blue')
    const { stdout, stderr } = await execAsync(`cd ${machine.path} && pnpm e2e ${shardArg}`, {
      shell: '/bin/bash',
    })
    return { machine, success: true, stdout, stderr }
  } else {
    log(`[${machine.name}] Running remotely via SSH...`, 'blue')
    const { stdout, stderr } = await execAsync(
      `ssh ${machine.host} "bash -i -c 'cd ${machine.path} && pnpm e2e ${shardArg}'"`,
      { shell: '/bin/bash' },
    )
    return { machine, success: true, stdout, stderr }
  }
}

async function mergeReports() {
  log('Merging test reports...', 'yellow')

  const reportDirs = activeMachines
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
  logSection('🚀 Distributed Test Execution')

  log(`Total machines: ${activeMachines.length}`, 'bright')
  log(`Sharding mode: ${activeMachines.length}-way`, 'bright')
  log(`Generate report: ${generateReport ? 'Yes' : 'No'}`, 'bright')
  console.log('')

  log('Machines:', 'yellow')
  activeMachines.forEach((m) => {
    log(`  ${m.id}. ${m.name.padEnd(20)} (${m.host})`, 'cyan')
  })
  console.log('')

  // Step 1: Verify connectivity
  logSection('📡 Verifying Connectivity')

  for (const machine of activeMachines) {
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
      log('Make sure:', 'yellow')
      log('  - Machine is reachable via Tailscale', 'yellow')
      log('  - SSH keys are configured', 'yellow')
      log('  - Hostname is correct: ' + machine.host, 'yellow')
      process.exit(1)
    }
  }

  // Step 2: Run tests in parallel
  logSection('🧪 Running Tests in Parallel')

  const testPromises = activeMachines.map((machine) =>
    runTestShard(machine, activeMachines.length).catch((error) => ({
      machine,
      success: false,
      error: error.message,
    })),
  )

  log(`Starting ${activeMachines.length} test shards...`, 'yellow')
  console.log('')

  const results = await Promise.allSettled(testPromises)

  // Step 3: Report results
  logSection('📊 Test Results')

  const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success)
  const failed = results.filter(
    (r) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success),
  )

  successful.forEach((r) => {
    log(`✅ ${r.value.machine.name}`, 'green')
  })

  failed.forEach((r) => {
    const machine = r.value?.machine || { name: 'Unknown' }
    log(`❌ ${machine.name}`, 'red')
  })

  console.log('')
  log(
    `Passed: ${successful.length}/${activeMachines.length}`,
    successful.length === activeMachines.length ? 'green' : 'red',
  )

  // Step 4: Merge reports if requested
  if (generateReport && successful.length > 0) {
    logSection('📈 Merging Reports')
    await mergeReports()
  }

  // Exit with appropriate code
  if (failed.length > 0) {
    logSection('❌ Tests Failed')
    process.exit(1)
  } else {
    logSection('✅ All Tests Passed')
    process.exit(0)
  }
}

main().catch((error) => {
  log(`Unexpected error: ${error.message}`, 'red')
  process.exit(1)
})
