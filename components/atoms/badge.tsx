import * as React from 'react'
import { cn } from '@/lib/utils/utils'

/**
 * Badge Atom Component (Unified)
 *
 * Atomic Design Level: ATOM
 * A versatile badge/pill component for displaying labels, statuses, and tags.
 *
 * Merged from:
 * - atoms/badge.tsx (custom variants: success, warning, info + size support)
 * - ui/badge.tsx (shadcn/ui variants: secondary, destructive, outline)
 *
 * Features:
 * - Seven color variants covering all use cases
 * - Three size variants: xs, sm, md
 * - Responsive to dark mode
 * - Theme-aware (uses CSS variables for shadcn variants)
 * - Can be used for cookie status, tags, notifications, post metadata, etc.
 *
 * @example
 * ```tsx
 * // Status badges (custom)
 * <Badge variant="info" size="xs">Always Active</Badge>
 * <Badge variant="success">Published</Badge>
 * <Badge variant="warning" size="sm">Draft</Badge>
 *
 * // Theme badges (shadcn/ui)
 * <Badge variant="secondary">Tag</Badge>
 * <Badge variant="destructive">Error</Badge>
 * <Badge variant="outline">Neutral</Badge>
 * ```
 */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Visual variant of the badge
   *
   * Custom variants (specific colors):
   * - 'default': Gray/neutral styling
   * - 'success': Green styling (positive states)
   * - 'warning': Yellow/amber styling (attention states)
   * - 'info': Blue styling (informational states)
   *
   * Theme variants (uses CSS variables):
   * - 'secondary': Secondary theme color
   * - 'destructive': Destructive/error theme color
   * - 'outline': Outlined style with foreground text
   */
  variant?: 'default' | 'success' | 'warning' | 'info' | 'secondary' | 'destructive' | 'outline'

  /**
   * Size of the badge
   * - 'xs': Extra small (text-xs, minimal padding)
   * - 'sm': Small (text-xs, comfortable padding) - default
   * - 'md': Medium (text-sm, standard padding)
   */
  size?: 'xs' | 'sm' | 'md'
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
  ...props
}: BadgeProps) {
  // Base classes shared by all variants
  const baseClasses = 'inline-flex items-center rounded font-medium transition-colors'

  // Variant-specific classes
  const variantClasses = {
    // Semantic variants (uses CSS variables for theme consistency)
    // Note: Using existing semantic tokens. For better color semantics, consider adding
    // --success, --warning, --info tokens to globals.css in the future.
    default: 'bg-muted text-muted-foreground hover:bg-muted/80',
    success: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    warning: 'bg-accent text-accent-foreground hover:bg-accent/80',
    info: 'bg-primary/10 text-primary hover:bg-primary/20',

    // Theme variants (shadcn/ui standard)
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  }

  // Size classes
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }

  return (
    <span
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </span>
  )
}
