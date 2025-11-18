/**
 * Text Atom Component
 *
 * Atomic Design Level: ATOM
 * A semantic text component for body copy, leads, captions, and labels.
 *
 * Features:
 * - Four text variants (body, lead, caption, label)
 * - Semantic HTML elements (p, span)
 * - Consistent color and sizing
 * - Type-safe with CVA
 * - Dark mode support
 *
 * Design Tokens:
 * - body: Standard paragraph text
 * - lead: Larger introductory text
 * - caption: Smaller descriptive text
 * - label: Form labels and UI text
 *
 * @example
 * ```tsx
 * <Text variant="lead">Introduction paragraph with emphasis</Text>
 * <Text>Standard body text</Text>
 * <Text variant="caption">Image caption or metadata</Text>
 * <Text variant="label" as="label">Form Field Label</Text>
 * ```
 */

import { cva, type VariantProps } from 'class-variance-authority'
import { type ReactNode } from 'react'
import { cn } from '@/lib/utils/utils'

const textVariants = cva('', {
  variants: {
    variant: {
      body: 'text-base text-gray-700 dark:text-gray-300 leading-relaxed',
      lead: 'text-xl text-gray-600 dark:text-gray-400 leading-relaxed',
      caption: 'text-sm text-gray-500 dark:text-gray-400',
      label: 'text-sm font-medium text-gray-700 dark:text-gray-300',
    },
  },
  defaultVariants: {
    variant: 'body',
  },
})

export interface TextProps
  extends VariantProps<typeof textVariants>,
    Omit<React.HTMLAttributes<HTMLElement>, 'className'> {
  /**
   * Text style variant
   * - 'body': Standard paragraph text (default)
   * - 'lead': Larger introductory/emphasis text
   * - 'caption': Smaller descriptive text
   * - 'label': Form labels and UI text
   */
  variant?: 'body' | 'lead' | 'caption' | 'label'

  /**
   * HTML element to render
   * - 'p': Paragraph (default)
   * - 'span': Inline span
   * - 'label': Form label
   * - 'div': Block div
   */
  as?: 'p' | 'span' | 'label' | 'div'

  /**
   * Content to render inside the text element
   */
  children: ReactNode

  /**
   * Additional CSS classes to apply
   */
  className?: string

  /**
   * HTML for attribute (when as="label")
   */
  htmlFor?: string
}

/**
 * Renders semantic text with consistent typography
 *
 * @param variant - Text style variant (body, lead, caption, label)
 * @param as - HTML element type, defaults to 'p'
 * @param children - Text content
 * @param className - Additional CSS classes
 * @param htmlFor - For attribute (when rendering as label)
 */
export function Text({
  variant = 'body',
  as: Component = 'p',
  className,
  children,
  htmlFor,
  ...restProps
}: TextProps) {
  const props: React.HTMLAttributes<HTMLElement> & { htmlFor?: string } = {
    className: cn(textVariants({ variant }), className),
    ...restProps,
  }

  // Add htmlFor only if Component is 'label'
  if (Component === 'label' && htmlFor) {
    props.htmlFor = htmlFor
  }

  return <Component {...props}>{children}</Component>
}
