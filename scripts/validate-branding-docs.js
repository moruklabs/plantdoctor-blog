#!/usr/bin/env node

/**
 * Branding Variables Validation Script
 *
 * This script validates that the hard-coded branding variables documented in
 * HARD_CODED_BRANDING_VARIABLES.md actually exist in the codebase.
 *
 * Usage: node scripts/validate-branding-docs.js
 */

const fs = require('fs')
const path = require('path')

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

// Test cases - key branding variables to validate
const validationTests = [
  {
    name: 'Brand name in config',
    file: 'lib/config.ts',
    pattern: /name:\s*('[[REPLACE_ME_APP_NAME]]'|"[[REPLACE_ME_APP_NAME]]")/,
  },
  {
    name: 'Tagline in config',
    file: 'lib/config.ts',
    pattern: /tagline:\s*('#1 AI Dating Assistant'|"#1 AI Dating Assistant")/,
  },
  {
    name: 'Domain in config',
    file: 'lib/config.ts',
    pattern: /domain:\s*('news.plantdoctor.app\.ai'|"news.plantdoctor.app\.ai")/,
  },
  {
    name: 'Contact email in config',
    file: 'lib/config.ts',
    pattern: /email:\s*('hey@news.plantdoctor.app\.ai'|"hey@news.plantdoctor.app\.ai")/,
  },
  {
    name: 'Primary color (orange)',
    file: 'styles/globals.css',
    pattern: /--primary:\s*20\s+91%\s+55%/,
  },
  {
    name: 'Accent color (pink)',
    file: 'styles/globals.css',
    pattern: /--accent:\s*345\s+82%\s+61%/,
  },
  {
    name: 'Theme color meta tag',
    file: 'app/layout.tsx',
    pattern: /#0f172a/,
  },
  {
    name: 'GTM container ID',
    file: 'app/layout.tsx',
    pattern: /GT-55BRJB2Q/,
  },
  {
    name: 'Instagram social link',
    file: 'lib/config.ts',
    pattern: /instagram:\s*(['"])https:\/\/instagram\.news.plantdoctor.app\.ai\1/,
  },
  {
    name: 'Company name (Moruk LLC)',
    file: 'app/privacy-policy/page.tsx',
    pattern: /Moruk LLC/,
  },
  {
    name: 'Inter font import',
    file: 'styles/globals.css',
    pattern: /Inter/,
  },
  {
    name: 'Playfair Display font import',
    file: 'styles/globals.css',
    pattern: /Playfair Display/,
  },
]

/**
 * Validates a single file against a pattern
 * @param {Object} test - Test configuration object
 * @returns {Object} - Validation result with status and error message
 */
function validateFile(test) {
  const filePath = path.join(__dirname, '..', test.file)

  if (!fs.existsSync(filePath)) {
    return {
      success: false,
      error: `File not found: ${test.file}`,
    }
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return checkPattern(content, test.pattern, test.file, test.name)
  } catch (error) {
    return {
      success: false,
      error: `Error reading ${test.file}: ${error.message}`,
    }
  }
}

/**
 * Checks if content matches the given pattern
 * @param {string} content - File content to check
 * @param {RegExp} pattern - Pattern to match
 * @param {string} file - File name for error reporting
 * @param {string} name - Test name for error reporting
 * @returns {Object} - Validation result
 */
function checkPattern(content, pattern, file, name) {
  if (pattern.test(content)) {
    return { success: true }
  }
  return {
    success: false,
    error: `Pattern not found in ${file}: ${name}`,
  }
}

function validateBrandingVariables() {
  console.log(`${colors.cyan}🔍 Validating Branding Variables Documentation...${colors.reset}\n`)

  let passed = 0
  let failed = 0
  const errors = []

  for (const test of validationTests) {
    const result = validateFile(test)

    if (result.success) {
      passed++
      console.log(`${colors.green}✓${colors.reset} ${test.name}`)
    } else {
      failed++
      errors.push(`❌ ${result.error}`)
      console.log(`${colors.red}✗${colors.reset} ${test.name} - ${result.error}`)
    }
  }

  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`)
  console.log(`${colors.cyan}Results:${colors.reset}`)
  console.log(`  ${colors.green}Passed:${colors.reset} ${passed}/${validationTests.length}`)
  console.log(`  ${colors.red}Failed:${colors.reset} ${failed}/${validationTests.length}`)

  if (errors.length > 0) {
    console.log(`\n${colors.red}Errors:${colors.reset}`)
    errors.forEach((error) => console.log(`  ${error}`))
  }

  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`)

  if (failed === 0) {
    console.log(`${colors.green}✅ All branding variables validated successfully!${colors.reset}\n`)
    return true
  } else {
    console.log(
      `${colors.yellow}⚠️  Some branding variables could not be validated.${colors.reset}`,
    )
    console.log(
      `${colors.yellow}   Please review the documentation and update as needed.${colors.reset}\n`,
    )
    return false
  }
}

// Run validation
const success = validateBrandingVariables()
process.exit(success ? 0 : 1)
