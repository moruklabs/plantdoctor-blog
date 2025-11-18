# Lighthouse Theme Testing - Implementation Summary

## Overview

This document summarizes the comprehensive Lighthouse testing infrastructure set up for theme verification across light and dark modes.

## What Was Created

### 1. Testing Scripts

#### `/scripts/lighthouse-audit-all-themes.mjs`

- **Purpose**: Node.js script for comprehensive multi-theme Lighthouse audits
- **Features**:
  - Tests both light and dark themes
  - Runs across mobile, tablet, and desktop viewports
  - Generates detailed reports with theme comparisons
  - Saves JSON results for analysis
- **Usage**: `node scripts/lighthouse-audit-all-themes.mjs`

#### `/scripts/run-theme-lighthouse.sh`

- **Purpose**: Bash script for theme testing using existing Lighthouse CI configs
- **Features**:
  - Leverages `.lighthouseci/` configurations
  - Uses `jq` for JSON parsing and report generation
  - Creates side-by-side theme comparisons
  - Generates formatted text reports
- **Usage**: `bash scripts/run-theme-lighthouse.sh` or `pnpm lh:themes`

#### `/scripts/lighthouse-theme-audit.ts`

- **Purpose**: TypeScript version of comprehensive audit script
- **Features**:
  - Full TypeScript type safety
  - Detailed metric collection (FCP, LCP, TBT, CLS, SI)
  - Issue categorization and prioritization
  - Estimated performance impact analysis
- **Usage**: `tsx scripts/lighthouse-theme-audit.ts`

### 2. Playwright Test Suite

#### `/tests/e2e/lighthouse-theme-audit.spec.ts`

- **Purpose**: Playwright-based theme testing with accessibility checks
- **Features**:
  - Tests both themes across all viewports
  - Verifies theme application (dark class on HTML)
  - Checks color contrast using axe-core
  - Validates no hydration errors
  - Runs performance metric collection
- **Test Structure**:
  - 6 test suites (3 viewports × 2 themes)
  - 18 tests total (6 suites × 3 pages each)
- **Usage**: `pnpm test:themes`

### 3. Documentation

#### `/docs/lighthouse-theme-testing-guide.md`

- **Purpose**: Comprehensive guide for running Lighthouse audits
- **Contents**:
  - Testing methodology
  - Target scores and acceptance criteria
  - Step-by-step testing instructions
  - Manual browser testing procedures
  - Theme-specific checklists (color contrast, focus, FOUC)
  - Troubleshooting common issues
  - Expected results per page
  - CI/CD setup guidance

#### `/docs/LIGHTHOUSE-THEME-TESTING.md` (this file)

- **Purpose**: Technical summary of testing implementation
- **Contents**:
  - All scripts and their purposes
  - Testing matrix
  - NPM script commands
  - Quick reference

## Testing Matrix

| Theme     | Viewport | Pages | Total Tests |
| --------- | -------- | ----- | ----------- |
| Light     | Mobile   | 3     | 3           |
| Light     | Tablet   | 3     | 3           |
| Light     | Desktop  | 3     | 3           |
| Dark      | Mobile   | 3     | 3           |
| Dark      | Tablet   | 3     | 3           |
| Dark      | Desktop  | 3     | 3           |
| **Total** | **6**    | **3** | **18**      |

### Pages Tested

1. **Homepage** (`/`)
   - Featured content
   - Blog post listings
   - Testimonials

2. **Tips Listing** (`/tips`)
   - Blog post grid
   - Filtering/sorting (if applicable)

3. **Single Tip** (`/tips/12-one-liners-ab-test-tonight`)
   - Article content
   - Code blocks
   - Citations

### Viewports

| Viewport | Width  | Height | Mobile | Device Scale | Throttling      |
| -------- | ------ | ------ | ------ | ------------ | --------------- |
| Mobile   | 375px  | 667px  | Yes    | 2x           | 4x CPU, Slow 4G |
| Tablet   | 768px  | 1024px | No     | 2x           | None            |
| Desktop  | 1920px | 1080px | No     | 1x           | None            |

