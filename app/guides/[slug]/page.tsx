import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAllSlugsFromGuidesDir, getGuideBySlug } from '@/lib/content/guides'
import { getPostBySlug } from '@/lib/content/posts'
import { getRelatedPostsForGuide } from '@/lib/content/related-content'
import { getBlogImage } from '@/lib/content/blog-images'
import { Breadcrumbs } from '@/components/molecules/breadcrumbs'
import { Badge } from '@/components/atoms/badge'
import { StructuredDataScript } from '@/components/seo'
import { ReadingModeToggle } from '@/components/molecules/reading-mode-toggle'
import { ArticleContent } from '@/components/molecules/article-content'
import nextDynamic from 'next/dynamic'
import {
  getSiteNameForOpenGraph,
  getGuideOgImage,
  formatPublishedLine,
} from '@/lib/content/meta-helpers'
import { OG_IMAGE_DEFAULT } from '@/config/seo-constants'
import { pageMetadata } from '@/config/page-metadata'
import { LOG_MESSAGES } from '@/config/log-messages'

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
    const slugs = getAllSlugsFromGuidesDir()
    console.log(
      LOG_MESSAGES.guides.generatedSlugs,
      slugs.map((s) => s.slug),
    )
    return slugs
  } catch (error) {
    console.error(LOG_MESSAGES.guides.generateError, error)
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
    const guide = await getGuideBySlug(slug)
    const { metadata } = guide

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
            url: getGuideOgImage(metadata, slug),
            width: OG_IMAGE_DEFAULT.width,
            height: OG_IMAGE_DEFAULT.height,
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
        images: [getGuideOgImage(metadata, slug)],
      },
    }
  } catch {
    return {
      title: pageMetadata.guideNotFound.title,
      description: pageMetadata.guideNotFound.description,
    }
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const guide = await getGuideBySlug(slug)

    // Get hardcoded related posts for this guide (exactly 6 curated posts)
    const relatedPostSlugs = getRelatedPostsForGuide(slug)
    const relatedPosts = await Promise.all(
      relatedPostSlugs.map(async (postSlug) => {
        try {
          return await getPostBySlug(postSlug)
        } catch (error) {
          console.error(`Failed to load related post: ${postSlug}`, error)
          return null
        }
      }),
    ).then((posts) => posts.filter((post) => post !== null))

    const { metadata, html } = guide

    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Guides', href: '/guides' },
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
                  className="object-cover"
                  priority
                  fetchPriority="high"
                />
              </div>
            </section>

            {/* Title and Meta */}
            <header className="mb-8">
              <div className="inline-block mb-4">
                <Badge variant="default" className="text-sm">
                  Comprehensive Guide
                </Badge>
              </div>
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

            {/* Share Buttons */}
            <section className="mb-8">
              <ShareButtons url={metadata.canonical} title={metadata.title} />
            </section>

            {/* Related Posts - Hardcoded 6 most relevant blog posts */}
            {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
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
