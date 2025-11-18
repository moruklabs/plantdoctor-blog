#!/usr/bin/env node

/**
 * distributed-test-progress.js
 * Real-time progress tracking for distributed test execution
 *
 * Provides live progress bars and statistics for test shards running across multiple machines.
 *
 * Usage:
 *   import { ProgressTracker } from './distributed-test-progress.js';
 *   const tracker = new ProgressTracker(machines, totalShards);
 *   tracker.start();
 *   tracker.updateShard(machineId, shardNumber, status);
 *   tracker.stop();
 */

import { clearLine, cursorTo, moveCursor } from 'readline'

// Colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
}

/**
 * Progress tracker for distributed testing
 */
export class ProgressTracker {
  constructor(machines, totalShards) {
    this.machines = machines.map((m) => ({
      ...m,
      completed: 0,
      failed: 0,
      total: 0,
      shards: new Map(), // shardNumber -> status ('pending'|'running'|'passed'|'failed')
    }))
    this.totalShards = totalShards
    this.startTime = null
    this.updateInterval = null
    this.lastOutput = null
  }

  /**
   * Start tracking and display initial state
   */
  start() {
    this.startTime = Date.now()

    // Hide cursor for cleaner output
    process.stdout.write('\x1b[?25l')

    // Initial render
    this.render()

    // Update every 500ms
    this.updateInterval = setInterval(() => {
      this.render()
    }, 500)
  }

  /**
   * Stop tracking and show cursor
   */
  stop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
    }

    // Show cursor again
    process.stdout.write('\x1b[?25h')

    // Final render
    this.render()
    console.log('') // Add newline at the end
  }

  /**
   * Update the status of a specific shard
   * @param {string} machineName - Name of the machine
   * @param {number} shardNumber - Shard number
   * @param {string} status - 'pending'|'running'|'passed'|'failed'
   */
  updateShard(machineName, shardNumber, status) {
    const machine = this.machines.find((m) => m.name === machineName)
    if (!machine) return

    const previousStatus = machine.shards.get(shardNumber)
    machine.shards.set(shardNumber, status)

    // Update counters
    if (status === 'passed' && previousStatus !== 'passed') {
      machine.completed++
    } else if (status === 'failed' && previousStatus !== 'failed') {
      machine.failed++
      machine.completed++
    }
  }

  /**
   * Initialize a machine's shards
   * @param {string} machineName - Name of the machine
   * @param {Array<number>} shardNumbers - Array of shard numbers assigned to this machine
   */
  initMachine(machineName, shardNumbers) {
    const machine = this.machines.find((m) => m.name === machineName)
    if (!machine) return

    machine.total = shardNumbers.length
    shardNumbers.forEach((shard) => {
      machine.shards.set(shard, 'pending')
    })
  }

  /**
   * Render the progress display
   */
  render() {
    const output = this._buildOutput()

    // Clear previous output if exists
    if (this.lastOutput) {
      const lines = this.lastOutput.split('\n').length
      moveCursor(process.stdout, 0, -lines)
      for (let i = 0; i < lines; i++) {
        clearLine(process.stdout, 0)
        if (i < lines - 1) moveCursor(process.stdout, 0, 1)
      }
      moveCursor(process.stdout, 0, -(lines - 1))
      cursorTo(process.stdout, 0)
    }

    process.stdout.write(output)
    this.lastOutput = output
  }

  /**
   * Build the output string
   * @returns {string}
   */
  _buildOutput() {
    const lines = []

    // Header
    lines.push(`${colors.cyan}${'═'.repeat(70)}${colors.reset}`)
    lines.push(`${colors.bright}    Distributed Test Progress${colors.reset}`)
    lines.push(`${colors.cyan}${'═'.repeat(70)}${colors.reset}`)
    lines.push('')

    // Overall progress
    const totalCompleted = this.machines.reduce((sum, m) => sum + m.completed, 0)
    const totalFailed = this.machines.reduce((sum, m) => sum + m.failed, 0)
    const totalPassed = totalCompleted - totalFailed
    const percentComplete =
      this.totalShards > 0 ? ((totalCompleted / this.totalShards) * 100).toFixed(1) : 0

    lines.push(
      `${colors.bright}Overall: ${totalCompleted}/${this.totalShards} (${percentComplete}%)${colors.reset}`,
    )
    if (totalPassed > 0) {
      lines.push(`${colors.green}Passed: ${totalPassed}${colors.reset}`)
    }
    if (totalFailed > 0) {
      lines.push(`${colors.red}Failed: ${totalFailed}${colors.reset}`)
    }

    // Elapsed time
    if (this.startTime) {
      const elapsedMs = Date.now() - this.startTime
      const elapsedSec = Math.floor(elapsedMs / 1000)
      const minutes = Math.floor(elapsedSec / 60)
      const seconds = elapsedSec % 60
      lines.push(`${colors.dim}Time: ${minutes}m ${seconds}s${colors.reset}`)
    }

    lines.push('')

    // Per-machine progress
    this.machines.forEach((machine) => {
      const percent = machine.total > 0 ? (machine.completed / machine.total) * 100 : 0

      const bar = this._buildProgressBar(machine.completed, machine.total, 30)
      const status = `${machine.completed}/${machine.total}`

      let machineLine = `${machine.name.padEnd(15)} ${bar} ${status}`

      // Add failure indicator
      if (machine.failed > 0) {
        machineLine += ` ${colors.red}(${machine.failed} failed)${colors.reset}`
      }

      lines.push(machineLine)
    })

    lines.push('')

    return lines.join('\n')
  }

  /**
   * Build a progress bar string
   * @param {number} completed - Number completed
   * @param {number} total - Total number
   * @param {number} width - Width of the bar
   * @returns {string}
   */
  _buildProgressBar(completed, total, width = 30) {
    if (total === 0) {
      return `${colors.gray}[${'░'.repeat(width)}]${colors.reset}`
    }

    const percent = completed / total
    const filledWidth = Math.floor(percent * width)
    const emptyWidth = width - filledWidth

    const filled = '█'.repeat(filledWidth)
    const empty = '░'.repeat(emptyWidth)

    // Color based on progress
    let color = colors.yellow
    if (percent >= 1.0) {
      color = colors.green
    } else if (percent >= 0.75) {
      color = colors.cyan
    }

    return `${color}[${filled}${empty}]${colors.reset}`
  }

  /**
   * Get current statistics
   * @returns {Object}
   */
  getStats() {
    const totalCompleted = this.machines.reduce((sum, m) => sum + m.completed, 0)
    const totalFailed = this.machines.reduce((sum, m) => sum + m.failed, 0)
    const totalPassed = totalCompleted - totalFailed

    return {
      total: this.totalShards,
      completed: totalCompleted,
      passed: totalPassed,
      failed: totalFailed,
      percentComplete:
        this.totalShards > 0 ? ((totalCompleted / this.totalShards) * 100).toFixed(1) : 0,
      machines: this.machines.map((m) => ({
        name: m.name,
        total: m.total,
        completed: m.completed,
        failed: m.failed,
        passed: m.completed - m.failed,
      })),
    }
  }
}

