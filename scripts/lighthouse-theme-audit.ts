#!/usr/bin/env tsx

/**
 * Lighthouse Theme Audit Script
 *
 * Runs comprehensive Lighthouse audits across:
 * - 2 themes (light, dark)
 * - 3 viewports (mobile, tablet, desktop)
 * - 3 pages (homepage, tips, single tip)
 *
 * Total: 18 audits (2 × 3 × 3)
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs/promises'
import * as path from 'path'

const execAsync = promisify(exec)

interface ViewportConfig {
  name: string
  width: number
  height: number
  mobile: boolean
  deviceScaleFactor: number
}

interface AuditResult {
  theme: string
  viewport: string
  page: string
  url: string
  scores: {
    performance: number
    accessibility: number
    'best-practices': number
    seo: number
  }
  metrics?: {
    fcp?: number
    lcp?: number
    tbt?: number
    cls?: number
    si?: number
  }
  issues?: string[]
}

interface LighthouseAudit {
  score: number | null
  title?: string
  description?: string
  numericValue?: number
}

const VIEWPORTS: Record<string, ViewportConfig> = {
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 667,
    mobile: true,
    deviceScaleFactor: 2,
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    mobile: false,
    deviceScaleFactor: 2,
  },
  desktop: {
    name: 'Desktop',
    width: 1920,
    height: 1080,
    mobile: false,
    deviceScaleFactor: 1,
  },
}

const PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'Tips', path: '/tips' },
  { name: 'Single Tip', path: '/tips/12-one-liners-ab-test-tonight' },
]

const THEMES = ['light', 'dark']

const BASE_URL = 'http://localhost:3000'

async function runLighthouse(
  url: string,
  viewport: ViewportConfig,
  theme: string,
  outputPath: string,
): Promise<unknown> {
  const chromeFlagsArray = ['--headless=new', '--no-sandbox', '--disable-gpu']

  // For dark mode, we'll inject a script to add the dark class
  const extraHeaders = theme === 'dark' ? `{"Cookie": "theme=dark"}` : '{}'

  const screenEmulation = {
    mobile: viewport.mobile,
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.deviceScaleFactor,
    disabled: false,
  }

  const configPath = path.join(
    __dirname,
    '..',
    '.lighthouseci',
    `temp-${theme}-${viewport.name.toLowerCase()}.json`,
  )

  const config = {
    extends: 'lighthouse:default',
    settings: {
      formFactor: viewport.mobile ? 'mobile' : 'desktop',
      throttling: viewport.mobile
        ? {
            rttMs: 150,
            throughputKbps: 1638.4,
            cpuSlowdownMultiplier: 4,
          }
        : {
            rttMs: 40,
            throughputKbps: 10240,
            cpuSlowdownMultiplier: 1,
          },
      screenEmulation,
      emulatedUserAgent: viewport.mobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    },
  }

  await fs.writeFile(configPath, JSON.stringify(config, null, 2))

  const chromeFlags = chromeFlagsArray.join(' ')

  const themeScript =
    theme === 'dark'
      ? `--extra-headers='${extraHeaders}' --precomputed-lantern-data-path='' --preset=${viewport.mobile ? 'perf' : 'desktop'}`
      : `--preset=${viewport.mobile ? 'perf' : 'desktop'}`

  try {
    const command = `npx lighthouse "${url}" \
      --output=json \
      --output-path="${outputPath}" \
      --chrome-flags="${chromeFlags}" \
      --config-path="${configPath}" \
      ${themeScript}`

    console.log(`Running: ${theme} theme - ${viewport.name} - ${url}`)

    const { stdout: _stdout, stderr } = await execAsync(command, {
      maxBuffer: 1024 * 1024 * 10,
      timeout: 120000,
    })

    if (stderr && !stderr.includes('ChromeLauncher')) {
      console.warn(`Warning: ${stderr}`)
    }

    // Clean up temp config
    await fs.unlink(configPath).catch(() => {})

    // Read and return the results
    const results = JSON.parse(await fs.readFile(outputPath, 'utf-8'))
    return results
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Error running Lighthouse for ${url} (${theme}, ${viewport.name}):`, errorMessage)
    // Clean up temp config on error
    await fs.unlink(configPath).catch(() => {})
    throw error
  }
}

// Unused - reserved for future use with Puppeteer
// async function injectDarkModeScript(url: string): Promise<void> {
//   // This function would use Puppeteer to inject dark mode class
//   // For now, we'll rely on cookie-based theme switching
//   console.log(`Note: Dark mode testing relies on cookie: theme=dark`)
// }

async function parseResults(
  lighthouseResults: unknown,
  theme: string,
  viewport: string,
  page: string,
  url: string,
): Promise<AuditResult> {
  // Type assertion for Lighthouse results structure
  const results = lighthouseResults as {
    categories: Record<string, { score: number }>
    audits: Record<string, LighthouseAudit>
  }
  const categories = results.categories
  const audits = results.audits

  const result = {
    theme,
    viewport,
    page,
    url,
    scores: {
      performance: Math.round(categories.performance?.score * 100 || 0),
      accessibility: Math.round(categories.accessibility?.score * 100 || 0),
      'best-practices': Math.round(categories['best-practices']?.score * 100 || 0),
      seo: Math.round(categories.seo?.score * 100 || 0),
    },
    metrics: {
      fcp: audits['first-contentful-paint']?.numericValue,
      lcp: audits['largest-contentful-paint']?.numericValue,
      tbt: audits['total-blocking-time']?.numericValue,
      cls: audits['cumulative-layout-shift']?.numericValue,
      si: audits['speed-index']?.numericValue,
    },
    issues: [] as string[],
  }(
    // Collect issues
    Object.values(audits) as LighthouseAudit[],
  ).forEach((audit: LighthouseAudit) => {
    if (audit.score !== null && audit.score < 1 && audit.title) {
      result.issues.push(`${audit.title}: ${audit.description || 'No description'}`)
    }
  })

  return result
}

function formatResults(results: AuditResult[]): string {
  let output = '\n'
  output += '═══════════════════════════════════════════════════════════════════════\n'
  output += '                 LIGHTHOUSE THEME AUDIT RESULTS                       \n'
  output += '═══════════════════════════════════════════════════════════════════════\n\n'

  // Group by viewport
  const byViewport = results.reduce(
    (acc, result) => {
      if (!acc[result.viewport]) acc[result.viewport] = []
      acc[result.viewport].push(result)
      return acc
    },
    {} as Record<string, AuditResult[]>,
  )

  Object.entries(byViewport).forEach(([viewport, viewportResults]) => {
    output += `\n╔═══════════════════════════════════════════════════════════════════╗\n`
    output += `║  ${viewport.toUpperCase().padEnd(64)} ║\n`
    output += `╚═══════════════════════════════════════════════════════════════════╝\n\n`

    viewportResults.forEach((result) => {
      output += `📄 ${result.page} - ${result.theme === 'light' ? '☀️  Light' : '🌙 Dark'} Theme\n`
      output += `   URL: ${result.url}\n\n`

      output += `   Scores:\n`
      const perfIcon =
        result.scores.performance >= 95 ? '✅' : result.scores.performance >= 90 ? '⚠️ ' : '❌'
      const a11yIcon =
        result.scores.accessibility >= 100 ? '✅' : result.scores.accessibility >= 95 ? '⚠️ ' : '❌'
      const bpIcon =
        result.scores['best-practices'] >= 95
          ? '✅'
          : result.scores['best-practices'] >= 90
            ? '⚠️ '
            : '❌'
      const seoIcon = result.scores.seo >= 100 ? '✅' : result.scores.seo >= 95 ? '⚠️ ' : '❌'

      output += `   ${perfIcon} Performance:     ${result.scores.performance}/100\n`
      output += `   ${a11yIcon} Accessibility:   ${result.scores.accessibility}/100\n`
      output += `   ${bpIcon} Best Practices:  ${result.scores['best-practices']}/100\n`
      output += `   ${seoIcon} SEO:             ${result.scores.seo}/100\n\n`

      if (result.metrics) {
        output += `   Core Web Vitals:\n`
        output += `   • FCP: ${result.metrics.fcp ? (result.metrics.fcp / 1000).toFixed(2) + 's' : 'N/A'}\n`
        output += `   • LCP: ${result.metrics.lcp ? (result.metrics.lcp / 1000).toFixed(2) + 's' : 'N/A'}\n`
        output += `   • TBT: ${result.metrics.tbt ? result.metrics.tbt.toFixed(0) + 'ms' : 'N/A'}\n`
        output += `   • CLS: ${result.metrics.cls ? result.metrics.cls.toFixed(3) : 'N/A'}\n`
        output += `   • SI:  ${result.metrics.si ? (result.metrics.si / 1000).toFixed(2) + 's' : 'N/A'}\n\n`
      }

      output += `   ─────────────────────────────────────────────────────────────────\n\n`
    })
  })

  // Summary comparison
  output += '\n╔═══════════════════════════════════════════════════════════════════╗\n'
  output += '║  THEME COMPARISON SUMMARY                                        ║\n'
  output += '╚═══════════════════════════════════════════════════════════════════╝\n\n'

  PAGES.forEach((page) => {
    output += `📄 ${page.name}\n`
    Object.keys(VIEWPORTS).forEach((viewport) => {
      const lightResult = results.find(
        (r) => r.page === page.name && r.viewport === viewport && r.theme === 'light',
      )
      const darkResult = results.find(
        (r) => r.page === page.name && r.viewport === viewport && r.theme === 'dark',
      )

      if (lightResult && darkResult) {
        output += `\n  ${viewport.charAt(0).toUpperCase() + viewport.slice(1)}:\n`

        const categories = ['performance', 'accessibility', 'best-practices', 'seo'] as const
        categories.forEach((category) => {
          const lightScore = lightResult.scores[category]
          const darkScore = darkResult.scores[category]
          const delta = darkScore - lightScore
          const deltaStr = delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : '±0'
          const icon = Math.abs(delta) <= 2 ? '✅' : '⚠️ '

          output += `    ${icon} ${category.padEnd(20)}: ☀️  ${lightScore}  |  🌙 ${darkScore}  (${deltaStr})\n`
        })
      }
    })
    output += '\n'
  })

  return output
}

async function main() {
  console.log('Starting Lighthouse Theme Audit...\n')
  console.log(
    `Testing ${THEMES.length} themes × ${Object.keys(VIEWPORTS).length} viewports × ${PAGES.length} pages = ${THEMES.length * Object.keys(VIEWPORTS).length * PAGES.length} audits\n`,
  )

  const resultsDir = path.join(__dirname, '..', '.lighthouse-results')
  await fs.mkdir(resultsDir, { recursive: true })

  const allResults: AuditResult[] = []

  for (const theme of THEMES) {
    for (const [viewportKey, viewport] of Object.entries(VIEWPORTS)) {
      for (const page of PAGES) {
        const url = `${BASE_URL}${page.path}`
        const outputPath = path.join(
          resultsDir,
          `${theme}-${viewportKey}-${page.name.toLowerCase().replace(/\s+/g, '-')}.json`,
        )

        try {
          const lighthouseResults = await runLighthouse(url, viewport, theme, outputPath)
          const parsedResult = await parseResults(
            lighthouseResults,
            theme,
            viewportKey,
            page.name,
            url,
          )
          allResults.push(parsedResult)

          console.log(`✅ Completed: ${theme} - ${viewport.name} - ${page.name}`)
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          console.error(`❌ Failed: ${theme} - ${viewport.name} - ${page.name}`, errorMessage)
        }
      }
    }
  }

  // Generate report
  const report = formatResults(allResults)
  console.log(report)

  // Save report to file
  const reportPath = path.join(resultsDir, 'theme-audit-report.txt')
  await fs.writeFile(reportPath, report)
  console.log(`\n📊 Full report saved to: ${reportPath}`)

  // Save JSON results
  const jsonPath = path.join(resultsDir, 'theme-audit-results.json')
  await fs.writeFile(jsonPath, JSON.stringify(allResults, null, 2))
  console.log(`📊 JSON results saved to: ${jsonPath}`)
}

main().catch(console.error)
