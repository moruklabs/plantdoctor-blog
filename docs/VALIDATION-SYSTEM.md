# Comprehensive Validation System Documentation

## 🎯 Overview

This project implements a **comprehensive validation system** that ensures code quality through multiple layers of testing and validation. The system supports Test-Driven Development (TDD) with continuous validation across all viewports (mobile, tablet, desktop) and theme modes (light, dark).

## 🚀 Quick Start

### TDD Development Mode

```bash
# Start TDD watch mode (runs all tests continuously)
pnpm tdd

# Quick TDD mode (only related tests)
pnpm tdd:quick
```

### Validation Commands

#### 🏃 Quick Validation (2-5 seconds)

```bash
pnpm validate:quick
```

Runs: Lint, Type-check, Format check

#### 📦 Standard Validation (30-60 seconds)

```bash
pnpm validate:standard
```

Runs: Quick validation + Build + Test with coverage

#### 🎯 Complete Validation (5-10 minutes)

```bash
pnpm validate:complete
```

Runs: Standard validation + E2E (all viewports) + Accessibility + Lighthouse

#### 👁️ Visual Validation (SEE THE BROWSER!)

```bash
pnpm validate:visual
# or
pnpm validate:complete:headed
```

Runs: Same as complete validation but with **VISIBLE BROWSER WINDOWS** so you can watch the tests actually running on mobile, tablet, and desktop viewports!

#### 🎨 Theme Validation

```bash
pnpm validate:themes
```

Runs: Tests in both light and dark modes

## 📋 Available Commands

### Core Validation

| Command                  | Description                    | Time    | When to Use   |
| ------------------------ | ------------------------------ | ------- | ------------- |
| `pnpm validate:quick`    | Lint, type-check, format       | 2-5s    | Pre-commit    |
| `pnpm validate:standard` | Quick + build + tests          | 30-60s  | Pre-push      |
| `pnpm validate:complete` | Everything                     | 5-10min | Before merge  |
| `pnpm validate:visual`   | Complete with visible browsers | 5-10min | Debug/verify  |
| `pnpm validate:themes`   | Theme-specific tests           | 2-3min  | Theme changes |

### TDD Commands

| Command          | Description           | Use Case            |
| ---------------- | --------------------- | ------------------- |
| `pnpm tdd`       | Full TDD watch mode   | Active development  |
| `pnpm tdd:quick` | Related tests only    | Focused development |
| `pnpm tdd:watch` | Continuous validation | Refactoring         |

### Test Commands

| Command              | Description          | Coverage          |
| -------------------- | -------------------- | ----------------- |
| `pnpm test`          | Unit tests           | Components, utils |
| `pnpm test:coverage` | With coverage report | 80% threshold     |
| `pnpm test:watch`    | Watch mode           | Development       |
| `pnpm test:mutation` | Mutation testing     | Test quality      |

### E2E Testing

| Command               | Description             | Viewport      |
| --------------------- | ----------------------- | ------------- |
| `pnpm e2e`            | All E2E tests           | All viewports |
| `pnpm e2e:desktop`    | Desktop only            | 1920x1080     |
| `pnpm e2e:mobile`     | Mobile only             | 375x667       |
| `pnpm e2e:tablet`     | Tablet only             | 768x1024      |
| `pnpm test:viewports` | Parallel viewport tests | All at once   |

### Visual Testing (Headed Mode)

| Command                      | Description                    | Purpose             |
| ---------------------------- | ------------------------------ | ------------------- |
| `pnpm e2e:headed`            | All tests with browser visible | Debug/watch         |
| `pnpm e2e:desktop:headed`    | Desktop with browser           | See desktop layout  |
| `pnpm e2e:mobile:headed`     | Mobile with browser            | See mobile viewport |
| `pnpm e2e:tablet:headed`     | Tablet with browser            | See tablet viewport |
| `pnpm test:viewports:headed` | All viewports visible          | Watch all sizes     |
| `pnpm validate:visual`       | Complete validation visible    | Full verification   |

