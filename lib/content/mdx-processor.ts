import matter from 'gray-matter'
import yaml from 'js-yaml'
import { marked } from 'marked'
import { generateCalloutHtml } from './callout-config'

// Configure marked for clean, semantic HTML output
marked.setOptions({
  breaks: false, // Don't convert single line breaks to <br> for cleaner HTML
  gfm: true, // GitHub Flavored Markdown for better compatibility
})

/**
 * Process Callout components in markdown content and convert them to placeholder tokens.
 * This two-phase approach prevents issues with regex matching and double-processing:
 * 1. First, extract callouts and replace with unique tokens
 * 2. Process markdown on the content (tokens are preserved)
 * 3. Replace tokens with final HTML
 *
 * DESIGN PRINCIPLE: Separation of Concerns
 * - This function handles MDX parsing logic only
 * - Styling and presentation are externalized to callout-config.ts
 * - Maintains consistency with Callout component (components/molecules/callout.tsx)
 *
 * @param content - MDX content with <Callout> tags
 * @returns HTML with rendered callouts
 */
function processCallouts(content: string): string {
  const callouts: Array<{ token: string; html: string }> = []
  let tokenIndex = 0

  // Phase 1: Extract callouts and replace with unique tokens
  // Use a token format that won't be affected by markdown processing (no underscores that could be interpreted as emphasis)
  const calloutRegex = /<Callout(\s+type=["'](\w+)["'])?\s*>([\s\S]*?)<\/Callout>/g

  const contentWithTokens = content.replace(
    calloutRegex,
    (_match, _typeAttr, type, innerContent) => {
      const calloutType = type || 'info'
      // Use HTML comment-style tokens that marked will preserve
      const token = `<!--CALLOUT${tokenIndex}-->`
      tokenIndex++

      // Process markdown inside the callout content
      const processedContent = marked(innerContent.trim()) as string

      // Generate HTML using configuration (styles and icons externalized)
      const html = generateCalloutHtml(calloutType, processedContent)

      callouts.push({ token, html })
      return token
    },
  )

  // Phase 2: Process the main markdown (with tokens in place)
  let processedHtml = marked(contentWithTokens) as string

  // Phase 3: Replace tokens with actual callout HTML
  // HTML comments are preserved by marked and won't be wrapped in other tags
  callouts.forEach(({ token, html }) => {
    processedHtml = processedHtml.replace(new RegExp(token, 'g'), html)
  })

  return processedHtml
}

// Configure footnote support
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const markedFootnote = require('marked-footnote')

  if (typeof marked.use === 'function' && markedFootnote) {
    marked.use(
      markedFootnote({
        refMarkers: true, // Show references as [1], [2], etc.
        footnoteDivider: true, // Add horizontal rule above footnotes section
      }),
    )
  }
} catch {
  // Gracefully handle missing or incompatible footnote extension
  // This can happen in Jest environment or if the package is not installed
  // Footnotes will still work but without special formatting
}

export interface PostFrontmatter {
  title: string
  description?: string
  meta_desc?: string
  tags: string[]
  date: string
  draft?: boolean
  canonical: string
  coverImage?: string
  ogImage?: string
  altText?: string
  readingTime?: number
  lang?: string
  hero_prompt?: string
}

export interface ProcessedPost {
  frontmatter: PostFrontmatter
  content: string
  html: string
  excerpt: string
  slug: string
}

export function processMDX(source: string, slug: string): ProcessedPost {
  // Parse frontmatter and content
  // Use js-yaml 4.x API (load instead of deprecated safeLoad)
  const { data: frontmatter, content } = matter(source, {
    engines: {
      yaml: {
        parse: (str: string) => yaml.load(str) as Record<string, unknown>,
      },
    },
  })

  // Process Callout components BEFORE running marked to avoid regex matching issues
  // This uses a token-based approach to safely handle callouts
  let html = processCallouts(content)

  // Remove the first-level heading (H1) from the HTML to prevent duplicate page titles
  html = html.replace(/<h1[\s\S]*?<\/h1>/, '')

  // Add security attributes to external links in footnotes and citations
  html = html.replace(
    /<a href="(https?:\/\/(?!blog.plantdoctor.app\.ai)[^"]+)"([^>]*)>/g,
    '<a href="$1" rel="nofollow noopener noreferrer" target="_blank"$2>',
  )

  // Generate SEO-friendly excerpt (first 160 chars for meta description)
  const plainText = content
    .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
    .replace(/[#*`_~\[\]()]/g, '') // Remove markdown syntax
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim()

  const excerpt = plainText.substring(0, 160).trim() + (plainText.length > 160 ? '...' : '')

  return {
    frontmatter: frontmatter as PostFrontmatter,
    content,
    html,
    excerpt,
    slug,
  }
}

export function validateFrontmatter(frontmatter: Partial<PostFrontmatter>): PostFrontmatter {
  // Ensure required fields exist
  if (!frontmatter.title) {
    throw new Error('Post must have a title')
  }
  if (!frontmatter.tags || !Array.isArray(frontmatter.tags)) {
    throw new Error('Post must have tags array')
  }
  if (!frontmatter.date) {
    throw new Error('Post must have a date')
  }
  if (!frontmatter.canonical) {
    throw new Error('Post must have a canonical URL')
  }

  return {
    title: frontmatter.title,
    description: frontmatter.description || frontmatter.meta_desc || '',
    meta_desc: frontmatter.meta_desc || frontmatter.description || '',
    tags: frontmatter.tags,
    date: frontmatter.date,
    draft: frontmatter.draft || false,
    canonical: frontmatter.canonical,
    coverImage: frontmatter.coverImage,
    ogImage: frontmatter.ogImage,
    readingTime: frontmatter.readingTime || 5,
    lang: frontmatter.lang || 'en',
    hero_prompt: frontmatter.hero_prompt,
  }
}
