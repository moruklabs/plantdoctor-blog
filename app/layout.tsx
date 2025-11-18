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
  robots: 'index, follow',
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
