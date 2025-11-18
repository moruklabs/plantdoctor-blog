'use client'

import { useMemo } from 'react'
import { useReadingMode } from '@/contexts/reading-mode-context'
import { getReadingModeClassNames, applyBionicReading } from '@/lib/reading-modes'
import { cn } from '@/lib/utils'

interface ArticleContentProps {
  html: string
  className?: string
}

/**
 * Article content component with reading mode support
 * Applies bionic reading, spacing, tints, and font size adjustments
 */
export function ArticleContent({ html, className }: ArticleContentProps) {
  const { settings } = useReadingMode()

  // Apply bionic reading transformation if enabled
  const processedHtml = useMemo(() => {
    if (settings.bionicReading) {
      return applyBionicReading(html)
    }
    return html
  }, [html, settings.bionicReading])

  // Get CSS class names based on current settings
  const modeClasses = getReadingModeClassNames(settings)

  return (
    <div
      className={cn(
        'prose prose-lg max-w-none dark:prose-invert',
        settings.bionicReading && 'reading-mode-bionic',
        modeClasses,
        className,
      )}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  )
}
