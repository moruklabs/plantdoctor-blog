import { render, screen } from '@testing-library/react'
import { Heading } from '@/components/atoms/heading'

describe('Heading Atom', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Heading>Test Heading</Heading>)
      expect(screen.getByText('Test Heading')).toBeInTheDocument()
    })

    it('renders children content', () => {
      render(<Heading level={1}>Welcome to our site</Heading>)
      expect(screen.getByText('Welcome to our site')).toBeInTheDocument()
    })

    it('renders React nodes as children', () => {
      render(
        <Heading level={2}>
          Hello <strong>World</strong>
        </Heading>,
      )
      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('World')).toBeInTheDocument()
    })
  })

  describe('Semantic Levels', () => {
    it('renders h1 element when level is 1', () => {
      render(<Heading level={1}>H1 Heading</Heading>)
      const heading = screen.getByText('H1 Heading')
      expect(heading.tagName).toBe('H1')
    })

    it('renders h2 element when level is 2', () => {
      render(<Heading level={2}>H2 Heading</Heading>)
      const heading = screen.getByText('H2 Heading')
      expect(heading.tagName).toBe('H2')
    })

    it('renders h3 element when level is 3', () => {
      render(<Heading level={3}>H3 Heading</Heading>)
      const heading = screen.getByText('H3 Heading')
      expect(heading.tagName).toBe('H3')
    })

    it('renders h4 element when level is 4', () => {
      render(<Heading level={4}>H4 Heading</Heading>)
      const heading = screen.getByText('H4 Heading')
      expect(heading.tagName).toBe('H4')
    })

    it('renders h5 element when level is 5', () => {
      render(<Heading level={5}>H5 Heading</Heading>)
      const heading = screen.getByText('H5 Heading')
      expect(heading.tagName).toBe('H5')
    })

    it('renders h6 element when level is 6', () => {
      render(<Heading level={6}>H6 Heading</Heading>)
      const heading = screen.getByText('H6 Heading')
      expect(heading.tagName).toBe('H6')
    })

    it('defaults to h2 when no level is specified', () => {
      render(<Heading>Default Heading</Heading>)
      const heading = screen.getByText('Default Heading')
      expect(heading.tagName).toBe('H2')
    })
  })

  describe('Level-Based Styling', () => {
    it('applies h1 styles with appropriate text size and margin', () => {
      render(<Heading level={1}>Level 1</Heading>)
      const heading = screen.getByText('Level 1')
      expect(heading).toHaveClass('text-4xl', 'md:text-5xl', 'mb-6')
    })

    it('applies h2 styles with appropriate text size and margin', () => {
      render(<Heading level={2}>Level 2</Heading>)
      const heading = screen.getByText('Level 2')
      expect(heading).toHaveClass('text-3xl', 'md:text-4xl', 'mb-4')
    })

    it('applies h3 styles with appropriate text size and margin', () => {
      render(<Heading level={3}>Level 3</Heading>)
      const heading = screen.getByText('Level 3')
      expect(heading).toHaveClass('text-2xl', 'md:text-3xl', 'mb-3')
    })

    it('applies h4 styles with appropriate text size and margin', () => {
      render(<Heading level={4}>Level 4</Heading>)
      const heading = screen.getByText('Level 4')
      expect(heading).toHaveClass('text-xl', 'md:text-2xl', 'mb-3')
    })

    it('applies h5 styles with appropriate text size and margin', () => {
      render(<Heading level={5}>Level 5</Heading>)
      const heading = screen.getByText('Level 5')
      expect(heading).toHaveClass('text-lg', 'md:text-xl', 'mb-2')
    })

    it('applies h6 styles with appropriate text size and margin', () => {
      render(<Heading level={6}>Level 6</Heading>)
      const heading = screen.getByText('Level 6')
      expect(heading).toHaveClass('text-base', 'md:text-lg', 'mb-2')
    })

    it('applies font-bold to all headings', () => {
      render(<Heading level={1}>Bold Heading</Heading>)
      const heading = screen.getByText('Bold Heading')
      expect(heading).toHaveClass('font-bold')
    })
  })

  describe('Named Variants', () => {
    it('applies hero variant styles', () => {
      render(
        <Heading level={1} variant="hero">
          Hero Heading
        </Heading>,
      )
      const heading = screen.getByText('Hero Heading')
      expect(heading).toHaveClass('text-5xl', 'md:text-6xl', 'mb-8')
    })

    it('applies section variant styles', () => {
      render(
        <Heading level={2} variant="section">
          Section Heading
        </Heading>,
      )
      const heading = screen.getByText('Section Heading')
      expect(heading).toHaveClass('text-3xl', 'md:text-4xl', 'mb-6')
    })

    it('applies subsection variant styles', () => {
      render(
        <Heading level={3} variant="subsection">
          Subsection Heading
        </Heading>,
      )
      const heading = screen.getByText('Subsection Heading')
      expect(heading).toHaveClass('text-2xl', 'md:text-3xl', 'mb-4')
    })

    it('variant overrides level-based styles', () => {
      render(
        <Heading level={6} variant="hero">
          Small element, hero style
        </Heading>,
      )
      const heading = screen.getByText('Small element, hero style')
      // Should have h6 element but hero variant styling
      expect(heading.tagName).toBe('H6')
      expect(heading).toHaveClass('text-5xl', 'md:text-6xl', 'mb-8')
      expect(heading).not.toHaveClass('text-base', 'md:text-lg') // not h6 styles
    })
  })

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(
        <Heading level={1} className="custom-class">
          Custom Heading
        </Heading>,
      )
      const heading = screen.getByText('Custom Heading')
      expect(heading).toHaveClass('custom-class')
    })

    it('combines default and custom classes', () => {
      render(
        <Heading level={2} className="text-blue-600">
          Blue Heading
        </Heading>,
      )
      const heading = screen.getByText('Blue Heading')
      expect(heading).toHaveClass('text-blue-600', 'font-bold', 'text-3xl')
    })
  })

  describe('Accessibility', () => {
    it('accepts id attribute for ARIA labelledby', () => {
      render(
        <Heading level={2} id="main-heading">
          Main Section
        </Heading>,
      )
      const heading = screen.getByText('Main Section')
      expect(heading).toHaveAttribute('id', 'main-heading')
    })

    it('uses semantic heading hierarchy', () => {
      render(
        <div>
          <Heading level={1}>Main Title</Heading>
          <Heading level={2}>Section</Heading>
          <Heading level={3}>Subsection</Heading>
        </div>,
      )

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('includes responsive text sizing classes', () => {
      render(<Heading level={1}>Responsive</Heading>)
      const heading = screen.getByText('Responsive')
      // Should have both base and md: breakpoint classes
      expect(heading.className).toMatch(/text-4xl/)
      expect(heading.className).toMatch(/md:text-5xl/)
    })

    it('applies responsive sizing for all levels', () => {
      const { rerender } = render(<Heading level={1}>Test</Heading>)
      let heading = screen.getByText('Test')
      expect(heading.className).toMatch(/md:/)

      rerender(<Heading level={3}>Test</Heading>)
      heading = screen.getByText('Test')
      expect(heading.className).toMatch(/md:/)

      rerender(<Heading level={6}>Test</Heading>)
      heading = screen.getByText('Test')
      expect(heading.className).toMatch(/md:/)
    })
  })
})
