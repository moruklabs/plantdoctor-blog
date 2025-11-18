import fs from 'fs'
import path from 'path'

describe('Blog References Validation', () => {
  const postsDir = path.join(process.cwd(), 'content/posts')

  // Get all MDX files in the posts directory
  const getPostFiles = () => {
    return fs
      .readdirSync(postsDir)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => path.join(postsDir, file))
  }

  describe('Reference Format Validation', () => {
    test('should not contain Jekyll/Kramdown attribute syntax in references', () => {
      const postFiles = getPostFiles()
      const malformedFiles: string[] = []

      postFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8')

        // Check for Jekyll/Kramdown attribute syntax in references section
        const referencesSection = content.match(/## References[\s\S]*$/m)
        if (referencesSection) {
          const hasMalformedAttributes = referencesSection[0].includes('{:target="_blank"')

          if (hasMalformedAttributes) {
            malformedFiles.push(path.basename(filePath))
          }
        }
      })

      if (malformedFiles.length > 0) {
        throw new Error(
          `Found malformed Jekyll/Kramdown attributes in references: ${malformedFiles.join(', ')}`,
        )
      }
    })

    test('should not contain JSX ExternalLink components in references', () => {
      const postFiles = getPostFiles()
      const jsxFiles: string[] = []

      postFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8')

        // Check for JSX ExternalLink components in references section
        const referencesSection = content.match(/## References[\s\S]*$/m)
        if (referencesSection) {
          const hasJSXComponents = referencesSection[0].includes('<ExternalLink')

          if (hasJSXComponents) {
            jsxFiles.push(path.basename(filePath))
          }
        }
      })

      if (jsxFiles.length > 0) {
        throw new Error(`Found JSX ExternalLink components in references: ${jsxFiles.join(', ')}`)
      }
    })

    test('should use clean Markdown footnote syntax', () => {
      const postFiles = getPostFiles()
      const invalidFiles: string[] = []

      postFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8')

        // Check references section format
        const referencesSection = content.match(/## References[\s\S]*$/m)
        if (referencesSection) {
          const referencesText = referencesSection[0]

          // Look for footnote definitions that don't follow the clean format
          const footnoteMatches = referencesText.match(/\[\^\d+\]:/g)
          if (footnoteMatches) {
            // Check if any footnotes have malformed syntax
            const hasMalformedSyntax =
              referencesText.includes('{:') ||
              referencesText.includes('<ExternalLink') ||
              referencesText.includes('target="_blank"')

            if (hasMalformedSyntax) {
              invalidFiles.push(path.basename(filePath))
            }
          }
        }
      })

      if (invalidFiles.length > 0) {
        throw new Error(`Found invalid footnote syntax in: ${invalidFiles.join(', ')}`)
      }
    })
  })

  describe('Sequential Numbering Validation', () => {
    test('should have sequential footnote numbering', () => {
      const postFiles = getPostFiles()
      const invalidFiles: string[] = []

      postFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8')

        const referencesSection = content.match(/## References[\s\S]*$/m)
        if (referencesSection) {
          const referencesText = referencesSection[0]

          // Extract all footnote numbers
          const footnoteNumbers = referencesText.match(/\[\^(\d+)\]:/g)
          if (footnoteNumbers && footnoteNumbers.length > 0) {
            const numbers = footnoteNumbers
              .map((match) => parseInt(match.match(/\[\^(\d+)\]:/)?.[1] || '0'))
              .sort((a, b) => a - b)

            // Check for sequential numbering starting from 1
            const expectedNumbers = Array.from({ length: numbers.length }, (_, i) => i + 1)
            const isSequential = numbers.every((num, index) => num === expectedNumbers[index])

            if (!isSequential) {
              invalidFiles.push(`${path.basename(filePath)} (numbers: ${numbers.join(', ')})`)
            }
          }
        }
      })

      if (invalidFiles.length > 0) {
        throw new Error(`Found non-sequential footnote numbering in: ${invalidFiles.join(', ')}`)
      }
    })

    test('should not have duplicate footnote numbers', () => {
      const postFiles = getPostFiles()
      const duplicateFiles: string[] = []

      postFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8')

        const referencesSection = content.match(/## References[\s\S]*$/m)
        if (referencesSection) {
          const referencesText = referencesSection[0]

          // Extract all footnote numbers
          const footnoteNumbers = referencesText.match(/\[\^(\d+)\]:/g)
          if (footnoteNumbers && footnoteNumbers.length > 0) {
            const numbers = footnoteNumbers.map((match) =>
              parseInt(match.match(/\[\^(\d+)\]:/)?.[1] || '0'),
            )

            // Check for duplicates
            const uniqueNumbers = new Set(numbers)
            if (uniqueNumbers.size !== numbers.length) {
              duplicateFiles.push(path.basename(filePath))
            }
          }
        }
      })

      if (duplicateFiles.length > 0) {
        expect(duplicateFiles).toEqual([])
      }
    })
  })

  describe('Citation Matching Validation', () => {
    test('should have matching in-text citations and footnote definitions', () => {
      const postFiles = getPostFiles()
      const mismatchedFiles: string[] = []

      postFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8')

        // Extract in-text citations
        const inTextCitations = content.match(/\[\^\d+\]/g) || []
        const citationNumbers = inTextCitations.map((citation) =>
          parseInt(citation.match(/\[\^(\d+)\]/)?.[1] || '0'),
        )

        // Extract footnote definitions
        const referencesSection = content.match(/## References[\s\S]*$/m)
        let footnoteNumbers: number[] = []

        if (referencesSection) {
          const footnoteDefinitions = referencesSection[0].match(/\[\^(\d+)\]:/g) || []
          footnoteNumbers = footnoteDefinitions.map((def) =>
            parseInt(def.match(/\[\^(\d+)\]:/)?.[1] || '0'),
          )
        }

        // Check for orphaned citations (citations without definitions)
        const orphanedCitations = citationNumbers.filter((num) => !footnoteNumbers.includes(num))

        // Check for unused footnotes (definitions without citations)
        const unusedFootnotes = footnoteNumbers.filter((num) => !citationNumbers.includes(num))

        if (orphanedCitations.length > 0 || unusedFootnotes.length > 0) {
          const issues = []
          if (orphanedCitations.length > 0) {
            issues.push(`orphaned citations: [^${orphanedCitations.join('], [^')}]`)
          }
          if (unusedFootnotes.length > 0) {
            issues.push(`unused footnotes: [^${unusedFootnotes.join('], [^')}]`)
          }
          mismatchedFiles.push(`${path.basename(filePath)} (${issues.join(', ')})`)
        }
      })

      if (mismatchedFiles.length > 0) {
        expect(mismatchedFiles).toEqual([])
      }
    })
  })

  describe('Reference Structure Validation', () => {
    test('should have properly formatted reference entries', () => {
      const postFiles = getPostFiles()
      const malformedFiles: string[] = []

      postFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8')

        const referencesSection = content.match(/## References[\s\S]*$/m)
        if (referencesSection) {
          const referencesText = referencesSection[0]

          // Check for proper footnote format: [^N]: Author. (Year). [Title](URL). Publication.
          const footnoteDefinitions = referencesText.match(/\[\^\d+\]:/g)
          if (footnoteDefinitions) {
            // Basic validation: should have author, year, title, URL, and publication
            const hasBasicStructure =
              referencesText.includes('(') && // Year in parentheses
              referencesText.includes('[') && // Title in brackets
              referencesText.includes('](') && // URL after title
              referencesText.includes(')') && // URL closing
              referencesText.includes('.') // Publication ending with period

            if (!hasBasicStructure) {
              malformedFiles.push(path.basename(filePath))
            }
          }
        }
      })

      if (malformedFiles.length > 0) {
        expect(malformedFiles).toEqual([])
      }
    })
  })

  describe('Reference Content Summary', () => {
    test('should provide summary of reference formatting across all posts', () => {
      const postFiles = getPostFiles()
      const referenceStats: Record<string, any> = {}

      postFiles.forEach((filePath) => {
        const filename = path.basename(filePath)
        const content = fs.readFileSync(filePath, 'utf-8')

        const referencesSection = content.match(/## References[\s\S]*$/m)
        const hasReferences = !!referencesSection

        if (hasReferences) {
          const referencesText = referencesSection![0]
          const footnoteCount = (referencesText.match(/\[\^\d+\]:/g) || []).length
          const citationCount = (content.match(/\[\^\d+\]/g) || []).length

          referenceStats[filename] = {
            hasReferences: true,
            footnoteCount,
            citationCount,
            hasMalformedAttributes: referencesText.includes('{:target="_blank"'),
            hasJSXComponents: referencesText.includes('<ExternalLink'),
          }
        } else {
          referenceStats[filename] = {
            hasReferences: false,
            footnoteCount: 0,
            citationCount: 0,
            hasMalformedAttributes: false,
            hasJSXComponents: false,
          }
        }
      })

      // Log summary for debugging
      //console.log('Reference formatting summary:')
      Object.entries(referenceStats).forEach(([_filename, _stats]) => {
        //console.log(
        // `${filename}: ${stats.hasReferences ? `${stats.footnoteCount} footnotes, ${stats.citationCount} citations` : 'no references'}`,
        // )
      })

      // This test always passes - it's just for reporting
      expect(referenceStats).toBeDefined()
    })
  })
})
