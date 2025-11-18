import { render, screen } from '@testing-library/react'
import { Text } from '@/components/atoms/text'

describe('Text Atom', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing', () => {
      render(<Text>Test text</Text>)
      expect(screen.getByText('Test text')).toBeInTheDocument()
    })

    it('renders children content', () => {
      render(<Text>This is body text</Text>)
      expect(screen.getByText('This is body text')).toBeInTheDocument()
    })

    it('renders React nodes as children', () => {
      render(
        <Text>
          Hello <em>world</em>
        </Text>,
      )
      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('world')).toBeInTheDocument()
    })
  })

  describe('HTML Elements', () => {
    it('renders as p element by default', () => {
      render(<Text>Paragraph text</Text>)
      const text = screen.getByText('Paragraph text')
      expect(text.tagName).toBe('P')
    })

    it('renders as span when as="span"', () => {
      render(<Text as="span">Span text</Text>)
      const text = screen.getByText('Span text')
      expect(text.tagName).toBe('SPAN')
    })

    it('renders as label when as="label"', () => {
      render(<Text as="label">Label text</Text>)
      const text = screen.getByText('Label text')
      expect(text.tagName).toBe('LABEL')
    })

    it('renders as div when as="div"', () => {
      render(<Text as="div">Div text</Text>)
      const text = screen.getByText('Div text')
      expect(text.tagName).toBe('DIV')
    })
  })

  describe('Text Variants', () => {
    it('applies body variant styles by default', () => {
      render(<Text>Body text</Text>)
      const text = screen.getByText('Body text')
      expect(text).toHaveClass('text-base', 'leading-relaxed')
    })

    it('applies lead variant styles', () => {
      render(<Text variant="lead">Lead text</Text>)
      const text = screen.getByText('Lead text')
      expect(text).toHaveClass('text-xl', 'leading-relaxed')
    })

    it('applies caption variant styles', () => {
      render(<Text variant="caption">Caption text</Text>)
      const text = screen.getByText('Caption text')
      expect(text).toHaveClass('text-sm')
    })

    it('applies label variant styles', () => {
      render(<Text variant="label">Label text</Text>)
      const text = screen.getByText('Label text')
      expect(text).toHaveClass('text-sm', 'font-medium')
    })
  })

  describe('Color Variants', () => {
    it('applies appropriate text color for body variant', () => {
      render(<Text variant="body">Body</Text>)
      const text = screen.getByText('Body')
      expect(text).toHaveClass('text-gray-700', 'dark:text-gray-300')
    })

    it('applies appropriate text color for lead variant', () => {
      render(<Text variant="lead">Lead</Text>)
      const text = screen.getByText('Lead')
      expect(text).toHaveClass('text-gray-600', 'dark:text-gray-400')
    })

    it('applies appropriate text color for caption variant', () => {
      render(<Text variant="caption">Caption</Text>)
      const text = screen.getByText('Caption')
      expect(text).toHaveClass('text-gray-500', 'dark:text-gray-400')
    })

    it('applies appropriate text color for label variant', () => {
      render(<Text variant="label">Label</Text>)
      const text = screen.getByText('Label')
      expect(text).toHaveClass('text-gray-700', 'dark:text-gray-300')
    })
  })

  describe('Custom Styling', () => {
    it('accepts custom className', () => {
      render(<Text className="custom-class">Custom text</Text>)
      const text = screen.getByText('Custom text')
      expect(text).toHaveClass('custom-class')
    })

    it('combines default and custom classes', () => {
      render(
        <Text variant="body" className="text-blue-600">
          Blue text
        </Text>,
      )
      const text = screen.getByText('Blue text')
      expect(text).toHaveClass('text-blue-600', 'text-base')
    })

    it('allows custom classes to override defaults', () => {
      render(<Text className="text-2xl">Large text</Text>)
      const text = screen.getByText('Large text')
      expect(text).toHaveClass('text-2xl')
    })
  })

  describe('Label-Specific Features', () => {
    it('adds htmlFor attribute when as="label"', () => {
      render(
        <Text as="label" htmlFor="input-id">
          Input Label
        </Text>,
      )
      const label = screen.getByText('Input Label')
      expect(label).toHaveAttribute('for', 'input-id')
    })

    it('does not add htmlFor when not a label', () => {
      render(
        <Text as="p" htmlFor="input-id">
          Not a label
        </Text>,
      )
      const text = screen.getByText('Not a label')
      expect(text).not.toHaveAttribute('for')
    })

    it('uses label variant with label element', () => {
      render(
        <Text as="label" variant="label" htmlFor="field">
          Field Label
        </Text>,
      )
      const label = screen.getByText('Field Label')
      expect(label.tagName).toBe('LABEL')
      expect(label).toHaveClass('text-sm', 'font-medium')
      expect(label).toHaveAttribute('for', 'field')
    })
  })

  describe('Variant and Element Combinations', () => {
    it('renders lead variant as span', () => {
      render(
        <Text variant="lead" as="span">
          Lead span
        </Text>,
      )
      const text = screen.getByText('Lead span')
      expect(text.tagName).toBe('SPAN')
      expect(text).toHaveClass('text-xl')
    })

    it('renders caption variant as div', () => {
      render(
        <Text variant="caption" as="div">
          Caption div
        </Text>,
      )
      const text = screen.getByText('Caption div')
      expect(text.tagName).toBe('DIV')
      expect(text).toHaveClass('text-sm')
    })

    it('renders body variant as label', () => {
      render(
        <Text variant="body" as="label">
          Body label
        </Text>,
      )
      const text = screen.getByText('Body label')
      expect(text.tagName).toBe('LABEL')
      expect(text).toHaveClass('text-base')
    })
  })

  describe('Dark Mode Support', () => {
    it('includes dark mode classes for body variant', () => {
      render(<Text variant="body">Dark mode text</Text>)
      const text = screen.getByText('Dark mode text')
      expect(text.className).toMatch(/dark:text-gray-300/)
    })

    it('includes dark mode classes for lead variant', () => {
      render(<Text variant="lead">Dark mode lead</Text>)
      const text = screen.getByText('Dark mode lead')
      expect(text.className).toMatch(/dark:text-gray-400/)
    })

    it('includes dark mode classes for caption variant', () => {
      render(<Text variant="caption">Dark mode caption</Text>)
      const text = screen.getByText('Dark mode caption')
      expect(text.className).toMatch(/dark:text-gray-400/)
    })

    it('includes dark mode classes for label variant', () => {
      render(<Text variant="label">Dark mode label</Text>)
      const text = screen.getByText('Dark mode label')
      expect(text.className).toMatch(/dark:text-gray-300/)
    })
  })

  describe('Additional HTML Attributes', () => {
    it('forwards additional HTML attributes', () => {
      render(
        <Text data-testid="test-text" aria-label="Test">
          Attributed text
        </Text>,
      )
      const text = screen.getByTestId('test-text')
      expect(text).toHaveAttribute('aria-label', 'Test')
    })

    it('forwards event handlers', () => {
      const handleClick = jest.fn()
      render(<Text onClick={handleClick}>Clickable text</Text>)
      const text = screen.getByText('Clickable text')
      text.click()
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('forwards id attribute', () => {
      render(<Text id="unique-id">ID text</Text>)
      const text = screen.getByText('ID text')
      expect(text).toHaveAttribute('id', 'unique-id')
    })
  })

  describe('Typography', () => {
    it('applies leading-relaxed to body variant', () => {
      render(<Text variant="body">Relaxed leading</Text>)
      const text = screen.getByText('Relaxed leading')
      expect(text).toHaveClass('leading-relaxed')
    })

    it('applies leading-relaxed to lead variant', () => {
      render(<Text variant="lead">Lead relaxed</Text>)
      const text = screen.getByText('Lead relaxed')
      expect(text).toHaveClass('leading-relaxed')
    })

    it('applies font-medium to label variant', () => {
      render(<Text variant="label">Medium weight</Text>)
      const text = screen.getByText('Medium weight')
      expect(text).toHaveClass('font-medium')
    })
  })
})
