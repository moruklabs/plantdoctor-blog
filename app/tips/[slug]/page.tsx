import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/content/posts'
import { getBlogImage } from '@/lib/content/blog-images'
import { pageMetadata } from '@/config/page-metadata'
import {
  formatPublishedLine,
  getPostOgImage,
  getSiteNameForOpenGraph,
} from '@/lib/content/meta-helpers'
import { siteConfig } from '@/lib/config'
import { Breadcrumbs } from '@/components/molecules/breadcrumbs'
import { Badge } from '@/components/atoms/badge'
import { ContentCTA } from '@/components/molecules/content-cta'
import { StructuredDataScript } from '@/components/seo'
import { ReadingModeToggle } from '@/components/molecules/reading-mode-toggle'
import { ArticleContent } from '@/components/molecules/article-content'
import { createBreadcrumbList } from '@/lib/seo/structured-data'
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
    // Use getAllPosts() instead of getAllSlugsFromPostsDir() to apply date/draft filtering
    // This excludes posts >3 months in the future, speeding up builds
    const posts = await getAllPosts()
    const slugs = posts.map((post) => ({ slug: post.metadata.slug }))
    console.log(`Generated static params for ${slugs.length} posts (filtered by date/draft)`)
    return slugs
  } catch (error) {
    console.error('Error generating static params:', error)
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
    const post = await getPostBySlug(slug)
    const { metadata } = post

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
      title: pageMetadata.postNotFound.title,
      description: pageMetadata.postNotFound.description,
    }
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const post = await getPostBySlug(slug)
    const allPosts = await getAllPosts()

    // Two-tier related posts strategy to ensure exactly 3 posts
    // 1. Prioritize posts with matching tags
    const tagMatchedPosts = allPosts
      .filter((p) => p.metadata.slug !== slug)
      .filter((p) => p.metadata.tags.some((tag) => post.metadata.tags.includes(tag)))

    // 2. If fewer than 3, fill with most recent posts (sorted by date)
    let relatedPosts = tagMatchedPosts.slice(0, 3)

    if (relatedPosts.length < 3) {
      const remainingPosts = allPosts
        .filter((p) => p.metadata.slug !== slug)
        .filter(
          (p) => !tagMatchedPosts.find((matched) => matched.metadata.slug === p.metadata.slug),
        )
        .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())

      relatedPosts = [...relatedPosts, ...remainingPosts].slice(0, 3)
    }

    const { metadata, html } = post

    // Create breadcrumb schema
    const breadcrumbSchema = createBreadcrumbList([
      {
        name: 'Home',
        item: siteConfig.baseUrl,
      },
      {
        name: 'Tips',
        item: `${siteConfig.baseUrl}/tips`,
      },
      {
        name: metadata.title,
        item: metadata.canonical,
      },
    ])

    return (
      <div className="container mx-auto px-4 py-8">
        <StructuredDataScript data={breadcrumbSchema as unknown as Record<string, unknown>} />
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Tips', href: siteConfig.app.tips },
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
                  alt={metadata.altText || metadata.title}
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
                <h1 className="text-4xl font-bold flex-1">{metadata.title}</h1>
                <ReadingModeToggle />
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {metadata.tags.map((tag) => (
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

            {/* Related Posts */}
            <RelatedPosts posts={relatedPosts} />
          </article>

          {/* Table of Contents */}
          <aside className="lg:col-span-1">
            <TableOfContents />
          </aside>
        </div>

        {/* Structured Data */}
        {metadata.structuredData && (
          <StructuredDataScript data={metadata.structuredData as Record<string, unknown>} />
        )}
      </div>
    )
  } catch {
    notFound()
  }
}
