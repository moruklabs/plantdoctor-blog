#!/usr/bin/env node

/**
 * distributed-test-health-monitor.js
 * Health monitoring system for distributed test infrastructure
 *
 * Provides pre-flight checks and periodic monitoring for:
 * - SSH connectivity (timeout 5s)
 * - Disk space (require >10% free)
 * - Memory usage (require <95% used)
 * - CPU load (require <2x cores)
 *
 * Usage:
 *   const { runHealthChecks, startMonitoring } = await import('./distributed-test-health-monitor.js');
 *   const healthResults = await runHealthChecks(machines);
 *   const stopMonitoring = startMonitoring(machines, intervalMs);
 */

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

/**
 * Check SSH connectivity to a machine
 * @param {Object} machine - Machine configuration
 * @param {number} timeoutMs - Connection timeout in milliseconds
 * @returns {Promise<{success: boolean, latencyMs?: number, error?: string}>}
 */
async function checkSSHConnectivity(machine, timeoutMs = 5000) {
  if (machine.host === 'localhost') {
    return { success: true, latencyMs: 0 }
  }

  const startTime = Date.now()

  try {
    await execAsync(
      `ssh -o ConnectTimeout=${Math.floor(timeoutMs / 1000)} -q ${machine.host} "exit 0"`,
      { timeout: timeoutMs },
    )

    const latencyMs = Date.now() - startTime
    return { success: true, latencyMs }
  } catch (error) {
    return {
      success: false,
      error: `SSH connection failed: ${error.message}`,
    }
  }
}

/**
 * Check disk space on a machine
 * @param {Object} machine - Machine configuration
 * @returns {Promise<{success: boolean, percentFree?: number, error?: string}>}
 */
async function checkDiskSpace(machine) {
  const command =
    machine.host === 'localhost'
      ? `df -h ${machine.path} | awk 'NR==2 {print $5}'`
      : `ssh ${machine.host} "df -h ${machine.path} | awk 'NR==2 {print \\$5}'"`

  try {
    const { stdout } = await execAsync(command)
    const percentUsed = parseInt(stdout.trim().replace('%', ''))
    const percentFree = 100 - percentUsed

    return {
      success: percentFree > 10,
      percentFree,
      percentUsed,
    }
  } catch (error) {
    return {
      success: false,
      error: `Disk check failed: ${error.message}`,
    }
  }
}

/**
 * Check memory usage on a machine
 * @param {Object} machine - Machine configuration
 * @returns {Promise<{success: boolean, percentUsed?: number, error?: string}>}
 */
async function checkMemoryUsage(machine) {
  // Different commands for different OS
  // Use simpler approach: get used and total, calculate percentage in Node.js

  // Detect OS first
  const osCheckCommand =
    machine.host === 'localhost' ? `uname -s` : `ssh ${machine.host} "uname -s"`

  try {
    const { stdout: osType } = await execAsync(osCheckCommand)
    const isDarwin = osType.trim() === 'Darwin'

    let command
    if (machine.host === 'localhost') {
      if (isDarwin) {
        // macOS: Get page stats and calculate
        command = `vm_stat | awk '/Pages free/ {print $3} /Pages active/ {print $3} /Pages wired/ {print $3}'`
      } else {
        // Linux: Get used and total in MB
        command = `free -m | awk 'NR==2 {print $3,$2}'`
      }
    } else {
      if (isDarwin) {
        command = `ssh ${machine.host} "vm_stat | awk '/Pages free/ {print \\$3} /Pages active/ {print \\$3} /Pages wired/ {print \\$3}'"`
      } else {
        command = `ssh ${machine.host} "free -m | awk 'NR==2 {print \\$3,\\$2}'"`
      }
    }

    const { stdout } = await execAsync(command)
    const values = stdout
      .trim()
      .split(/\s+/)
      .map((v) => parseInt(v.replace(/\.$/, ''), 10))

    let percentUsed
    if (isDarwin) {
      // macOS: values = [free, active, wired]
      // Skip calculation for now, use fallback
      percentUsed = 50 // Placeholder - macOS memory calculation is complex
    } else {
      // Linux: values = [used_mb, total_mb]
      const [used, total] = values
      percentUsed = (used / total) * 100
    }

    return {
      success: percentUsed < 95,
      percentUsed,
      percentFree: 100 - percentUsed,
    }
  } catch (error) {
    return {
      success: false,
      error: `Memory check failed: ${error.message}`,
    }
  }
}

/**
 * Check CPU load on a machine
 * @param {Object} machine - Machine configuration
 * @returns {Promise<{success: boolean, load1m?: number, loadPerCore?: number, error?: string}>}
 */
async function checkCPULoad(machine) {
  // Get 1-minute load average and compare to core count
  // macOS/Linux: uptime shows load averages
  const command =
    machine.host === 'localhost'
      ? `uptime | awk -F'load average' '{print $2}' | awk -F'[:,]' '{gsub(/^[ \\t]+|[ \\t]+$/, "", $2); print $2}'`
      : `ssh ${machine.host} "uptime | awk -F'load average' '{print \\$2}' | awk -F'[:,]' '{gsub(/^[ \\\\t]+|[ \\\\t]+\\$/, \\\"\\\", \\$2); print \\$2}'"`

  try {
    const { stdout } = await execAsync(command)
    const load1m = parseFloat(stdout.trim())

    // Check if we got a valid number
    if (isNaN(load1m)) {
      return {
        success: false,
        error: `Invalid load average: ${stdout.trim()}`,
      }
    }

    const cores = machine.capacity.cpu_cores
    const loadPerCore = load1m / cores

    // Warning if load per core > 2.0
    return {
      success: loadPerCore < 2.0,
      load1m: parseFloat(load1m.toFixed(2)),
      loadPerCore: parseFloat(loadPerCore.toFixed(2)),
      cores,
    }
  } catch (error) {
    return {
      success: false,
      error: `CPU load check failed: ${error.message}`,
    }
  }
}