### Accessibility Testing

| Command                     | Description           | Target                  |
| --------------------------- | --------------------- | ----------------------- |
| `pnpm test:a11y`            | Basic a11y tests      | All pages               |
| `pnpm test:a11y:all`        | All viewports         | Mobile, tablet, desktop |
| `pnpm test:a11y:desktop`    | Desktop only          | WCAG 2.1 AA             |
| `pnpm test:a11y:mobile`     | Mobile only           | Touch targets           |
| `pnpm test:a11y:all:headed` | All viewports visible | Watch a11y testing      |

### Lighthouse Testing

| Command           | Description   | Metrics                |
| ----------------- | ------------- | ---------------------- |
| `pnpm lh:all`     | All viewports | Performance, SEO, A11y |
| `pnpm lh:desktop` | Desktop audit | Target: 95+            |
| `pnpm lh:mobile`  | Mobile audit  | Target: 95+            |
| `pnpm lh:themes`  | Theme audits  | Light & dark           |

## 🔧 Git Hooks

### Pre-commit Hook

**Runs automatically on `git commit`**

- Validates tracking files (TODO.md, STATUS.md)
- Runs lint-staged on changed files
- Formats code with Prettier
- Fixes linting issues
- Runs related unit tests

**Time:** 2-5 seconds

### Pre-push Hook

**Runs automatically on `git push`**

- Quick validation (lint, type, format)
- Production build
- Unit tests with coverage
- Optional: E2E tests
- Optional: Accessibility tests

**Time:** 30-60 seconds (without optional)

## 🎯 Coverage Thresholds

All coverage metrics must meet **80% minimum**:

- **Branches:** 80%
- **Functions:** 80%
- **Lines:** 80%
- **Statements:** 80%

View coverage report:

```bash
pnpm coverage:report
```

## 🧬 Mutation Testing

Mutation testing validates the quality of your tests by introducing bugs and checking if tests catch them.

```bash
# Run mutation testing
pnpm test:mutation

# Incremental mode (faster)
pnpm test:mutation:incremental
```

**Thresholds:**

- **Target:** 75% mutation score
- **Minimum:** 60% mutation score
- **Break:** 50% (fails CI/CD)

## 📱 Viewport Testing

All tests run across three viewports:

### Desktop (1920x1080)

- Full layout testing
- Hover interactions
- Keyboard navigation

### Tablet (768x1024)

- Touch interactions
- Responsive layout
- Portrait/landscape

### Mobile (375x667)

- Touch targets (48x48 minimum)
- Responsive images
- Mobile navigation

## 🎨 Theme Testing

Tests run in both theme modes:

### Light Mode

```bash
THEME_MODE=light pnpm test
```

### Dark Mode

```bash
THEME_MODE=dark pnpm test
```

### Both Themes

```bash
pnpm test:themes
```

## 📊 Performance Targets

### Lighthouse Scores

- **Performance:** 95+
- **Accessibility:** 100
- **Best Practices:** 95+
- **SEO:** 100

### Build Performance

- **Cold build:** <60 seconds
- **Hot build:** <10 seconds
- **Incremental:** <5 seconds

### Bundle Size

- **Homepage:** <50KB
- **Total:** <150KB
- **Per route:** <75KB

## 🔄 TDD Workflow

### 1. Start TDD Mode

```bash
pnpm tdd
```

This runs:

- Jest in watch mode
- TypeScript compiler in watch mode
- ESLint on file changes
- E2E tests on changes
- Accessibility tests on changes

### 2. Write Failing Test

Create your test first (red phase):

```typescript
// component.test.tsx
test('should validate email format', () => {
  expect(validateEmail('invalid')).toBe(false)
})
```

### 3. Write Implementation

Make the test pass (green phase):

```typescript
// component.tsx
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
```

### 4. Refactor

Improve code while keeping tests green (refactor phase).

