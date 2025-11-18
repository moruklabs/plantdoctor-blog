# Lighthouse Theme Testing Guide

This guide explains how to run comprehensive Lighthouse audits across both light and dark themes for all viewports.

## Overview

We need to test:

- **2 themes**: Light and Dark
- **3 viewports**: Mobile (375x667), Tablet (768x1024), Desktop (1920x1080)
- **3 key pages**: Homepage, Tips listing, Single tip article
- **Total**: 18 audits (2 × 3 × 3)

## Target Scores

| Category       | Target | Acceptable |
| -------------- | ------ | ---------- |
| Performance    | 95+    | 90+        |
| Accessibility  | 100    | 95+        |
| Best Practices | 95+    | 90+        |
| SEO            | 100    | 95+        |

## Prerequisites

1. **Production build** is required:

   ```bash
   pnpm build
   ```

2. **Start production server**:

   ```bash
   pnpm start
   ```

3. Server should be running at `http://localhost:3000`

## Quick Test (Single Viewport)

To quickly test one viewport and get a sense of the scores:

```bash
# Desktop test
pnpm lh:desktop
```

This will test all pages configured in `.lighthouseci/lighthouse.desktop.js`.

## Full Manual Test (All Viewports)

### Option 1: Using Existing Scripts

```bash
# Mobile (375x667, throttled)
pnpm lh:mobile

# Tablet (768x1024)
pnpm lh:tablet

# Desktop (1920x1080)
pnpm lh:desktop
```

Each command will:

- Run Lighthouse 3 times per URL (for consistency)
- Average the scores
- Generate HTML reports in `.lighthouseci/` directory
- Test 5 pages: /, /tips/, /guides/, /about/, /contact/

### Option 2: Using Custom Theme Script

For comprehensive theme testing with detailed comparison:

```bash
# Build first
pnpm build

# Start server in another terminal
pnpm start

# Run comprehensive theme audit
chmod +x scripts/run-theme-lighthouse.sh
./scripts/run-theme-lighthouse.sh
```

This script will:

- Test both light and dark themes
- Run across all 3 viewports
- Generate a comparison report
- Save results to `.lighthouse-results/theme-audit-summary.txt`

## Manual Browser Testing

If automated tests are failing or you want to manually verify:

### Testing Light Theme

1. Open Chrome DevTools (F12)
2. Go to Application > Local Storage
3. Set `theme` to `light`
4. Go to Lighthouse tab
5. Select device (Mobile/Desktop)
6. Click "Analyze page load"

### Testing Dark Theme

1. Open Chrome DevTools (F12)
2. Go to Application > Local Storage
3. Set `theme` to `dark`
4. Refresh page to apply theme
5. Go to Lighthouse tab
6. Select device (Mobile/Desktop)
7. Click "Analyze page load"

### Verify Theme Applied

**Light theme checks:**

- Background should be white/light gray
- Text should be dark
- `<html>` element should NOT have `class="dark"`

**Dark theme checks:**

- Background should be dark (slate)
- Text should be light
- `<html>` element should have `class="dark"`

## Specific Theme Testing Checklist

### Color Contrast (WCAG AA/AAA)

Both themes must meet WCAG contrast requirements:

**Light Theme:**

- [ ] Body text on background: min 4.5:1 (AA)
- [ ] Headings on background: min 4.5:1 (AA)
- [ ] Link text on background: min 4.5:1 (AA)
- [ ] Button text on button background: min 4.5:1 (AA)
- [ ] Focus indicators visible: min 3:1 (AA)

**Dark Theme:**

- [ ] Body text on dark background: min 4.5:1 (AA)
- [ ] Headings on dark background: min 4.5:1 (AA)
- [ ] Link text on dark background: min 4.5:1 (AA)
- [ ] Button text on button background: min 4.5:1 (AA)
- [ ] Focus indicators visible on dark: min 3:1 (AA)

### Accessibility Verification

Run the accessibility test suite:

```bash
# All viewports
pnpm test:a11y

# Specific viewport
pnpm test:a11y:desktop
pnpm test:a11y:mobile
pnpm test:a11y:tablet
```

This will check for:

- Color contrast violations
- Missing ARIA attributes
- Keyboard navigation issues
- Screen reader compatibility

### Focus Indicators

**Manual check:**

1. Tab through the page
2. Verify focus ring is visible on ALL interactive elements
3. In light theme: focus ring should be dark/visible
4. In dark theme: focus ring should be light/visible

### No Flash of Unstyled Content (FOUC)

1. Hard refresh the page (Cmd+Shift+R / Ctrl+Shift+R)
2. Verify no "flash" between themes on initial load
3. Theme should be applied immediately (thanks to `suppressHydrationWarning` on `<html>`)

### Theme Persistence

1. Set theme to dark
2. Navigate to another page
3. Verify theme stays dark
4. Refresh page
5. Verify theme still dark (localStorage persistence)

