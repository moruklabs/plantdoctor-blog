import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAllSlugsFromNewsDir, getNewsBySlug, getAllNews } from '@/lib/content/news'
import { getBlogImage } from '@/lib/content/blog-images'
import { ContentMetadata } from '@/lib/content/content-utils'
import {
  formatPublishedLine,
  getPostOgImage,
  getSiteNameForOpenGraph,
} from '@/lib/content/meta-helpers'
import { Breadcrumbs } from '@/components/molecules/breadcrumbs'
import { Badge } from '@/components/atoms/badge'
import { InternalLink } from '@/components/links'
import { ContentCTA } from '@/components/molecules/content-cta'
import { StructuredDataScript } from '@/components/seo'
import { ArticleContent } from '@/components/molecules/article-content'
import { ReadingModeToggle } from '@/components/molecules/reading-mode-toggle'
import { createArticleSchema, createOrganizationSchema } from '@/lib/seo/structured-data'
import { siteConfig } from '@/lib/config'
import nextDynamic from 'next/dynamic'

// Dynamic imports for below-the-fold components to reduce initial bundle size
const TableOfContents = nextDynamic(() => import('@/components/molecules/table-of-contents'), {
  loading: () => <div className="animate-pulse bg-muted h-32 rounded-lg"></div>,
})

const ShareButtons = nextDynamic(
  () =>
    import('@/components/molecules/share-buttons').then((mod) => ({ default: mod.ShareButtons })),
  {
    loading: () => <div className="animate-pulse bg-muted h-12 rounded-lg"></div>,
  },
)

const RelatedPosts = nextDynamic(
  () =>
    import('@/components/organisms/related-posts').then((mod) => ({ default: mod.RelatedPosts })),
  {
    loading: () => <div className="animate-pulse bg-muted h-48 rounded-lg"></div>,
  },
)

// Static generation configuration
export const dynamic = 'force-static'
export const revalidate = false

export async function generateStaticParams() {
  try {
    const slugs = getAllSlugsFromNewsDir()
    console.log(
      'Generated static params for news slugs:',
      slugs.map((s) => s.slug),
    )
    return slugs
  } catch (error) {
    console.error('Error generating static params for news:', error)
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  try {
    const newsArticle = await getNewsBySlug(slug)
    const { metadata } = newsArticle

    return {
      title: metadata.title,
      description: metadata.meta_desc || metadata.description || '',
      alternates: {
        canonical: metadata.canonical,
      },
      openGraph: {
        title: metadata.title,
        description: metadata.meta_desc || metadata.description || '',
        url: metadata.canonical,
        siteName: getSiteNameForOpenGraph(),
        images: [
          {
            url: getPostOgImage(metadata, slug),
            width: 1200,
            height: 630,
            alt: metadata.title,
          },
        ],
        locale: metadata.lang || 'en',
        type: 'article',
        publishedTime: metadata.date,
        tags: metadata.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata.title,
        description: metadata.meta_desc || metadata.description || '',
        images: [getPostOgImage(metadata, slug)],
      },
    }
  } catch {
    return {
      title: 'News Article Not Found',
      description: 'The news article you are looking for does not exist.',
    }
  }
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let metadata: ContentMetadata
  let html: string
  let relatedNews: Awaited<ReturnType<typeof getNewsBySlug>>[]
  let newsArticleSchema: ReturnType<typeof createArticleSchema>

  try {
    const newsArticle = await getNewsBySlug(slug)
    const allNews = await getAllNews()

    // Two-tier related news strategy to ensure exactly 3 articles
    // 1. Prioritize news with matching tags
    const tagMatchedNews = allNews
      .filter((n) => n.metadata.slug !== slug)
      .filter((n) => n.metadata.tags.some((tag: string) => newsArticle.metadata.tags.includes(tag)))

    // 2. If fewer than 3, fill with most recent news (sorted by date)
    relatedNews = tagMatchedNews.slice(0, 3)

    if (relatedNews.length < 3) {
      const remainingNews = allNews
        .filter((n) => n.metadata.slug !== slug)
        .filter((n) => !tagMatchedNews.find((matched) => matched.metadata.slug === n.metadata.slug))
        .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())

      relatedNews = [...relatedNews, ...remainingNews].slice(0, 3)
    }

    const articleData = newsArticle
    metadata = articleData.metadata
    html = articleData.html

    // Create NewsArticle schema
    const publisherSchema = createOrganizationSchema({
      name: siteConfig.name,
      url: siteConfig.baseUrl,
      logo: `${siteConfig.baseUrl}/favicon.svg`,
    })

    newsArticleSchema = createArticleSchema(
      {
        headline: metadata.title,
        description: metadata.description || metadata.meta_desc || '',
        datePublished: metadata.date,
        author: publisherSchema,
        publisher: publisherSchema,
        image: {
          '@type': 'ImageObject',
          url:
            metadata.coverImage ||
            metadata.ogImage ||
            `${siteConfig.baseUrl}/images/og-default.jpg`,
          width: 1200,
          height: 630,
        },
      },
      'NewsArticle',
    )
  } catch {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'News', href: '/news' },
          { label: metadata.title },
        ]}
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <article className="lg:col-span-3">
          {/* Hero Image */}
          <section className="mb-8">
            <div className="relative aspect-[1200/630] rounded-lg overflow-hidden">
              <Image
                src={metadata.coverImage || metadata.ogImage || getBlogImage(slug).src}
                alt={metadata.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                className="object-cover"
                priority
                fetchPriority="high"
              />
            </div>
          </section>

          {/* Title and Meta */}
          <header className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-4xl font-bold flex-1">
                <InternalLink
                  href={metadata.canonical}
                  className="text-foreground hover:text-primary transition-colors duration-200"
                  aria-label={`Read full article: ${metadata.title}`}
                >
                  {metadata.title}
                </InternalLink>
              </h1>
              <ReadingModeToggle />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {metadata.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-muted-foreground">
              {formatPublishedLine(metadata.date, metadata.readingTime ?? 0)}
            </p>
          </header>

          {/* Article Content with Reading Mode Support */}
          <ArticleContent html={html} className="mb-8" />

          {/* Guide CTA */}
          <section className="mb-8">
            <ContentCTA tags={metadata.tags} />
          </section>

          {/* Share Buttons */}
          <section className="mb-8">
            <ShareButtons url={metadata.canonical} title={metadata.title} />
          </section>

          {/* Related News */}
          <RelatedPosts posts={relatedNews} />
        </article>

        {/* Table of Contents */}
        <aside className="lg:col-span-1">
          <TableOfContents />
        </aside>
      </div>

      {/* Structured Data */}
      <StructuredDataScript data={newsArticleSchema as unknown as Record<string, unknown>} />
      {metadata.structuredData && (
        <StructuredDataScript data={metadata.structuredData as Record<string, unknown>} />
      )}
    </div>
  )
}