### 5. Commit

The pre-commit hook automatically:

- Formats your code
- Fixes linting issues
- Runs related tests

### 6. Push

The pre-push hook validates:

- Build succeeds
- All tests pass
- Coverage thresholds met

## 👁️ Visual Validation for Debugging

Visual validation allows you to **see the browser windows** while tests run, which is essential for:

- **Verifying test behavior** - Ensure tests are clicking the right elements
- **Debugging failures** - See exactly what went wrong
- **Responsive testing** - Watch how your app adapts to different viewports
- **Accessibility verification** - See focus indicators and screen reader announcements
- **Performance monitoring** - Watch loading sequences and animations

### Quick Visual Commands

```bash
# See everything at once (3 browser windows)
pnpm validate:visual

# Watch specific viewport tests
pnpm e2e:mobile:headed    # See mobile viewport (375x667)
pnpm e2e:tablet:headed    # See tablet viewport (768x1024)
pnpm e2e:desktop:headed   # See desktop viewport (1920x1080)

# Watch all viewports simultaneously
pnpm test:viewports:headed

# Debug accessibility issues visually
pnpm test:a11y:all:headed

# Test themes with visible browser
pnpm e2e:themes:headed
```

### Benefits of Visual Testing

1. **Immediate Feedback** - See exactly what the test sees
2. **Catch Visual Bugs** - Some issues only appear visually
3. **Verify Interactions** - Ensure clicks, hovers, and scrolls work correctly
4. **Check Responsive Behavior** - Watch breakpoint transitions
5. **Debug Faster** - No need to add console.logs or screenshots

### Tips for Visual Testing

- **Use multiple monitors** - Spread browser windows across screens
- **Record sessions** - Use screen recording for later review
- **Slow down tests** - Add `--slow-mo=500` to Playwright commands
- **Pause on failure** - Add `--debug` to stop when tests fail

## 🚨 Troubleshooting

### Tests Failing

```bash
# Run specific test
jest path/to/test.test.ts

# Debug mode
pnpm e2e:debug

# Update snapshots
jest -u
```

### Coverage Below Threshold

```bash
# View detailed report
pnpm coverage:report

# Find uncovered lines
jest --coverage --coverageReporters=text
```

### Lighthouse Scores Low

```bash
# Run locally with details
pnpm lh:desktop

# Check specific metric
lighthouse http://localhost:3000 --only-categories=performance
```

### Hook Issues

```bash
# Skip hooks (emergency only!)
git commit --no-verify

# Reinstall hooks
pnpm hooks:install
```

## 🎯 Best Practices

### 1. Use TDD Mode During Development

Start with `pnpm tdd` when beginning any feature work.

### 2. Commit Frequently

Small, focused commits with the pre-commit hook ensure quality.

### 3. Run Full Validation Before PR

```bash
pnpm validate:complete
```

### 4. Test Across Viewports

Don't just test desktop - mobile and tablet matter!

### 5. Monitor Bundle Size

Check after adding dependencies:

```bash
pnpm build:analyze
```

### 6. Fix Issues Immediately

Don't let failing tests accumulate - fix them right away.

## 📈 Continuous Improvement

### Weekly Tasks

- Run mutation testing: `pnpm test:mutation`
- Review coverage trends: `pnpm coverage:report`
- Update dependencies: `pnpm update`

### Monthly Tasks

- Full accessibility audit
- Performance profiling
- Bundle size analysis
- Dependency audit

## 🔗 Related Documentation

- [Git Hooks Documentation](./.githooks/README.md)
- [Testing Strategy](./TESTING-STRATEGY.md)
- [TDD Guidelines](./TDD-GUIDELINES.md)
- [Performance Budgets](./PERFORMANCE.md)

---

**Remember:** The validation system is here to help, not hinder. If something is blocking you unnecessarily, please report it so we can adjust thresholds or improve the workflow.

Last Updated: 2025-11-16
