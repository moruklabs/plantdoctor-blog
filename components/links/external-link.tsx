'use client'

import { isExternalUrl, isSubdomainUrl } from '@/lib/config'

interface ExternalLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  'aria-label'?: string
  onClick?: () => void
}

export function ExternalLink({
  href,
  children,
  className = '',
  'aria-label': ariaLabel,
  onClick,
}: ExternalLinkProps) {
  // Determine if this is an external link
  const isExternal = isExternalUrl(href) || isSubdomainUrl(href)

  // Build rel attribute - all external links get nofollow
  const rel = isExternal ? 'noopener noreferrer nofollow' : undefined

  return (
    <a
      href={href}
      rel={rel}
      target={isExternal ? '_blank' : undefined}
      className={className}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </a>
  )
}
