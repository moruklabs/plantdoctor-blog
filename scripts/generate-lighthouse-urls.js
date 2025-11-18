/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

/**
 * Generate Lighthouse CI URLs based on the actual built files in the out directory
 * This prevents 404 errors by only testing URLs that actually exist
 */

// Configuration constants
const OUT_DIR = path.join(process.cwd(), 'out')
const BASE_URL = 'http://localhost'
const MAX_BLOG_POSTS = 5
const MAIN_PAGES = ['about', 'tips', 'contact']

function generateUrls() {
  const urls = []

  // Check if out directory exists
  if (!fs.existsSync(OUT_DIR)) {
    console.error('❌ Out directory does not exist. Run pnpm build first.')
    process.exit(1)
  }

  // Always add homepage
  urls.push(`${BASE_URL}/`)

  const isLocal = process.env.NODE_ENV !== 'production'
  if (!isLocal) {
    // Add main pages if they exist
    for (const page of MAIN_PAGES) {
      const pagePath = path.join(OUT_DIR, page)
      if (fs.existsSync(pagePath) && fs.statSync(pagePath).isDirectory()) {
        urls.push(`${BASE_URL}/${page}/`)
      }
    }
  }

  // Add blog posts
  const blogDir = path.join(OUT_DIR, 'tips')
  if (fs.existsSync(blogDir) && fs.statSync(blogDir).isDirectory()) {
    const blogPosts = fs.readdirSync(blogDir).filter((item) => {
      const itemPath = path.join(blogDir, item)
      return fs.statSync(itemPath).isDirectory() && fs.existsSync(path.join(itemPath, 'index.html'))
    })

    // Include up to MAX_BLOG_POSTS random blog posts for Lighthouse testing
    if (blogPosts.length > 0) {
      // Shuffle array and take up to MAX_BLOG_POSTS posts
      const shuffled = blogPosts.sort(() => Math.random() - 0.5)
      const selectedPosts = shuffled.slice(0, Math.min(MAX_BLOG_POSTS, blogPosts.length))

      selectedPosts.forEach((post) => {
        urls.push(`${BASE_URL}/tips/${post}/`)
      })
    }
  }

  return urls
}

function updateLighthouseConfig(urls) {
  const configPath = path.join(process.cwd(), 'lighthouse.ci.js')

  // Read current config
  const configContent = fs.readFileSync(configPath, 'utf8')

  // Generate new URL array string
  const urlsString = urls.map((url) => `        '${url}',`).join('\n')

  // Replace the URL array in the config
  const newConfig = configContent.replace(/url: \[[\s\S]*?\],/, `url: [\n${urlsString}\n      ],`)

  // Write updated config
  fs.writeFileSync(configPath, newConfig)

  console.log('✅ Updated lighthouse.ci.js with the following URLs:')
  urls.forEach((url) => console.log(`   ${url}`))
}

if (require.main === module) {
  const urls = generateUrls()
  updateLighthouseConfig(urls)
}

module.exports = { generateUrls, updateLighthouseConfig }
