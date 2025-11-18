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
      <p className="text-sm text-muted-foreground">
        {FOOTER_COPY.brandDescription} Part of the{' '}
        <ExternalLink href={BLOG_CONSTANTS.COMPANY_URL} className="text-primary hover:underline">
          {BLOG_CONSTANTS.BRAND_NAME}
        </ExternalLink>{' '}
        ecosystem.
      </p>
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
    <div>
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
    </div>
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
        <div className="grid grid-cols-4 gap-8">
          <FooterBrand />
          <FooterSection
            title={'Apps'}
            items={[
              { label: 'All Apps', href: '/apps' },
              { label: 'Breathe Easy', href: '/apps/breathe-easy' },
              { label: 'Minday', href: '/apps/minday' },
              { label: 'Plant Doctor', href: '/apps/plant-doctor' },
            ]}
          />
          <FooterSection
            title={'Content'}
            items={[
              { label: 'News', href: siteConfig.app.news },
              { label: 'Tips', href: siteConfig.app.tips },
              { label: 'Guides', href: siteConfig.app.guides },
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
        <FooterBottom />
      </div>
    </footer>
  )
}
