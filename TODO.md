# Project TODO

**Last Updated:** 2025-11-18 14:30 UTC
**Auto-Update:** ⚠️ MANDATORY - Update this file for EVERY task start/completion

## ⚠️ USAGE RULES

1. **LIMIT**: Only 1 task in "In Progress" at a time
2. **COMMIT**: Commit this file after every change
3. **SYNC**: Keep in sync with TodoWrite (session tool)
4. **PRIORITY**: Use P0 (critical), P1 (high), P2 (medium)

---

## 🔥 In Progress (Limit: 1)

<!-- MUST have exactly 0 or 1 items here -->

**No tasks in progress** - All 3 hub guide tasks completed and committed

---

## 📌 Up Next (Prioritized)

### P0 - Critical (Do First)

> **⚠️ BLOCKER FOUND:** Comprehensive codebase analysis revealed 1 critical issue. See ANTI-PATTERNS.md and ADR-008 for details.

- [ ] **Enable TypeScript strict mode**
  - Reason: CRITICAL - Type safety disabled, allows unsafe patterns
  - File: tsconfig.json:7 (currently "strict": false)
  - Fix: Enable strict mode incrementally, fix errors file-by-file
  - Estimate: 4-6 hours (incremental)
  - Severity: CRITICAL
  - See: ANTI-PATTERNS.md #1

### P1 - High Priority

> **⚠️ HIGH PRIORITY ISSUES:** 6 issues found that damage performance, SEO, or maintainability. See ANTI-PATTERNS.md for complete list.

- [ ] **Remove CSS duplication (210 lines)**
  - Reason: layout.tsx has 210 lines of inline CSS duplicating globals.css
  - Files: app/layout.tsx (lines 72-212), app/globals.css
  - Fix: Remove <style dangerouslySetInnerHTML> block, use only globals.css
  - Estimate: 1 hour
  - Severity: HIGH
  - See: ANTI-PATTERNS.md #3

- [ ] **Replace all `any` types with proper types**
  - Reason: Type safety bypassed in 4+ production files
  - Files: mdx-components.tsx, structured-data-script.tsx, feature-toggles.ts
  - Fix: Import proper types (MDXComponents, JsonLd, etc.)
  - Estimate: 2 hours
  - Severity: HIGH
  - See: ANTI-PATTERNS.md #5

- [ ] **Standardize badge styling to semantic tokens**
  - Reason: Mixed hardcoded colors + semantic tokens breaks theming
  - File: components/atoms/badge.tsx:74-82
  - Fix: Replace hardcoded Tailwind colors with CSS variables
  - Estimate: 1 hour
  - Severity: HIGH
  - See: ANTI-PATTERNS.md #4

- [ ] **Enable image optimization**
  - Reason: Currently disabled, hurts Lighthouse Performance score
  - File: next.config.mjs:20 (unoptimized: true)
  - Fix: Enable for non-static builds only
  - Estimate: 30 min
  - Severity: HIGH
  - See: ANTI-PATTERNS.md #8

- [ ] **Replace 100+ placeholder values**
  - Reason: [[REPLACE_ME_*]] placeholders throughout codebase
  - Files: lib/config.ts, layout.tsx, header.tsx, footer.tsx, 50+ content files
  - Fix: Create config validation, replace all placeholders
  - Estimate: 3-4 hours
  - Severity: HIGH
  - See: ANTI-PATTERNS.md #7

- [ ] **Add component unit tests (current coverage: 4%)**
  - Reason: Only 1 test for 26 components, target is 80%
  - Missing: Header, Footer, ThemeToggle, Navigation, BlogPostContent
  - Fix: Create test files for all organisms and critical molecules
  - Estimate: 8-10 hours
  - Severity: HIGH
  - See: ANTI-PATTERNS.md #6

- [ ] **Phase 5: Test theme system (build, type-check, visual testing)**
  - 🔒 **Locked By:** agent-uj8qr7ednuo
  - 🕐 **Lock Started:** 2025-11-16 09:18:14 UTC
  - ⏰ **Lock Expires:** 2025-11-16 11:18:14 UTC
  - Reason: Ensure theme switching works without FOUC or errors
  - Depends on: ThemeToggle component complete
  - Estimate: 30 min
  - Tasks: pnpm build, test theme switching, verify Lighthouse scores

- [ ] **Phase 5: Update CLAUDE.md and STATUS.md for Phase 5 completion**
  - Reason: Document phase completion per Protocol 5
  - Depends on: All Phase 5 tasks tested
  - Estimate: 30 min
  - Files: CLAUDE.md, STATUS.md, CHANGELOG.md

### P2 - Medium Priority

