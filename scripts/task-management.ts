#!/usr/bin/env tsx
/**
 * Task Management System with Locking Mechanism
 *
 * Implements a distributed lock system using git as the coordination layer.
 * Prevents multiple agents from working on the same task simultaneously.
 */

import * as fs from 'fs/promises'
import { execSync } from 'child_process'
import chalk from 'chalk'

const TODO_FILE = 'TODO.md'
const TASK_LOCKS_FILE = 'TASK-LOCKS.md'
const AGENT_ID_FILE = '.agent-id'
const DEFAULT_LOCK_DURATION_HOURS = 2

interface LockInfo {
  taskId?: string
  taskName: string
  agentId: string
  startedAt: string
  expiresAt: string
  estimatedDuration?: string
}

interface Task {
  name: string
  priority: 'P0' | 'P1' | 'P2'
  locked?: boolean
  lockInfo?: LockInfo
}

class TaskManager {
  private agentId: string = ''

  async init() {
    this.agentId = await this.getOrCreateAgentId()
  }

  private async getOrCreateAgentId(): Promise<string> {
    try {
      const id = await fs.readFile(AGENT_ID_FILE, 'utf-8')
      return id.trim()
    } catch {
      // Generate new agent ID if file doesn't exist
      const id = `agent-${Math.random().toString(36).substring(2, 15)}`
      await fs.writeFile(AGENT_ID_FILE, id)
      console.log(chalk.cyan(`Created agent ID: ${id}`))
      return id
    }
  }

  private getCurrentUTC(): string {
    return new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  }

  private getExpirationTime(hours: number = DEFAULT_LOCK_DURATION_HOURS): string {
    const expiration = new Date()
    expiration.setHours(expiration.getHours() + hours)
    return expiration.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
  }

  private isLockExpired(expiresAt: string): boolean {
    const expiration = new Date(expiresAt.replace(' UTC', 'Z'))
    return new Date() > expiration
  }

