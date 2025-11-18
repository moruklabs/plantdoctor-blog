interface BlogImage {
  src: string
  alt: string
}

/**
 * Generate a placeholder image URL using an online service
 * Creates a colored placeholder with the slug text
 */
function generatePlaceholderUrl(slug: string): string {
  // Use a reliable placeholder service
  // Creates a 1200x630 placeholder (standard OG image size)
  const encodedSlug = encodeURIComponent(slug.substring(0, 30).replace(/-/g, ' '))
  return `https://via.placeholder.com/1200x630/2563eb/ffffff?text=${encodedSlug}`
}

export function getBlogImage(slug: string): BlogImage {
  // Generate a placeholder image with the slug as text
  // If the post's actual image doesn't exist, this fallback provides a better UX
  return {
    src: generatePlaceholderUrl(slug),
    alt: slug.replace(/-/g, ' '),
  }
}
