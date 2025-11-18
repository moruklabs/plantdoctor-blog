import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/atoms/badge'

describe('Badge Atom', () => {
  it('renders children content', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  it('renders with default variant', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge).toHaveClass('bg-muted', 'text-muted-foreground')
  })

  it('renders with success variant', () => {
    render(<Badge variant="success">Success</Badge>)
    const badge = screen.getByText('Success')
    expect(badge).toHaveClass('bg-secondary', 'text-secondary-foreground')
  })

  it('renders with warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>)
    const badge = screen.getByText('Warning')
    expect(badge).toHaveClass('bg-accent', 'text-accent-foreground')
  })

  it('renders with info variant', () => {
    render(<Badge variant="info">Info</Badge>)
    const badge = screen.getByText('Info')
    expect(badge).toHaveClass('bg-primary/10', 'text-primary')
  })

  it('renders with extra small size', () => {
    render(<Badge size="xs">Extra Small</Badge>)
    const badge = screen.getByText('Extra Small')
    expect(badge).toHaveClass('text-xs', 'px-1.5', 'py-0.5')
  })

  it('renders with small size (default)', () => {
    render(<Badge>Small</Badge>)
    const badge = screen.getByText('Small')
    expect(badge).toHaveClass('text-xs', 'px-2', 'py-0.5')
  })

  it('renders with medium size', () => {
    render(<Badge size="md">Medium</Badge>)
    const badge = screen.getByText('Medium')
    expect(badge).toHaveClass('text-sm', 'px-2.5', 'py-1')
  })

  it('applies custom className', () => {
    render(<Badge className="custom-class">Custom</Badge>)
    const badge = screen.getByText('Custom')
    expect(badge).toHaveClass('custom-class')
  })

  it('combines variant, size, and custom className', () => {
    render(
      <Badge variant="success" size="md" className="ml-2">
        Combined
      </Badge>,
    )
    const badge = screen.getByText('Combined')
    expect(badge).toHaveClass('bg-secondary', 'text-sm', 'px-2.5', 'py-1', 'ml-2')
  })

  it('renders as inline-flex element', () => {
    render(<Badge>Inline</Badge>)
    const badge = screen.getByText('Inline')
    expect(badge).toHaveClass('inline-flex')
  })

  it('has rounded corners', () => {
    render(<Badge>Rounded</Badge>)
    const badge = screen.getByText('Rounded')
    expect(badge).toHaveClass('rounded')
  })

  it('has font-medium weight', () => {
    render(<Badge>Medium Weight</Badge>)
    const badge = screen.getByText('Medium Weight')
    expect(badge).toHaveClass('font-medium')
  })

  it('renders React node children', () => {
    render(
      <Badge>
        <span>Always</span> <strong>Active</strong>
      </Badge>,
    )
    expect(screen.getByText('Always')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
  })
})
