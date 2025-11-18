import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/atoms/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { PostMetadata } from '@/lib/content/posts'
import { Heading, Text } from '@/components/atoms'

interface RecentPostsGridProps {
  posts: Array<{
    metadata: PostMetadata
  }>
}

export function RecentPostsGrid({ posts }: RecentPostsGridProps) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Heading level={2} className="mb-8">
          Recent Posts
        </Heading>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 6).map((post) => (
            <Card
              key={post.metadata.slug}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative aspect-video">
                <Image
                  src={post.metadata.coverImage || '/placeholder.svg'}
                  alt={post.metadata.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.metadata.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Heading level={3} className="line-clamp-2 hover:text-primary transition-colors">
                  <Link href={`/blog/${post.metadata.slug}`}>{post.metadata.title}</Link>
                </Heading>
              </CardHeader>
              <CardContent className="pt-0">
                <Text variant="caption" className="text-muted-foreground line-clamp-2 mb-4">
                  {post.metadata.description}
                </Text>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{new Date(post.metadata.date).toLocaleDateString()}</span>
                  <span>{post.metadata.readingTime} min read</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
