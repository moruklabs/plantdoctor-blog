import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getAppBySlug, getAllApps } from '@/lib/content/apps'
import { Breadcrumbs } from '@/components/molecules/breadcrumbs'
import { Badge } from '@/components/atoms/badge'
import { InternalLink } from '@/components/links'
import { ExternalLink } from '@/components/links/external-link'
import { StructuredDataScript } from '@/components/seo'
import { Heading, Text } from '@/components/atoms'
import { getSiteNameForOpenGraph } from '@/lib/content/meta-helpers'
import { OG_IMAGE_DEFAULT } from '@/config/seo-constants'

// Static generation configuration
export const dynamic = 'force-static'
export const dynamicParams = false
export const revalidate = false

export async function generateStaticParams() {
  try {
    // Use getAllApps() to apply date/draft filtering (consistent with tips route)
    const apps = await getAllApps()
    const slugs = apps.map((app) => ({ slug: app.metadata.slug }))
    console.log(
      'Generated static params for app slugs:',
      slugs.map((s) => s.slug),
    )
    return slugs
  } catch (error) {
    console.error('Error generating static params for apps:', error)
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
    const app = await getAppBySlug(slug)
    const { metadata } = app

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
            url: metadata.ogImage || metadata.coverImage || OG_IMAGE_DEFAULT.url,
            width: OG_IMAGE_DEFAULT.width,
            height: OG_IMAGE_DEFAULT.height,
            alt: metadata.title,
          },
        ],
        locale: metadata.lang || 'en',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata.title,
        description: metadata.meta_desc || metadata.description || '',
        images: [metadata.ogImage || metadata.coverImage || OG_IMAGE_DEFAULT.url],
      },
    }
  } catch {
    return {
      title: 'App Not Found',
      description: 'The app you are looking for does not exist.',
    }
  }
}

export default async function AppPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const app = await getAppBySlug(slug)
    const allApps = await getAllApps()

    // Get related apps (same category, excluding current app)
    const relatedApps = allApps
      .filter((a) => a.metadata.slug !== slug && a.metadata.category === app.metadata.category)
      .slice(0, 3)

    const { metadata, html } = app

    // Platform icons
    const platformIcons: Record<string, string> = {
      iOS: '📱',
      Android: '🤖',
      Web: '🌐',
      'Browser Extension': '🧩',
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Apps', href: '/apps' },
            { label: metadata.title },
          ]}
        />

        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <section className="mb-12">
            {/* Cover Image */}
            <div className="relative aspect-[2/1] rounded-2xl overflow-hidden mb-8">
              <Image
                src={metadata.coverImage || OG_IMAGE_DEFAULT.url}
                alt={metadata.title}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
                priority
                fetchPriority="high"
              />
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="secondary">{metadata.category}</Badge>
                  {metadata.status === 'live' && (
                    <Badge variant="default" className="bg-green-600">
                      ✓ Live
                    </Badge>
                  )}
                  {metadata.status === 'beta' && <Badge variant="secondary">⚠ Beta</Badge>}
                  {metadata.status === 'coming-soon' && (
                    <Badge variant="outline">🚀 Coming Soon</Badge>
                  )}
                </div>

                <Heading level={1} className="text-4xl md:text-5xl mb-4">
                  {metadata.title}
                </Heading>

                <Text className="text-xl text-muted-foreground mb-6">{metadata.description}</Text>

                {/* Platforms */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {metadata.platform.map((platform) => (
                    <div
                      key={platform}
                      className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg"
                    >
                      <span>{platformIcons[platform] || '📦'}</span>
                      <span className="font-medium">{platform}</span>
                    </div>
                  ))}
                </div>

                {/* Download/Visit Links */}
                <div className="flex flex-wrap gap-3">
                  {metadata.appStoreUrl && (
                    <ExternalLink
                      href={metadata.appStoreUrl}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors font-medium"
                    >
                      <span>📱</span>
                      <span>App Store</span>
                    </ExternalLink>
                  )}
                  {metadata.playStoreUrl && (
                    <ExternalLink
                      href={metadata.playStoreUrl}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      <span>🤖</span>
                      <span>Google Play</span>
                    </ExternalLink>
                  )}
                  {metadata.websiteUrl && (
                    <ExternalLink
                      href={metadata.websiteUrl}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                    >
                      <span>🌐</span>
                      <span>Visit Website</span>
                    </ExternalLink>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Key Features */}
          {metadata.features && metadata.features.length > 0 && (
            <section className="mb-12 p-8 bg-card rounded-2xl border">
              <Heading level={2} className="text-2xl mb-6">
                ✨ Key Features
              </Heading>
              <ul className="grid md:grid-cols-2 gap-4">
                {metadata.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary mt-1">✓</span>
                    <Text>{feature}</Text>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Main Content */}
          <section
            className="prose prose-lg max-w-none mb-12 dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {/* Technology Stack */}
          {metadata.technologies && metadata.technologies.length > 0 && (
            <section className="mb-12 p-8 bg-muted/50 rounded-2xl">
              <Heading level={2} className="text-2xl mb-6">
                🛠️ Built With
              </Heading>
              <div className="flex flex-wrap gap-3">
                {metadata.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-sm px-4 py-2">
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Related Apps */}
          {relatedApps.length > 0 && (
            <section className="mb-12">
              <Heading level={2} className="text-2xl mb-6">
                More {metadata.category} Apps
              </Heading>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedApps.map((relatedApp) => (
                  <article
                    key={relatedApp.metadata.slug}
                    className="group bg-card rounded-lg overflow-hidden border hover:shadow-lg transition-shadow"
                  >
                    <InternalLink href={`/apps/${relatedApp.metadata.slug}`}>
                      <div className="relative aspect-[16/9] bg-muted">
                        <Image
                          src={relatedApp.metadata.coverImage || OG_IMAGE_DEFAULT.url}
                          alt={relatedApp.metadata.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-4">
                        <Heading level={3} className="text-lg mb-2 group-hover:text-primary">
                          {relatedApp.metadata.title}
                        </Heading>
                        <Text variant="caption" className="text-muted-foreground line-clamp-2">
                          {relatedApp.metadata.description}
                        </Text>
                      </div>
                    </InternalLink>
                  </article>
                ))}
              </div>
            </section>
          )}
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
