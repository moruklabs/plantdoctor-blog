import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/atoms/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { PostMetadata } from '@/lib/content/posts'
import { Heading, Text } from '@/components/atoms'
import { blogConfig } from '@/config'

interface FeaturedPostProps {
  post: {
    metadata: PostMetadata
  }
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const { metadata } = post

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Heading level={2} className="mb-8">
          Featured Post
        </Heading>
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-video md:aspect-square">
              <Image
                src={metadata.coverImage || '/placeholder.svg'}
                alt={metadata.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <CardContent className="p-8 flex flex-col justify-center">
              <div className="flex flex-wrap gap-2 mb-4">
                {metadata.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Heading level={3} className="text-2xl mb-4 line-clamp-2">
                {metadata.title}
              </Heading>
              <Text className="text-muted-foreground mb-6 line-clamp-3">
                {metadata.description}
              </Text>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Date(metadata.date).toLocaleDateString(
                    blogConfig.formatting?.date?.locale ?? 'en-US',
                    blogConfig.formatting?.date?.formats?.short ?? undefined,
                  )}{' '}
                  • {metadata.readingTime}{' '}
                  {blogConfig.formatting?.readingTime?.suffixShort ?? 'min'}
                </span>
                <Link
                  href={`/blog/${metadata.slug}`}
                  className="text-primary hover:underline font-medium"
                >
                  Read More →
                </Link>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </section>
  )
}
