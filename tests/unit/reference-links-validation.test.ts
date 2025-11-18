import fs from 'fs'
import path from 'path'

describe('Reference Links Validation', () => {
  const postsDir = path.join(process.cwd(), 'content/posts')

  // Get all MDX files in the posts directory
  const getPostFiles = () => {
    return fs
      .readdirSync(postsDir)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => path.join(postsDir, file))
  }

  // Extract reference links from a post
  const extractReferenceLinks = (filePath: string) => {
    const content = fs.readFileSync(filePath, 'utf-8')
    const referencesSection = content.match(/## References[\s\S]*$/m)

    if (!referencesSection) {
      return []
    }

    const referencesText = referencesSection[0]
    const linkMatches = referencesText.match(/\[([^\]]+)\]\(<?([^>)]+)>?\)/g) || []

    return linkMatches.map((match) => {
      const [, text, url] = match.match(/\[([^\]]+)\]\(<?([^>)]+)>?\)/) || []
      return { text, url, file: path.basename(filePath) }
    })
  }

  // Check if a URL is accessible
  const checkUrl = async (
    url: string,
  ): Promise<{ url: string; status: number; accessible: boolean }> => {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Blog-Reference-Checker/1.0)',
        },
      })

      return {
        url,
        status: response.status,
        accessible: response.ok,
      }
    } catch (error) {
      return {
        url,
        status: 0,
        accessible: false,
      }
    }
  }

  describe('Reference Link Accessibility', () => {
    test('should validate all reference links are accessible', async () => {
      const postFiles = getPostFiles()
      const allReferenceLinks: Array<{ text: string; url: string; file: string }> = []

      // Extract all reference links from all posts
      postFiles.forEach((filePath) => {
        const links = extractReferenceLinks(filePath)
        allReferenceLinks.push(...links)
      })

      //console.log(`Found ${allReferenceLinks.length} reference links across all posts`)

      if (allReferenceLinks.length === 0) {
        //console.log('No reference links found to validate')
        return
      }

      // Check each reference link
      const results = await Promise.all(
        allReferenceLinks.map(async (link) => {
          const result = await checkUrl(link.url)
          return {
            ...link,
            ...result,
          }
        }),
      )

      // Log results
      //console.log('\n📊 Reference Link Validation Results:')
      results.forEach((_result) => {
        // const status = result.accessible ? '✅' : '❌'
        //console.log(`${status} ${result.file}: ${result.text} -> ${result.url} (${result.status})`)
      })

      // Check for failures
      const failedLinks = results.filter((result) => !result.accessible)

      if (failedLinks.length > 0) {
        //console.log(`\n❌ Found ${failedLinks.length} inaccessible reference links:`)
        failedLinks.forEach((_link) => {
          //console.log(`   - ${link.file}: ${link.url} (Status: ${link.status})`)
        })

        throw new Error(`Found ${failedLinks.length} inaccessible reference links`)
      } else {
        //console.log(`\n✅ All ${results.length} reference links are accessible!`)
      }
    }, 30000) // 30 second timeout for network requests
  })

  describe('Reference Link Analysis', () => {
    test('should provide detailed analysis of reference links', () => {
      const postFiles = getPostFiles()

      interface ReferenceStats {
        linkCount: number
        domains: string[]
        links: Array<{
          text: string
          url: string
          domain: string
        }>
      }

      const referenceStats: Record<string, ReferenceStats> = {}

      postFiles.forEach((filePath) => {
        const filename = path.basename(filePath)
        const links = extractReferenceLinks(filePath)

        if (links.length > 0) {
          const domains = links.map((link) => {
            try {
              return new URL(link.url).hostname
            } catch {
              return 'invalid-url'
            }
          })

          const uniqueDomains = [...new Set(domains)]

          referenceStats[filename] = {
            linkCount: links.length,
            domains: uniqueDomains,
            links: links.map((link) => ({
              text: link.text,
              url: link.url,
              domain: (() => {
                try {
                  return new URL(link.url).hostname
                } catch {
                  return 'invalid-url'
                }
              })(),
            })),
          }
        } else {
          referenceStats[filename] = {
            linkCount: 0,
            domains: [],
            links: [],
          }
        }
      })

      // Log detailed analysis
      //console.log('\n📈 Reference Link Analysis:')
      Object.entries(referenceStats).forEach(([_filename, _stats]) => {
        // if (stats.linkCount > 0) {
        //console.log(`\n📄 ${filename}:`)
        //console.log(`   Links: ${stats.linkCount}`)
        //console.log(`   Domains: ${stats.domains.join(', ')}`)
        // stats.links.forEach((link) => {
        //console.log(`   - ${link.text} -> ${link.domain}`)
        // })
        // }
      })

      //console.log(`\n📊 Summary:`)
      //console.log(`   Total reference links: ${totalLinks}`)
      //console.log(`   Posts with references: ${postsWithReferences}`)
      //console.log(`   Unique domains: ${uniqueDomains.length}`)
      //console.log(`   Domains: ${uniqueDomains.join(', ')}`)

      expect(referenceStats).toBeDefined()
    })
  })

  describe('Reference Link Format Validation', () => {
    test('should validate reference link format consistency', () => {
      const postFiles = getPostFiles()
      const formatIssues: string[] = []

      postFiles.forEach((filePath) => {
        const filename = path.basename(filePath)
        const links = extractReferenceLinks(filePath)

        links.forEach((link) => {
          // Check for common format issues
          if (link.url.includes(' ')) {
            formatIssues.push(`${filename}: URL contains spaces - "${link.url}"`)
          }

          if (!link.url.startsWith('http://') && !link.url.startsWith('https://')) {
            formatIssues.push(`${filename}: URL missing protocol - "${link.url}"`)
          }

          if (link.text.length === 0) {
            formatIssues.push(`${filename}: Empty link text for URL "${link.url}"`)
          }

          // Check for common problematic patterns
          if (link.url.includes('{:target="_blank"')) {
            formatIssues.push(`${filename}: URL contains malformed attributes - "${link.url}"`)
          }
        })
      })

      if (formatIssues.length > 0) {
        //console.log('Found reference link format issues:')
        // formatIssues.forEach((issue) => //console.log(`  - ${issue}`))
        throw new Error(`Found ${formatIssues.length} reference link format issues`)
      }
    })
  })
})