## NPM Scripts

### Lighthouse Testing

```bash
# Single viewport tests (existing)
pnpm lh:desktop          # Desktop only
pnpm lh:mobile           # Mobile only
pnpm lh:tablet           # Tablet only
pnpm lh:all              # All viewports in parallel

# Theme-specific tests (new)
pnpm lh:themes           # Comprehensive theme comparison
pnpm test:themes         # Playwright-based theme tests
```

### Accessibility Testing

```bash
pnpm test:a11y           # All viewports
pnpm test:a11y:desktop   # Desktop only
pnpm test:a11y:mobile    # Mobile only
pnpm test:a11y:tablet    # Tablet only
```

### Full Validation

```bash
pnpm validate            # Lint + type + test
pnpm validate:full       # + e2e + a11y + schema
pnpm test:all            # + lighthouse
```

## How to Run Tests

### Prerequisites

1. **Build the project**:

   ```bash
   pnpm build
   ```

2. **Start production server** (in separate terminal):
   ```bash
   pnpm start
   ```

### Option 1: Quick Test (Recommended for Development)

Test one viewport to verify themes are working:

```bash
pnpm test:a11y:desktop
```

This runs the Playwright accessibility tests which include theme verification.

### Option 2: Full Lighthouse Audit (Single Theme)

```bash
pnpm lh:desktop
```

This runs the standard Lighthouse audit for desktop. Repeat for mobile/tablet.

### Option 3: Comprehensive Theme Comparison

```bash
# Make sure server is running (pnpm start in another terminal)
pnpm lh:themes
```

This will:

1. Test both light and dark themes
2. Run across all 3 viewports
3. Test all 3 pages
4. Generate comparison report in `.lighthouse-results/theme-audit-summary.txt`

### Option 4: Playwright Theme Tests

```bash
pnpm test:themes
```

This runs the Playwright test suite which:

- Verifies theme switching works
- Checks color contrast in both themes
- Validates no hydration errors
- Confirms accessibility in both themes

## Results Location

All test results are saved to:

```
.lighthouse-results/
├── theme-audit-summary.txt          # Human-readable report
├── theme-audit-results.json         # Structured JSON data
├── light-desktop-homepage.json      # Individual audit results
├── light-desktop-tips.json
├── light-desktop-single-tip.json
├── dark-desktop-homepage.json
├── dark-desktop-tips.json
├── dark-desktop-single-tip.json
├── light-mobile-homepage.json
... (18 total JSON files)
```

## Expected Scores

Based on current codebase architecture:

### Homepage

| Theme | Viewport | Perf | A11y | BP  | SEO |
| ----- | -------- | ---- | ---- | --- | --- |
| Light | Desktop  | 95+  | 100  | 95+ | 100 |
| Light | Mobile   | 90+  | 100  | 95+ | 100 |
| Dark  | Desktop  | 95+  | 100  | 95+ | 100 |
| Dark  | Mobile   | 90+  | 100  | 95+ | 100 |

### Tips Page

| Theme | Viewport | Perf | A11y | BP  | SEO |
| ----- | -------- | ---- | ---- | --- | --- |
| Light | Desktop  | 92+  | 100  | 95+ | 100 |
| Light | Mobile   | 85+  | 100  | 95+ | 100 |
| Dark  | Desktop  | 92+  | 100  | 95+ | 100 |
| Dark  | Mobile   | 85+  | 100  | 95+ | 100 |

### Single Tip

| Theme | Viewport | Perf | A11y | BP  | SEO |
| ----- | -------- | ---- | ---- | --- | --- |
| Light | Desktop  | 90+  | 100  | 95+ | 100 |
| Light | Mobile   | 80+  | 100  | 95+ | 100 |
| Dark  | Desktop  | 90+  | 100  | 95+ | 100 |
| Dark  | Mobile   | 80+  | 100  | 95+ | 100 |

