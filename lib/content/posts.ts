import {
  type ContentTypeConfig,
  type ContentMetadata,
  type ContentItem,
  getAllSlugsFromDirectory,
  getContentBySlug,
  getAllContent,
  getUniqueTags as getUniqueTagsFromContent,
  isContentPublished,
} from './content-utils'

// Type aliases for posts
export type PostMetadata = ContentMetadata

export type Post = ContentItem<PostMetadata>

// Content type configuration for posts
const postsConfig: ContentTypeConfig = {
  directory: 'content/posts',
  pathPrefix: 'tips',
  schemaType: 'BlogPosting',
}

/**
 * Get all slugs from posts directory
 */
export function getAllSlugsFromPostsDir(): { slug: string }[] {
  return getAllSlugsFromDirectory(postsConfig.directory)
}

/**
 * Get a post by slug
 */
export async function getPostBySlug(slug: string): Promise<Post> {
  return getContentBySlug<PostMetadata>(slug, postsConfig)
}

/**
 * Check if a post should be published based on its date.
 * Posts are published if their date is today or in the past.
 *
 * @param dateString - The post date in ISO format (YYYY-MM-DD)
 * @returns true if the post should be published, false if it's a future post
 */
export function isPostPublished(dateString: string): boolean {
  return isContentPublished(dateString)
}

/**
 * Get all published posts, sorted by date descending
 */
export async function getAllPosts(): Promise<Post[]> {
  return getAllContent<PostMetadata>(postsConfig)
}

/**
 * Get unique tags from posts
 */
export function getUniqueTags(posts: Post[]): string[] {
  return getUniqueTagsFromContent(posts)
}

export function getUrlForPost(slug: string): string {
  return `/${postsConfig.pathPrefix}/${slug}`
}
