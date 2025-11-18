# Task Locks

**Last Updated:** 2025-11-16 09:52:07 UTC
**Purpose:** Coordinate concurrent work across multiple agents/sessions

## ⚠️ CRITICAL: Lock Protocol

**Before starting ANY task:**

1. ✅ Run `pnpm task:lock <task-name>` to claim the task
2. ✅ Verify lock was acquired (check output)
3. ✅ Work on the task
4. ✅ Run `pnpm task:unlock <task-name>` when done
5. ✅ Commit changes with task completion

**Never:**

- ❌ Start work without acquiring a lock
- ❌ Override another agent's lock (unless stale)
- ❌ Forget to unlock when finished

---

## 🔒 Active Locks

<!-- This section is automatically updated by scripts/task-management.ts -->

**Currently:** No active locks

| Task ID | Task Name                                                      | Agent ID          | Started At              | Expires At              | Duration |
| ------- | -------------------------------------------------------------- | ----------------- | ----------------------- | ----------------------- | -------- |
| -       | Phase 5: Test theme system (build, type-check, visual testing) | agent-uj8qr7ednuo | 2025-11-16 09:18:14 UTC | 2025-11-16 11:18:14 UTC | 2 hours  |
| -       | -                                                              | -                 | -                       | -                       | -        |

---

## 📋 Available Tasks (Unlocked)

**P0 - Critical:**

- Fix TypeScript compilation error in E2E test
- Enable TypeScript strict mode

**P1 - High Priority:**

- Remove CSS duplication (210 lines)
- Replace all `any` types with proper types
- Standardize badge styling to semantic tokens
- Enable image optimization
- Replace 100+ placeholder values
- Add component unit tests (current coverage: 4%)
- Phase 5: Test theme system
- Phase 5: Update CLAUDE.md and STATUS.md for Phase 5 completion

**P2 - Medium Priority:**

- Remove dead/unused components
- Fix Atomic Design violations
- Standardize component exports (remove default exports)

---

## 🕐 Lock History (Last 10)

| Task ID | Task Name | Agent ID | Started At | Completed At | Duration | Status |
| ------- | --------- | -------- | ---------- | ------------ | -------- | ------ |
| -       | -         | -        | -          | -            | -        | -      |

---

## 📊 Lock Statistics

**Total Locks Today:** 0
**Average Lock Duration:** N/A
**Stale Locks Cleaned:** 0

---

## 🔧 Lock Management Commands

```bash
# Claim a task (acquire lock)
pnpm task:lock "Fix TypeScript compilation error"

# Release a task (release lock)
pnpm task:unlock "Fix TypeScript compilation error"

# List all available (unlocked) tasks
pnpm task:list

# Check active locks
pnpm task:locks

# Clean up stale locks (>2 hours old)
pnpm task:cleanup

# Force unlock a task (emergency only)
pnpm task:force-unlock "Task name" --reason "Stale lock, agent crashed"
```

---

## 🎯 Lock Mechanism Design

### How It Works

1. **Lock Acquisition:**
   - Agent runs `pnpm task:lock "Task name"`
   - Script searches TODO.md for matching task
   - Checks if task is already locked (has `Locked By` field)
   - If available, adds lock metadata to task:
     ```markdown
     - [ ] **Task Name**
       - Locked By: agent-abc123def
       - Lock Started: 2025-11-16 18:45 UTC
       - Lock Expires: 2025-11-16 20:45 UTC (2 hours default)
     ```
   - Updates TASK-LOCKS.md with active lock entry
   - Commits changes: `git commit -m "lock: Acquire task 'Task name'"`

2. **Lock Release:**
   - Agent runs `pnpm task:unlock "Task name"`
   - Script removes lock metadata from TODO.md
   - Moves task to "In Progress" or "Completed" in TODO.md
   - Updates TASK-LOCKS.md (moves to history)
   - Commits changes: `git commit -m "unlock: Release task 'Task name'"`

3. **Stale Lock Detection:**
   - Locks expire after 2 hours by default (configurable)
   - `pnpm task:cleanup` removes stale locks
   - Stale locks are those where `Lock Expires < now`

### Conflict Resolution

**Scenario: Two agents try to lock same task simultaneously**

1. Agent A runs `pnpm task:lock "Task X"`
2. Agent B runs `pnpm task:lock "Task X"` at same time
3. Agent A's script modifies TODO.md and TASK-LOCKS.md, commits
4. Agent B's script modifies TODO.md and TASK-LOCKS.md, tries to commit
5. Git merge conflict occurs (optimistic locking)
6. Agent B's script detects conflict, rolls back, shows error:
   ```
   ❌ Failed to acquire lock: Task already locked by agent-abc123def
   ⚠️ Lock held by: agent-abc123def
   ⏰ Expires at: 2025-11-16 20:45 UTC
   💡 Try: pnpm task:list to see available tasks
   ```

### Lock Metadata Format