**Note**: Theme scores should be within ±2 points of each other. Larger deltas indicate theme-specific issues.

## Theme-Specific Checks

### Automated Checks (via Playwright)

- [x] Theme class applied to `<html>` element
- [x] LocalStorage persistence
- [x] No hydration errors
- [x] Color contrast (WCAG AA)
- [x] ARIA attributes
- [x] Keyboard navigation

### Manual Checks Required

- [ ] Focus indicators visible in both themes
- [ ] No FOUC on initial load
- [ ] Images look good in both themes
- [ ] Code blocks readable in both themes
- [ ] Syntax highlighting works in both themes
- [ ] Links distinguishable in both themes

## Core Web Vitals Targets

| Metric                         | Good   | Needs Improvement | Poor   |
| ------------------------------ | ------ | ----------------- | ------ |
| FCP (First Contentful Paint)   | <1.8s  | 1.8-3.0s          | >3.0s  |
| LCP (Largest Contentful Paint) | <2.5s  | 2.5-4.0s          | >4.0s  |
| CLS (Cumulative Layout Shift)  | <0.1   | 0.1-0.25          | >0.25  |
| TBT (Total Blocking Time)      | <200ms | 200-600ms         | >600ms |
| SI (Speed Index)               | <3.4s  | 3.4-5.8s          | >5.8s  |

## Troubleshooting

### Server Issues

**Problem**: Tests fail with "server not running"

**Solution**:

```bash
# Terminal 1
pnpm build
pnpm start

# Terminal 2
pnpm lh:themes
```

### Theme Not Switching

**Problem**: Dark mode doesn't apply in tests

**Solutions**:

1. Check ThemeProvider is in `app/layout.tsx`
2. Verify `suppressHydrationWarning` on `<html>`
3. Check CSS custom properties for `.dark` class
4. Look for CSS specificity conflicts

### Lighthouse Timeout

**Problem**: Lighthouse hangs or times out

**Solutions**:

1. Increase timeout in script (default: 180s)
2. Close other applications
3. Use production build (not dev)
4. Check for infinite loops in code

### Score Discrepancies

**Problem**: Scores vary between light and dark themes

**Common Causes**:

1. **Color contrast**: Dark theme may have insufficient contrast
2. **Images**: Some images may not load in dark theme
3. **CSS size**: Dark theme may load additional CSS
4. **JavaScript**: Theme switching logic adds bundle size

**Investigation**:

1. Compare bundle sizes between themes
2. Check network tab for different assets loaded
3. Look for theme-conditional rendering
4. Verify CSS custom properties are optimized

## CI/CD Integration

To run these tests in CI (GitHub Actions, etc.):

```yaml
# .github/workflows/lighthouse-themes.yml
name: Lighthouse Theme Tests

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 10.20.0
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - run: pnpm start &
      - run: sleep 10 # Wait for server
      - run: pnpm lh:themes
      - uses: actions/upload-artifact@v3
        with:
          name: lighthouse-results
          path: .lighthouse-results/
```

## Next Steps

1. **Run initial baseline tests** to establish current scores
2. **Document any issues** found in theme implementation
3. **Fix critical issues** (accessibility, contrast)
4. **Re-run tests** to verify fixes
5. **Set up CI/CD** to run on every PR
6. **Monitor scores** over time to prevent regressions

## Resources

- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse)
- [Lighthouse CI GitHub](https://github.com/GoogleChrome/lighthouse-ci)
- [Core Web Vitals](https://web.dev/vitals/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)

## Summary

This testing infrastructure provides:

1. ✅ **Automated testing** for both themes
2. ✅ **Multiple viewports** (mobile, tablet, desktop)
3. ✅ **Comprehensive metrics** (performance, accessibility, SEO)
4. ✅ **Theme comparison** reports
5. ✅ **Accessibility checks** (color contrast, ARIA, keyboard)
6. ✅ **Documentation** for manual testing
7. ✅ **CI/CD ready** scripts

You can now verify that your light and dark themes both meet accessibility and performance standards across all device sizes.
