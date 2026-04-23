/**
 * Verifies the homepage does not reference the removed apps content system.
 */
import fs from 'fs'
import path from 'path'

describe('homepage', () => {
  const pagePath = path.join(process.cwd(), 'app/page.tsx')
  const pageContent = fs.readFileSync(pagePath, 'utf-8')

  it('should not import from lib/content/apps', () => {
    expect(pageContent).not.toMatch(/from ['"]@\/lib\/content\/apps['"]/)
  })

  it('should not call getAllApps', () => {
    expect(pageContent).not.toMatch(/getAllApps/)
  })
})
