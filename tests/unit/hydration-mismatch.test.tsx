import { readFileSync } from 'fs'
import path from 'path'

describe('Hydration mismatch safeguards', () => {
  it('keeps suppressHydrationWarning on the root html element', () => {
    const layoutPath = path.join(process.cwd(), 'app/layout.tsx')
    const layoutSource = readFileSync(layoutPath, 'utf8')

    expect(layoutSource).toContain('<html lang="en" suppressHydrationWarning>')
  })

  it('keeps ThemeToggle mounted gate and SSR-safe placeholder', () => {
    const themeTogglePath = path.join(process.cwd(), 'components/molecules/theme-toggle.tsx')
    const themeToggleSource = readFileSync(themeTogglePath, 'utf8')

    expect(themeToggleSource).toContain('const [mounted, setMounted] = React.useState(false)')
    expect(themeToggleSource).toContain('if (!mounted)')
    expect(themeToggleSource).toContain('disabled')
  })

  it('keeps static footer link components server-rendered', () => {
    const footerPath = path.join(process.cwd(), 'components/organisms/footer.tsx')
    const footerSource = readFileSync(footerPath, 'utf8')
    const externalLinkPath = path.join(process.cwd(), 'components/links/external-link.tsx')
    const externalLinkSource = readFileSync(externalLinkPath, 'utf8')

    expect(footerSource).not.toMatch(/^'use client'$/m)
    expect(externalLinkSource).not.toMatch(/^'use client'$/m)
  })
})
