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

### Added

**Git Hooks System (2025-11-16):**

- **`.githooks/pre-commit`** - Validates tracking files before commit
  - Checks TODO.md has max 1 task in "In Progress"
  - Warns if timestamps in TODO.md/STATUS.md are >2 hours old
  - Recommends TODO.md updates when code files change
  - Detects phase completion and warns if tracking files missing
  - Validates TODO.md format
- **`.githooks/commit-msg`** - Validates commit message and enforces file requirements
  - Enforces conventional commit format (type(scope): subject)
  - Requires TODO.md for task start/completion commits
  - Requires DECISIONS.md for ADR commits
  - Requires CHANGELOG.md for changelog update commits
  - Requires STATUS.md for status update commits
  - Requires all 4 files for phase completion commits
  - Validates commit message length (warns if >72 chars)
- **`scripts/install-hooks.sh`** - Auto-install script for git hooks
  - Sets `git config core.hooksPath .githooks`
  - Auto-runs on `pnpm install` via prepare script
- **`.githooks/README.md`** - Complete documentation for hooks
  - Usage examples, troubleshooting, maintenance guide
- **ADR-006** - Documented decision to use git hooks (see DECISIONS.md)

### Changed

- **package.json** - Updated prepare script to auto-install hooks
  - Changed from `husky` to `bash scripts/install-hooks.sh || true`
  - Added `hooks:install` script for manual installation

### Planned

**Phase 5: Theme Architecture**

- Research theme architecture patterns
- Design 3-tier token system
- Integrate ThemeProvider in layout.tsx
- Create ThemeToggle component

**Phase 6: Implement Themes**

- Implement 4 theme variants (default, dark, minimal, bold)

**Phase 7: Internationalization**

- Implement next-intl
- Support 5 languages (en, es, fr, de, ja)

**Phase 8-12:**

- SEO optimization
- Blog configuration system
- Testing suite expansion
- Documentation
- Final cleanup

---

## [Workflow-System] - 2025-11-16

### Added

- **Mandatory Workflow System:** Comprehensive cross-session continuity system
  - Added ⚠️ CRITICAL: Session Start Protocol at top of CLAUDE.md
  - Added 🚨 MANDATORY WORKFLOWS section with 6 detailed protocols:
    1. New Session Start (read STATUS.md, TODO.md, DECISIONS.md)
    2. Task Start (update TODO.md, commit)
    3. Making Decisions (document in DECISIONS.md with ADR format)
    4. Task Completion (mark complete in TODO.md)
    5. Phase Completion (update all 4 tracking files)
    6. Session End (ensure continuity)

- **File-Based Tracking System:** 4 core files for persistence
  - `TODO.md` - Task tracking with P0/P1/P2 priorities
  - `DECISIONS.md` - Architecture Decision Records (MADR format)
  - `CHANGELOG.md` - This file (Keep a Changelog format)
  - `STATUS.md` - Current state snapshot for session handoff

- **File Templates:** Complete templates for all 4 tracking files in CLAUDE.md

### Changed

- **CLAUDE.md:** Major restructure for mandatory workflows
  - Updated "Working with Claude" section to reference protocols
  - Updated "Key Files & Directories" to include tracking files
  - Added workflow summary table (action → file → commit pattern)

### Technical

- Files changed: 1 file (CLAUDE.md)
- Additions: +707 lines
- Deletions: -19 lines
- Purpose: Make workflow steps impossible to skip

---

## [Phase-4] - 2025-11-16

### Changed

- **Homepage (app/page.tsx):** Completely redesigned to newspaper-style content layout
  - Reduced from 465 lines to 235 lines (50% reduction)
  - Simplified from 9 sections to 3 sections:
    1. Featured post hero (large image + title + excerpt + metadata + CTA)
    2. Recent posts grid (6 posts in responsive 3-column layout)
    3. Testimonials section (social proof, feature toggle)
  - Changed featured post query: `allPosts[0]` (was: `allPosts.slice(0, 4)[0]`)
  - Changed recent posts query: `allPosts.slice(1, 7)` (was: `allPosts.slice(0, 4).slice(1, 4)`)

### Removed

- **Homepage promotional content:**
  - Hero section (app marketing copy)
  - Features section ("Why [[REPLACE_ME_APP_NAME]] Works")
  - "How It Works" section (3-step process)
  - CTA section (gradient background, email CTA)
  - Featured Guide section (guide promotion card)

- **Components removed from homepage:**
  - `EmailCTAButton` component (no longer imported)
  - `ExternalLink` component (no longer imported)

- **Structured data:**
  - SoftwareApplication schema (kept Organization schema only)

### Technical

- Files changed: 1 file (app/page.tsx)
- Additions: +105 lines
- Deletions: -336 lines
- Net change: -231 lines (50% reduction)
- Bundle size: 1.21 kB (maintained, no change)
- Production build: ✅ Passed
- TypeScript: ✅ Clean
- Commit: 171f3d4

---