**In TODO.md:**

```markdown
- [ ] **Fix TypeScript compilation error in E2E test**
  - Reason: BLOCKS BUILD - Module '@axe-core/playwright' error
  - File: tests/e2e/lighthouse-theme-audit.spec.ts:13
  - Fix: Change to default import
  - Estimate: 5 min
  - Severity: CRITICAL
  - See: ANTI-PATTERNS.md #2
  - 🔒 **Locked By:** agent-abc123def
  - 🕐 **Lock Started:** 2025-11-16 18:45 UTC
  - ⏰ **Lock Expires:** 2025-11-16 20:45 UTC
```

**In TASK-LOCKS.md:**

```markdown
| P0-1 | Fix TypeScript compilation error | agent-abc123def | 2025-11-16 18:45 UTC | 2025-11-16 20:45 UTC | 5 min |
```

---

## 🛡️ Safety Features

### 1. Automatic Stale Lock Cleanup

- Locks expire after 2 hours by default
- `pnpm task:cleanup` runs automatically via git pre-commit hook
- Notifies when stale locks are cleaned

### 2. Lock Expiration Extension

```bash
# Extend lock by 1 hour (if still working on task)
pnpm task:extend "Task name" --duration 1h
```

### 3. Force Unlock (Emergency)

```bash
# Only use if agent crashed or lock is truly stale
pnpm task:force-unlock "Task name" --reason "Agent crashed, safe to override"

# Will prompt for confirmation:
# ⚠️ WARNING: This will override lock held by agent-abc123def
# ⚠️ Lock expires in: 45 minutes
# ⚠️ Reason: Agent crashed, safe to override
# Continue? (y/N):
```

### 4. Lock Collision Detection

- Uses git as coordination layer
- Optimistic locking strategy
- First commit wins, second gets conflict error

---

## 📝 Agent Workflow Example

### Scenario: Agent Picks Up Critical Task

```bash
# 1. Check available tasks
$ pnpm task:list
📋 Available Tasks (Unlocked):

P0 - Critical:
  1. Fix TypeScript compilation error in E2E test (5 min)
  2. Enable TypeScript strict mode (4-6 hours)

P1 - High Priority:
  3. Remove CSS duplication (1 hour)
  ...

# 2. Acquire lock on task #1
$ pnpm task:lock "Fix TypeScript compilation error"
✅ Lock acquired: Fix TypeScript compilation error
🔒 Agent ID: agent-abc123def
⏰ Expires: 2025-11-16 20:45 UTC (2 hours)
📝 Updated: TODO.md, TASK-LOCKS.md
🔄 Committed: lock: Acquire task 'Fix TypeScript compilation error'

# 3. Work on task
$ # ... make code changes ...

# 4. Release lock when done
$ pnpm task:unlock "Fix TypeScript compilation error"
✅ Lock released: Fix TypeScript compilation error
📝 Updated: TODO.md, TASK-LOCKS.md
🔄 Committed: unlock: Release task 'Fix TypeScript compilation error'

# 5. Mark task complete in TODO.md
$ # ... update TODO.md status to completed ...
$ git commit -m "chore: Complete task - Fix TypeScript compilation error"
```

---

## 🔍 Troubleshooting

### Problem: "Failed to acquire lock: Task already locked"

**Solution:**

```bash
# Check who has the lock
$ pnpm task:locks

# If lock is stale (>2 hours old):
$ pnpm task:cleanup

# If agent crashed and lock is valid but agent is gone:
$ pnpm task:force-unlock "Task name" --reason "Agent crashed"
```

### Problem: Forgot to unlock task

**Solution:**

```bash
# Find your active locks
$ pnpm task:locks --agent $(cat .agent-id)

# Unlock the task
$ pnpm task:unlock "Task name"
```

### Problem: Git conflict when acquiring lock

**Solution:**

```bash
# Someone else got the lock first
# Pull latest changes
$ git pull

# Try a different task
$ pnpm task:list
```

---

## 📚 Related Documentation

- **TODO.md** - Task list with priorities
- **DECISIONS.md** - See ADR-009 for lock mechanism design
- **scripts/task-management.ts** - Lock implementation
- **.agent-id** - Your unique agent identifier

---

## 🔗 Integration with Mandatory Workflows

**Protocol 2: Task Start (Updated)**

```bash
# OLD (Manual):
# Edit TODO.md, move task to "In Progress", commit

# NEW (With Locks):
pnpm task:lock "Task name"
# → Automatically updates TODO.md, TASK-LOCKS.md, commits
# → Prevents concurrent work
```

**Protocol 4: Task Completion (Updated)**

```bash
# OLD (Manual):
# Move task to "Completed", commit

# NEW (With Locks):
pnpm task:unlock "Task name"
# → Releases lock, updates files, commits
# → Other agents can see task is available again
```

---

**Last Updated:** 2025-11-16 18:45 UTC
**Next Review:** After first multi-agent session