// CLI test
if (import.meta.url === `file://${process.argv[1]}`) {
  // Demo usage
  console.log('Progress Tracker Demo\n')

  const demoMachines = [
    { name: 'local', capacity: { cpu_cores: 16 } },
    { name: 'moruk', capacity: { cpu_cores: 24 } },
    { name: 'ilko2', capacity: { cpu_cores: 4 } },
    { name: 'pi', capacity: { cpu_cores: 4 } },
  ]

  const tracker = new ProgressTracker(demoMachines, 48)

  // Initialize machines with shards
  tracker.initMachine('local', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])
  tracker.initMachine(
    'moruk',
    Array.from({ length: 24 }, (_, i) => i + 17),
  )
  tracker.initMachine('ilko2', [41, 42, 43, 44])
  tracker.initMachine('pi', [45, 46, 47, 48])

  tracker.start()

  // Simulate progress
  let progress = 0
  const interval = setInterval(() => {
    progress++

    // Simulate some shards completing
    if (progress <= 16) {
      tracker.updateShard('local', progress, Math.random() > 0.1 ? 'passed' : 'failed')
    }
    if (progress > 5 && progress <= 29) {
      tracker.updateShard('moruk', progress + 11, Math.random() > 0.1 ? 'passed' : 'failed')
    }
    if (progress > 10 && progress <= 14) {
      tracker.updateShard('ilko2', progress + 30, Math.random() > 0.1 ? 'passed' : 'failed')
    }
    if (progress > 15 && progress <= 19) {
      tracker.updateShard('pi', progress + 29, Math.random() > 0.1 ? 'passed' : 'failed')
    }

    if (progress >= 35) {
      tracker.stop()
      clearInterval(interval)

      console.log('\nDemo complete!')
      console.log('Final stats:', tracker.getStats())
    }
  }, 200)
}
