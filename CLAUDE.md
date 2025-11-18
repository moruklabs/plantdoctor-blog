# Claude Code Guide for Blog Platform Project

## ⚠️ CRITICAL: Session Start Protocol

**🚨 MANDATORY - Execute BEFORE responding to user:**

1. ✅ **Read STATUS.md FIRST** (current state, what just happened, what's next)
2. ✅ **Read TODO.md SECOND** (active tasks, priorities, blockers)
3. ✅ **Scan DECISIONS.md** (recent architectural choices)
4. ✅ **Check git status** (verify branch and clean/dirty state)
5. ✅ **ONLY THEN respond to user**

**⚠️ If these files don't exist:** Create them IMMEDIATELY using templates in "File-Based Tracking System" section below.

**⚠️ If user asks to do work:** Follow "Mandatory Workflows" section below - NEVER skip steps.

---

## 🎯 Project Overview

This is a **Next.js 15 blog platform** undergoing systematic refactoring from a dating advice application to a clean, reusable, multi-theme, internationalized blog system.

**Current Phase:** Phase 4 Completed - Homepage Redesigned to Newspaper-Style Layout
**Target:** 100% Lighthouse scores, 5+ languages, 4+ themes, production-ready reusable blog

---

## 📋 Quick Reference

### Essential Commands

```bash
# Development
pnpm dev                    # Start dev server with Turbopack
pnpm build                  # Production build
pnpm start                  # Start production server

# Testing
pnpm validate              # Run all checks (lint + type + test)
pnpm test                  # Run Jest unit tests
pnpm e2e                   # Run Playwright E2E tests
pnpm lint                  # ESLint check
pnpm type-check           # TypeScript check

# Code Quality
pnpm format                # Format code with Prettier
pnpm analyze              # Bundle size analysis

# Lighthouse
pnpm lh:local             # Local Lighthouse tests
pnpm lh:ci                # CI Lighthouse tests

# Task Management (Multi-Agent Coordination)
pnpm task:list             # Show available (unlocked) tasks
pnpm task:lock "Task"      # Acquire lock before starting work
pnpm task:unlock "Task"    # Release lock after completing work
pnpm task:locks            # Show active locks (who's working on what)
pnpm task:cleanup          # Remove stale locks (>2 hours old)
```

### Key Files & Directories

```
/Users/fatih/workspace/blog.plantdoctor.app/
├── REFACTORING.md              # Main refactoring plan (12 phases)
├── BRANCHING-STRATEGY.md       # Git workflow guide
├── RESEARCH-SUMMARY.md         # Research findings & recommendations
├── CLAUDE.md                   # This file (quick reference + mandatory workflows)
├── PROJECT_STRUCTURE.md        # Auto-generated project tree (run pnpm tree:generate)
│
├── ⚠️ TRACKING FILES (MANDATORY - Read these every session)
├── TODO.md                     # Task tracking (priorities, blockers, WIP)
├── STATUS.md                   # Current state snapshot (read FIRST)
├── DECISIONS.md                # Architecture Decision Records (ADRs)
├── CHANGELOG.md                # Detailed change log (Keep a Changelog format)
├── TASK-LOCKS.md               # Task lock coordination (multi-agent)
├── .agent-id                   # Your unique agent ID (gitignored)
│
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout (needs ThemeProvider!)
│   ├── page.tsx               # Homepage
│   ├── globals.css            # Global styles & CSS variables
│   ├── tips/                  # Blog posts (keep)
│   ├── guides/                # Long guides (keep)
│   ├── tools/                 # AI tools (REMOVE in Phase 1)
│   └── podcasts/              # Podcasts (REMOVE in Phase 2)
│
├── components/                # Atomic Design structure
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── templates/
│
├── lib/
│   ├── config.ts              # App configuration
│   ├── feature-toggles.ts     # Feature flags
│   └── seo/                   # SEO utilities
│
├── content/                   # MDX content
│   ├── posts/                 # Blog posts
│   └── guides/                # Guide content
│
└── tests/
    ├── unit/                  # Jest tests
    └── e2e/                   # Playwright tests
```

---

## 🔄 Current Refactoring Status

### ✅ Completed Phases

- Research & Planning
- Documentation Creation
- **Phase 1: Remove Tools and AI Features** ✓
  - Removed app/api/ai/ directory
  - Removed tool-related components
  - Removed AI dependencies (@ai-sdk/openai, ai)
  - Updated feature toggles
  - Cleaned homepage and sitemap
  - Updated tests
- **Phase 2: Remove Podcasts System** ✓
  - Deleted 9 podcast components (audio player, episode card, podcast hero, etc.)
  - Removed podcast content directory and all podcast MDX files
  - Deleted podcast assets (audio files, cover images)
  - Removed RSS API endpoint (app/api/rss/)
  - Removed fast-xml-parser dependency
  - Updated feature toggles (removed PodcastsToggles)
  - Cleaned navigation (footer, nav-bar) and homepage
  - Updated sitemap generation
  - Fixed missing image references (using placeholders)
  - Updated tests (43 files changed, 3130 deletions)
- **Phase 3: Cleanup Social Features & Dead Code** ✓
  - Deleted 3 unused organism components (app-discord-cta, follow-us-section, ready-to-connect-cta)
  - Removed all social media links from footer (Instagram, TikTok, YouTube, X, Discord)
  - Removed social media sections from contact page
  - Removed social links from homepage structured data
  - Removed Cloudflare Turnstile from CSP headers
  - Cleaned up configuration (removed social, tools, widgets config)
  - Restored Tips navigation link
  - Bundle size improvements (homepage: 1.35 kB → 1.21 kB, ~10% reduction)
  - (10 files changed, 419 deletions)
- **Phase 4: Redesign Homepage to Newspaper-Style** ✓
  - Completely rewrote app/page.tsx (465 lines → 235 lines, 50% reduction)
  - Changed from 9 sections to 3 sections (featured post hero, recent posts grid, testimonials)
  - Removed all app promotional content (hero, features, how it works, CTA sections, featured guide)
  - Removed EmailCTAButton and ExternalLink component usage
  - Removed SoftwareApplication structured data (kept Organization only)
  - Pure content-focused newspaper layout: featured post + 6 recent posts grid
  - Homepage bundle size maintained at 1.21 kB
  - (1 file changed, 105 insertions, 336 deletions)

### 🏗️ In Progress

**Phase 5: Theme Architecture**

- Branch: To be created
- Status: Ready to start

### ⏳ Upcoming Phases

1. Phase 5: Theme architecture
2. Phase 6: Implement themes
3. Phase 7: Internationalization
4. Phase 8: SEO optimization
5. Phase 9: Blog configuration
6. Phase 10: Testing suite
7. Phase 11: Documentation
8. Phase 12: Final cleanup

---

## 🚨 MANDATORY WORKFLOWS

**⚠️ These protocols are NON-NEGOTIABLE. Follow them exactly or risk data loss, missed tasks, and broken continuity.**

### Protocol 1: New Session Start

**EXECUTE THESE STEPS BEFORE RESPONDING TO USER:**

```bash
# Step 1: Read STATUS.md
cat STATUS.md  # Current state, what happened, what's next

# Step 2: Read TODO.md
cat TODO.md  # Active tasks, priorities, blockers

# Step 3: Scan DECISIONS.md
cat DECISIONS.md  # Recent architectural choices

# Step 4: Check git status
git status
git log --oneline -3
```

**Checklist:**

- [ ] Read STATUS.md completely
- [ ] Read TODO.md "In Progress" and "Up Next" sections
- [ ] Scan last 2-3 entries in DECISIONS.md
- [ ] Verify current branch and commit
- [ ] **ONLY THEN** respond to user

**If files don't exist:** Jump to "File-Based Tracking System" section, create all 4 files using templates, commit them, THEN proceed.

---

### Protocol 2: Task Start (WITH TASK LOCK)

**BEFORE STARTING ANY TASK:**

```bash
# Step 1: List available tasks
pnpm task:list

# Step 2: Acquire lock on chosen task
pnpm task:lock "Task name"
# → Automatically updates TODO.md with lock metadata
# → Updates TASK-LOCKS.md with active lock
# → Commits: "lock: Acquire task 'Task name'"
# → Prevents other agents from picking same task

# Step 3: Create TodoWrite entry for in-session tracking
# Use TodoWrite tool to mirror TODO.md task

# Step 4: Verify lock acquired
# Check output for success message and agent ID
```

**Checklist:**

- [ ] Ran `pnpm task:list` to see available tasks
- [ ] Acquired lock with `pnpm task:lock "Task name"`
- [ ] Verified lock success (check output)
- [ ] Created TodoWrite for session tracking
- [ ] **ONLY THEN** start work

**NEVER start work without acquiring a lock first.**

**Why locks matter:**

- Prevents duplicate work across multiple agents/sessions
- Provides visibility (other agents see task is locked)
- Git coordination prevents race conditions
- Stale locks auto-cleanup after 2 hours

---

### Protocol 3: Making Architectural Decisions

**WHEN MAKING DECISIONS ABOUT:**

- Architecture or design patterns
- Technology/library choices
- File structure changes
- Breaking changes
- User-facing behavior

**THEN EXECUTE:**

```bash
# Step 1: Document in DECISIONS.md
# Add new ADR entry using template (see File-Based Tracking System section)
# Format: ADR-XXX: Title
# Include: Date, Status, Context, Options, Decision, Rationale, Consequences

# Step 2: Commit decision
git add DECISIONS.md
git commit -m "docs: Add ADR-XXX - [decision title]"
```

**Checklist:**

- [ ] Decision documented in DECISIONS.md with ADR-XXX number
- [ ] All sections filled (Context, Decision, Rationale, Consequences)
- [ ] Committed with descriptive message
- [ ] Mentioned in task notes if applicable

**NEVER make architectural decisions without documenting.**

---

### Protocol 4: Task Completion (WITH TASK LOCK)

**AFTER COMPLETING ANY TASK:**

```bash
# Step 1: Release lock on completed task
pnpm task:unlock "Task name"
# → Removes lock metadata from TODO.md
# → Moves lock to TASK-LOCKS.md history
# → Commits: "unlock: Release task 'Task name'"

# Step 2: Update TodoWrite
# Mark corresponding TodoWrite item as completed

# Step 3: Commit your work
git add .
git commit -m "feat/fix/refactor: [description of changes]"

# Step 4: Update TODO.md to mark task complete
# Move from "In Progress" to "Recently Completed"
# Add completion date
git add TODO.md
git commit -m "chore: Complete [task name]"
```

**Checklist:**

- [ ] Released lock with `pnpm task:unlock "Task name"`
- [ ] TodoWrite marked completed
- [ ] Committed actual work changes
- [ ] Task moved to "Recently Completed" in TODO.md
- [ ] Completion date added
- [ ] "In Progress" section empty (or has next task)

**NEVER forget to unlock - other agents need to know task is available.**

---

### Protocol 5: Phase Completion

**AFTER COMPLETING ANY PHASE - EXECUTE IN EXACT ORDER:**

```bash
# Step 1: Run full validation
pnpm validate  # lint + type + test
pnpm build     # production build

# Step 2: Update CHANGELOG.md
# Add [Phase-X] section with date
# Categories: Added, Changed, Removed, Fixed, Technical
# Include metrics: files changed, deletions, bundle size
git add CHANGELOG.md
git commit -m "docs: Update changelog for Phase X"

# Step 3: Update STATUS.md
# Update: Current Phase, Progress Overview, "What Just Happened", "What's Next"
# Update: Known Issues, Test Status
# Add: Last Updated timestamp
git add STATUS.md
git commit -m "docs: Update status for Phase X completion"

# Step 4: Update CLAUDE.md
# Move phase from "In Progress" to "Completed Phases"
# Update "Current Phase" at top
# Update "Progress Tracking" section
# Add entry to "Update Log"
# Update footer (Last Updated, Current Phase, Next Milestone)
git add CLAUDE.md
git commit -m "docs: Update CLAUDE.md with Phase X completion"

# Step 5: Update TODO.md
# Archive completed phase tasks (move to bottom or delete old ones)
# Add next phase tasks to "Up Next"
git add TODO.md
git commit -m "chore: Archive Phase X tasks, prepare Phase Y"

# Step 6: Verify git status
git status  # Should be clean
git log --oneline -5  # Verify all commits present
```

**Checklist:**

- [ ] `pnpm validate` passed
- [ ] `pnpm build` passed
- [ ] CHANGELOG.md updated and committed
- [ ] STATUS.md updated and committed
- [ ] CLAUDE.md updated and committed
- [ ] TODO.md updated and committed
- [ ] Git working tree clean
- [ ] **ONLY THEN** report completion to user

**NEVER skip these steps. Execute in exact order.**

---

### Protocol 6: Session End (Major Work)

**BEFORE ENDING SESSION WITH MAJOR WORK:**

```bash
# Step 1: Update STATUS.md
# Ensure "Current State" reflects reality
# Add any WIP notes to "Notes for Next Session"
git add STATUS.md
git commit -m "docs: Update STATUS.md before session end"

# Step 2: Update TODO.md
# Ensure "In Progress" shows 0-1 accurate items
# Clear stale items
git add TODO.md
git commit -m "chore: Clean TODO.md before session end"

# Step 3: Verify git state
git status
# If clean: good
# If dirty: Add note to STATUS.md about intentional WIP

# Step 4: Final commit if needed
# If STATUS.md mentions WIP, commit WIP state:
git add -A
git commit -m "wip: [description of work in progress]"
```

**Checklist:**

- [ ] STATUS.md reflects current reality
- [ ] TODO.md "In Progress" accurate (0-1 items)
- [ ] Git state documented (clean OR WIP noted in STATUS.md)
- [ ] Next session can pick up seamlessly

**This ensures continuity across sessions.**

---

## 📁 File-Based Tracking System

**The 4 core files that enable cross-session continuity:**

### 1. TODO.md - Task Tracking

**Location:** `/Users/fatih/workspace/blog.plantdoctor.app/TODO.md`

**Template:**

```markdown
# Project TODO

**Last Updated:** YYYY-MM-DD HH:MM UTC
**Auto-Update:** ⚠️ MANDATORY - Update this file for EVERY task start/completion

## ⚠️ USAGE RULES

1. **LIMIT**: Only 1 task in "In Progress" at a time
2. **COMMIT**: Commit this file after every change
3. **SYNC**: Keep in sync with TodoWrite (session tool)
4. **PRIORITY**: Use P0 (critical), P1 (high), P2 (medium)

---

## 🔥 In Progress (Limit: 1)

<!-- MUST have exactly 0 or 1 items here -->

- [ ] **[Task Name]** (P0/P1/P2)
  - Started: YYYY-MM-DD
  - Reason: Why this task matters
  - Blocker: None / [description]
  - Estimate: X hours

---

## 📌 Up Next (Prioritized)

### P0 - Critical (Do First)

<!-- Tasks that block other work or are time-sensitive -->

- [ ] **[Task Name]**
  - Reason: Why critical
  - Depends on: [task] or None
  - Estimate: X hours

### P1 - High Priority

<!-- Important but not blocking -->

- [ ] **[Task Name]**
  - Reason: Why important
  - Estimate: X hours

### P2 - Medium Priority

<!-- Can be deferred if needed -->

- [ ] **[Task Name]**
  - Estimate: X hours

---

## 📦 Backlog

<!-- Tasks that are planned but not prioritized yet -->

- [ ] **[Task Name]**
- [ ] **[Another Task]**

---

## 🚫 Blocked

<!-- Tasks that cannot proceed due to dependencies -->

- [ ] **[Task Name]**
  - Blocker: What's preventing progress
  - Added: YYYY-MM-DD

---

## ✅ Recently Completed (Last 5)

<!-- Archive older items periodically -->

- [x] [Task Name] (Completed: YYYY-MM-DD)
- [x] [Another Task] (Completed: YYYY-MM-DD)
```

---

### 2. DECISIONS.md - Architecture Decision Records

**Location:** `/Users/fatih/workspace/blog.plantdoctor.app/DECISIONS.md`

**Template:**

```markdown
# Architecture Decision Records

**Last Updated:** YYYY-MM-DD
**Format:** MADR (Markdown Architectural Decision Records)

## ⚠️ USAGE RULES

1. **WHEN**: Document ANY architectural/design decision
2. **FORMAT**: Use ADR template below
3. **NUMBER**: Sequential (ADR-001, ADR-002, ...)
4. **COMMIT**: Commit after adding each ADR

---

## ADR Template

Use this template for each new decision:

\`\`\`markdown

## ADR-XXX: [Title]

**Date:** YYYY-MM-DD
**Status:** 🤔 Proposed / ✅ Accepted / ❌ Rejected / ⚠️ Deprecated

### Context

What is the issue we're facing? What are the constraints?

### Options Considered

1. **Option A** - [brief description]
2. **Option B** - [brief description]
3. **Option C** - [brief description]

### Decision

Which option did we choose?

### Rationale

Why did we choose this option over the others?

- [Reason 1]
- [Reason 2]

### Consequences

**Positive:**

- ✅ [benefit]
- ✅ [benefit]

**Negative:**

- ❌ [drawback]
- ❌ [drawback]

**Neutral:**

- [neither good nor bad]

### Follow-up

What needs to happen next?

- [Action item]
  \`\`\`

---

## Active ADRs

<!-- List ADRs in reverse chronological order below -->

## ADR-001: Example Decision

**Date:** 2025-11-16
**Status:** ✅ Accepted

### Context

[Your context here]

[etc...]
```

---

### 3. CHANGELOG.md - Change Log

**Location:** `/Users/fatih/workspace/blog.plantdoctor.app/CHANGELOG.md`

**Template:**

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## ⚠️ USAGE RULES

1. **WHEN**: Update at end of each phase
2. **FORMAT**: Use categories: Added, Changed, Removed, Fixed, Technical
3. **DATES**: ISO 8601 format (YYYY-MM-DD)
4. **COMMIT**: Commit with message "docs: Update changelog for Phase X"

---

## [Unreleased]

### Planned

- [Upcoming work]

---

## [Phase-X] - YYYY-MM-DD

### Added

- **[Feature]:** Description
- **[Component]:** Description

### Changed

- **[Feature]:** What changed and why
- **[File]:** What was modified

### Removed

- **[Feature]:** What was removed and why
- **[Files]:** List of deleted files/components

### Fixed

- **[Bug]:** What was broken and how it was fixed

### Technical

- Bundle size: X kB → Y kB (Z% change)
- Tests: X passing / Y total
- Files changed: X files, Y insertions, Z deletions

---

## [Phase-4] - 2025-11-16

### Changed

- **Homepage:** Completely redesigned to newspaper-style content layout
  - Reduced from 465 lines to 235 lines (50% reduction)
  - Simplified from 9 sections to 3 sections

### Removed

- **Homepage promotional content:** Hero, features, CTAs

### Technical

- Bundle size: 1.21 kB (maintained)
- Production build: ✅ Passed
```

---

### 4. STATUS.md - Current State Snapshot

**Location:** `/Users/fatih/workspace/blog.plantdoctor.app/STATUS.md`

**Template:**

```markdown
# Project Status

**Last Updated:** YYYY-MM-DD HH:MM UTC
**Current Branch:** [branch-name]
**Last Commit:** [sha] - [commit message]

---

## ⚠️ CRITICAL: Read This First

**New session? Execute these steps:**

1. ✅ Read this file completely
2. ✅ Read TODO.md
3. ✅ Check DECISIONS.md (last 2-3 entries)
4. ✅ Run `git status`
5. ✅ **ONLY THEN** proceed with work

---

## 🎯 Current Phase

**Phase X: [Name]** - ✅ Complete / 🏗️ In Progress / ⏳ Pending

[Brief description of current phase status]

---

## 📊 Progress Overview

\`\`\`
Phase 1: ✅ Completed
Phase 2: ✅ Completed
Phase 3: ✅ Completed
Phase 4: ✅ Completed
Phase 5: 🏗️ In Progress ← YOU ARE HERE
Phase 6: ⏳ Pending
[...]
\`\`\`

---

## 🔥 What Just Happened

**Phase X Completion (YYYY-MM-DD):**

- ✅ [Achievement 1]
- ✅ [Achievement 2]
- ✅ [Achievement 3]

**Key Decision:**
[Link to ADR if applicable]

---

## 🚀 What's Next

**Immediate (Phase Y):**

1. [Task 1] (see TODO.md)
2. [Task 2] (see TODO.md)
3. [Task 3] (see TODO.md)

**Branch Strategy:**

- Merge `[current-branch]` to main OR
- Continue from `[current-branch]` as base
- Create `[next-branch]` for Phase Y

---

## ⚠️ Known Issues & Blockers

**Critical:**

1. **[Issue]** - [Description]
   - Priority: P0/P1/P2
   - File: [file-path]
   - Fix in: Phase X

**Important:** 2. **[Issue]** - [Description]

- Fix in: Phase Y

**No Current Blockers:** ✅ / ❌ See blockers in TODO.md

---

## 📁 Recent Files Changed

**Phase X:**

- `[file-path]` (X insertions, Y deletions)
- `[file-path]` (X insertions, Y deletions)

---

## 🧪 Test Status

**Last Run:** YYYY-MM-DD HH:MM UTC

- ✅ TypeScript: `pnpm type-check` - PASSED
- ✅ Production Build: `pnpm build` - PASSED
- ⚠️ Full Validation: `pnpm validate` - [status]
- ⚠️ E2E Tests: `pnpm e2e` - [status]

**Action Items:**

- [x] Run validation before Phase X
- [ ] Run E2E tests before Phase Y

---

## 🎯 Success Metrics (Overall Project)

**Performance:**

- [ ] Lighthouse Performance: 95+
- [ ] Lighthouse SEO: 100
- [ ] Bundle size: <150 kB total

**Features:**

- [x] Tips (blog posts) ✅
- [x] Guides ✅
- [ ] 4+ themes (Phase 6)
- [ ] 5+ languages (Phase 7)

---

## 💡 Notes for Next Session

1. **Read this file first** to get current state
2. **Check TODO.md** for active tasks
3. **Review DECISIONS.md** for recent choices
4. **Continue from:** [branch-name]

**Quick Start Phase Y:**
\`\`\`bash

# Verify branch

git checkout [branch-name]

# Run validation

pnpm validate

# Check TODO.md

cat TODO.md

# Start work

# See TODO.md for specific tasks

\`\`\`
```

---

## 📝 Workflow Summary

| Action         | Commands                  | Files Updated                               | Commit Message Pattern                   |
| -------------- | ------------------------- | ------------------------------------------- | ---------------------------------------- |
| Start task     | `pnpm task:lock "Task"`   | TODO.md, TASK-LOCKS.md                      | `lock: Acquire task 'Task'`              |
| Complete task  | `pnpm task:unlock "Task"` | TODO.md, TASK-LOCKS.md                      | `unlock: Release task 'Task'`            |
| Make decision  | Manual edit               | DECISIONS.md                                | `docs: Add ADR-XXX - [title]`            |
| Complete phase | Multiple updates          | CHANGELOG.md, STATUS.md, CLAUDE.md, TODO.md | See Protocol 5                           |
| End session    | Manual edit               | STATUS.md, TODO.md                          | `docs: Update STATUS before session end` |
| List tasks     | `pnpm task:list`          | N/A (read-only)                             | N/A                                      |
| Check locks    | `pnpm task:locks`         | N/A (read-only)                             | N/A                                      |
| Clean stale    | `pnpm task:cleanup`       | TODO.md, TASK-LOCKS.md                      | `cleanup: Remove N stale locks`          |

---

## 📝 Phase 1 Checklist

### Files to Delete

```bash
# Directories
app/tools/
app/api/ai/
lib/tool-configs/

# Files
types/ai-tools.ts
types/tool-page.ts
components/templates/tool-page-template.tsx
components/molecules/image-upload.tsx
components/molecules/accessible-textarea.tsx
```

### Dependencies to Remove

```bash
pnpm remove @ai-sdk/openai ai
```

### Files to Update

- [ ] `lib/feature-toggles.ts` - Remove tool toggles
- [ ] `components/organisms/header.tsx` - Remove tool links
- [ ] `app/page.tsx` - Remove tool sections
- [ ] `app/sitemap.ts` - Remove tool routes
- [ ] Run tests: `pnpm validate`

---

## 🎨 Theme System (Phases 5-6)

### Current Issues

⚠️ **CRITICAL**: ThemeProvider exists but NOT integrated in layout.tsx

### Required Fixes

1. Add ThemeProvider wrapper in `app/layout.tsx`
2. Add `suppressHydrationWarning` to `<html>`
3. Create ThemeToggle component
4. Implement brand colors in CSS

### Architecture

- **Approach**: CSS Custom Properties (not CSS-in-JS)
- **Structure**: 3-tier token system (primitive → semantic → component)
- **Variants**: Default, Dark, Minimal, Bold

---

## 🌍 Internationalization (Phase 7)

### Library: next-intl

- 931K weekly downloads
- Next.js 15 App Router optimized
- Industry standard for 2025

### Implementation

```
app/
├── [locale]/
│   ├── page.tsx
│   ├── tips/
│   └── guides/
```

### Languages (Initial)

- English (en) - default
- Spanish (es)
- French (fr)
- German (de)
- Japanese (ja)

---

## 🚀 SEO Strategy (Phase 8)

### Target Metrics

- Lighthouse Performance: 95+
- Lighthouse Accessibility: 100
- Lighthouse SEO: 100
- Lighthouse Best Practices: 95+

### Structured Data Schemas

- Organization (site-wide)
- WebSite (homepage)
- Article/BlogPosting (posts)
- Person (authors)
- BreadcrumbList (navigation)

### Tools

- Schema Markup Validator
- Google Rich Results Test
- Lighthouse CI

---

## 🧪 Testing Strategy

### Current Coverage (40+ tests)

- ✅ Content validation
- ✅ Feature toggles
- ✅ SEO/metadata
- ⚠️ Component tests (only 1)
- ❌ Accessibility tests

### Add in Phase 10

- Visual regression (Percy/Chromatic)
- Accessibility (axe-core)
- Lighthouse CI automation
- Theme variant testing

---

## 🌲 Git Workflow

### Branch Naming

```
refactor/phase-X-description
feature/feature-name
fix/bug-description
```

### Workflow

```bash
# Start new phase
git checkout -b refactor/phase-X-description

# Make changes
git add -A
git commit -m "refactor(phase-X): description"

# Push and create PR
git push -u origin refactor/phase-X-description

# After merge, start next phase
git checkout refactor/phase-X-description
git checkout -b refactor/phase-Y-next-description
```

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `refactor`, `feat`, `fix`, `docs`, `test`, `chore`, `perf`

---

## 🔧 Configuration System (Phase 9)

### Centralized Config (To Be Created)

```typescript
// blog.config.ts
export const blogConfig = {
  site: {
    name: 'My Blog',
    url: 'https://myblog.com',
    description: 'A clean blog platform',
  },
  theme: {
    default: 'light',
    available: ['light', 'dark', 'minimal', 'bold'],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr', 'de', 'ja'],
  },
  features: {
    tips: true,
    guides: true,
    rss: true,
  },
}
```

---

## ⚠️ Known Issues

### Critical

1. **ThemeProvider not integrated** - Exists but not used in layout.tsx
2. **TypeScript strict mode disabled** - Should be enabled
3. **No git commits yet** - Repository needs initialization

### Important

4. Mixed component styling (theme vars vs hardcoded)
5. Limited component test coverage
6. No internationalization
7. Dating-specific content throughout

### Minor

8. Duplicate CSS in layout.tsx inline styles
9. Brand colors defined but not implemented
10. No theme toggle UI

---

## 📚 Documentation Structure

### Planning Docs (Read These First)

1. **REFACTORING.md** - Complete refactoring plan with all 12 phases
2. **BRANCHING-STRATEGY.md** - Git workflow and branch management
3. **RESEARCH-SUMMARY.md** - Research findings and recommendations
4. **CLAUDE.md** - This quick reference guide

### To Be Created

- Setup guide
- Theme customization guide
- i18n implementation guide
- Deployment guide
- Contributing guidelines

---

## 🎯 Success Criteria

### Performance

- [ ] Lighthouse Performance: 95+
- [ ] Lighthouse Accessibility: 100
- [ ] Lighthouse SEO: 100
- [ ] First Contentful Paint: <1.5s
- [ ] Time to Interactive: <3.5s

### Features

- [ ] 4+ themes available
- [ ] 5+ languages supported
- [ ] Full keyboard navigation
- [ ] Screen reader compatible
- [ ] Mobile responsive

### Code Quality

- [ ] TypeScript strict mode enabled
- [ ] 80%+ test coverage
- [ ] Zero ESLint errors
- [ ] All tests passing

### Developer Experience

- [ ] <5 min setup time
- [ ] Clear documentation
- [ ] Example projects
- [ ] Easy customization

---

## 🚦 Working with Claude

**⚠️ IMPORTANT: Follow "MANDATORY WORKFLOWS" section above - these are NON-NEGOTIABLE protocols.**

### Before Starting Each Phase

1. ✅ **Follow Protocol 1: New Session Start** (read STATUS.md, TODO.md, DECISIONS.md)
2. ✅ Read phase description in REFACTORING.md
3. ✅ Create branch following naming convention
4. ✅ **Follow Protocol 2: Task Start** (update TODO.md, commit)

### During Each Phase

1. ✅ Make incremental changes
2. ✅ Run tests frequently: `pnpm validate`
3. ✅ **Follow Protocol 2 & 4** (update TODO.md for each task start/completion)
4. ✅ **Follow Protocol 3** (document architectural decisions in DECISIONS.md)
5. ✅ Commit often with descriptive messages

### After Each Phase

1. ✅ **Follow Protocol 5: Phase Completion** (MANDATORY - see full checklist above)
   - Run pnpm validate & build
   - Update CHANGELOG.md, STATUS.md, CLAUDE.md, TODO.md
   - Commit each file separately
   - Verify git status clean
2. ✅ **ONLY THEN** report completion to user

### Before Ending Session

1. ✅ **Follow Protocol 6: Session End** (update STATUS.md, TODO.md)
2. ✅ Ensure next session can pick up seamlessly

### Best Practices

- ✅ Keep phases small and focused
- ✅ Test continuously
- ✅ Document changes in MANDATORY files (TODO.md, DECISIONS.md, CHANGELOG.md, STATUS.md)
- ✅ Maintain backward compatibility where possible
- ✅ Use feature toggles for gradual rollout
- ✅ **NEVER skip workflow protocols**

---

## 🔗 Helpful Resources

### Documentation

- [Next.js 15 Docs](https://nextjs.org/docs)
- [next-intl Docs](https://next-intl.dev/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Playwright Docs](https://playwright.dev)

### Tools

- [Schema Markup Validator](https://validator.schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### Standards

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Schema.org Reference](https://schema.org)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)

---

## 📊 Progress Tracking

### Timeline

- **Week 1**: Phases 1-4 (Foundation cleanup)
- **Week 2**: Phases 5-6 (Theme system)
- **Week 3**: Phase 7 (Internationalization)
- **Week 4**: Phases 8-10 (Optimization & testing)
- **Week 5**: Phases 11-12 (Documentation & polish)

### Current Status

```
Phase 1: ✅ Completed
Phase 2: ✅ Completed
Phase 3: ✅ Completed
Phase 4: ✅ Completed
Phase 5: ⏳ Pending
Phase 6: ⏳ Pending
Phase 7: ⏳ Pending
Phase 8: ⏳ Pending
Phase 9: ⏳ Pending
Phase 10: ⏳ Pending
Phase 11: ⏳ Pending
Phase 12: ⏳ Pending
```

---

## 🎬 Getting Started

### Initial Setup

```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: Blog platform with refactoring plan"

# Create Phase 1 branch
git checkout -b refactor/phase-1-remove-tools

# Start development server
pnpm dev
```

### First Task: Remove AI Tools

See Phase 1 checklist above for specific files and commands.

---

## 💡 Quick Tips

1. **Always run tests before committing**: `pnpm validate`
2. **Check bundle size periodically**: `pnpm analyze`
3. **Use feature toggles**: Modify `lib/feature-toggles.ts`
4. **Follow Atomic Design**: Components in correct hierarchy
5. **Theme variables only**: Avoid hardcoded colors
6. **Type safety**: Enable strict mode incrementally
7. **Document as you go**: Update relevant .md files

---

## 🆘 Troubleshooting

### Tests Failing

```bash
# Run specific test
pnpm test -- path/to/test.ts

# Watch mode for debugging
pnpm test -- --watch

# Update snapshots if needed
pnpm test -- -u
```

### Build Errors

```bash
# Clear cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Check for type errors
pnpm type-check
```

### Port Already in Use

```bash
# Kill port 3000
pnpm stop
```

---

## 📝 Notes

- **Package Manager**: pnpm only (enforced by .npmrc)
- **Node Version**: 20.x
- **TypeScript**: 5.9.3
- **Next.js**: 15.3.3
- **React**: 19.2.0

---

## 🔒 Task Lock Mechanism (Multi-Agent Coordination)

### Overview

**Purpose:** Prevent concurrent work on same tasks across multiple agents/sessions

**How It Works:**

1. Each agent gets unique `.agent-id` (auto-generated, gitignored)
2. Before starting work: `pnpm task:lock "Task name"`
3. System adds lock metadata to TODO.md and TASK-LOCKS.md
4. Git coordination prevents race conditions (optimistic locking)
5. After completing: `pnpm task:unlock "Task name"`
6. Stale locks (>2 hours) auto-cleanup with `pnpm task:cleanup`

### Commands

```bash
# List available tasks (shows only unlocked tasks)
pnpm task:list

# Acquire lock (before starting work)
pnpm task:lock "Fix TypeScript compilation error"
# Output:
# ✅ Lock acquired: Fix TypeScript compilation error
# 🔒 Agent ID: agent-abc123def
# ⏰ Expires: 2025-11-16 20:45 UTC (2 hours)

# Show active locks (see who's working on what)
pnpm task:locks

# Release lock (after completing work)
pnpm task:unlock "Fix TypeScript compilation error"

# Clean up stale locks
pnpm task:cleanup
```

### Lock Workflow Example

```bash
# 1. Check available tasks
pnpm task:list

# 2. Pick a task and lock it
pnpm task:lock "Enable TypeScript strict mode"

# 3. Do your work (you're safe - no other agent will pick this task)
# ... make changes ...

# 4. Release lock when done
pnpm task:unlock "Enable TypeScript strict mode"

# 5. Commit your changes
git add .
git commit -m "feat: Enable TypeScript strict mode"
```

### Benefits

✅ **Prevents duplicate work** - Can't start same task twice
✅ **Full visibility** - TASK-LOCKS.md shows who's working on what
✅ **Git coordination** - Optimistic locking prevents race conditions
✅ **No external deps** - Pure git + files, works offline
✅ **Automatic cleanup** - Stale locks expire after 2 hours

### Documentation

- **TASK-LOCKS.md** - Complete guide and lock dashboard
- **ADR-009** (DECISIONS.md) - Design rationale
- **scripts/task-management.ts** - Implementation

---

## 🔄 Update Log

### 2025-11-16 - Project Tree Generator Added

- ✅ **Created file watcher script** (`scripts/watch-tree.ts`) for auto-generating project structure
- ✅ **Features implemented:**
  - Watches file changes with chokidar (efficient, no polling)
  - Smart filtering (excludes node_modules, .git, build artifacts, IDE files, etc.)
  - Debounced updates (1000ms default) to avoid excessive regeneration
  - Two modes: watch mode (`pnpm watch:tree`) and one-time generation (`pnpm tree:generate`)
  - Generates clean tree with file/directory counts and statistics
  - Auto-excludes itself and output file from tree
- ✅ **Added PROJECT_STRUCTURE.md** - Auto-generated tree (added to .gitignore)
- ✅ **Updated package.json** with new scripts
- ✅ **Added dependencies:** chokidar@^4.0.3
- 📝 Reference added to Key Files & Directories section

### 2025-11-16 - Mandatory Workflow System Added

- ✅ **Added comprehensive workflow system** to ensure cross-session continuity
- ✅ **New section:** "MANDATORY WORKFLOWS" with 6 protocols:
  - Protocol 1: New Session Start (read STATUS.md, TODO.md, DECISIONS.md)
  - Protocol 2: Task Start (update TODO.md, commit)
  - Protocol 3: Making Architectural Decisions (document in DECISIONS.md)
  - Protocol 4: Task Completion (mark complete in TODO.md)
  - Protocol 5: Phase Completion (update all 4 tracking files)
  - Protocol 6: Session End (ensure continuity)
- ✅ **New section:** "File-Based Tracking System" with 4 file templates:
  - TODO.md (task tracking with priorities)
  - DECISIONS.md (ADR format for architectural choices)
  - CHANGELOG.md (Keep a Changelog format)
  - STATUS.md (current state snapshot)
- ✅ **Updated sections:**
  - "Session Start Protocol" at top (CRITICAL warning)
  - "Working with Claude" (references to mandatory protocols)
  - "Key Files & Directories" (includes tracking files)
- ✅ **Purpose:** Make it IMPOSSIBLE to skip steps, ensuring perfect continuity across sessions
- 📝 Files defined but not yet created - will be created when needed

### 2025-11-16 - Phase 4 Completed

- ✅ Redesigned homepage to pure content newspaper-style layout (1 file changed, 105 insertions, 336 deletions)
- ✅ Completely rewrote app/page.tsx from 465 lines to 235 lines (50% reduction)
- ✅ Reduced from 9 sections to 3 sections (featured post hero, recent posts grid, testimonials)
- ✅ Removed all app promotional content:
  - Hero section (app promotion)
  - Features section
  - How It Works section
  - CTA section
  - Featured Guide section
- ✅ Removed EmailCTAButton and ExternalLink components from homepage
- ✅ Removed SoftwareApplication structured data (kept Organization only)
- ✅ Implemented newspaper-style layout:
  - Featured post hero: Large image + title + excerpt + metadata + read article CTA
  - Recent posts grid: 6 posts in responsive 3-column grid
  - Testimonials section: Social proof (feature toggle)
- ✅ Homepage bundle size maintained at 1.21 kB
- 📝 Production build passing, TypeScript clean
- 📝 Ready to start Phase 5 - Theme Architecture

### 2025-11-15 - Phase 3 Completed

- ✅ Removed all social media integrations (10 files changed, 419 deletions)
- ✅ Deleted 3 unused organism components (app-discord-cta, follow-us-section, ready-to-connect-cta)
- ✅ Removed social links from footer (Instagram, TikTok, YouTube, X, Discord)
- ✅ Removed Discord and social media sections from contact page
- ✅ Removed social media from homepage structured data (sameAs property)
- ✅ Removed Cloudflare Turnstile from all CSP headers (script-src, style-src, connect-src, frame-src)
- ✅ Cleaned up lib/config.ts (removed social, tools, widgets configuration)
- ✅ Restored Tips navigation link in nav-bar
- ✅ Fixed navigation styling (added className to all links)
- ✅ Bundle size improvements (homepage: -10% reduction)
- 📝 Build passing, TypeScript clean
- 📝 Ready to start Phase 4

### 2025-11-15 - Phase 2 Completed

- ✅ Removed entire podcasts system (43 files changed, 3130 deletions)
- ✅ Deleted 9 podcast components (audio-player, episode-card, podcast-hero, episodes-section, etc.)
- ✅ Removed podcast content directory with all podcast MDX files
- ✅ Deleted podcast assets (audio files, cover images in public/podcasts/ and public/images/podcasts/)
- ✅ Removed RSS API endpoint (app/api/rss/)
- ✅ Removed fast-xml-parser dependency from package.json
- ✅ Updated feature toggles (removed PodcastsToggles interface and related code)
- ✅ Cleaned navigation components (footer.tsx, nav-bar.tsx)
- ✅ Updated homepage and sitemap generation
- ✅ Fixed missing image 404s (using placeholder.svg)
- ✅ Updated sitemap validation and feature toggle tests
- ✅ Removed 6 podcast-specific test files
- 📝 Build passing, TypeScript clean, 2/3 console error tests passing
- 📝 Ready to start Phase 3

### 2025-01-15 - Phase 1 Completed

- ✅ Removed AI tools and related infrastructure
- ✅ Deleted app/api/ai/ directory (chat-assist, photo-rating, smart-opener)
- ✅ Removed tool-related components (tool-page-template, image-upload, accessible-textarea)
- ✅ Removed AI dependencies (@ai-sdk/openai, ai)
- ✅ Updated feature toggles (removed tools, ratingsWidget, toolsWidgets)
- ✅ Cleaned homepage and sitemap of tool references
- ✅ Updated and fixed tests
- 📝 Ready to merge Phase 1 to main

### 2025-01-15 - Initial Setup

- Created REFACTORING.md with 12-phase plan
- Created BRANCHING-STRATEGY.md for git workflow
- Created RESEARCH-SUMMARY.md with findings
- Created this CLAUDE.md guide
- Initialized git repository

---

**Last Updated**: 2025-11-16 (Project Tree Generator Added)
**Current Phase**: Phase 4 Completed
**Next Milestone**: Start Phase 5 - Theme Architecture

- from now on we switch to TDD, including accessibility, lighthouse, unit, integration and e2e on mobile, tablet and desktop, and on light mode and dark mode.
- the base url is blog.plantdoctor.app
