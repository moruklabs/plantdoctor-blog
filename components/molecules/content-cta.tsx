'use client'

import { Card, CardContent } from '@/components/ui/card'
import { InternalLink } from '@/components/links'
import { Heading, Text } from '@/components/atoms'
import { getCTAVariant } from '@/config/cta-variants'

interface ContentCTAProps {
  title?: string
  description?: string
  href?: string
  ctaText?: string
  position?: 'inline' | 'sidebar'
  tags?: string[]
}

export function ContentCTA({ title, description, href, ctaText, tags = [] }: ContentCTAProps) {
  const variant = getCTAVariant(tags)

  const finalTitle = title || variant.title
  const finalDescription = description || variant.description
  const finalHref = href || variant.href
  const finalCtaText = ctaText || variant.ctaText

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col gap-4">
          {/* Icon + Title */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <Heading level={3} className="text-xl sm:text-2xl text-foreground mb-2">
                {finalTitle}
              </Heading>
              <Text className="text-muted-foreground text-sm sm:text-base">{finalDescription}</Text>
            </div>
          </div>

          {/* CTA Button */}
          <InternalLink
            href={finalHref}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 hover:gap-3 group"
            aria-label={finalCtaText}
          >
            {finalCtaText}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </InternalLink>
        </div>
      </CardContent>
    </Card>
  )
}
