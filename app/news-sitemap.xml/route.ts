/**
 * Google News Sitemap
 *
 * This generates a sitemap specifically for Google News, which is required
 * for submitting your site to Google News Publisher Center.
 *
 * Requirements:
 * - Articles published within the last 2 days (Google News only indexes recent content)
 * - Must include: publication date, title, and URL
 * - Should be updated as new articles are published
 *
 * @see https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
 */

import { getAllPosts } from '@/lib/content/posts'
import { blogConfig } from '@/config'

export async function GET() {
  const posts = await getAllPosts()

  // Google News only indexes articles published within the last 2 days
  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  const recentPosts = posts.filter((post) => {
    const publishDate = new Date(post.metadata.date)
    return publishDate >= twoDaysAgo && !post.metadata.draft
  })

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recentPosts
  .map(
    (post) => `  <url>
    <loc>${blogConfig.site.url}/tips/${post.metadata.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${blogConfig.site.name}</news:name>
        <news:language>${blogConfig.site.language}</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.metadata.date).toISOString()}</news:publication_date>
      <news:title>${escapeXml(post.metadata.title)}</news:title>
    </news:news>
  </url>`,
  )
  .join('\n')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  })
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
