'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import { featureToggles } from '@/lib/feature-toggles'

export function NavBar() {
  const pathname = usePathname()
  const navItemClass = 'text-xs sm:text-sm font-medium hover:text-primary transition-colors'

  // Check if a path is active (matches current pathname or is a parent path)
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  return (
    <nav
      aria-label="Main navigation"
      className="flex items-center space-x-2 sm:space-x-4 md:space-x-6"
    >
      <Link href="/" className={navItemClass} aria-current={isActive('/') ? 'page' : undefined}>
        {'Home'}
      </Link>
      {featureToggles.tips.enabled && (
        <Link
          href={siteConfig.app.tips}
          className={navItemClass}
          aria-current={isActive(siteConfig.app.tips) ? 'page' : undefined}
        >
          {'Tips'}
        </Link>
      )}
      <Link
        href={siteConfig.app.news}
        className={navItemClass}
        aria-current={isActive(siteConfig.app.news) ? 'page' : undefined}
      >
        {'News'}
      </Link>
      <Link
        href="/apps"
        className={navItemClass}
        aria-current={isActive('/apps') ? 'page' : undefined}
      >
        {'Apps'}
      </Link>
      {featureToggles.guides.enabled && (
        <Link
          href={siteConfig.app.guides}
          className={navItemClass}
          aria-current={isActive(siteConfig.app.guides) ? 'page' : undefined}
        >
          {'Guides'}
        </Link>
      )}
    </nav>
  )
}
