#!/usr/bin/env tsx
/**
 * Better script to remove duplicate Header/Footer while keeping valid JSX structure
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

  // Step 1: Remove Header and Footer imports
  content = content.replace(/^import \{ Header \} from '@\/components\/organisms\/header'\n/gm, '')
  content = content.replace(/^import \{ Footer \} from '@\/components\/organisms\/footer'\n/gm, '')

  // Step 2: Remove the wrapping structure
  // Replace the opening: <div className="min-h-screen flex flex-col">\n      <Header />
  // with just: <>
  content = content.replace(
    /<div className="min-h-screen flex flex-col">\s*\n\s*<Header \/>/g,
    '<>',
  )

  // Step 3: Remove the closing structure
  // Replace: </main>\n      <Footer />\n    </div>
  // with just: </>
  content = content.replace(/<\/main>\s*\n\s*<Footer \/>\s*\n\s*<\/div>/g, '</>')

  // Step 4: Remove the <main> wrapper
  // Replace: <main id="main-content" className="flex-1...">
  // with nothing (the layout provides main)
  content = content.replace(/<main[^>]+>\s*\n/g, '')

  // Clean up any standalone </main> that might be left
  content = content.replace(/^\s*<\/main>\s*\n/gm, '')

  fs.writeFileSync(fullPath, content, 'utf-8')
  console.log(`✅ Fixed ${filePath}`)
}

console.log('\n🎉 All pages fixed!')
