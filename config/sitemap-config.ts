import type { MetadataRoute } from 'next'

export function getStaticPageConfigs(baseUrl: string) {
  return [
    {
      url: baseUrl,
      filePath: 'app/page.tsx',
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/tips`,
      filePath: 'app/tips/page.tsx',
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      filePath: 'app/news/page.tsx',
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/apps`,
      filePath: 'app/apps/page.tsx',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      filePath: 'app/guides/page.tsx',
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      filePath: 'app/about/page.tsx',
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      filePath: 'app/contact/page.tsx',
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support`,
      filePath: 'app/support/page.tsx',
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      filePath: 'app/privacy-policy/page.tsx',
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      filePath: 'app/terms-and-conditions/page.tsx',
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      filePath: 'app/cookie-policy/page.tsx',
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    },
  ] as const satisfies Array<{
    url: string
    filePath: string
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
    priority: number
  }>
}
