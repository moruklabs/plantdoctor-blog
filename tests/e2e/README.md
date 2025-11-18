# E2E Tests

This directory contains Playwright end-to-end tests for the [[REPLACE_ME_APP_NAME]] blog application.

## Test Files

### Active Tests

- **sanity.spec.ts** - Basic sanity tests to verify the e2e setup works
  - Homepage loading
  - Basic page content
  - Navigation elements
  - Internal link navigation
  - 404 handling
  - Basic page tests (homepage, blog, guides)

- **citations-footnotes.spec.ts** - Tests for citation and footnote rendering
  - Footnote reference links
  - Footnotes section rendering
  - Back-reference links
  - CSS styling
  - Accessibility features
  - Visual regression tests

- **link-crawler.spec.ts** - Simplified link validation tests
  - Key page loading (homepage, blog, guides, about, contact)
  - Navigation between pages
  - Blog post and guide loading
  - Internal link validation
  - External link security attributes
  - Sitemap accessibility

### Archived Tests

- **link-crawler.spec.ts.full** - Comprehensive link crawler (archived due to timeout issues)
  - Full site crawl with BFS
  - Dynamic content discovery (modals, mobile menus)
  - Comprehensive internal and external link validation
  - **Note**: This test is too slow for regular e2e runs (3+ minutes). Use for comprehensive link audits only.

## Running Tests

```bash
# Run all e2e tests
pnpm e2e

# Run specific test file
pnpm playwright test sanity.spec.ts

# Run with debug mode
pnpm playwright test --debug

# Run with headed browser
pnpm playwright test --headed

# Run specific test by name
pnpm playwright test -g "should load homepage"
```

## Configuration

Tests are configured in `playwright.config.ts`:

- Web server: `pnpm build && pnpm exec next start`
- Base URL: `http://localhost:3000`
- Timeout: 120 seconds (180 seconds for crawler tests)
- Workers: 1 in CI, unlimited locally
- Retries: 2 in CI, 0 locally

## Test Patterns

### Proper Use of Playwright Fixtures

**❌ Don't do this:**

```typescript
test.beforeAll(async ({ browser }) => {
  page = await browser.newPage() // browser is not available in beforeAll
})
```

**✅ Do this:**

```typescript
test('my test', async ({ page }) => {
  await page.goto('/')
  // Use page fixture directly in each test
})
```

### Serial Tests with Shared State

For tests that need to share state (like the crawler), use `mode: 'serial'`:

```typescript
test.describe('My Tests', () => {
  test.describe.configure({ mode: 'serial' })

  let sharedData: any

  test('first test', async ({ page }) => {
    sharedData = await setupData(page)
  })

  test('second test uses shared data', async () => {
    // Can use sharedData here
  })
})
```

## Troubleshooting

### Port Already in Use

If you see "port 3000 is already used":

```bash
# Kill existing Next.js processes
pkill -9 -f "next-server"
pkill -9 -f "next start"

# Then run tests again
pnpm e2e
```

### Tests Timeout

- Check if the build completes successfully: `pnpm build`
- Increase timeout in test: `test.setTimeout(180000)` (3 minutes)
- Simplify complex tests that crawl many pages

### Page Closed Errors

This usually means:

1. Using `beforeAll` with `{ browser }` (use `{ page }` in each test instead)
2. Closing page too early
3. Test isolation issues (use serial mode if tests depend on each other)

## CI Integration

Tests run automatically in CI with:

- 2 retries for flaky tests
- HTML reporter for failure analysis
- Strict mode (`forbidOnly: true`)
- Single worker for consistency