  async acquireLock(taskName: string): Promise<boolean> {
    try {
      // Read TODO.md to find the task
      const todoContent = await fs.readFile(TODO_FILE, 'utf-8')
      const lines = todoContent.split('\n')

      let taskFound = false
      let taskIndex = -1
      let isLocked = false

      // Find the task in TODO.md
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.includes(taskName) && line.includes('- [ ]')) {
          taskFound = true
          taskIndex = i

          // Check if already locked (look for lock metadata in next few lines)
          for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
            if (lines[j].includes('🔒 **Locked By:**')) {
              isLocked = true
              const lockedBy = lines[j].match(/agent-\w+/)?.[0]

              // Check if lock is expired
              for (let k = j; k < Math.min(j + 3, lines.length); k++) {
                if (lines[k].includes('⏰ **Lock Expires:**')) {
                  const expiresMatch = lines[k].match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC)/)
                  if (expiresMatch && this.isLockExpired(expiresMatch[1])) {
                    console.log(
                      chalk.yellow(`⚠️ Found expired lock held by ${lockedBy}, cleaning up...`),
                    )
                    isLocked = false
                    // Remove lock lines
                    lines.splice(j, 3)
                  } else {
                    console.log(chalk.red(`❌ Task already locked by ${lockedBy}`))
                    if (expiresMatch) {
                      console.log(chalk.yellow(`⏰ Lock expires at: ${expiresMatch[1]}`))
                    }
                    return false
                  }
                  break
                }
              }
              break
            }
          }
          break
        }
      }

      if (!taskFound) {
        console.log(chalk.red(`❌ Task not found: ${taskName}`))
        console.log(chalk.cyan(`💡 Run 'pnpm task:list' to see available tasks`))
        return false
      }

      if (isLocked) {
        return false
      }

      // Add lock metadata to TODO.md
      const startTime = this.getCurrentUTC()
      const expireTime = this.getExpirationTime()
      const lockMetadata = [
        `  - 🔒 **Locked By:** ${this.agentId}`,
        `  - 🕐 **Lock Started:** ${startTime}`,
        `  - ⏰ **Lock Expires:** ${expireTime}`,
      ]

      lines.splice(taskIndex + 1, 0, ...lockMetadata)
      await fs.writeFile(TODO_FILE, lines.join('\n'))

      // Update TASK-LOCKS.md
      await this.updateTaskLocksFile(
        {
          taskName,
          agentId: this.agentId,
          startedAt: startTime,
          expiresAt: expireTime,
          estimatedDuration: '2 hours',
        },
        'lock',
      )

      // Commit changes
      try {
        execSync(`git add ${TODO_FILE} ${TASK_LOCKS_FILE}`, { stdio: 'pipe' })
        execSync(`git commit -m "lock: Acquire task '${taskName}'"`, { stdio: 'pipe' })

        console.log(chalk.green(`✅ Lock acquired: ${taskName}`))
        console.log(chalk.blue(`🔒 Agent ID: ${this.agentId}`))
        console.log(chalk.blue(`⏰ Expires: ${expireTime}`))
        console.log(chalk.blue(`📝 Updated: ${TODO_FILE}, ${TASK_LOCKS_FILE}`))
        console.log(chalk.blue(`🔄 Committed: lock: Acquire task '${taskName}'`))
        return true
      } catch (error) {
        // Git conflict - someone else got the lock
        console.log(chalk.red(`❌ Failed to acquire lock: Git conflict detected`))
        console.log(chalk.yellow(`⚠️ Another agent acquired the lock first`))
        console.log(chalk.cyan(`💡 Try 'pnpm task:list' to see available tasks`))

        // Revert local changes
        execSync(`git checkout -- ${TODO_FILE} ${TASK_LOCKS_FILE}`, { stdio: 'pipe' })
        return false
      }
    } catch (error) {
      console.error(chalk.red('Error acquiring lock:'), error)
      return false
    }
  }

  async releaseLock(taskName: string): Promise<boolean> {
    try {
      const todoContent = await fs.readFile(TODO_FILE, 'utf-8')
      const lines = todoContent.split('\n')

      let taskFound = false
      let lockRemoved = false

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (line.includes(taskName)) {
          taskFound = true

          // Look for lock metadata and remove it
          for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
            if (lines[j].includes('🔒 **Locked By:**')) {
              const lockedBy = lines[j].match(/agent-\w+/)?.[0]

              if (lockedBy !== this.agentId) {
                console.log(chalk.red(`❌ Cannot release lock held by ${lockedBy}`))
                console.log(chalk.yellow(`⚠️ You are: ${this.agentId}`))
                return false
              }

              // Remove the 3 lock lines
              lines.splice(j, 3)
              lockRemoved = true
              break
            }
          }
          break
        }
      }

      if (!taskFound) {
        console.log(chalk.red(`❌ Task not found: ${taskName}`))
        return false
      }

      if (!lockRemoved) {
        console.log(chalk.yellow(`⚠️ No lock found for task: ${taskName}`))
        return false
      }

      await fs.writeFile(TODO_FILE, lines.join('\n'))

      // Update TASK-LOCKS.md (move to history)
      await this.updateTaskLocksFile(
        {
          taskName,
          agentId: this.agentId,
          startedAt: '',
          expiresAt: '',
        },
        'unlock',
      )

      // Commit changes
      execSync(`git add ${TODO_FILE} ${TASK_LOCKS_FILE}`, { stdio: 'pipe' })
      execSync(`git commit -m "unlock: Release task '${taskName}'"`, { stdio: 'pipe' })

      console.log(chalk.green(`✅ Lock released: ${taskName}`))
      console.log(chalk.blue(`📝 Updated: ${TODO_FILE}, ${TASK_LOCKS_FILE}`))
      console.log(chalk.blue(`🔄 Committed: unlock: Release task '${taskName}'`))
      return true
    } catch (error) {
      console.error(chalk.red('Error releasing lock:'), error)
      return false
    }
  }

  async listAvailableTasks(): Promise<void> {
    try {
      const todoContent = await fs.readFile(TODO_FILE, 'utf-8')
      const lines = todoContent.split('\n')

      const tasks: { [key: string]: Task[] } = {
        P0: [],
        P1: [],
        P2: [],
      }

      let currentPriority = ''

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]

        // Detect priority sections
        if (line.includes('P0 - Critical')) currentPriority = 'P0'
        else if (line.includes('P1 - High Priority')) currentPriority = 'P1'
        else if (line.includes('P2 - Medium Priority')) currentPriority = 'P2'

        // Find tasks
        if (line.includes('- [ ]') && currentPriority) {
          const taskMatch = line.match(/\*\*(.*?)\*\*/)
          if (taskMatch) {
            const taskName = taskMatch[1]
            let isLocked = false

            // Check if locked
            for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
              if (lines[j].includes('🔒 **Locked By:**')) {
                isLocked = true
                break
              }
              if (lines[j].startsWith('- [')) break // Next task
            }

            if (!isLocked) {
              tasks[currentPriority].push({
                name: taskName,
                priority: currentPriority as 'P0' | 'P1' | 'P2',
              })
            }
          }
        }
      }

      console.log(chalk.cyan('📋 Available Tasks (Unlocked):\n'))

      if (tasks['P0'].length > 0) {
        console.log(chalk.red.bold('P0 - Critical:'))
        tasks['P0'].forEach((task, idx) => {
          console.log(`  ${idx + 1}. ${task.name}`)
        })
        console.log()
      }

      if (tasks['P1'].length > 0) {
        console.log(chalk.yellow.bold('P1 - High Priority:'))
        tasks['P1'].forEach((task, idx) => {
          console.log(`  ${tasks['P0'].length + idx + 1}. ${task.name}`)
        })
        console.log()
      }

      if (tasks['P2'].length > 0) {
        console.log(chalk.blue.bold('P2 - Medium Priority:'))
        tasks['P2'].forEach((task, idx) => {
          console.log(`  ${tasks['P0'].length + tasks['P1'].length + idx + 1}. ${task.name}`)
        })
      }
    } catch (error) {
      console.error(chalk.red('Error listing tasks:'), error)
    }
  }

  async showActiveLocks(): Promise<void> {
    try {
      const content = await fs.readFile(TASK_LOCKS_FILE, 'utf-8')
      const lines = content.split('\n')

      let inActiveSection = false
      let lockCount = 0

      console.log(chalk.cyan('🔒 Active Locks:\n'))

      for (const line of lines) {
        if (line.includes('## 🔒 Active Locks')) {
          inActiveSection = true
          continue
        }

        if (inActiveSection && line.startsWith('##')) {
          break
        }

        if (
          inActiveSection &&
          line.includes('|') &&
          !line.includes('Task ID') &&
          !line.includes('---')
        ) {
          const parts = line.split('|').map((p) => p.trim())
          if (parts[1] && parts[1] !== '-') {
            lockCount++
            console.log(`${chalk.yellow('Task:')} ${parts[2]}`)
            console.log(`${chalk.blue('Agent:')} ${parts[3]}`)
            console.log(`${chalk.green('Started:')} ${parts[4]}`)
            console.log(`${chalk.red('Expires:')} ${parts[5]}`)
            console.log()
          }
        }
      }

      if (lockCount === 0) {
        console.log(chalk.green('No active locks found.'))
      } else {
        console.log(chalk.yellow(`Total active locks: ${lockCount}`))
      }
    } catch (error) {
      console.error(chalk.red('Error showing locks:'), error)
    }
  }

  private async updateTaskLocksFile(lockInfo: LockInfo, action: 'lock' | 'unlock'): Promise<void> {
    try {
      const content = await fs.readFile(TASK_LOCKS_FILE, 'utf-8')
      let lines = content.split('\n')

      if (action === 'lock') {
        // Find the active locks table and add new entry
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes('| Task ID | Task Name') && lines[i + 2]) {
            // Insert after the header separator
            const newRow = `| - | ${lockInfo.taskName} | ${lockInfo.agentId} | ${lockInfo.startedAt} | ${lockInfo.expiresAt} | ${lockInfo.estimatedDuration || '-'} |`
            lines.splice(i + 2, 0, newRow)

            // Update the lock count
            for (let j = 0; j < lines.length; j++) {
              if (lines[j].includes('**Currently:**')) {
                const match = lines[j].match(/\d+/)
                if (match) {
                  const count = parseInt(match[0]) + 1
                  lines[j] = `**Currently:** ${count} active locks`
                }
                break
              }
            }
            break
          }
        }
      } else {
        // Remove from active locks
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].includes(lockInfo.taskName) && lines[i].includes(lockInfo.agentId)) {
            lines.splice(i, 1)

            // Update the lock count
            for (let j = 0; j < lines.length; j++) {
              if (lines[j].includes('**Currently:**')) {
                const match = lines[j].match(/\d+/)
                if (match) {
                  const count = Math.max(0, parseInt(match[0]) - 1)
                  lines[j] = `**Currently:** ${count} active locks`
                }
                break
              }
            }
            break
          }
        }
      }

      // Update last updated timestamp
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('**Last Updated:**')) {
          lines[i] = `**Last Updated:** ${this.getCurrentUTC()}`
          break
        }
      }

      await fs.writeFile(TASK_LOCKS_FILE, lines.join('\n'))
    } catch (error) {
      console.error(chalk.red('Error updating TASK-LOCKS.md:'), error)
    }
  }

  async cleanupStaleLocks(): Promise<void> {
    try {
      console.log(chalk.cyan('🧹 Cleaning up stale locks...\n'))

      const todoContent = await fs.readFile(TODO_FILE, 'utf-8')
      const lines = todoContent.split('\n')
      let cleanedCount = 0

      for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i]
        if (line.includes('⏰ **Lock Expires:**')) {
          const expiresMatch = line.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC)/)
          if (expiresMatch && this.isLockExpired(expiresMatch[1])) {
            // Remove lock lines (current and 2 before)
            lines.splice(i - 2, 3)
            cleanedCount++
            console.log(chalk.yellow(`Removed stale lock expiring at: ${expiresMatch[1]}`))
          }
        }
      }

      if (cleanedCount > 0) {
        await fs.writeFile(TODO_FILE, lines.join('\n'))

        execSync(`git add ${TODO_FILE}`, { stdio: 'pipe' })
        execSync(`git commit -m "cleanup: Remove ${cleanedCount} stale lock(s)"`, { stdio: 'pipe' })

        console.log(chalk.green(`✅ Cleaned up ${cleanedCount} stale lock(s)`))
      } else {
        console.log(chalk.green('No stale locks found.'))
      }
    } catch (error) {
      console.error(chalk.red('Error cleaning up stale locks:'), error)
    }
  }
}

// CLI
async function main() {
  const manager = new TaskManager()
  await manager.init()

  const command = process.argv[2]
  const taskName = process.argv.slice(3).join(' ')

  switch (command) {
    case 'lock':
      if (!taskName) {
        console.error(chalk.red('Usage: pnpm task:lock "Task name"'))
        process.exit(1)
      }
      await manager.acquireLock(taskName)
      break

    case 'unlock':
      if (!taskName) {
        console.error(chalk.red('Usage: pnpm task:unlock "Task name"'))
        process.exit(1)
      }
      await manager.releaseLock(taskName)
      break

    case 'list':
      await manager.listAvailableTasks()
      break

    case 'locks':
      await manager.showActiveLocks()
      break

    case 'cleanup':
      await manager.cleanupStaleLocks()
      break

    default:
      console.log(chalk.cyan('Task Management System\n'))
      console.log('Commands:')
      console.log('  pnpm task:lock "Task name"   - Acquire lock on a task')
      console.log('  pnpm task:unlock "Task name" - Release lock on a task')
      console.log('  pnpm task:list               - List available (unlocked) tasks')
      console.log('  pnpm task:locks              - Show active locks')
      console.log('  pnpm task:cleanup            - Clean up stale locks')
  }
}

main().catch(console.error)
