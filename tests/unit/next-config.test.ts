/**
 * Tests for next.config.mjs correctness.
 * Validates deprecated config patterns are not used.
 */
import fs from 'fs'
import path from 'path'

describe('next.config.mjs', () => {
  const configPath = path.join(process.cwd(), 'next.config.mjs')
  const configContent = fs.readFileSync(configPath, 'utf-8')

  it('should not use deprecated images.domains', () => {
    expect(configContent).not.toMatch(/images\s*:\s*\{[^}]*domains\s*:/)
  })

  it('should use images.remotePatterns instead of domains', () => {
    expect(configContent).toMatch(/remotePatterns/)
  })
})