## Interpreting Results

### Performance Score Breakdown

- **90-100**: Green (Excellent)
- **50-89**: Orange (Needs improvement)
- **0-49**: Red (Poor)

### Common Performance Issues

1. **Large image files**: Optimize with WebP, proper sizing
2. **Render-blocking resources**: Inline critical CSS, defer non-critical JS
3. **JavaScript bundle size**: Code splitting, tree shaking
4. **Network requests**: Minimize, bundle, cache
5. **Layout shifts**: Reserve space for images, ads

### Accessibility Score Breakdown

Lighthouse accessibility checks:

- Color contrast
- ARIA attributes
- Keyboard navigation
- Form labels
- Alt text on images
- Semantic HTML

### Dark Theme Specific Issues

Common issues in dark themes:

1. **Insufficient contrast**: Light text on gray background
2. **Focus indicators**: Hard to see on dark backgrounds
3. **Images**: May need dark-mode specific versions
4. **Shadows**: May need to be lightened or removed

## Analyzing Results

After running tests, check:

1. **Score deltas between themes**: Should be ±2 points max
2. **Core Web Vitals**:
   - FCP (First Contentful Paint): <1.8s (good), <3.0s (needs improvement)
   - LCP (Largest Contentful Paint): <2.5s (good), <4.0s (needs improvement)
   - CLS (Cumulative Layout Shift): <0.1 (good), <0.25 (needs improvement)
   - TBT (Total Blocking Time): <200ms (good), <600ms (needs improvement)

3. **Accessibility violations**: Should be 0 in both themes

4. **Best Practices**: Check for:
   - Console errors
   - Deprecated APIs
   - Security headers
   - HTTPS

5. **SEO**: Verify:
   - Meta tags
   - Structured data
   - Mobile-friendliness
   - Crawlability

## Troubleshooting

### Lighthouse Fails with 500 Error

**Problem**: `/tips/` returns 500 status code

**Solution**:

1. Check if the page renders in browser
2. Look for server errors in console
3. Verify all required content files exist
4. Check for TypeScript/build errors

### Theme Not Switching

**Problem**: Dark mode not applying

**Solutions**:

1. Check `localStorage.theme` value
2. Verify ThemeProvider is in layout.tsx
3. Check `suppressHydrationWarning` on `<html>` element
4. Look for CSS specificity issues
5. Verify CSS custom properties for dark theme exist

### Scores Vary Significantly Between Runs

**Problem**: Performance scores inconsistent

**Solutions**:

1. Close other applications (reduce CPU load)
2. Use production build (not dev mode)
3. Run multiple times and average
4. Use Lighthouse CI which runs 3 times automatically
5. Disable browser extensions
6. Use incognito/private mode

### Mobile Scores Much Lower

**Problem**: Mobile performance significantly worse

**Expected**: Mobile scores are typically 10-15 points lower due to:

- CPU throttling (4x slower)
- Network throttling (slow 4G simulation)
- Smaller viewport (more reflows)

**Solutions**:

1. Optimize images for mobile (smaller sizes)
2. Lazy load below-the-fold content
3. Defer non-critical JavaScript
4. Use smaller font files
5. Minimize initial bundle size

## Expected Results

Based on the current codebase:

### Homepage

- **Performance**: 95+ (desktop), 90+ (mobile)
- **Accessibility**: 100 (both themes)
- **Best Practices**: 95+
- **SEO**: 100

### Tips Page

- **Performance**: 92+ (desktop), 85+ (mobile)
- **Accessibility**: 100 (both themes)
- **Best Practices**: 95+
- **SEO**: 100

### Single Tip

- **Performance**: 90+ (desktop), 80+ (mobile)
- **Accessibility**: 100 (both themes)
- **Best Practices**: 95+
- **SEO**: 100

## Next Steps After Testing

1. **Document all issues** in a spreadsheet or issue tracker
2. **Prioritize by impact**:
   - P0: Accessibility violations
   - P1: SEO issues
   - P2: Performance <90
   - P3: Performance 90-95
3. **Create fixes** for each issue
4. **Re-test** after fixes
5. **Set up CI/CD** to run Lighthouse on every PR

## Automated CI Testing

To set up automated Lighthouse testing in CI:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm build
      - run: pnpm lh:ci
```

This will run Lighthouse on every PR and fail if scores drop below thresholds.

## Resources

- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Web.dev Lighthouse](https://web.dev/lighthouse-performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

## Summary Commands

```bash
# Quick single viewport test
pnpm lh:desktop

# Full test all viewports
pnpm lh:all  # Runs desktop, mobile, tablet in parallel

# Accessibility tests
pnpm test:a11y

# Full validation (lint, type, test, build)
pnpm validate

# Everything (unit + e2e + a11y + lighthouse)
pnpm test:all
```
