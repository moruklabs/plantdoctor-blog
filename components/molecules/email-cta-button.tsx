import { siteConfig } from '@/lib/config'
import { ExternalLink } from '@/components/links/external-link'
import type React from 'react'

import { blogConfig } from '@/config'
interface EmailCTAButtonProps {
  children: React.ReactNode
  className?: string
  buttonText?: string
}

/**
 * CTA button that links to the app download page
 */
export function EmailCTAButton({ children, className = '' }: EmailCTAButtonProps) {
  return (
    <ExternalLink
      href={siteConfig.ios.app}
      className={
        className ||
        'group inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-lg font-bold text-lg hover:bg-orange-700 transition-colors'
      }
    >
      {children || (
        <>
          <span className="mr-2">🚀</span>
          <span>Get {blogConfig.site.name} Now →</span>
        </>
      )}
    </ExternalLink>
  )
}
