'use client'

import Link from 'next/link'

interface InternalLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  'aria-label'?: string
  onClick?: () => void
  section?: 'nav' | 'breadcrumb' | 'content' | 'footer'
}

export function InternalLink({
  href,
  children,
  className = '',
  'aria-label': ariaLabel,
  onClick,
}: InternalLinkProps) {
  return (
    <Link href={href} className={className} aria-label={ariaLabel} onClick={onClick}>
      {children}
    </Link>
  )
}