> **✅ PARTIAL COMPLETION:** Variable consolidation in progress (ADR-010). 4/11 pages updated, 7 remaining.

- [ ] **Complete variable consolidation (ADR-010) - 7 remaining pages**
  - Reason: Finish consolidating 400+ lines of duplicate constants
  - Completed: homepage, support, tips, privacy-policy (4/11 pages)
  - Remaining pages (7):
    - app/about/page.tsx (99 lines) - Use aboutPageContent
    - app/contact/page.tsx (100 lines) - Use contactPageContent
    - app/guides/page.tsx (46 lines) - Use blogConfig formatting
    - app/guides/[slug]/page.tsx - Use blogConfig + metadata helpers
    - app/tips/[slug]/page.tsx - Use blogConfig + metadata helpers
    - app/terms-and-conditions/page.tsx (~60 lines) - Use blogConfig.company
    - app/cookie-policy/page.tsx (97 lines) - Use blogConfig.company
  - Pattern established, straightforward migration
  - Estimate: 2-3 hours
  - See: ADR-010 in DECISIONS.md

> **⚠️ MEDIUM PRIORITY ISSUES:** 19 quality improvements identified. See ANTI-PATTERNS.md for complete list. Top items added below.

- [ ] **Remove dead/unused components**
  - Reason: 3 components from dating app era not used
  - Files: email-cta-button.tsx, featured-post.tsx, recent-posts-grid.tsx
  - Fix: Delete or integrate these components
  - Estimate: 1 hour
  - See: ANTI-PATTERNS.md #10

- [ ] **Fix Atomic Design violations**
  - Reason: components/ui/ directory outside hierarchy
  - Files: ui/button.tsx → atoms/, ui/card.tsx → atoms/molecules/
  - Fix: Move to correct hierarchy, update imports
  - Estimate: 1 hour
  - See: ANTI-PATTERNS.md #9

- [ ] **Standardize component exports (remove default exports)**
  - Reason: table-of-contents.tsx uses default export, all others use named
  - Fix: Change to named export, update barrel exports
  - Estimate: 30 min
  - See: ANTI-PATTERNS.md #11

- [ ] **Phase 6: Implement dark theme**
  - Reason: Most requested theme variant
  - Depends on: Phase 5 complete
  - Estimate: 2-3 hours

- [ ] **Phase 6: Implement minimal theme**
  - Reason: Clean alternative for different audiences
  - Depends on: Dark theme complete
  - Estimate: 2 hours

- [ ] **Phase 6: Implement bold theme**
  - Reason: High-contrast option for accessibility
  - Depends on: Minimal theme complete
  - Estimate: 2 hours

---

## 📦 Backlog

- [ ] **Enable TypeScript strict mode incrementally**
  - Phase: 10
  - Estimate: 4-6 hours

- [ ] **Add accessibility tests with axe-core**
  - Phase: 10
  - Estimate: 3-4 hours

- [ ] **Set up Lighthouse CI automation**
  - Phase: 10
  - Estimate: 2 hours

- [ ] **Create i18n routing structure**
  - Phase: 7
  - Estimate: 3-4 hours

- [ ] **Implement next-intl for 5 languages**
  - Phase: 7
  - Estimate: 8-10 hours

- [ ] **SEO optimization and structured data**
  - Phase: 8
  - Estimate: 4-6 hours

- [ ] **Create blog configuration system (blog.config.ts)**
  - Phase: 9
  - Estimate: 3-4 hours

---

## 🚫 Blocked

<!-- No current blockers -->

**No tasks blocked** ✅

---

## ✅ Recently Completed (Last 5)

- [x] **Regenerate testimonials with plant-focused content** (Completed: 2025-11-18)
  - Rewrote all 6 testimonials in config/testimonials.ts (plant care success stories)
  - Updated interface: platform → location, appSlug → plantType
  - Simplified testimonials.tsx component (removed Link wrapper logic)
  - Updated REBRANDING_STEPS.md with Phase 10 documentation
  - Commit: 6073a09

- [x] **Extract GuideCTA config and rename to ContentCTA** (Completed: 2025-11-18)
  - Created config/guide-cta.ts with centralized CTA defaults
  - Renamed GuideCTA → ContentCTA for better semantics
  - Updated imports in news/[slug]/page.tsx and tips/[slug]/page.tsx
  - Fixed sitemap tests (removed /apps references)
  - Commit: 3d7cfd6

- [x] **Remove Conversation Mastery guide** (Completed: 2025-11-16)
  - Deleted content/guides/conversation-mastery.mdx (dating-specific guide)
  - Replaced with 6 new strategic SEO hub guides
  - Commit: 7bdfacb

