#!/usr/bin/env tsx
/**
 * Configuration Validation Script
 *
 * Validates blog configuration against Zod schema.
 * Run this before deploying to catch configuration errors early.
 *
 * Usage: pnpm validate:config
 */

import { ZodError } from 'zod'
import { validateConfig } from '../config/schema'
import { blogConfig } from '../config/blog.config'
import chalk from 'chalk'

console.log(chalk.blue('🔍 Validating blog configuration...\n'))

try {
  // Validate configuration
  const validConfig = validateConfig(blogConfig)

  // Success!
  console.log(chalk.green('✅ Configuration is valid!\n'))

  // Show summary
  console.log(chalk.bold('Configuration Summary:'))
  console.log(chalk.gray('─'.repeat(50)))
  console.log(`${chalk.cyan('Site Name:')} ${validConfig.site.name}`)
  console.log(`${chalk.cyan('Site URL:')} ${validConfig.site.url}`)
  console.log(`${chalk.cyan('Author:')} ${validConfig.author.name}`)
  console.log(`${chalk.cyan('Email:')} ${validConfig.site.email}`)
  console.log(`${chalk.cyan('Theme:')} ${validConfig.theme.default}`)
  console.log(chalk.gray('─'.repeat(50)))

  // Check for content types
  console.log(`\n${chalk.bold('Content Types:')}`)
  if (validConfig.content.types.posts.enabled) {
    console.log(chalk.green(`✓ Posts enabled at ${validConfig.content.types.posts.path}`))
  } else {
    console.log(chalk.gray(`✗ Posts disabled`))
  }
  if (validConfig.content.types.guides.enabled) {
    console.log(chalk.green(`✓ Guides enabled at ${validConfig.content.types.guides.path}`))
  } else {
    console.log(chalk.gray(`✗ Guides disabled`))
  }

  // Check navigation
  console.log(`\n${chalk.bold('Navigation:')}`)
  console.log(`${chalk.cyan('Header links:')} ${validConfig.navigation.header.length}`)
  console.log(`${chalk.cyan('Footer sections:')} ${validConfig.navigation.footer.sections.length}`)

  // Check SEO
  console.log(`\n${chalk.bold('SEO:')}`)
  console.log(`${chalk.cyan('Keywords:')} ${validConfig.seo.keywords.length}`)
  if (validConfig.seo.ogImage) {
    console.log(chalk.green(`✓ OG image configured`))
  } else {
    console.log(chalk.yellow(`⚠ OG image not configured`))
  }

  console.log(chalk.green(`\n✅ All checks passed! Configuration is ready for deployment.\n`))
  process.exit(0)
} catch (error) {
  console.log(chalk.red('❌ Configuration validation failed!\n'))

  if (error instanceof Error) {
    console.log(chalk.red('Error:'))
    console.log(chalk.gray(error.message))

    // If it's a Zod error, show detailed validation issues
    if (error instanceof ZodError) {
      console.log(chalk.red('\nValidation Issues:'))
      error.issues.forEach((issue, index) => {
        console.log(chalk.gray(`\n${index + 1}. ${issue.path.join('.')}`))
        console.log(chalk.red(`   ${issue.message}`))
      })
    }
  } else {
    console.log(chalk.red(String(error)))
  }

  console.log(chalk.yellow('\n💡 Tip: Check config/blog.config.ts and fix the issues above.\n'))
  process.exit(1)
}
