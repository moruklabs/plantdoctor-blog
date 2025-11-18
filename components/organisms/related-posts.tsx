import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/atoms/badge'
import { getBlogImage } from '@/lib/content/blog-images'
import { siteConfig } from '@/lib/config'
import type { PostMetadata } from '@/lib/content/posts'
import { Heading, Text } from '@/components/atoms'

interface RelatedPostsProps {
  posts: Array<{
    metadata: PostMetadata
  }>
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-12">
      <Heading level={2} className="text-2xl mb-6">
        Related Posts
      </Heading>
      <div className="grid md:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.metadata.slug} className="group">
            <Link href={`${siteConfig.app.tips}/${post.metadata.slug}`}>
              <div className="bg-card rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow">
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.metadata.coverImage || getBlogImage(post.metadata.slug).src}
                    alt={post.metadata.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {post.metadata.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Heading
                    level={3}
                    className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors"
                  >
                    {post.metadata.title}
                  </Heading>
                  <Text variant="caption" className="text-muted-foreground line-clamp-2">
                    {post.metadata.description}
                  </Text>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
