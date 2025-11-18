#!/usr/bin/env node
/**
 * Aggregate MDX AI-likelihood scorer
 *
 * Usage:
 *  pnpm ai-score --file posts/your-post.mdx [--json] [--out outputs/ai-scores.json]
 *  pnpm ai-score --all [--json] [--out outputs/ai-scores.json]
 *  pnpm ai-score guides/your-guide.mdx
 */

const fs = require('fs')
const path = require('path')
const {
  scoreMdx,
} = require('../.ai/content-generation/ai-generated-content-detection/score-mdx-ai-likelihood.js')

function parseArgs(argv) {
  const args = { files: [] }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--all') args.all = true
    else if (a === '--json') args.json = true
    else if (a === '--out' || a === '-o') args.out = argv[++i]
    else if (a === '--file' || a === '-f') args.files.push(argv[++i])
    else if (!a.startsWith('--')) args.files.push(a)
  }
  return args
}

function collectMdxFiles(root) {
  const results = []
  function walk(p) {
    const stat = fs.statSync(p)
    if (stat.isDirectory()) {
      for (const e of fs.readdirSync(p)) walk(path.join(p, e))
    } else if (p.endsWith('.mdx')) {
      results.push(p)
    }
  }
  if (fs.existsSync(root)) walk(root)
  return results
}

function unique(arr) {
  return Array.from(new Set(arr))
}

async function main() {
  const args = parseArgs(process.argv)
  let files = []

  if (args.all || args.files.length === 0) {
    files = [
      ...collectMdxFiles(path.resolve(process.cwd(), 'content/posts')),
      ...collectMdxFiles(path.resolve(process.cwd(), 'content/guides')),
    ]
  } else {
    files = args.files.map((f) => path.resolve(process.cwd(), f))
  }
  files = unique(files).filter((p) => fs.existsSync(p))

  if (files.length === 0) {
    console.error('No MDX files found. Use --file <path.mdx> or --all.')
    process.exit(1)
  }

  const results = []
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8')
    const r = scoreMdx(src)
    results.push({ file: path.relative(process.cwd(), file), ...r })
  }

  // Optional write
  if (args.out) {
    const outPath = path.resolve(process.cwd(), args.out)
    const outDir = path.dirname(outPath)
    fs.mkdirSync(outDir, { recursive: true })
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2))
  }

  if (args.json) {
    console.log(JSON.stringify(results, null, 2))
  } else {
    // Pretty print table-ish
    const rows = results
      .sort((a, b) => b.score - a.score)
      .map((r) => `${r.score.toString().padStart(3)}  ${r.reliability.toFixed(2)}  ${r.file}`)
    console.log('Score Rel  File')
    console.log('----- ---- ------------------------------------------')
    for (const row of rows) console.log(row)
    const avg = results.reduce((a, b) => a + b.score, 0) / results.length
    console.log('\nAverage score:', Math.round(avg))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
