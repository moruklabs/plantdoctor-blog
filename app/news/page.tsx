import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllNews } from '@/lib/content/news'
import { getBlogImage } from '@/lib/content/blog-images'
import { Badge } from '@/components/atoms/badge'
import { Heading, Text } from '@/components/atoms'
import { generatePageMetadata, formatDate, formatReadingTime } from '@/lib/content/meta-helpers'

export const metadata: Metadata = generatePageMetadata(
  'News',
  'Stay updated with the latest news, trends, and insights across technology, science, politics, and culture.',
  '/news',
)

export default async function NewsPage() {
  const allNews = await getAllNews()

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="text-6xl mb-4">📰</div>
          <Heading level={1} className="text-4xl tracking-tight mb-4">
            News
          </Heading>
          <Text className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay informed with comprehensive, ADHD-friendly breakdowns of today&apos;s most
            important stories
          </Text>
        </section>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allNews.map((article) => {
            // Use coverImage if provided, otherwise fall back to getBlogImage
            const imageSrc = article.metadata.coverImage || getBlogImage(article.metadata.slug).src
            const imageAlt = article.metadata.title

            return (
              <article
                key={article.metadata.slug}
                className="group flex flex-col bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-border"
              >
                <Link href={`/news/${article.metadata.slug}`} className="block">
                  <div className="relative h-48 w-full overflow-hidden bg-muted">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="flex-1 flex flex-col p-6">
                  {/* Tags */}
                  {article.metadata.tags && article.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {article.metadata.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <Link href={`/news/${article.metadata.slug}`}>
                    <Heading
                      level={2}
                      className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2"
                    >
                      {article.metadata.title}
                    </Heading>
                  </Link>

                  {/* Description */}
                  {article.metadata.meta_desc && (
                    <Text className="text-muted-foreground mb-4 line-clamp-3 flex-1">
                      {article.metadata.meta_desc}
                    </Text>
                  )}

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                    <time dateTime={article.metadata.date}>
                      {formatDate(article.metadata.date)}
                    </time>
                    {article.metadata.readingTime && (
                      <span>{formatReadingTime(article.metadata.readingTime)}</span>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Empty State */}
        {allNews.length === 0 && (
          <div className="text-center py-12">
            <Text className="text-muted-foreground">No news articles published yet.</Text>
          </div>
        )}
      </div>
    </>
  )
}
