#!/usr/bin/env tsx
/**
 * Script to remove duplicate Header and Footer from all pages
 * Since the layout already provides Header/Footer, pages shouldn't have them
 */

import * as fs from 'fs'
import * as path from 'path'

const pagesToFix = [
  'app/[locale]/about/page.tsx',
  'app/[locale]/contact/page.tsx',
  'app/[locale]/cookie-policy/page.tsx',
  'app/[locale]/guides/[slug]/page.tsx',
  'app/[locale]/guides/page.tsx',
  'app/[locale]/news/[slug]/page.tsx',
  'app/[locale]/news/page.tsx',
  'app/[locale]/privacy-policy/page.tsx',
  'app/[locale]/support/page.tsx',
  'app/[locale]/terms-and-conditions/page.tsx',
  'app/[locale]/tips/[slug]/page.tsx',
  'app/[locale]/tips/page.tsx',
]

for (const filePath of pagesToFix) {
  const fullPath = path.join(process.cwd(), filePath)

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${filePath} (not found)`)
    continue
  }

  let content = fs.readFileSync(fullPath, 'utf-8')

  // Remove Header and Footer imports
  content = content.replace(/^import { Header } from '@\/components\/organisms\/header'\n/gm, '')
  content = content.replace(/^import { Footer } from '@\/components\/organisms\/footer'\n/gm, '')

  // Remove <Header /> line
  content = content.replace(/^\s*<Header \/>\s*\n/gm, '')

  // Remove <Footer /> line
  content = content.replace(/^\s*<Footer \/>\s*\n/gm, '')

  // Remove wrapping div with min-h-screen flex flex-col
  content = content.replace(/<div className="min-h-screen flex flex-col">\s*\n/g, '')

  // Remove <main> wrapper
  content = content.replace(/<main id="main-content" className="flex-1[^"]*">\s*\n/g, '')
  content = content.replace(/^\s*<\/main>\s*\n/gm, '')

  // Remove closing </div> that was wrapping everything
  // This is tricky - we need to remove the last </div> before the closing }
  const lines = content.split('\n')
  let bracketCount = 0
  let lastDivIndex = -1

  // Find the last standalone </div> before the final }
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim()
    if (line === '}') {
      bracketCount++
    } else if (line === '</div>' && bracketCount === 1 && lastDivIndex === -1) {
      lastDivIndex = i
      break
    }
  }

  if (lastDivIndex !== -1) {
    lines.splice(lastDivIndex, 1)
    content = lines.join('\n')
  }

  fs.writeFileSync(fullPath, content, 'utf-8')
  console.log(`✅ Fixed ${filePath}`)
}

console.log('\n🎉 All pages fixed!')
