import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/content/posts'
import { getBlogImage } from '@/lib/content/blog-images'
import { Badge } from '@/components/atoms/badge'
import { Heading, Text } from '@/components/atoms'
import { tipsPageContent } from '@/content/pages/en'
import { generatePageMetadata, formatDate, formatReadingTime } from '@/lib/content/meta-helpers'

export const metadata: Metadata = generatePageMetadata(
  'Blog Posts',
  tipsPageContent.hero.description,
  '/tips',
)

export default async function BlogPage() {
  const allPosts = await getAllPosts()

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="text-6xl mb-4">{tipsPageContent.hero.emoji}</div>
          <Heading level={1} className="text-4xl tracking-tight mb-4">
            {tipsPageContent.hero.title}
          </Heading>
          <Text variant="lead" className="text-muted-foreground max-w-2xl mx-auto">
            {tipsPageContent.hero.description}
          </Text>
        </section>

        {/* Posts Grid */}
        <section>
          {allPosts.length === 0 ? (
            <div className="text-center py-12">
              <Heading level={2} className="text-2xl mb-4">
                {tipsPageContent.emptyState.title}
              </Heading>
              <Text className="text-muted-foreground mb-6">
                {tipsPageContent.emptyState.description}
              </Text>
              <Link
                href={tipsPageContent.emptyState.ctaHref}
                className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                {tipsPageContent.emptyState.cta}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {allPosts.map((post) => (
                <article key={post.metadata.slug} className="group w-full max-w-sm">
                  <Link href={`/tips/${post.metadata.slug}`}>
                    <div className="bg-card rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
                      {/* Cover Image */}
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={post.metadata.coverImage || getBlogImage(post.metadata.slug).src}
                          alt={post.metadata.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.metadata.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Title */}
                        <Heading
                          level={2}
                          className="text-xl mb-2 group-hover:text-primary transition-colors"
                        >
                          {post.metadata.title}
                        </Heading>

                        {/* Description */}
                        <Text variant="caption" className="text-muted-foreground mb-4 line-clamp-3">
                          {post.metadata.description}
                        </Text>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatDate(post.metadata.date, 'short')}</span>
                          <span>{formatReadingTime(post.metadata.readingTime, true)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
