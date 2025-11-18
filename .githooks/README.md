# Git Hooks

This directory contains git hooks that enforce the mandatory workflow system defined in CLAUDE.md.

## Purpose

These hooks make it **physically impossible** to skip workflow steps by validating commits before they're created.

## Hooks

### `pre-commit`

**When:** Runs before every commit

**Validates:**

1. **TODO.md format** - Ensures max 1 task in "In Progress"
2. **Timestamps** - Warns if TODO.md or STATUS.md timestamps are >2 hours old
3. **Code changes** - Recommends updating TODO.md when code files change
4. **Phase completion** - Warns if CLAUDE.md shows phase completion but missing tracking files
5. **New ADRs** - Detects new ADRs in DECISIONS.md

**Errors that block commit:**

- More than 1 task in TODO.md "In Progress" section

**Warnings (don't block):**

- Old timestamps in tracking files
- Code changes without TODO.md update
- Phase completion without all 4 tracking files

### `commit-msg`

**When:** Runs after commit message is written

**Validates:**

1. **Conventional commit format** - Warns if not following `type(scope): subject`
2. **Task start commits** - `chore: Start [task]` requires TODO.md
3. **Task completion commits** - `chore: Complete [task]` requires TODO.md
4. **ADR commits** - `docs: Add ADR-XXX` requires DECISIONS.md
5. **Changelog commits** - `docs: Update changelog` requires CHANGELOG.md
6. **Status commits** - `docs: Update status` requires STATUS.md
7. **Phase completion commits** - Requires all 4 tracking files (CHANGELOG, STATUS, CLAUDE, TODO)

**Errors that block commit:**

- Missing required files for specific commit types
- Phase completion without all 4 tracking files

**Warnings (don't block):**

- Commit subject >72 characters
- Not following conventional commit format

## Installation

### Automatic (on pnpm install)

Hooks are automatically installed via the `prepare` script in package.json:

```bash
pnpm install  # Runs scripts/install-hooks.sh
```

### Manual

```bash
# Run installation script
bash scripts/install-hooks.sh

# Or directly configure git
git config core.hooksPath .githooks
```

### Verify Installation

```bash
git config core.hooksPath
# Should output: .githooks
```

## Usage

### Normal Commits

Hooks run automatically on every commit:

```bash
git add TODO.md
git commit -m "chore: Start Phase 5 research"
# ✅ Hook validates TODO.md is staged
# ✅ Hook validates commit message format
# ✅ Commit succeeds
```

### Bypassing Hooks (Emergency Only)

If you need to bypass hooks temporarily (not recommended):

```bash
git commit --no-verify -m "emergency fix"
```

**⚠️ Warning:** Bypassing hooks defeats the purpose of the workflow system. Only use in emergencies.

## Examples

### ✅ Valid Commits

```bash
# Task start (TODO.md staged)
git add TODO.md
git commit -m "chore: Start theme research"

# Task completion (TODO.md staged)
git add TODO.md
git commit -m "chore: Complete theme research"

# New ADR (DECISIONS.md staged)
git add DECISIONS.md
git commit -m "docs: Add ADR-006 - Theme token system"

# Phase completion (all 4 files staged)
git add CHANGELOG.md STATUS.md CLAUDE.md TODO.md
git commit -m "docs: Update changelog for Phase 5"
git commit -m "docs: Update status for Phase 5 completion"
git commit -m "docs: Update CLAUDE.md with Phase 5 completion"
git commit -m "chore: Archive Phase 5 tasks, prepare Phase 6"
```

### ❌ Invalid Commits (Will Be Blocked)

```bash
# Task start without TODO.md
git commit -m "chore: Start theme research"
# ❌ ERROR: Task start commit requires TODO.md

# Task completion without TODO.md
git commit -m "chore: Complete theme research"
# ❌ ERROR: Task completion commit requires TODO.md

# ADR commit without DECISIONS.md
git commit -m "docs: Add ADR-006 - Theme system"
# ❌ ERROR: ADR commit requires DECISIONS.md

# Phase completion missing files
git add CHANGELOG.md STATUS.md
git commit -m "Phase 5: complete"
# ❌ ERROR: Phase completion requires all 4 tracking files
#    Missing: CLAUDE.md TODO.md
```

## Hook Behavior

### Exit Codes

- **0** - Success, allow commit
- **1** - Error, block commit

### Output

Hooks use colored output for clarity:

- 🔍 Information (cyan)
- ⚠️ Warning (yellow, doesn't block)
- ❌ Error (red, blocks commit)
- ✅ Success (green)

## Troubleshooting

### Hooks Not Running

```bash
# Check if hooks are configured
git config core.hooksPath
# Should be: .githooks

# Reinstall hooks
bash scripts/install-hooks.sh
```

### Permission Denied

```bash
# Make hooks executable
chmod +x .githooks/*
```

### Hook Failures

If a hook is failing incorrectly:

1. **Check the error message** - It tells you what's wrong
2. **Verify file is staged** - `git status`
3. **Check file format** - Ensure timestamps updated, etc.
4. **Emergency bypass** - `git commit --no-verify` (not recommended)

### Disable Hooks

```bash
# Uninstall hooks
git config --unset core.hooksPath

# Re-enable hooks
bash scripts/install-hooks.sh
```

## Maintenance

### Testing Hooks

```bash
# Test pre-commit
git add .githooks/pre-commit
.githooks/pre-commit

# Test commit-msg
echo "test commit message" > /tmp/test-msg
.githooks/commit-msg /tmp/test-msg
```

### Updating Hooks

1. Edit hook files in `.githooks/`
2. Test changes
3. Commit hook changes
4. Hooks are automatically updated (git-tracked)

## Integration with Workflow

These hooks enforce the **6 Mandatory Protocols** from CLAUDE.md:

| Protocol                      | Hook       | Enforcement                                       |
| ----------------------------- | ---------- | ------------------------------------------------- |
| Protocol 1: New Session Start | N/A        | Read-only, not enforced by hooks                  |
| Protocol 2: Task Start        | commit-msg | Requires TODO.md for "chore: Start" commits       |
| Protocol 3: Making Decisions  | commit-msg | Requires DECISIONS.md for "docs: Add ADR" commits |
| Protocol 4: Task Completion   | commit-msg | Requires TODO.md for "chore: Complete" commits    |
| Protocol 5: Phase Completion  | commit-msg | Requires all 4 files for phase commits            |
| Protocol 6: Session End       | N/A        | Manual process, not enforced by hooks             |

## References

- **Workflow Documentation**: CLAUDE.md
- **Installation Script**: scripts/install-hooks.sh
- **Tracking Files**: TODO.md, STATUS.md, DECISIONS.md, CHANGELOG.md

---

**Last Updated:** 2025-11-16
