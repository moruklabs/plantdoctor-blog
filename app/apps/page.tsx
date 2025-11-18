import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllApps, getUrlForApp } from '@/lib/content/apps'
import { Badge } from '@/components/atoms/badge'
import { Heading, Text } from '@/components/atoms'
import { generatePageMetadata } from '@/lib/metadata'
import { ExternalLink } from '@/components/links/external-link'
import { OG_IMAGE_DEFAULT } from '@/config/seo-constants'

export const metadata: Metadata = generatePageMetadata({
  title: 'Apps & Projects',
  description:
    'Explore our portfolio of AI-powered applications and productivity tools built with cutting-edge technology.',
  path: '/apps',
})

// Static generation configuration
export const dynamic = 'force-static'
export const revalidate = false

// Platform icons/labels
const platformLabels: Record<string, string> = {
  iOS: '📱 iOS',
  Android: '🤖 Android',
  Web: '🌐 Web',
  'Browser Extension': '🧩 Extension',
}

// Status badges
const statusConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  live: { label: '✓ Live', variant: 'default' },
  beta: { label: '⚠ Beta', variant: 'secondary' },
  'coming-soon': { label: '🚀 Coming Soon', variant: 'outline' },
}

export default async function AppsPage() {
  const allApps = await getAllApps()

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="text-6xl mb-6">🚀</div>
        <Heading level={1} className="text-4xl md:text-5xl tracking-tight mb-6">
          Apps & Projects
        </Heading>
        <Text variant="lead" className="text-muted-foreground max-w-3xl mx-auto mb-4">
          Explore our portfolio of AI-powered applications and productivity tools designed to
          enhance your digital life.
        </Text>
        <Text className="text-muted-foreground max-w-2xl mx-auto">
          From mindfulness to productivity, each app is built with cutting-edge technology and user
          experience in mind.
        </Text>
      </section>

      {/* Apps Grid */}
      <section>
        {allApps.length === 0 ? (
          <div className="text-center py-12">
            <Heading level={2} className="text-2xl mb-4">
              No apps available yet
            </Heading>
            <Text className="text-muted-foreground mb-6">
              We&apos;re working on exciting projects. Check back soon!
            </Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allApps.map((app) => {
              const statusBadge = statusConfig[app.metadata.status] || statusConfig.live

              return (
                <article
                  key={app.metadata.slug}
                  className="group flex flex-col bg-card rounded-xl overflow-hidden shadow-sm border hover:shadow-xl transition-all duration-300"
                >
                  {/* Cover Image */}
                  <Link
                    href={getUrlForApp(app.metadata.slug)}
                    className="relative aspect-[16/9] overflow-hidden bg-muted"
                  >
                    <Image
                      src={app.metadata.coverImage || OG_IMAGE_DEFAULT.url}
                      alt={app.metadata.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Status Badge Overlay */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant={statusBadge.variant}
                        className="bg-background/90 backdrop-blur-sm shadow-sm"
                      >
                        {statusBadge.label}
                      </Badge>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    {/* Category */}
                    <div className="mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {app.metadata.category}
                      </Badge>
                    </div>

                    {/* Title */}
                    <Link href={getUrlForApp(app.metadata.slug)}>
                      <Heading
                        level={2}
                        className="text-2xl mb-3 group-hover:text-primary transition-colors"
                      >
                        {app.metadata.title}
                      </Heading>
                    </Link>

                    {/* Description */}
                    <Text className="text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {app.metadata.description}
                    </Text>

                    {/* Technologies */}
                    {app.metadata.technologies && app.metadata.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {app.metadata.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                        {app.metadata.technologies.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                            +{app.metadata.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Platforms */}
                    {app.metadata.platform && app.metadata.platform.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {app.metadata.platform.map((platform) => (
                          <span
                            key={platform}
                            className="text-xs text-muted-foreground flex items-center"
                          >
                            {platformLabels[platform] || platform}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t">
                      <Link
                        href={getUrlForApp(app.metadata.slug)}
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        Learn More →
                      </Link>
                      {app.metadata.websiteUrl && (
                        <ExternalLink
                          href={app.metadata.websiteUrl}
                          className="inline-flex items-center px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                        >
                          Visit Site
                        </ExternalLink>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Categories Overview (if multiple apps) */}
      {allApps.length > 0 && (
        <section className="mt-16 pt-12 border-t">
          <Heading level={2} className="text-2xl mb-6 text-center">
            Built with Modern Technology
          </Heading>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <Text className="font-medium mb-1">Fast & Responsive</Text>
              <Text variant="caption" className="text-muted-foreground">
                Optimized performance
              </Text>
            </div>
            <div>
              <div className="text-3xl mb-2">🤖</div>
              <Text className="font-medium mb-1">AI-Powered</Text>
              <Text variant="caption" className="text-muted-foreground">
                Cutting-edge ML/AI
              </Text>
            </div>
            <div>
              <div className="text-3xl mb-2">🔒</div>
              <Text className="font-medium mb-1">Privacy First</Text>
              <Text variant="caption" className="text-muted-foreground">
                Your data is secure
              </Text>
            </div>
            <div>
              <div className="text-3xl mb-2">📱</div>
              <Text className="font-medium mb-1">Cross-Platform</Text>
              <Text variant="caption" className="text-muted-foreground">
                Works everywhere
              </Text>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
