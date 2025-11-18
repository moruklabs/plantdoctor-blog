/**
 * Utility functions for exporting link data to YAML files during testing
 *
 * This module provides functionality to save internal and external links
 * discovered during testing to YAML files for further analysis or reporting.
 */
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

/**
 * External link interface - shared with test files
 */
export interface ExternalLink {
  url: string
  source: string
  lineNumber?: number
}

/**
 * Validation result interface - shared with test files
 */
export interface ValidationResult {
  url: string
  source: string
  success: boolean
  error?: string
  status?: number
  skipped?: boolean
  skipReason?: string
}

/**
 * Metadata for the exported YAML file
 */
export interface YamlMetadata {
  generatedAt: string
  testType: string
  totalSources: number
  totalLinks: number
  uniqueLinks: number
  uniqueDomains: number
  validated?: boolean
  successfulValidations?: number
  failedValidations?: number
  skippedValidations?: number
}

/**
 * Structure of the exported YAML data
 */
export interface YamlData {
  metadata: YamlMetadata
  linksBySource: Record<string, string[]>
  linksByDomain: Record<string, string[]>
  validationResults?: {
    successful: Array<{ url: string; status?: number }>
    failed: Array<{ url: string; source: string; status?: number; error?: string }>
    skipped: Array<{ url: string; reason?: string }>
  }
}

/**
 * Ensure the outputs directory exists
 */
function ensureOutputsDirectory(): string {
  const outputsDir = path.join(process.cwd(), 'outputs')
  if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true })
  }
  return outputsDir
}

/**
 * Export internal links to a YAML file
 *
 * @param links - Map of source pages to their internal links
 * @param validRoutes - Set of valid routes in the application
 * @param filename - Optional custom filename (default: 'internal-links.yaml')
 */
export function exportInternalLinksToYAML(
  links: Map<string, string[]>,
  validRoutes: Set<string>,
  filename: string = 'internal-links.yaml',
): string {
  const outputsDir = ensureOutputsDirectory()
  const outputPath = path.join(outputsDir, filename)

  // Convert Map to plain object for YAML serialization
  const allLinks: string[] = []
  const linksBySource: Record<string, string[]> = {}

  links.forEach((linkList, source) => {
    linksBySource[source] = linkList
    allLinks.push(...linkList)
  })

  // Get unique links and sort them
  const uniqueLinks = Array.from(new Set(allLinks)).sort()

  // Categorize links as valid or broken
  const validLinks: string[] = []
  const brokenLinks: string[] = []

  uniqueLinks.forEach((link) => {
    if (validRoutes.has(link)) {
      validLinks.push(link)
    } else {
      brokenLinks.push(link)
    }
  })

  const yamlData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      testType: 'internal-links-validation',
      totalSources: links.size,
      totalLinks: allLinks.length,
      uniqueLinks: uniqueLinks.length,
      validLinks: validLinks.length,
      brokenLinks: brokenLinks.length,
    },
    summary: {
      validLinks,
      brokenLinks,
    },
    linksBySource,
  }

  const yamlString = yaml.dump(yamlData, {
    indent: 2,
    lineWidth: -1, // Don't wrap lines
    noRefs: true,
  })

  fs.writeFileSync(outputPath, yamlString, 'utf8')
  return outputPath
}

/**
 * Export external links to a YAML file
 *
 * @param links - Array of external links found
 * @param validationResults - Array of validation results for those links
 * @param filename - Optional custom filename (default: 'external-links.yaml')
 */
export function exportExternalLinksToYAML(
  links: ExternalLink[],
  validationResults?: ValidationResult[],
  filename: string = 'external-links.yaml',
): string {
  const outputsDir = ensureOutputsDirectory()
  const outputPath = path.join(outputsDir, filename)

  // Group links by source
  const linksBySource: Record<string, string[]> = {}
  links.forEach((link) => {
    if (!linksBySource[link.source]) {
      linksBySource[link.source] = []
    }
    linksBySource[link.source].push(link.url)
  })

  // Get unique links and categorize them by domain
  const uniqueLinks = Array.from(new Set(links.map((link) => link.url))).sort()

  // Group by domain
  const linksByDomain: Record<string, string[]> = {}
  uniqueLinks.forEach((url) => {
    try {
      const domain = new URL(url).hostname
      if (!linksByDomain[domain]) {
        linksByDomain[domain] = []
      }
      linksByDomain[domain].push(url)
    } catch {
      // For non-HTTP links like mailto:
      const protocol = url.split(':')[0]
      const key = `${protocol}://`
      if (!linksByDomain[key]) {
        linksByDomain[key] = []
      }
      linksByDomain[key].push(url)
    }
  })

  const yamlData: YamlData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      testType: 'external-links-validation',
      totalSources: Object.keys(linksBySource).length,
      totalLinks: links.length,
      uniqueLinks: uniqueLinks.length,
      uniqueDomains: Object.keys(linksByDomain).length,
    },
    linksBySource,
    linksByDomain,
  }

  // Add validation results if provided
  if (validationResults && validationResults.length > 0) {
    const successful = validationResults.filter((r) => r.success && !r.skipped)
    const failed = validationResults.filter((r) => !r.success && !r.skipped)
    const skipped = validationResults.filter((r) => r.skipped)

    yamlData.metadata.validated = true
    yamlData.metadata.successfulValidations = successful.length
    yamlData.metadata.failedValidations = failed.length
    yamlData.metadata.skippedValidations = skipped.length

    yamlData.validationResults = {
      successful: successful.map((r) => ({
        url: r.url,
        status: r.status,
      })),
      failed: failed.map((r) => ({
        url: r.url,
        source: r.source,
        status: r.status,
        error: r.error,
      })),
      skipped: skipped.map((r) => ({
        url: r.url,
        reason: r.skipReason,
      })),
    }
  } else {
    yamlData.metadata.validated = false
  }

  const yamlString = yaml.dump(yamlData, {
    indent: 2,
    lineWidth: -1, // Don't wrap lines
    noRefs: true,
  })

  fs.writeFileSync(outputPath, yamlString, 'utf8')
  return outputPath
}
