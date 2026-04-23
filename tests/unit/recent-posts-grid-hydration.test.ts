/**
 * Ensures RecentPostsGrid uses a fixed locale for date formatting to prevent
 * SSR/client hydration mismatches.
 */
import fs from 'fs'
import path from 'path'

describe('RecentPostsGrid', () => {
  const src = fs.readFileSync(
    path.join(process.cwd(), 'components/organisms/recent-posts-grid.tsx'),
    'utf-8',
  )

  it('should not call toLocaleDateString without a locale argument', () => {
    // toLocaleDateString() with no args is locale-dependent → hydration mismatch
    expect(src).not.toMatch(/toLocaleDateString\(\s*\)/)
  })

  it('should format dates with a fixed locale', () => {
    // Must pass at least a locale string so server and client agree
    expect(src).toMatch(/toLocaleDateString\(\s*['"`]/)
  })
})
