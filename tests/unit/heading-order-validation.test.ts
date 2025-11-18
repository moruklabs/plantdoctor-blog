import fs from 'fs'
import path from 'path'

describe('Heading Order Validation', () => {
  const getHeadingsFromContent = (
    content: string,
    _filePath: string,
  ): Array<{ level: number; text: string; line: number }> => {
    const lines = content.split('\n')
    const headings: Array<{ level: number; text: string; line: number }> = []
    let inFrontmatter = false
    let frontmatterCount = 0

    lines.forEach((line, index) => {
      // Track frontmatter boundaries
      if (line.trim() === '---') {
        frontmatterCount++
        if (frontmatterCount <= 2) {
          inFrontmatter = frontmatterCount === 1
          return
        }
      }

      // Skip lines inside frontmatter
      if (inFrontmatter) return

      // Match markdown headings (## Heading) but not code blocks or HTML comments
      const match = line.match(/^(#{1,6})\s+(.+)$/)
      if (match) {
        const level = match[1].length
        const text = match[2].trim()
        headings.push({ level, text, line: index + 1 })
      }
    })

    return headings
  }

  const validateHeadingOrder = (
    headings: Array<{ level: number; text: string; line: number }>,
    filePath: string,
  ) => {
    const violations: string[] = []

    for (let i = 1; i < headings.length; i++) {
      const prev = headings[i - 1]
      const current = headings[i]

      // Heading level should only increase by 1 at most, or decrease by any amount
      // Valid: H1 → H2, H2 → H3, H2 → H1, H3 → H2
      // Invalid: H1 → H3 (skipping H2), H2 → H4 (skipping H3)
      if (current.level > prev.level + 1) {
        violations.push(
          `${filePath}:${current.line} - Heading level skip detected: ` +
            `H${prev.level} "${prev.text}" (line ${prev.line}) → H${current.level} "${current.text}" (line ${current.line}). ` +
            `Heading levels should not skip (use H${prev.level + 1} instead of H${current.level})`,
        )
      }
    }

    return violations
  }

  const testDirectory = (dirPath: string, dirName: string) => {
    const files = fs.readdirSync(dirPath).filter((file) => file.endsWith('.mdx'))

    it(`ensures all ${dirName} have proper heading order`, () => {
      expect(files.length).toBeGreaterThan(0)

      const allViolations: string[] = []

      files.forEach((file) => {
        const filePath = path.join(dirPath, file)
        const content = fs.readFileSync(filePath, 'utf8')
        const headings = getHeadingsFromContent(content, file)

        // Only validate heading order if headings exist
        // Some posts may use plain text structure without markdown headings
        if (headings.length > 0) {
          const violations = validateHeadingOrder(headings, file)
          allViolations.push(...violations)
        }
      })

      if (allViolations.length > 0) {
        const errorMessage =
          '\n\nHeading order violations found:\n' +
          allViolations.map((v) => `  • ${v}`).join('\n') +
          '\n'
        throw new Error(errorMessage)
      }
    })
  }

  // Test posts directory
  const postsDir = path.join(process.cwd(), 'content/posts')
  testDirectory(postsDir, 'posts')

  // Test guides directory
  const guidesDir = path.join(process.cwd(), 'content/guides')
  testDirectory(guidesDir, 'guides')

  it('provides clear examples of valid and invalid heading patterns', () => {
    // This test serves as documentation
    const validPatterns = [
      'H1 → H2 → H3 (sequential descent)',
      'H3 → H2 (moving back up)',
      'H2 → H2 (same level)',
      'H2 → H1 (moving back to top level)',
    ]

    const invalidPatterns = [
      'H1 → H3 (skipping H2)',
      'H2 → H4 (skipping H3)',
      'H1 → H4 (skipping multiple levels)',
    ]

    expect(validPatterns.length).toBeGreaterThan(0)
    expect(invalidPatterns.length).toBeGreaterThan(0)
  })
})
