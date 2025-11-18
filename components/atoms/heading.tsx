/**
 * Heading Atom Component
 *
 * Atomic Design Level: ATOM
 * A semantic heading component (h1-h6) with consistent typography design tokens.
 *
 * Features:
 * - Six semantic levels (h1-h6)
 * - Predefined variants (hero, section, subsection)
 * - Responsive text sizing
 * - Type-safe with CVA
 * - Consistent spacing and font weights
 *
 * Design Tokens:
 * - Level-based: Semantic HTML heading levels with default styles
 * - Variant-based: Named semantic variants for specific use cases
 *
 * @example
 * ```tsx
 * <Heading level={1} variant="hero">Welcome to {blogConfig.site.name}</Heading>
 * <Heading level={2} variant="section">Our Services</Heading>
 * <Heading level={3}>Feature Details</Heading>
 * <Heading level={4} className="text-pink-600">Custom Styled</Heading>
 * ```
 */

import { cva, type VariantProps } from 'class-variance-authority'
import { createElement, type ReactNode } from 'react'
import { cn } from '@/lib/utils/utils'

const headingVariants = cva('font-bold', {
  variants: {
    level: {
      1: 'text-4xl md:text-5xl mb-6',
      2: 'text-3xl md:text-4xl mb-4',
      3: 'text-2xl md:text-3xl mb-3',
      4: 'text-xl md:text-2xl mb-3',
      5: 'text-lg md:text-xl mb-2',
      6: 'text-base md:text-lg mb-2',
    },
    variant: {
      hero: 'text-5xl md:text-6xl mb-8',
      section: 'text-3xl md:text-4xl mb-6',
      subsection: 'text-2xl md:text-3xl mb-4',
    },
  },
  defaultVariants: {
    level: 2,
  },
})

export interface HeadingProps extends VariantProps<typeof headingVariants> {
  /**
   * Semantic heading level (1-6)
   * Maps to h1-h6 HTML elements
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6

  /**
   * Named variant for specific design contexts
   * - 'hero': Large display heading for page heroes
   * - 'section': Main section headings
   * - 'subsection': Subsection headings
   */
  variant?: 'hero' | 'section' | 'subsection'

  /**
   * Content to render inside the heading
   */
  children: ReactNode

  /**
   * Additional CSS classes to apply
   */
  className?: string

  /**
   * Optional HTML id attribute for accessibility (e.g., ARIA labelledby)
   */
  id?: string
}

/**
 * Renders a semantic heading with consistent typography
 *
 * @param level - HTML heading level (1-6), defaults to 2
 * @param variant - Named design variant (hero, section, subsection)
 * @param children - Heading content
 * @param className - Additional CSS classes
 * @param id - Optional HTML id attribute for accessibility
 */
export function Heading({ level = 2, variant, className, id, children }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  return createElement(
    Tag,
    {
      className: cn(
        headingVariants({
          level: variant ? undefined : level,
          variant,
        }),
        className,
      ),
      id,
    },
    children,
  )
}