- [x] **Analyze 856 posts and identify 6 major topic clusters** (Completed: 2025-11-16)
  - Analyzed content across 856 valid posts
  - Identified 6 major topic categories:
    1. Productivity & Wellness Mastery (125+ posts)
    2. Pet Care & Nutrition Guide (109 posts)
    3. DIY Maintenance & Optimization (60 posts)
    4. AI Tools & Content Creation Mastery (440 posts)
    5. Habit Building & Behavior Change (52 posts)
    6. Business Templates & Monetization (70 posts)

- [x] **Create 6 comprehensive hub guides with internal links** (Completed: 2025-11-16)
  - Created productivity-and-wellness-mastery.mdx with 10 internal links
  - Created pet-care-and-nutrition-guide.mdx with 10 internal links
  - Created diy-maintenance-and-optimization.mdx with 10 internal links
  - Created ai-tools-content-creation-mastery.mdx with 10 internal links
  - Created habit-building-and-behavior-change.mdx with 10 internal links
  - Created business-templates-monetization.mdx with 10 internal links
  - All guides use correct canonical URL base (https://blog.plantdoctor.app)
  - Each guide includes implementation plans and key takeaways
  - Commit: 7bdfacb

- [x] **Phase 5: Create ThemeToggle component** (Completed: 2025-11-16)
  - Created theme-toggle.tsx with cycling themes (light → dark → system)
  - Added SVG icons for sun (light), moon (dark), monitor (system)
  - Implemented mounted state to prevent hydration mismatch
  - Used semantic tokens for all styling (no hardcoded colors)
  - Integrated into Header component with proper spacing
  - Updated Header to use semantic tokens (bg-background, text-foreground, etc.)
  - Exported from molecules index
  - Fully accessible with aria-labels and keyboard support

- [x] **Phase 5: Integrate ThemeProvider in layout.tsx** (Completed: 2025-11-16)
  - Added ThemeProvider import from @/components/organisms
  - Wrapped children with ThemeProvider (attribute="class", defaultTheme="system", enableSystem)
  - Added suppressHydrationWarning to <html> tag
  - Theme system now active and ready for theme switching
  - File: app/layout.tsx (3 lines changed)

- [x] **Phase 5: Design 3-tier token system and document architecture** (Completed: 2025-11-16)
  - Created comprehensive theme architecture documentation (docs/theme-architecture.md)
  - Documented existing shadcn/ui-style token system (semantic tokens in HSL format)
  - Created ADR-007 with architectural decision (CSS Variables + next-themes)
  - Defined 3-tier token architecture (implicit primitives, semantic, component)
  - Documented all 30+ semantic tokens with light/dark values
  - Created usage patterns, best practices, and migration guide

- [x] **Phase 5: Research theme architecture patterns** (Completed: 2025-11-16)
  - Researched CSS variable systems, design tokens, theme switching
  - Analyzed Material Design 3, Chakra UI, shadcn/ui, Radix approaches
  - Confirmed CSS Variables + next-themes as industry standard
  - Performance: 0 KB JS overhead, 20-35% faster than CSS-in-JS

- [x] **Create git hooks to enforce workflow system** (Completed: 2025-11-16)
  - Created pre-commit hook (validates tracking files, TODO.md format)
  - Created commit-msg hook (validates commit format, enforces file requirements)
  - Created install script with auto-install on pnpm install
  - Created comprehensive documentation (.githooks/README.md)
  - Tested hooks successfully

- [x] **Phase 5: Create tracking files (TODO, STATUS, DECISIONS, CHANGELOG)** (Completed: 2025-11-16)
  - Created all 4 mandatory tracking files with complete templates
  - Backfilled DECISIONS.md with ADR-001 through ADR-005
  - Backfilled CHANGELOG.md with Phases 1-4 history
  - STATUS.md reflects current state (Phase 4 complete, Phase 5 next)

- [x] **Phase 4: Test homepage changes** (Completed: 2025-11-16)
  - Ran pnpm type-check and pnpm build - both passed

- [x] **Phase 4: Redesign homepage to newspaper-style** (Completed: 2025-11-16)
  - Rewrote app/page.tsx from 465 to 235 lines (50% reduction)
  - Simplified from 9 sections to 3 sections
  - Result: Pure content-focused layout

- [x] **Phase 4: Analyze current homepage structure** (Completed: 2025-11-16)
  - Identified 9 sections, determined what to keep/remove

- [x] **Phase 3: Remove social media integrations** (Completed: 2025-11-15)
  - 10 files changed, 419 deletions
  - Removed footer links, contact page sections, CSP headers

- [x] **Phase 3: Remove dead code (3 unused components)** (Completed: 2025-11-15)
  - Deleted app-discord-cta, follow-us-section, ready-to-connect-cta
