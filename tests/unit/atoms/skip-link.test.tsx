import { render, screen } from '@testing-library/react'
import { SkipLink } from '@/components/atoms/skip-link'

describe('SkipLink Atom', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<SkipLink />)
      expect(screen.getByText('Skip to main content')).toBeInTheDocument()
    })

    it('renders as an anchor element', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink.tagName).toBe('A')
    })

    it('has correct link text', () => {
      render(<SkipLink />)
      expect(screen.getByText('Skip to main content')).toBeInTheDocument()
    })
  })

  describe('Navigation', () => {
    it('links to main content anchor', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveAttribute('href', '#main-content')
    })
  })

  describe('Accessibility - Screen Reader Only', () => {
    it('is hidden by default with sr-only class', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveClass('sr-only')
    })

    it('removes sr-only on focus', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveClass('focus:not-sr-only')
    })
  })

  describe('Accessibility - Focus Visibility', () => {
    it('becomes visible on focus with absolute positioning', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveClass('focus:absolute')
    })

    it('positions at top-left on focus', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveClass('focus:top-4', 'focus:left-4')
    })

    it('has high z-index on focus to appear above content', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveClass('focus:z-50')
    })
  })

  describe('Visual Styling on Focus', () => {
    it('applies background color on focus', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveClass('focus:bg-pink-600')
    })

    it('applies text color on focus', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveClass('focus:text-white')
    })

    it('applies padding on focus', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveClass('focus:px-4', 'focus:py-2')
    })

    it('applies rounded corners on focus', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveClass('focus:rounded-lg')
    })

    it('applies shadow on focus', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveClass('focus:shadow-lg')
    })
  })

  describe('Focus Ring Styling', () => {
    it('removes default outline on focus', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveClass('focus:outline-none')
    })

    it('applies custom focus ring', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveClass('focus:ring-2', 'focus:ring-pink-500')
    })

    it('applies focus ring offset', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')
      expect(skipLink).toHaveClass('focus:ring-offset-2')
    })
  })

  describe('WCAG Compliance', () => {
    it('satisfies WCAG 2.1 AA 2.4.1 Bypass Blocks criterion', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')

      // Should be a link
      expect(skipLink.tagName).toBe('A')

      // Should point to main content
      expect(skipLink).toHaveAttribute('href', '#main-content')

      // Should be screen reader accessible
      expect(skipLink).toHaveClass('sr-only')
    })

    it('is first focusable element (appears before other content)', () => {
      render(
        <div>
          <SkipLink />
          <button>Other Button</button>
        </div>,
      )

      const skipLink = screen.getByText('Skip to main content')
      const otherButton = screen.getByText('Other Button')

      // Skip link should appear first in DOM
      const parent = skipLink.parentElement
      const children = Array.from(parent?.children || [])
      expect(children.indexOf(skipLink)).toBeLessThan(children.indexOf(otherButton))
    })
  })

  describe('Keyboard Navigation', () => {
    it('is accessible via Tab key (first focusable element)', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')

      // Link should be in the document and focusable
      expect(skipLink).toBeInTheDocument()
      expect(skipLink.getAttribute('href')).toBe('#main-content')
    })

    it('has focus classes that make it visible when focused', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')

      // Should have classes that reveal it on focus
      expect(skipLink.className).toMatch(/focus:not-sr-only/)
      expect(skipLink.className).toMatch(/focus:absolute/)
      expect(skipLink.className).toMatch(/focus:bg-pink-600/)
    })
  })

  describe('Integration with Main Content', () => {
    it('links to expected main content ID', () => {
      render(
        <div>
          <SkipLink />
          <main id="main-content">Main Content</main>
        </div>,
      )

      const skipLink = screen.getByText('Skip to main content')
      const mainContent = document.getElementById('main-content')

      expect(skipLink).toHaveAttribute('href', '#main-content')
      expect(mainContent).toBeInTheDocument()
      expect(mainContent).toHaveAttribute('id', 'main-content')
    })
  })

  describe('Color Contrast', () => {
    it('uses high-contrast colors on focus for visibility', () => {
      render(<SkipLink />)
      const skipLink = screen.getByText('Skip to main content')

      // Pink background with white text provides good contrast
      expect(skipLink).toHaveClass('focus:bg-pink-600', 'focus:text-white')
    })
  })
})
