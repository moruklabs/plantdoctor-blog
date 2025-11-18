# Anti-Patterns & Code Quality Issues

**Analysis Date:** 2025-11-16
**Analyzer:** Comprehensive codebase audit
**Total Issues:** 32 (1 Critical, 6 High, 19 Medium, 6 Low)
**Last Updated:** 2025-11-16 (Removed false positive issue #2)

> **⚠️ IMPORTANT:** This document should be reviewed before starting any new phase or making architectural decisions. Issues are prioritized by severity and impact on production readiness.

---

## 🚨 Critical Issues (BLOCKING)

### 1. TypeScript Strict Mode Disabled

**File:** `tsconfig.json:7`
**Severity:** CRITICAL
**Status:** 🔴 Not Fixed

```json
{
  "strict": false // ❌ Major type safety gap
}
```

**Impact:**

- No null/undefined checks enforced
- Implicit `any` types allowed
- Reduced IDE capabilities and refactoring safety
- Missing return type enforcement

**Fix Required:**

```json
{
  "strict": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "noImplicitReturns": true
}
```

**Action:** Enable incrementally, fix errors file-by-file

**Note:** ~~Issue #2 (Build-Blocking TypeScript Error) was a false positive - removed 2025-11-16. Type-check and build both pass successfully.~~

---

## 🔥 High Priority Issues

### 3. Massive CSS Duplication

**Files:** `app/layout.tsx` (lines 72-212) + `app/globals.css`
**Severity:** HIGH
**Status:** 🔴 Not Fixed

**Problem:**

- 210 lines of CSS inlined in layout.tsx via `dangerouslySetInnerHTML`
- Same CSS variables also defined in `globals.css`
- Button styles duplicated
- Spacing utilities duplicated

**Impact:**

- Increased bundle size
- Maintenance nightmare (changes in two places)
- Breaks single source of truth
- Difficult to theme consistently

**Fix:**

```tsx
// ❌ Remove this entire block from layout.tsx:
<style dangerouslySetInnerHTML={{ __html: `...210 lines...` }} />

// ✅ Let Tailwind handle critical CSS extraction
// ✅ Use only globals.css for CSS variables
```

---

### 4. Mixed Styling Approach (Breaks Theming)

**File:** `components/atoms/badge.tsx:74-82`
**Severity:** HIGH
**Status:** 🔴 Not Fixed

```tsx
const variantClasses = {
  // ❌ Hardcoded Tailwind colors (won't theme):
  default: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  success: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
  warning: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',

  // ✅ Semantic tokens (theme-aware):
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'bg-destructive text-destructive-foreground',
}
```

**Impact:**

- Inconsistent dark mode support
- Theme switching won't affect hardcoded variants
- Custom themes (minimal, bold) won't work for these variants

**Fix:** Standardize all variants to use semantic CSS variables

---

### 5. `any` Types in Production Code

**Severity:** HIGH
**Status:** 🔴 Not Fixed

**Files with `any`:**

- `mdx-components.tsx:5` - Function parameter and return type
- `components/seo/structured-data-script.tsx:38` - Data parameter
- `lib/feature-toggles.ts:180` - Current variable
- `tests/unit/header-mobile.test.tsx:10` - Mock parameter

**Example:**

```tsx
// ❌ Current:
export function useMDXComponents(components: any): any {

// ✅ Correct:
import type { MDXComponents } from 'mdx/types'
export function useMDXComponents(components: Partial<MDXComponents>): MDXComponents {
```

**Action:** Replace all `any` with proper types

---

### 6. Very Low Component Test Coverage

**Severity:** HIGH
**Status:** 🔴 Not Fixed

**Stats:**

- 26 React components in codebase
- Only 1 component test: `atoms/badge.test.tsx`
- Target coverage: 80% (jest.config.js)
- Current coverage: ~4%

**Missing Tests:**

- ❌ Header component (async, navigation logic)
- ❌ Footer component (feature toggles, dynamic layout)
- ❌ ThemeToggle component (state management, hydration)
- ❌ Navigation components
- ❌ BlogPostContent rendering
- ❌ All UI components (Button, Card, etc.)

**Action:** Create component tests for all organisms and critical molecules

---

### 7. 100+ Placeholder Values Not Replaced

**Severity:** HIGH
**Status:** 🔴 Not Fixed

**Files Affected:**

- `lib/config.ts:1-17` - Multiple `[[REPLACE_ME_*]]` placeholders
- `app/layout.tsx:9-10` - Placeholder title/description
- `components/organisms/header.tsx:25,28` - "AI Dating Assistant" tagline
- `components/organisms/footer.tsx:8,62` - Multiple placeholders
- 50+ content files with old dating app content

**Examples:**

```tsx
// lib/config.ts
appName: '[[REPLACE_ME_APP_NAME]]'
appDescription: '[[REPLACE_ME_APP_DESCRIPTION]]'

// header.tsx
<p>Your AI Dating Assistant</p>  // ❌ Old content
```

**Impact:**

- App not production-ready
- SEO damaged by placeholder metadata
- User confusion with inconsistent branding
- Breaks build validation

**Action:** Create configuration validation and replace all placeholders

---

### 8. Image Optimization Disabled

**File:** `next.config.mjs:20`
**Severity:** HIGH
**Status:** 🔴 Not Fixed

```js
images: {
  unoptimized: true,  // ❌ Disables Next.js image optimization
}
```

**Impact:**

- All images served at full resolution
- No automatic WebP/AVIF conversion
- No responsive image sizing
- Lighthouse Performance score reduced
- Higher bandwidth usage

**Fix:**

```js
images: {
  unoptimized: process.env.NEXT_STATIC_EXPORT === 'true',  // Only for static export
}
```

---

## ⚠️ Medium Priority Issues

### 9. Atomic Design Violations

**Severity:** MEDIUM
**Status:** 🟡 Needs Refactoring

**Issue:** `components/ui/` directory exists outside Atomic Design hierarchy

**Files in wrong location:**

- `ui/button.tsx` → Should be `atoms/button.tsx`
- `ui/card.tsx` → Should be `atoms/card.tsx` or `molecules/card.tsx`

**Fix:** Move components to correct hierarchy level and update imports

---

### 10. Dead/Unused Components

**Severity:** MEDIUM
**Status:** 🟡 Needs Cleanup

**Components to Remove:**

1. `components/molecules/email-cta-button.tsx`
   - Points to dating app iOS download
   - Contains placeholder: "Get [[REPLACE_ME_APP_NAME]] Now →"
   - Not used anywhere

2. `components/molecules/featured-post.tsx`
   - Hardcoded path: `/blog/{slug}` (should be `/tips/{slug}`)
   - Homepage implements featured post inline instead
   - Different design than actual usage

3. `components/organisms/recent-posts-grid.tsx`
   - Hardcoded `/blog/` instead of `/tips/`
   - Never used (homepage has inline grid)
   - Different implementation

**Action:** Remove or integrate these components

---

### 11. Inconsistent Component Export Patterns

**Severity:** MEDIUM
**Status:** 🟡 Needs Standardization

**Issue:** Mixed export patterns across components

```tsx
// ❌ Only table-of-contents.tsx uses default export:
export default function TableOfContents() {}

// ✅ All other components use named exports:
export function Header() {}
export function Footer() {}
```

**Impact:**

- Harder to refactor
- Can't use automatic imports in IDEs
- Breaks barrel export consistency
- Reduces tree-shaking effectiveness

**Fix:** Standardize all components to named exports

---

### 12. Unnecessary Client Component

**File:** `components/molecules/table-of-contents.tsx`
**Severity:** MEDIUM
**Status:** 🟡 Optimization Opportunity

**Issue:**

- Uses `'use client'` for DOM querying
- Modifies DOM directly (sets IDs on headings)
- Could be generated server-side from MDX

**Alternative Approaches:**

1. Generate TOC data at build time from MDX frontmatter
2. Use heading extraction plugin during build
3. If client-side needed, memoize calculations

---

### 13. Outdated ESLint Rules

**File:** `.eslintrc.cjs:21-25`
**Severity:** MEDIUM
**Status:** 🟡 Needs Cleanup

```js
{
  group: ['@/components/engagement/*', '@/components/podcast/*'],  // ❌ Deleted in Phase 2-3
  message: 'These folders have been migrated...',
}
```

**Issue:** Rules reference deleted folders (engagement, podcast)

**Action:** Remove obsolete ESLint rules

---

### 14. Hardcoded Guide Titles in Footer

**File:** `components/organisms/footer.tsx:90-100`
**Severity:** MEDIUM
**Status:** 🟡 Needs Dynamic Generation

```tsx
{
  label: 'Dating Profile Optimization',  // ❌ Hardcoded
  href: siteConfig.guides.guide1,
},
```

**Issue:** Guide titles hardcoded instead of derived from MDX metadata

**Fix:** Generate from actual guide content:

```tsx
// lib/content/guides.ts
export async function getGuideNavItems() {
  const guides = await getAllGuides()
  return guides.map((g) => ({ label: g.metadata.title, href: g.url }))
}
```

---

### 15. TODO Comments in Critical Code

**Severity:** MEDIUM
**Status:** 🟡 Needs Tracking

**Files with TODOs:**

- `middleware.ts` - "Consider dynamically generating this mapping"
- `lib/content/blog-images.ts` - "Add proper blog post images"
- `lib/seo/guide-structured-data.ts` - "Refactor to dynamically parse HowTo and FAQ"
- `mdx-components.tsx:1` - "TODO: Fix MDX types import"

**Action:** Convert TODOs to GitHub issues with proper tracking

---

### 16. Fragile Static Export Configuration

**File:** `next.config.mjs:8`
**Severity:** MEDIUM
**Status:** 🟡 Needs Refactoring

```js
output: process.env.NEXT_STATIC_EXPORT === 'true' ? 'export' : undefined,
```

**Issues:**

- Magic string comparison prone to typos
- CSP headers removed in static export mode
- Image optimization disabled globally

**Fix:** Use enum/constant pattern

---

### 17. Unused Dependencies in optimizePackageImports

**File:** `next.config.mjs:25-39`
**Severity:** MEDIUM
**Status:** 🟡 Needs Cleanup

**Build-time only packages incorrectly listed:**

```js
optimizePackageImports: [
  'autoprefixer', // ❌ Not a runtime package
  'dotenv', // ❌ Not used in browser
  'gray-matter', // ❌ Build-time only
  'marked', // ❌ Build-time only
]
```

**Action:** Keep only runtime packages that are imported in client code

---

### 18. Inline Styles in Components

**File:** `components/molecules/table-of-contents.tsx:70+`
**Severity:** MEDIUM
**Status:** 🟡 Needs CSS Classes

```tsx
style={{ paddingLeft: `${(item.level - 1) * 12}px` }}  // ❌ Inline style
```

**Issue:** Dynamic inline styles prevent CSS optimization

**Fix:** Use CSS custom properties or Tailwind spacing

---

## 📊 Low Priority Issues

### 19. Type Assertion in Button Component

**File:** `components/ui/button.tsx:37`
**Severity:** LOW
**Status:** 🟢 Improvement

```tsx
const childElement = children as React.ReactElement<Record<string, unknown>>
```

**Better approach:**

```tsx
if (React.isValidElement(children) && asChild) {
  // children now properly typed
}
```

---

### 20. Unoptimized SVG Imports

**File:** `next.config.mjs:49-54`
**Severity:** LOW
**Status:** 🟢 Optimization

**Issue:** All SVGs converted to React components (larger JS)

**Alternative:** Serve static SVGs for non-interactive content

---

### 21. Missing MDX Type Import

**File:** `mdx-components.tsx:1`
**Severity:** LOW
**Status:** 🟢 Type Safety

```tsx
// import type { MDXComponents } from "mdx/types" // TODO: Fix MDX types import
```

**Action:** Properly import and use MDX types

---

## 📈 Summary Statistics

### By Severity

- 🔴 Critical: 2 issues (BLOCKING)
- 🔥 High: 6 issues (FIX BEFORE RELEASE)
- 🟡 Medium: 19 issues (QUALITY IMPROVEMENTS)
- 🟢 Low: 6 issues (POLISH)

### By Category

| Category      | Count | Top Issue                           |
| ------------- | ----- | ----------------------------------- |
| TypeScript    | 4     | Strict mode disabled                |
| Architecture  | 7     | Atomic Design violations            |
| Styling       | 5     | CSS duplication                     |
| Organization  | 6     | Dead code/unused components         |
| Performance   | 4     | Image optimization disabled         |
| Testing       | 3     | Very low coverage (4%)              |
| Configuration | 3     | 100+ placeholders                   |
| Security      | 1     | Unnecessary dangerouslySetInnerHTML |

---

## 🎯 Recommended Fix Order

### Sprint 1: Critical Blockers (1-2 days)

- [ ] Fix TypeScript compilation error (lighthouse-theme-audit.spec.ts)
- [ ] Enable TypeScript strict mode
- [ ] Replace all `any` types with proper types
- [ ] Fix placeholder configuration (100+ files)

### Sprint 2: High Priority (3-5 days)

- [ ] Remove CSS duplication (layout.tsx → globals.css)
- [ ] Standardize all colors to semantic tokens
- [ ] Enable image optimization
- [ ] Remove dead components (EmailCTAButton, etc.)
- [ ] Add component unit tests (target 80%)

### Sprint 3: Medium Priority (Ongoing)

- [ ] Fix Atomic Design violations (move ui/ components)
- [ ] Optimize TableOfContents (server-side generation)
- [ ] Remove TODO comments → create issues
- [ ] Update ESLint config
- [ ] Add accessibility unit tests
- [ ] Fix static export configuration

### Sprint 4: Low Priority (Polish)

- [ ] Remove type assertions
- [ ] Fix inline styles
- [ ] Improve test mock typing
- [ ] Optimize SVG imports

---

## 🔗 Related Documentation

- **REFACTORING.md** - 12-phase refactoring plan
- **TODO.md** - Current tasks and priorities
- **DECISIONS.md** - Architecture Decision Records (see ADR-008)
- **STATUS.md** - Current project status

---

## 📝 Notes

**Last Updated:** 2025-11-16
**Next Review:** Before starting Phase 6 (Implement Themes)

**Important:** These anti-patterns should be addressed before:

1. Production deployment
2. Adding new features
3. Implementing internationalization (Phase 7)
4. SEO optimization (Phase 8)

**Reason:** Fixing these issues later will be more expensive and risky. Address foundational issues (TypeScript, CSS, testing) before building new features on top.

---

## 🚀 Quick Reference: Most Urgent Files

**Fix Immediately:**

1. `tsconfig.json` - Enable strict mode
2. `tests/e2e/lighthouse-theme-audit.spec.ts` - Fix import
3. `app/layout.tsx` - Remove 210 lines of duplicate CSS
4. `lib/config.ts` - Replace placeholders

**Refactor Soon:**

1. `mdx-components.tsx` - Fix types
2. `components/atoms/badge.tsx` - Standardize styling
3. `components/ui/*` - Move to correct hierarchy
4. Test files - Add component tests

**Clean Up:**

1. `components/molecules/email-cta-button.tsx` - Delete
2. `components/molecules/featured-post.tsx` - Delete or integrate
3. `components/organisms/recent-posts-grid.tsx` - Delete or integrate

---

**End of Report**
