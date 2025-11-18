import Link from 'next/link'
import { NavBar } from './nav-bar'
import { ThemeToggle } from '@/components/molecules'
import Image from 'next/image'
import { BLOG_CONSTANTS } from '@/config/constants'
import { blogConfig } from '@/config'

export async function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="h-8 w-8">
              <Image
                src={BLOG_CONSTANTS.ICON_48x48}
                width={48}
                height={48}
                alt="{blogConfig.site.name} logo"
                className="h-8 w-8 sm:h-8 sm:w-8 flex-shrink-0"
                priority
                data-testid="logo"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base sm:text-lg leading-tight text-foreground">
                {blogConfig.site.name}
              </span>
              <span className="text-xs sm:text-xs text-muted-foreground leading-tight hidden sm:block">
                {blogConfig.site.tagline}
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4 ml-4 flex-shrink-0">
            <ThemeToggle />
            <NavBar />
          </div>
        </div>
      </div>
    </header>
  )
}
