import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts, getUrlForPost } from '@/lib/content/posts'
import { getAllNews, getUrlForNews } from '@/lib/content/news'
import { getAllGuides, getUrlForGuide } from '@/lib/content/guides'
import { getAllApps, getUrlForApp } from '@/lib/content/apps'
import { getBlogImage } from '@/lib/content/blog-images'
import { Badge } from '@/components/atoms/badge'
import { Testimonials } from '@/components/organisms/testimonials'
import { StructuredDataScript } from '@/components/seo'
import { createOrganizationWithContactPoint, createWebSiteSchema } from '@/lib/seo/structured-data'
import { siteConfig } from '@/lib/config'
import { blogConfig } from '@/config'
import { featureToggles } from '@/lib/feature-toggles'
import { Heading, Text } from '@/components/atoms'
import { generatePageMetadata } from '@/lib/metadata'
import { OG_IMAGE_DEFAULT } from '@/config/seo-constants'

export const metadata: Metadata = generatePageMetadata({
  title: undefined, // Uses default title
  description:
    'Explore AI-powered insights, practical guides, and expert analysis. From text-to-image generation to pet care optimization—discover 856+ actionable resources for every interest.',
  path: '',
  ogImage: '/images/og-default.jpg',
})

export default async function HomePage() {
  // News articles (top priority)
  const allNews = await getAllNews()
  const featuredNews = allNews[0]
  const recentNews = allNews.slice(1, 7) // Get 6 news articles for grid

  // Apps portfolio
  const allApps = await getAllApps()
  const featuredApps = allApps.slice(0, 3) // Get 3 apps for portfolio showcase

  // Tips (blog posts)
  const allPosts = featureToggles.tips.enabled ? await getAllPosts() : []
  const recentTips = allPosts.slice(0, 3) // Get 3 tips

  // Guides
  const allGuides = featureToggles.guides.enabled ? await getAllGuides() : []
  const featuredGuides = allGuides.slice(0, 3) // Get 3 guides

  // Create structured data for homepage
  const organizationSchema = createOrganizationWithContactPoint({
    name: siteConfig.name,
    url: siteConfig.baseUrl,
    logo: `${siteConfig.baseUrl}/favicon.svg`,
    description: siteConfig.description,
    contactPoint: {
      contactType: 'Customer Support',
      url: `${siteConfig.baseUrl}/support`,
    },
  })

  // Create WebSite schema with search action
  const websiteSchema = createWebSiteSchema({
    name: siteConfig.name,
    url: siteConfig.baseUrl,
    description: siteConfig.description,
    publisher: organizationSchema,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.baseUrl}/tips?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  })

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredDataScript data={organizationSchema as unknown as Record<string, unknown>} />
      <StructuredDataScript data={websiteSchema as unknown as Record<string, unknown>} />

      {/* Featured News Hero - Latest News */}
      {featuredNews && (
        <section className="bg-card border-b">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
              <article className="grid md:grid-cols-2 gap-8 items-center">
                {/* Featured Image */}
                <Link
                  href={getUrlForNews(featuredNews.metadata.slug)}
                  className="block overflow-hidden rounded-lg"
                >
                  <Image
                    src={
                      featuredNews.metadata.coverImage ||
                      getBlogImage(featuredNews.metadata.slug).src
                    }
                    alt={featuredNews.metadata.title}
                    width={800}
                    height={600}
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                    priority
                  />
                </Link>

                {/* Featured Content */}
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {featuredNews.metadata.tags?.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Heading level={1} className="text-3xl md:text-4xl lg:text-5xl mb-4">
                    <Link
                      href={getUrlForNews(featuredNews.metadata.slug)}
                      className="hover:text-primary transition-colors"
                    >
                      {featuredNews.metadata.title}
                    </Link>
                  </Heading>

                  <Text className="text-lg text-muted-foreground mb-6 line-clamp-3">
                    {featuredNews.metadata.description}
                  </Text>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                    <time dateTime={featuredNews.metadata.date}>
                      {new Date(featuredNews.metadata.date).toLocaleDateString(
                        blogConfig.formatting.date.locale,
                        blogConfig.formatting.date.formats?.featured as Intl.DateTimeFormatOptions,
                      )}
                    </time>
                    <span>
                      {featuredNews.metadata.readingTime ||
                        blogConfig.formatting.readingTime.default}{' '}
                      {blogConfig.formatting.readingTime.suffix}
                    </span>
                  </div>

                  <Link
                    href={getUrlForNews(featuredNews.metadata.slug)}
                    className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {'Read Article'} →
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>
      )}

      {/* Recent News Grid */}
      {recentNews.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <Heading level={2} className="text-2xl md:text-3xl">
                  {'Recent News'}
                </Heading>
                {allNews.length > 7 && (
                  <Link
                    href={siteConfig.app.news}
                    className="text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    {'View All News'}
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentNews.map((news) => (
                  <article
                    key={news.metadata.slug}
                    className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link href={getUrlForNews(news.metadata.slug)} className="block">
                      <Image
                        src={news.metadata.coverImage || getBlogImage(news.metadata.slug).src}
                        alt={news.metadata.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    </Link>

                    <div className="p-5">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {news.metadata.tags?.slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Heading level={3} className="text-xl mb-2">
                        <Link
                          href={getUrlForNews(news.metadata.slug)}
                          className="hover:text-primary transition-colors line-clamp-2"
                        >
                          {news.metadata.title}
                        </Link>
                      </Heading>

                      <Text className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                        {news.metadata.description}
                      </Text>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <time dateTime={news.metadata.date}>
                          {new Date(news.metadata.date).toLocaleDateString(
                            blogConfig.formatting.date.locale,
                            blogConfig.formatting.date.formats
                              ?.recent as Intl.DateTimeFormatOptions,
                          )}
                        </time>
                        <span>
                          {news.metadata.readingTime || blogConfig.formatting.readingTime.default}{' '}
                          {blogConfig.formatting.readingTime.suffixShort}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Apps Portfolio Showcase */}
      {featuredApps.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <div className="text-5xl mb-4">🚀</div>
                <Heading level={2} className="text-3xl md:text-4xl mb-4">
                  Featured Apps & Projects
                </Heading>
                <Text className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                  Explore our portfolio of AI-powered applications and productivity tools designed
                  to enhance your digital life.
                </Text>
                <Link
                  href="/apps"
                  className="inline-flex items-center text-primary hover:underline font-medium"
                >
                  View All Apps →
                </Link>
              </div>

              {/* Apps Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredApps.map((app) => (
                  <article
                    key={app.metadata.slug}
                    className="group bg-card rounded-xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300"
                  >
                    {/* App Image */}
                    <Link
                      href={getUrlForApp(app.metadata.slug)}
                      className="block relative aspect-[16/9] overflow-hidden bg-muted"
                    >
                      <Image
                        src={app.metadata.coverImage || OG_IMAGE_DEFAULT.url}
                        alt={app.metadata.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      {/* Status Badge */}
                      {app.metadata.status === 'live' && (
                        <div className="absolute top-3 right-3">
                          <Badge
                            variant="default"
                            className="bg-green-600 text-white shadow-lg backdrop-blur-sm"
                          >
                            ✓ Live
                          </Badge>
                        </div>
                      )}
                    </Link>

                    {/* App Content */}
                    <div className="p-6">
                      {/* Category */}
                      <Badge variant="secondary" className="text-xs mb-3">
                        {app.metadata.category}
                      </Badge>

                      {/* Title */}
                      <Heading level={3} className="text-xl mb-2">
                        <Link
                          href={getUrlForApp(app.metadata.slug)}
                          className="hover:text-primary transition-colors"
                        >
                          {app.metadata.title}
                        </Link>
                      </Heading>

                      {/* Description */}
                      <Text className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                        {app.metadata.description}
                      </Text>

                      {/* Technologies */}
                      {app.metadata.technologies && app.metadata.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {app.metadata.technologies.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground"
                            >
                              {tech}
                            </span>
                          ))}
                          {app.metadata.technologies.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                              +{app.metadata.technologies.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* CTA */}
                      <Link
                        href={getUrlForApp(app.metadata.slug)}
                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                      >
                        Learn More →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Tips Section */}
      {recentTips.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <Heading level={2} className="text-2xl md:text-3xl">
                  {'Latest Articles'}
                </Heading>
                {allPosts.length > 3 && (
                  <Link
                    href={siteConfig.app.tips}
                    className="text-primary hover:underline font-medium flex items-center gap-1"
                  >
                    {'View All Tips'}
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentTips.map((tip) => (
                  <article
                    key={tip.metadata.slug}
                    className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link href={getUrlForPost(tip.metadata.slug)} className="block">
                      <Image
                        src={tip.metadata.coverImage || getBlogImage(tip.metadata.slug).src}
                        alt={tip.metadata.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                        loading="lazy"
                      />
                    </Link>

                    <div className="p-5">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tip.metadata.tags?.slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <Heading level={3} className="text-xl mb-2">
                        <Link
                          href={getUrlForPost(tip.metadata.slug)}
                          className="hover:text-primary transition-colors line-clamp-2"
                        >
                          {tip.metadata.title}
                        </Link>
                      </Heading>

                      <Text className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                        {tip.metadata.description}
                      </Text>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <time dateTime={tip.metadata.date}>
                          {new Date(tip.metadata.date).toLocaleDateString(
                            blogConfig.formatting.date.locale,
                            blogConfig.formatting.date.formats
                              ?.recent as Intl.DateTimeFormatOptions,
                          )}
                        </time>
                        <span>
                          {tip.metadata.readingTime || blogConfig.formatting.readingTime.default}{' '}
                          {blogConfig.formatting.readingTime.suffixShort}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Guides Section */}
      {featuredGuides.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="text-5xl mb-4">📚</div>
                <Heading level={2} className="text-3xl md:text-4xl mb-4">
                  {'Comprehensive Guides'}
                </Heading>
                <Text className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
                  {
                    'Comprehensive guides covering productivity, wellness, technology, lifestyle, and more.'
                  }
                </Text>
                {allGuides.length > 3 && (
                  <Link
                    href={siteConfig.app.guides}
                    className="inline-flex items-center text-primary hover:underline font-medium"
                  >
                    {'View All Guides'} →
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredGuides.map((guide) => (
                  <article
                    key={guide.metadata.slug}
                    className="group bg-card rounded-xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300"
                  >
                    <Link
                      href={getUrlForGuide(guide.metadata.slug)}
                      className="block relative aspect-[16/9] overflow-hidden bg-muted"
                    >
                      <Image
                        src={guide.metadata.coverImage || OG_IMAGE_DEFAULT.url}
                        alt={guide.metadata.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        loading="lazy"
                      />
                    </Link>

                    <div className="p-6">
                      <Heading level={3} className="text-xl mb-2">
                        <Link
                          href={getUrlForGuide(guide.metadata.slug)}
                          className="hover:text-primary transition-colors"
                        >
                          {guide.metadata.title}
                        </Link>
                      </Heading>

                      <Text className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                        {guide.metadata.description}
                      </Text>

                      <Link
                        href={getUrlForGuide(guide.metadata.slug)}
                        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                      >
                        {'Read Guide'} →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials - Social Proof */}
      {featureToggles.testimonials.enabled && (
        <section className="border-t">
          <Testimonials />
        </section>
      )}
    </>
  )
}
