import type { Metadata } from 'next'
import { SkipLink } from '@/components/atoms'
import { Footer, Header } from '@/components/organisms'
import { ThemeProvider } from '@/components/organisms/theme-provider'
import { blogConfig } from '@/config'
import { ReadingModeProvider } from '@/contexts/reading-mode-context'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(blogConfig.site.url),
  title: {
    default: `${blogConfig.site.name} | ${blogConfig.site.tagline}`,
    template: `%s | ${blogConfig.site.name}`,
  },
  description: blogConfig.site.description,
  keywords: blogConfig.seo.keywords,
  authors: [{ name: blogConfig.author.name }],
  generator: 'Next.js',
  robots: { index: true, follow: true },
  alternates: { canonical: blogConfig.site.url },
  openGraph: {
    type: 'website',
    url: blogConfig.site.url,
    siteName: blogConfig.site.name,
    title: `${blogConfig.site.name} | ${blogConfig.site.tagline}`,
    description: blogConfig.site.description,
    images: [
      {
        url: '/images/og-default.jpg',
        width: 1200,
        height: 630,
        alt: blogConfig.site.name,
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${blogConfig.site.name} | ${blogConfig.site.tagline}`,
    description: blogConfig.site.description,
    images: ['/images/og-default.jpg'],
    site: blogConfig.seo.twitterHandle,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: [{ url: '/icon-180x180.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReadingModeProvider>
            <SkipLink />
            <div className="flex min-h-screen flex-col">
              <Header />
              <main id="main-content" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ReadingModeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
