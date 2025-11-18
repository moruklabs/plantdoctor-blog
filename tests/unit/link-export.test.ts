/**
 * Test for link export utility functions
 *
 * This test suite verifies that the YAML export functionality works correctly
 * for both internal and external links.
 */
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import { exportInternalLinksToYAML, exportExternalLinksToYAML } from '@/lib/test-utils/link-export'

describe('Link Export Utility', () => {
  const outputsDir = path.join(process.cwd(), 'outputs')

  afterEach(() => {
    // Clean up test YAML files
    const testFiles = ['test-internal.yaml', 'test-external.yaml']
    testFiles.forEach((file) => {
      const filePath = path.join(outputsDir, file)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    })
  })

  describe('exportInternalLinksToYAML', () => {
    test('should create YAML file with correct structure', () => {
      const links = new Map<string, string[]>([
        ['/blog/test-post', ['/about', '/contact']],
        ['/guides/test-guide', ['/blog', '/guides']],
      ])
      const validRoutes = new Set<string>(['/', '/about', '/contact', '/blog', '/guides'])

      const outputPath = exportInternalLinksToYAML(links, validRoutes, 'test-internal.yaml')

      expect(fs.existsSync(outputPath)).toBe(true)

      const content = fs.readFileSync(outputPath, 'utf8')
      const data = yaml.load(content) as any

      expect(data.metadata).toBeDefined()
      expect(data.metadata.testType).toBe('internal-links-validation')
      expect(data.metadata.totalSources).toBe(2)
      expect(data.metadata.uniqueLinks).toBe(4)
      expect(data.summary).toBeDefined()
      expect(data.summary.validLinks).toEqual(expect.arrayContaining(['/about', '/contact']))
      expect(data.linksBySource).toBeDefined()
      expect(data.linksBySource['/blog/test-post']).toEqual(['/about', '/contact'])
    })

    test('should identify broken links correctly', () => {
      const links = new Map<string, string[]>([
        ['/blog/test-post', ['/broken-link', '/valid-link']],
      ])
      const validRoutes = new Set<string>(['/valid-link'])

      const outputPath = exportInternalLinksToYAML(links, validRoutes, 'test-internal.yaml')

      const content = fs.readFileSync(outputPath, 'utf8')
      const data = yaml.load(content) as any

      expect(data.summary.brokenLinks).toContain('/broken-link')
      expect(data.summary.validLinks).toContain('/valid-link')
      expect(data.metadata.brokenLinks).toBe(1)
      expect(data.metadata.validLinks).toBe(1)
    })
  })

  describe('exportExternalLinksToYAML', () => {
    test('should create YAML file with correct structure', () => {
      const links = [
        { url: 'https://example.com', source: '/blog/test-post' },
        { url: 'https://test.org', source: '/blog/test-post' },
        { url: 'mailto:test@example.com', source: '/guides/test-guide' },
      ]

      const outputPath = exportExternalLinksToYAML(links, undefined, 'test-external.yaml')

      expect(fs.existsSync(outputPath)).toBe(true)

      const content = fs.readFileSync(outputPath, 'utf8')
      const data = yaml.load(content) as any

      expect(data.metadata).toBeDefined()
      expect(data.metadata.testType).toBe('external-links-validation')
      expect(data.metadata.totalLinks).toBe(3)
      expect(data.metadata.uniqueLinks).toBe(3)
      expect(data.metadata.validated).toBe(false)
      expect(data.linksBySource).toBeDefined()
      expect(data.linksByDomain).toBeDefined()
    })

    test('should include validation results when provided', () => {
      const links = [
        { url: 'https://example.com', source: '/blog/test-post' },
        { url: 'https://test.org', source: '/blog/test-post' },
      ]

      const validationResults = [
        { url: 'https://example.com', source: '/blog/test-post', success: true, status: 200 },
        {
          url: 'https://test.org',
          source: '/blog/test-post',
          success: false,
          status: 404,
          error: 'Not Found',
        },
      ]

      const outputPath = exportExternalLinksToYAML(links, validationResults, 'test-external.yaml')

      const content = fs.readFileSync(outputPath, 'utf8')
      const data = yaml.load(content) as any

      expect(data.metadata.validated).toBe(true)
      expect(data.metadata.successfulValidations).toBe(1)
      expect(data.metadata.failedValidations).toBe(1)
      expect(data.validationResults).toBeDefined()
      expect(data.validationResults.successful).toHaveLength(1)
      expect(data.validationResults.failed).toHaveLength(1)
      expect(data.validationResults.failed[0].error).toBe('Not Found')
    })

    test('should group links by domain correctly', () => {
      const links = [
        { url: 'https://example.com/page1', source: '/blog/test-post' },
        { url: 'https://example.com/page2', source: '/blog/test-post' },
        { url: 'https://test.org/page1', source: '/guides/test-guide' },
      ]

      const outputPath = exportExternalLinksToYAML(links, undefined, 'test-external.yaml')

      const content = fs.readFileSync(outputPath, 'utf8')
      const data = yaml.load(content) as any

      expect(data.linksByDomain['example.com']).toHaveLength(2)
      expect(data.linksByDomain['test.org']).toHaveLength(1)
    })
  })
})
