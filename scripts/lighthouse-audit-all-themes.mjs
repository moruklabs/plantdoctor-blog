#!/usr/bin/env node

/**
 * Comprehensive Lighthouse Theme Audit
 *
 * Runs Lighthouse audits across:
 * - 2 themes (light, dark)
 * - 3 viewports (mobile, tablet, desktop)
 * - 3 pages (homepage, tips, single tip)
 *
 * Total: 18 audits
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const execAsync = promisify(exec)
const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

const VIEWPORTS = {
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 667,
    mobile: true,
    deviceScaleFactor: 2,
    preset: 'perf',
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    mobile: false,
    deviceScaleFactor: 2,
    preset: 'desktop',
  },
  desktop: {
    name: 'Desktop',
    width: 1920,
    height: 1080,
    mobile: false,
    deviceScaleFactor: 1,
    preset: 'desktop',
  },
}

const PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'Tips', path: '/tips' },
  { name: 'Single Tip', path: '/tips/12-one-liners-ab-test-tonight' },
]

const THEMES = ['light', 'dark']
const BASE_URL = 'http://localhost:3000'
const RESULTS_DIR = join(projectRoot, '.lighthouse-results')

// Ensure results directory exists
if (!existsSync(RESULTS_DIR)) {
  await mkdir(RESULTS_DIR, { recursive: true })
}

async function runLighthouse(url, viewport, theme, outputPath) {
  const viewportConfig = VIEWPORTS[viewport]

  // Create a temporary Lighthouse config
  const config = {
    extends: 'lighthouse:default',
    settings: {
      formFactor: viewportConfig.mobile ? 'mobile' : 'desktop',
      throttling: viewportConfig.mobile
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
      screenEmulation: {
        mobile: viewportConfig.mobile,
        width: viewportConfig.width,
        height: viewportConfig.height,
        deviceScaleFactor: viewportConfig.deviceScaleFactor,
        disabled: false,
      },
      emulatedUserAgent: viewportConfig.mobile
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
        : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    },
  }

  const configPath = join(RESULTS_DIR, `temp-config-${theme}-${viewport}.json`)
  await writeFile(configPath, JSON.stringify(config, null, 2))

  // Build the command
  const chromeFlags = ['--headless=new', '--no-sandbox', '--disable-gpu'].join(' ')

  let command = `npx lighthouse "${url}" \\
    --output=json \\
    --output-path="${outputPath}" \\
    --chrome-flags="${chromeFlags}" \\
    --config-path="${configPath}" \\
    --quiet`

  console.log(`\n🔍 Running: ${theme} theme - ${viewport} - ${url}`)

  try {
    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 1024 * 1024 * 10,
      timeout: 180000, // 3 minutes
      cwd: projectRoot,
    })

    if (stderr && !stderr.includes('ChromeLauncher') && !stderr.includes('Lighthouse')) {
      console.warn(`⚠️  Warning: ${stderr}`)
    }

    // Read the results
    const results = JSON.parse(await readFile(outputPath, 'utf-8'))

    // Clean up temp config
    // await unlink(configPath).catch(() => {});

    return results
  } catch (error) {
    console.error(`❌ Error running Lighthouse for ${url} (${theme}, ${viewport}):`, error.message)
    throw error
  }
}

function parseResults(lighthouseResults, theme, viewport, pageName, url) {
  const categories = lighthouseResults.categories
  const audits = lighthouseResults.audits

  return {
    theme,
    viewport,
    page: pageName,
    url,
    scores: {
      performance: Math.round((categories.performance?.score || 0) * 100),
      accessibility: Math.round((categories.accessibility?.score || 0) * 100),
      'best-practices': Math.round((categories['best-practices']?.score || 0) * 100),
      seo: Math.round((categories.seo?.score || 0) * 100),
    },
    metrics: {
      fcp: audits['first-contentful-paint']?.numericValue,
      lcp: audits['largest-contentful-paint']?.numericValue,
      tbt: audits['total-blocking-time']?.numericValue,
      cls: audits['cumulative-layout-shift']?.numericValue,
      si: audits['speed-index']?.numericValue,
    },
    issues: Object.values(audits)
      .filter((audit) => audit.score !== null && audit.score < 1 && audit.title)
      .map((audit) => ({
        title: audit.title,
        description: audit.description,
        score: audit.score,
      })),
  }
}

function formatTime(ms) {
  if (!ms) return 'N/A'
  return `${(ms / 1000).toFixed(2)}s`
}

function formatMs(ms) {
  if (!ms) return 'N/A'
  return `${Math.round(ms)}ms`
}

function getScoreIcon(score, category) {
  if (category === 'performance') {
    return score >= 95 ? '✅' : score >= 90 ? '⚠️ ' : '❌'
  }
  if (category === 'accessibility' || category === 'seo') {
    return score >= 100 ? '✅' : score >= 95 ? '⚠️ ' : '❌'
  }
  if (category === 'best-practices') {
    return score >= 95 ? '✅' : score >= 90 ? '⚠️ ' : '❌'
  }
  return score >= 90 ? '✅' : score >= 80 ? '⚠️ ' : '❌'
}

function generateReport(results) {
  let report = '\n'
  report += '═══════════════════════════════════════════════════════════════════════\n'
  report += '                 LIGHTHOUSE THEME AUDIT RESULTS                        \n'
  report += '═══════════════════════════════════════════════════════════════════════\n\n'
  report += `Generated: ${new Date().toISOString()}\n\n`

  // Group by viewport
  const byViewport = results.reduce((acc, result) => {
    if (!acc[result.viewport]) acc[result.viewport] = []
    acc[result.viewport].push(result)
    return acc
  }, {})

  Object.entries(byViewport).forEach(([viewport, viewportResults]) => {
    report += `\n╔═══════════════════════════════════════════════════════════════════╗\n`
    report += `║  ${viewport.toUpperCase().padEnd(64)} ║\n`
    report += `╚═══════════════════════════════════════════════════════════════════╝\n\n`

    viewportResults.forEach((result) => {
      const themeIcon = result.theme === 'light' ? '☀️ ' : '🌙'
      report += `📄 ${result.page} - ${themeIcon} ${result.theme.charAt(0).toUpperCase() + result.theme.slice(1)} Theme\n`
      report += `   URL: ${result.url}\n\n`

      report += `   Scores:\n`
      report += `   ${getScoreIcon(result.scores.performance, 'performance')} Performance:     ${result.scores.performance}/100\n`
      report += `   ${getScoreIcon(result.scores.accessibility, 'accessibility')} Accessibility:   ${result.scores.accessibility}/100\n`
      report += `   ${getScoreIcon(result.scores['best-practices'], 'best-practices')} Best Practices:  ${result.scores['best-practices']}/100\n`
      report += `   ${getScoreIcon(result.scores.seo, 'seo')} SEO:             ${result.scores.seo}/100\n\n`

      report += `   Core Web Vitals:\n`
      report += `   • FCP: ${formatTime(result.metrics.fcp)}\n`
      report += `   • LCP: ${formatTime(result.metrics.lcp)}\n`
      report += `   • TBT: ${formatMs(result.metrics.tbt)}\n`
      report += `   • CLS: ${result.metrics.cls ? result.metrics.cls.toFixed(3) : 'N/A'}\n`
      report += `   • SI:  ${formatTime(result.metrics.si)}\n\n`

      if (result.issues && result.issues.length > 0) {
        report += `   Issues (${result.issues.length}):\n`
        result.issues.slice(0, 5).forEach((issue) => {
          report += `   • ${issue.title}\n`
        })
        if (result.issues.length > 5) {
          report += `   • ... and ${result.issues.length - 5} more\n`
        }
        report += '\n'
      }

      report += `   ─────────────────────────────────────────────────────────────────\n\n`
    })
  })

  // Theme Comparison Summary
  report += '\n╔═══════════════════════════════════════════════════════════════════╗\n'
  report += '║  THEME COMPARISON SUMMARY                                         ║\n'
  report += '╚═══════════════════════════════════════════════════════════════════╝\n\n'

  PAGES.forEach((page) => {
    report += `📄 ${page.name}\n`
    Object.keys(VIEWPORTS).forEach((viewport) => {
      const lightResult = results.find(
        (r) => r.page === page.name && r.viewport === viewport && r.theme === 'light',
      )
      const darkResult = results.find(
        (r) => r.page === page.name && r.viewport === viewport && r.theme === 'dark',
      )

      if (lightResult && darkResult) {
        report += `\n  ${viewport.charAt(0).toUpperCase() + viewport.slice(1)}:\n`

        const categories = ['performance', 'accessibility', 'best-practices', 'seo']
        categories.forEach((category) => {
          const lightScore = lightResult.scores[category]
          const darkScore = darkResult.scores[category]
          const delta = darkScore - lightScore
          const deltaStr = delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : '±0'
          const icon = Math.abs(delta) <= 2 ? '✅' : '⚠️ '

          report += `    ${icon} ${category.padEnd(20)}: ☀️  ${lightScore}  |  🌙 ${darkScore}  (${deltaStr})\n`
        })
      }
    })
    report += '\n'
  })

  return report
}

async function main() {
  console.log('\n🚀 Starting Lighthouse Theme Audit...\n')
  console.log(
    `Testing ${THEMES.length} themes × ${Object.keys(VIEWPORTS).length} viewports × ${PAGES.length} pages = ${
      THEMES.length * Object.keys(VIEWPORTS).length * PAGES.length
    } audits\n`,
  )

  // Check if server is running
  try {
    const response = await fetch(BASE_URL)
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`)
    }
    console.log('✅ Server is running at', BASE_URL)
  } catch (error) {
    console.error('❌ Server is not running at', BASE_URL)
    console.error('Please run `pnpm dev` in another terminal')
    process.exit(1)
  }

  const allResults = []
  let completed = 0
  const total = THEMES.length * Object.keys(VIEWPORTS).length * PAGES.length

  for (const theme of THEMES) {
    for (const [viewportKey, viewportConfig] of Object.entries(VIEWPORTS)) {
      for (const page of PAGES) {
        const url = `${BASE_URL}${page.path}`
        const outputPath = join(
          RESULTS_DIR,
          `${theme}-${viewportKey}-${page.name.toLowerCase().replace(/\s+/g, '-')}.json`,
        )

        try {
          completed++
          console.log(`\n[${completed}/${total}]`)

          const lighthouseResults = await runLighthouse(url, viewportKey, theme, outputPath)
          const parsedResult = parseResults(lighthouseResults, theme, viewportKey, page.name, url)
          allResults.push(parsedResult)

          console.log(`✅ Completed: ${theme} - ${viewportConfig.name} - ${page.name}`)
          console.log(
            `   Scores: P=${parsedResult.scores.performance} A=${parsedResult.scores.accessibility} BP=${parsedResult.scores['best-practices']} SEO=${parsedResult.scores.seo}`,
          )
        } catch (error) {
          console.error(
            `❌ Failed: ${theme} - ${viewportConfig.name} - ${page.name}`,
            error.message,
          )
        }
      }
    }
  }

  // Generate and save report
  const report = generateReport(allResults)
  console.log(report)

  const reportPath = join(RESULTS_DIR, 'theme-audit-report.txt')
  await writeFile(reportPath, report)
  console.log(`\n📊 Full report saved to: ${reportPath}`)

  const jsonPath = join(RESULTS_DIR, 'theme-audit-results.json')
  await writeFile(jsonPath, JSON.stringify(allResults, null, 2))
  console.log(`📊 JSON results saved to: ${jsonPath}`)

  console.log('\n✅ Audit complete!\n')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