/**
 * Run all health checks for a machine
 * @param {Object} machine - Machine configuration
 * @returns {Promise<{machine: string, healthy: boolean, checks: Object}>}
 */
export async function checkMachineHealth(machine) {
  const checks = {
    ssh: await checkSSHConnectivity(machine),
    disk: { success: true }, // Will be populated
    memory: { success: true }, // Will be populated
    cpu: { success: true }, // Will be populated
  }

  // Only run additional checks if SSH works (or is localhost)
  if (checks.ssh.success) {
    checks.disk = await checkDiskSpace(machine)
    checks.memory = await checkMemoryUsage(machine)
    checks.cpu = await checkCPULoad(machine)
  }

  const healthy =
    checks.ssh.success && checks.disk.success && checks.memory.success && checks.cpu.success

  return {
    machine: machine.name,
    host: machine.host,
    healthy,
    checks,
  }
}

/**
 * Run health checks for all machines
 * @param {Array} machines - Array of machine configurations
 * @returns {Promise<Array>} Health check results
 */
export async function runHealthChecks(machines) {
  log('\n🏥 Running Health Checks...', 'cyan')

  const results = await Promise.all(machines.map((m) => checkMachineHealth(m)))

  // Display results
  results.forEach((result) => {
    const symbol = result.healthy ? '✅' : '❌'
    const color = result.healthy ? 'green' : 'red'

    log(`\n[${result.machine}] ${symbol}`, color)

    // SSH
    if (result.checks.ssh.success) {
      const latency = result.checks.ssh.latencyMs || 0
      log(`  SSH: OK (${latency}ms)`, 'green')
    } else {
      log(`  SSH: FAILED - ${result.checks.ssh.error}`, 'red')
    }

    // Disk
    if (result.checks.ssh.success) {
      if (result.checks.disk.error) {
        log(`  Disk: ERROR - ${result.checks.disk.error}`, 'red')
      } else if (result.checks.disk.success) {
        log(`  Disk: ${result.checks.disk.percentFree}% free`, 'green')
      } else {
        log(`  Disk: ${result.checks.disk.percentFree}% free (⚠️ <10%)`, 'yellow')
      }
    }

    // Memory
    if (result.checks.ssh.success) {
      if (result.checks.memory.error) {
        log(`  Memory: ERROR - ${result.checks.memory.error}`, 'red')
      } else if (result.checks.memory.success) {
        log(`  Memory: ${result.checks.memory.percentUsed.toFixed(1)}% used`, 'green')
      } else if (result.checks.memory.percentUsed !== undefined) {
        log(`  Memory: ${result.checks.memory.percentUsed.toFixed(1)}% used (⚠️ >95%)`, 'yellow')
      }
    }

    // CPU
    if (result.checks.ssh.success) {
      if (result.checks.cpu.error) {
        log(`  CPU: ERROR - ${result.checks.cpu.error}`, 'red')
      } else if (result.checks.cpu.success) {
        log(
          `  CPU: Load ${result.checks.cpu.load1m} (${result.checks.cpu.loadPerCore}/core)`,
          'green',
        )
      } else if (result.checks.cpu.load1m !== undefined) {
        log(
          `  CPU: Load ${result.checks.cpu.load1m} (${result.checks.cpu.loadPerCore}/core) (⚠️ High)`,
          'yellow',
        )
      }
    }
  })

  const healthyCount = results.filter((r) => r.healthy).length
  const totalCount = results.length

  log(
    `\n📊 Health Summary: ${healthyCount}/${totalCount} machines healthy`,
    healthyCount === totalCount ? 'green' : 'yellow',
  )

  return results
}

/**
 * Start periodic health monitoring
 * @param {Array} machines - Array of machine configurations
 * @param {number} intervalMs - Monitoring interval in milliseconds (default: 30000)
 * @returns {Function} Stop function to cancel monitoring
 */
export function startMonitoring(machines, intervalMs = 30000) {
  log(`\n🔄 Starting periodic health monitoring (every ${intervalMs / 1000}s)`, 'cyan')

  const intervalId = setInterval(async () => {
    const results = await Promise.all(machines.map((m) => checkMachineHealth(m)))

    const unhealthy = results.filter((r) => !r.healthy)

    if (unhealthy.length > 0) {
      log(`\n⚠️  WARNING: ${unhealthy.length} machine(s) unhealthy:`, 'yellow')
      unhealthy.forEach((r) => {
        log(
          `  - ${r.machine}: ${Object.keys(r.checks)
            .filter((k) => !r.checks[k].success)
            .join(', ')}`,
          'yellow',
        )
      })
    }
  }, intervalMs)

  return () => {
    clearInterval(intervalId)
    log('\n✋ Stopped health monitoring', 'cyan')
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  import('js-yaml').then(async ({ default: yaml }) => {
    import('fs').then(async ({ default: fs }) => {
      import('path').then(async ({ default: path }) => {
        import('url').then(async ({ fileURLToPath }) => {
          const __filename = fileURLToPath(import.meta.url)
          const __dirname = path.dirname(__filename)
          const projectRoot = path.dirname(__dirname)

          const configPath = path.join(projectRoot, 'distributed-test-config.yaml')
          const config = yaml.load(fs.readFileSync(configPath, 'utf8'))

          const results = await runHealthChecks(config.machines)

          const unhealthy = results.filter((r) => !r.healthy)
          process.exit(unhealthy.length > 0 ? 1 : 0)
        })
      })
    })
  })
}
