/**
 * SkipLink Atom Component
 *
 * Atomic Design Level: ATOM
 * A skip navigation link for keyboard users to bypass repetitive navigation.
 *
 * Features:
 * - Hidden by default (sr-only)
 * - Visible on keyboard focus
 * - Jumps to main content
 * - WCAG 2.1 AA compliant (2.4.1 Bypass Blocks)
 *
 * Accessibility:
 * - Appears at the very top of the page
 * - First focusable element for keyboard users
 * - Allows screen reader users to skip navigation
 * - Keyboard users can press Tab to reveal, Enter to activate
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * <SkipLink />
 * <Header />
 * <main id="main-content">
 *   {children}
 * </main>
 * ```
 */

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-pink-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
    >
      Skip to main content
    </a>
  )
}
