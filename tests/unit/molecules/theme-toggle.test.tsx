import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '@/components/molecules/theme-toggle'
import { useTheme } from 'next-themes'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

describe('ThemeToggle Molecule', () => {
  const mockSetTheme = jest.fn()
  const mockUseTheme = useTheme as jest.Mock

  beforeEach(() => {
    mockSetTheme.mockClear()
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })
  })

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<ThemeToggle />)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders enabled button in test environment', () => {
      render(<ThemeToggle />)
      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
    })
  })

  describe('Theme Icons', () => {
    it('displays sun icon for light theme', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByRole('button')
        expect(button).toHaveAttribute('title', 'Light theme')
        // Check for SVG with circle (sun icon)
        const svg = button.querySelector('svg')
        expect(svg).toBeInTheDocument()
      })
    })

    it('displays moon icon for dark theme', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByRole('button')
        expect(button).toHaveAttribute('title', 'Dark theme')
      })
    })

    it('displays info icon for minimal theme', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'minimal',
        setTheme: mockSetTheme,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByRole('button')
        expect(button).toHaveAttribute('title', 'Minimal theme')
      })
    })

    it('displays star icon for bold theme', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'bold',
        setTheme: mockSetTheme,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByRole('button')
        expect(button).toHaveAttribute('title', 'Bold theme')
      })
    })
  })

  describe('Theme Cycling', () => {
    it('cycles from light to dark', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        expect(screen.getByRole('button')).not.toBeDisabled()
      })

      fireEvent.click(screen.getByRole('button'))

      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('cycles from dark to minimal', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        expect(screen.getByRole('button')).not.toBeDisabled()
      })

      fireEvent.click(screen.getByRole('button'))

      expect(mockSetTheme).toHaveBeenCalledWith('minimal')
    })

    it('cycles from minimal to bold', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'minimal',
        setTheme: mockSetTheme,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        expect(screen.getByRole('button')).not.toBeDisabled()
      })

      fireEvent.click(screen.getByRole('button'))

      expect(mockSetTheme).toHaveBeenCalledWith('bold')
    })

    it('cycles from bold back to light', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'bold',
        setTheme: mockSetTheme,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        expect(screen.getByRole('button')).not.toBeDisabled()
      })

      fireEvent.click(screen.getByRole('button'))

      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('defaults to light theme when theme is undefined', async () => {
      mockUseTheme.mockReturnValue({
        theme: undefined,
        setTheme: mockSetTheme,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        expect(screen.getByRole('button')).not.toBeDisabled()
      })

      fireEvent.click(screen.getByRole('button'))

      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })
  })

  describe('Accessibility', () => {
    it('has descriptive aria-label', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByRole('button')
        expect(button).toHaveAttribute('aria-label', 'Light theme. Click to cycle to next theme.')
      })
    })

    it('has screen reader text', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        const srText = screen.getByText('Light theme', { selector: '.sr-only' })
        expect(srText).toBeInTheDocument()
      })
    })

    it('icons are hidden from screen readers', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        const svg = screen.getByRole('button').querySelector('svg')
        expect(svg).toHaveAttribute('aria-hidden', 'true')
      })
    })

    it('has focus ring styles', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByRole('button')
        expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-ring')
      })
    })
  })

  describe('Styling', () => {
    it('applies base button styles', async () => {
      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByRole('button')
        expect(button).toHaveClass(
          'inline-flex',
          'items-center',
          'justify-center',
          'rounded-lg',
          'border',
        )
      })
    })

    it('applies hover styles', async () => {
      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByRole('button')
        expect(button).toHaveClass('hover:bg-accent', 'hover:text-accent-foreground')
      })
    })

    it('applies transition styles', async () => {
      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByRole('button')
        expect(button).toHaveClass('transition-colors')
      })
    })
  })

  describe('Hydration', () => {
    it('shows actual theme after render', async () => {
      mockUseTheme.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
      })

      render(<ThemeToggle />)

      await waitFor(() => {
        const button = screen.getByRole('button')
        expect(button).not.toBeDisabled()
        expect(button).toHaveAttribute('title', 'Dark theme')
      })
    })
  })
})
