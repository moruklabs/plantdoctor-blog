'use client'

import Link from 'next/link'
import { ExternalLink } from '@/components/links'
import { siteConfig } from '@/lib/config'

import { blogConfig } from '@/config'
import { FOOTER_COPY } from '@/config/footer'
import { BLOG_CONSTANTS } from '@/config/constants'
function FooterBrand() {
  return (
    <div>
      <h3 className="font-bold text-lg mb-4">{FOOTER_COPY.brandHeading}</h3>
      <p className="text-sm text-muted-foreground mb-4">
        <ExternalLink href={FOOTER_COPY.landingPageUrl} className="text-primary hover:underline">
          Plant Doctor
        </ExternalLink>{' '}
        {FOOTER_COPY.brandDescription} Part of the{' '}
        <ExternalLink href={BLOG_CONSTANTS.MORUK_URL} className="text-primary hover:underline">
          {BLOG_CONSTANTS.UMBRELLA_BRAND_NAME}
        </ExternalLink>{' '}
        ecosystem.
      </p>
      <ExternalLink
        href={BLOG_CONSTANTS.APPS.PLANT_DOCTOR}
        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
        Download on App Store
      </ExternalLink>
    </div>
  )
}

function FooterSection({
  title,
  items,
  customItems,
}: {
  title: string
  items: { label: string; href: string; external?: boolean }[]
  customItems?: React.ReactNode[]
}) {
  return (
    <nav aria-label={`${title} links`}>
      <h4 className="font-semibold mb-4">{title}</h4>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            {item.external ? (
              <ExternalLink href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </ExternalLink>
            ) : (
              <Link href={item.href} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            )}
          </li>
        ))}
        {customItems?.map((item, index) => (
          <li key={`custom-${index}`}>{item}</li>
        ))}
      </ul>
    </nav>
  )
}

function FooterBottom() {
  // Use a fixed year to avoid hydration mismatches between server and client
  // This will be updated annually as needed
  const currentYear = 2025

  return (
    <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
      <p>
        &copy; {currentYear} {BLOG_CONSTANTS.ORGANIZATION_NAME} – {blogConfig.site.name}.{' '}
        {FOOTER_COPY.copyrightPrefix}
      </p>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-8">
          <FooterBrand />
          <FooterSection
            title={'Content'}
            items={[
              { label: 'News', href: siteConfig.app.news },
              { label: 'Tips', href: siteConfig.app.tips },
              { label: 'Guides', href: siteConfig.app.guides },
              { label: 'Community', href: '/community' },
            ]}
          />
          <FooterSection
            title={'Legal'}
            items={[
              { label: 'Privacy Policy', href: siteConfig.pages.privacy },
              { label: 'Terms & Conditions', href: siteConfig.pages.terms },
              { label: 'Cookie Policy', href: siteConfig.pages.cookies },
              { label: 'Support', href: siteConfig.pages.support },
            ]}
          />
        </div>

        {/* Cross-app backlinks for SEO */}
        <nav aria-label="More from Moruk" className="border-t mt-8 pt-8">
          <h4 className="font-semibold mb-4 text-sm">More from Moruk</h4>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {[
              { label: 'plantdoctor.app', href: 'https://plantdoctor.app' },
              { label: 'Cat Doctor', href: 'https://catdoctor.app' },
              { label: 'Rizzman AI', href: 'https://rizzman.ai' },
              { label: 'Atomic Habit', href: 'https://atomichabit.app' },
              { label: 'Moruk AI', href: 'https://moruk.ai' },
            ].map((app) => (
              <li key={app.href}>
                <ExternalLink href={app.href} className="hover:text-primary transition-colors">
                  {app.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </nav>

        <FooterBottom />
      </div>
    </footer>
  )
}
