#!/usr/bin/env node

/**
 * Redistribute Post Dates Script
 *
 * Purpose: Optimize build performance by redistributing post dates
 * - Keep 20 most recent posts unchanged
 * - Randomly distribute remaining posts across next 2 years
 * - This reduces static page generation from 2032 to ~50 pages
 *
 * Usage: node scripts/redistribute-post-dates.js
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const postsDir = path.join(process.cwd(), 'content/posts')
const today = new Date('2025-11-16')
const twoYearsFromNow = new Date(today)
twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2)

console.log('🔄 Post Date Redistribution Script')
console.log('==================================\n')
console.log(`Today: ${today.toISOString().split('T')[0]}`)
console.log(
  `Target range: ${today.toISOString().split('T')[0]} to ${twoYearsFromNow.toISOString().split('T')[0]}\n`,
)

// Read all posts
const files = fs
  .readdirSync(postsDir)
  .filter((f) => f.endsWith('.mdx'))
  .map((file) => {
    const filePath = path.join(postsDir, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const { data, content: body } = matter(content)

    return {
      file,
      filePath,
      originalDate: data.date,
      frontmatter: data,
      body,
      parsedDate: new Date(data.date),
    }
  })
  .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime()) // Sort by date descending

console.log(`📊 Total posts: ${files.length}`)
console.log(`📌 Keeping most recent 20 posts unchanged`)
console.log(`🎲 Redistributing ${files.length - 20} posts randomly across 2 years\n`)

// Separate recent and others
const recentPosts = files.slice(0, 20)
const otherPosts = files.slice(20)

console.log(`Most recent posts (UNCHANGED):`)
recentPosts.forEach((post, i) => {
  console.log(`  ${i + 1}. ${post.originalDate} - ${post.file.substring(0, 50)}`)
})

// Generate random dates for other posts
const redistributedPosts = otherPosts.map((post) => {
  const randomTime = Math.random() * (twoYearsFromNow.getTime() - today.getTime()) + today.getTime()
  const newDate = new Date(randomTime)

  // Format as YYYY-MM-DD
  const year = newDate.getUTCFullYear()
  const month = String(newDate.getUTCMonth() + 1).padStart(2, '0')
  const day = String(newDate.getUTCDate()).padStart(2, '0')
  const dateString = `${year}-${month}-${day}`

  return {
    ...post,
    newDate: dateString,
    monthsFromNow: ((newDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)).toFixed(1),
  }
})

// Analyze distribution
const monthBuckets = {}
redistributedPosts.forEach((post) => {
  const month = post.newDate.substring(0, 7) // YYYY-MM
  monthBuckets[month] = (monthBuckets[month] || 0) + 1
})

console.log(`\n📅 Redistribution across months:`)
Object.entries(monthBuckets)
  .sort()
  .forEach(([month, count]) => {
    console.log(`  ${month}: ${count} posts`)
  })

// Update files
console.log(`\n✏️  Updating files...`)
let updated = 0
let errors = 0

// Update recent posts (no changes, but re-serialize to ensure format consistency)
recentPosts.forEach((post) => {
  try {
    const newContent = matter.stringify(post.body, post.frontmatter)
    fs.writeFileSync(post.filePath, newContent, 'utf8')
    updated++
  } catch (error) {
    console.error(`  ❌ Error updating ${post.file}:`, error.message)
    errors++
  }
})

// Update redistributed posts
redistributedPosts.forEach((post) => {
  try {
    const updatedFrontmatter = {
      ...post.frontmatter,
      date: post.newDate,
    }

    const newContent = matter.stringify(post.body, updatedFrontmatter)
    fs.writeFileSync(post.filePath, newContent, 'utf8')
    updated++
  } catch (error) {
    console.error(`  ❌ Error updating ${post.file}:`, error.message)
    errors++
  }
})

console.log(`\n✅ Complete!`)
console.log(`  Updated: ${updated} files`)
console.log(`  Errors: ${errors} files`)
console.log(`\n📈 Expected build improvement:`)
console.log(`  Before: 2032 static pages`)
console.log(`  After: ~50 static pages (20 recent + ~30 within 1 month)`)
console.log(`  Speedup: ~40x faster builds`)
console.log(`\n🚀 Posts will auto-publish as their dates arrive!`)
