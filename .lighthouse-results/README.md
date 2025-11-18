# Lighthouse Theme Testing Results

This directory contains Lighthouse audit results for theme testing.

## Directory Structure

```
.lighthouse-results/
├── README.md (this file)
├── theme-audit-summary.txt          # Human-readable comparison report
├── theme-audit-results.json         # Structured JSON data for analysis
│
├── Individual Test Results (JSON files):
├── light-desktop-homepage.json
├── light-desktop-tips.json
├── light-desktop-single-tip.json
├── light-tablet-homepage.json
├── light-tablet-tips.json
├── light-tablet-single-tip.json
├── light-mobile-homepage.json
├── light-mobile-tips.json
├── light-mobile-single-tip.json
│
├── dark-desktop-homepage.json
├── dark-desktop-tips.json
├── dark-desktop-single-tip.json
├── dark-tablet-homepage.json
├── dark-tablet-tips.json
├── dark-tablet-single-tip.json
├── dark-mobile-homepage.json
├── dark-mobile-tips.json
└── dark-mobile-single-tip.json
```

## How to Read Results

### Summary Report (`theme-audit-summary.txt`)

This file contains:

1. **Scores by viewport and theme**: Performance, Accessibility, Best Practices, SEO
2. **Core Web Vitals**: FCP, LCP, TBT, CLS, SI
3. **Theme Comparison**: Side-by-side scores showing deltas

### JSON Results (`theme-audit-results.json`)

Structured data including:

- All scores
- All metrics
- List of issues/warnings
- Can be imported into dashboards or CI tools

### Individual Test Results (`.json` files)

Full Lighthouse JSON output for each test:

- Detailed audit results
- Resource analysis
- Opportunity recommendations
- Diagnostic information

## Quick Analysis

### Check if themes are equivalent:

```bash
# View summary report
cat .lighthouse-results/theme-audit-summary.txt

# Compare specific metric across themes
jq '.[] | select(.page=="Homepage") | {theme, viewport, scores}' theme-audit-results.json
```

### Extract specific scores:

```bash
# All performance scores
jq '.[] | {page, theme, viewport, perf: .scores.performance}' theme-audit-results.json

# All accessibility scores
jq '.[] | {page, theme, viewport, a11y: .scores.accessibility}' theme-audit-results.json
```

### Find issues:

```bash
# Pages with accessibility < 100
jq '.[] | select(.scores.accessibility < 100) | {page, theme, viewport, score: .scores.accessibility}' theme-audit-results.json

# Pages with performance < 90
jq '.[] | select(.scores.performance < 90) | {page, theme, viewport, score: .scores.performance}' theme-audit-results.json
```

## Expected Scores

### Target Scores (All Pages, Both Themes)

| Category       | Target | Acceptable | Failing |
| -------------- | ------ | ---------- | ------- |
| Performance    | 95+    | 90+        | <90     |
| Accessibility  | 100    | 95+        | <95     |
| Best Practices | 95+    | 90+        | <90     |
| SEO            | 100    | 95+        | <95     |

### Theme Delta Tolerance

Scores between light and dark themes should be within:

- **±2 points**: Excellent (expected variance)
- **±5 points**: Acceptable (minor theme-specific overhead)
- **>5 points**: Investigate (significant theme-specific issue)

## Common Issues and Fixes

### Low Performance Score

**Causes**:

- Large images not optimized
- Render-blocking resources
- JavaScript bundle too large
- No code splitting

**Fixes**:

- Convert images to WebP
- Use Next.js Image optimization
- Implement lazy loading
- Split code by route

### Low Accessibility Score

**Causes**:

- Color contrast too low
- Missing ARIA labels
- Images without alt text
- Poor keyboard navigation

**Fixes**:

- Adjust theme colors for contrast
- Add proper ARIA attributes
- Add descriptive alt text
- Test with keyboard only

### Theme-Specific Issues

**Dark theme performing worse**:

- May be loading additional CSS
- Color calculations may be heavier
- Images may not be optimized for dark backgrounds

**Light theme performing worse**:

- Usually not the case
- Check for light-mode specific assets

## Viewing in Lighthouse Viewer

To view detailed results in the Lighthouse web viewer:

1. Go to https://googlechrome.github.io/lighthouse/viewer/
2. Drag and drop any `.json` file from this directory
3. View detailed recommendations and diagnostics

## Re-running Tests

To regenerate all results:

```bash
# Ensure production build
pnpm build

# Start server in another terminal
pnpm start

# Run comprehensive theme tests
pnpm lh:themes
```

Results will be overwritten in this directory.

## Continuous Monitoring

Set up CI to run these tests on every PR:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse

on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - run: pnpm start &
      - run: sleep 10
      - run: pnpm lh:themes
      - uses: actions/upload-artifact@v3
        with:
          name: lighthouse-results
          path: .lighthouse-results/
```

## Resources

- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse)
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Score Weights](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
