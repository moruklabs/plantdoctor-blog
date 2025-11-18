/**
 * Callout Configuration
 *
 * Separates presentation (styles, icons) from domain logic (MDX processing).
 * Maintains consistency with Callout component (components/molecules/callout.tsx).
 *
 * Design Principle: Configuration over Code
 * - Styles can be updated without touching business logic
 * - Easy to add new callout types
 * - Supports theming and customization
 */

export type CalloutType = 'info' | 'warning' | 'success' | 'error'

/**
 * Tailwind CSS classes for callout types
 * NOTE: Keep these in sync with Callout component (components/molecules/callout.tsx)
 * Dark mode variants added for better UX
 */
export const CALLOUT_STYLES: Record<CalloutType, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100',
  warning:
    'border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100',
  success:
    'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100',
  error:
    'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
}

/**
 * SVG icons for callout types
 * NOTE: Keep these in sync with Callout component's inline SVGs
 */
export const CALLOUT_ICONS: Record<CalloutType, string> = {
  info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>',
  warning:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>',
  success:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" /></svg>',
  error:
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>',
}

/**
 * Get style for callout type with fallback to 'info'
 */
export function getCalloutStyle(type: string): string {
  return CALLOUT_STYLES[(type as CalloutType) || 'info'] || CALLOUT_STYLES.info
}

/**
 * Get icon for callout type with fallback to 'info'
 */
export function getCalloutIcon(type: string): string {
  return CALLOUT_ICONS[(type as CalloutType) || 'info'] || CALLOUT_ICONS.info
}

/**
 * Generate HTML for callout matching Callout component structure
 * Structure: <Card><CardContent><flex container><icon><content>
 *
 * @param type - Callout type
 * @param content - Processed HTML content
 * @returns HTML string for callout
 */
export function generateCalloutHtml(type: string, content: string): string {
  const style = getCalloutStyle(type)
  const icon = getCalloutIcon(type)

  return `<div class="rounded-lg border ${style} border-l-4"><div class="p-4"><div class="flex items-start space-x-3">${icon}<div class="flex-1">${content}</div></div></div></div>`
}