## [Phase-3] - 2025-11-15

### Removed

- **Social media integrations:**
  - Footer component: Instagram, TikTok, YouTube, X (Twitter), Discord links
  - Contact page: Discord community section (lines 60-76)
  - Contact page: Social media cards section (lines 79-112)
  - Homepage: Social media from Organization structured data (`sameAs` property)

- **CSP Headers (next.config.mjs):**
  - Cloudflare Turnstile from `script-src`
  - Cloudflare Turnstile from `style-src`
  - Cloudflare Turnstile from `connect-src`
  - Cloudflare Turnstile from `frame-src`

- **Dead code:**
  - `components/organisms/app-discord-cta.tsx`
  - `components/organisms/follow-us-section.tsx`
  - `components/organisms/ready-to-connect-cta.tsx`
  - Exports for above 3 components from `components/organisms/index.ts`

- **Configuration (lib/config.ts):**
  - `social` object (instagram, tiktok, youtube, discord, x)
  - `tools` object (smartOpener, photoRating, chatAssist)
  - `widgets` object (widget1-4)
  - Social URL generation logic

### Changed

- **Navigation:**
  - Restored "Tips" link in nav-bar (uncommented)
  - Added `className={navItemClass}` to all navigation links for consistent styling

- **Footer:**
  - Updated `sectionsCount` calculation from 4 to 3 (removed social section)

### Technical

- Files changed: 10 files
- Deletions: -419 lines
- Bundle size improvement: 1.35 kB → 1.21 kB (10% reduction)
- Production build: ✅ Passed
- TypeScript: ✅ Clean
- Commits: 9e35b17, 18cc08e

---

## [Phase-2] - 2025-11-15

### Removed

- **Podcast components (9 total):**
  - `components/organisms/audio-player.tsx`
  - `components/organisms/episode-card.tsx`
  - `components/organisms/podcast-hero.tsx`
  - `components/organisms/episodes-section.tsx`
  - `components/organisms/related-episodes.tsx`
  - `components/organisms/episode-sort.tsx`
  - `components/molecules/transcript-toc.tsx`
  - Plus 2 additional podcast components

- **Podcast content:**
  - Entire podcast content directory with all MDX files
  - Podcast RSS feed data

- **Podcast assets:**
  - Audio files in `public/podcasts/`
  - Cover images in `public/images/podcasts/`

- **API endpoint:**
  - `app/api/rss/` directory (RSS feed generation)

- **Dependencies:**
  - `fast-xml-parser` package

- **Feature toggles:**
  - `PodcastsToggles` interface from `lib/feature-toggles.ts`
  - All podcast-related toggle properties

- **Test files (6 total):**
  - Podcast-specific test files
  - Podcast validation tests

### Changed

- **Navigation:**
  - Removed "Podcasts" from footer
  - Removed "Podcasts" from nav-bar

- **Homepage:**
  - Removed podcast sections

- **Sitemap:**
  - Removed podcast routes from sitemap generation

### Fixed

- **Missing images:**
  - Replaced 404ing images with `placeholder.svg`

### Technical

- Files changed: 43 files
- Deletions: -3,130 lines
- Tests: 2/3 console error tests passing
- Production build: ✅ Passed
- TypeScript: ✅ Clean
- Commits: 7dec31a

---

## [Phase-1] - 2025-01-15

### Removed

- **AI tools system:**
  - `app/api/ai/` directory (complete)
    - `app/api/ai/chat-assist/` endpoint
    - `app/api/ai/photo-rating/` endpoint
    - `app/api/ai/smart-opener/` endpoint

- **Tool components:**
  - `components/templates/tool-page-template.tsx`
  - `components/molecules/image-upload.tsx`
  - `components/molecules/accessible-textarea.tsx`

- **Type definitions:**
  - `types/ai-tools.ts`
  - `types/tool-page.ts`

- **Dependencies:**
  - `@ai-sdk/openai` package
  - `ai` package

- **Feature toggles:**
  - `tools` toggle
  - `ratingsWidget` toggle
  - `toolsWidgets` toggle

### Changed

- **Homepage:**
  - Removed tool references and links

- **Sitemap:**
  - Removed tool routes (/tools/\*)

### Fixed

- **Tests:**
  - Updated tests for removed features
  - Fixed feature toggle tests

### Technical

- Production build: ✅ Passed
- TypeScript: ✅ Clean
- Tests: ✅ All passing

---

## [Initial] - 2025-01-15

### Added

- **Planning documentation:**
  - `REFACTORING.md` - Complete 12-phase refactoring plan
  - `BRANCHING-STRATEGY.md` - Git workflow guide
  - `RESEARCH-SUMMARY.md` - Research findings and recommendations
  - `CLAUDE.md` - Quick reference guide for development

- **Git repository:**
  - Initialized git repository
  - Initial commit with project structure

### Technical

- Next.js: 15.3.3
- React: 19.2.0
- TypeScript: 5.9.3
- Node: 20.x
- Package manager: pnpm
