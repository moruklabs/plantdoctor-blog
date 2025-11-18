import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { NavBar } from '@/components/organisms/nav-bar'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// Mock the config
jest.mock('@/lib/config', () => ({
  siteConfig: {
    app: {
      news: '/news',
      tips: '/tips',
      guides: '/guides',
    },
  },
}))

// Mock feature toggles
jest.mock('@/lib/feature-toggles', () => ({
  featureToggles: {
    tips: { enabled: true },
    guides: { enabled: true },
  },
}))

describe('NavBar Organism', () => {
  const mockUsePathname = usePathname as jest.Mock

  beforeEach(() => {
    mockUsePathname.mockReturnValue('/')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<NavBar />)
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  describe('Navigation Structure', () => {
    it('renders with proper ARIA label', () => {
      render(<NavBar />)
      const nav = screen.getByRole('navigation', { name: 'Main navigation' })
      expect(nav).toBeInTheDocument()
    })

    it('applies flex layout with spacing', () => {
      render(<NavBar />)
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('flex', 'items-center')
    })
  })

  describe('Navigation Links', () => {
    it('renders all navigation links when features are enabled', () => {
      render(<NavBar />)
      expect(screen.getByRole('link', { name: 'Tips' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'News' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Guides' })).toBeInTheDocument()
    })

    it('renders correct href attributes', () => {
      render(<NavBar />)
      expect(screen.getByRole('link', { name: 'Tips' })).toHaveAttribute('href', '/tips')
      expect(screen.getByRole('link', { name: 'News' })).toHaveAttribute('href', '/news')
      expect(screen.getByRole('link', { name: 'Guides' })).toHaveAttribute('href', '/guides')
    })

    it('applies consistent styling to all links', () => {
      render(<NavBar />)
      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).toHaveClass('font-medium', 'hover:text-primary', 'transition-colors')
      })
    })
  })

  describe('Active Page Indication', () => {
    it('marks home page as active when on root path', () => {
      mockUsePathname.mockReturnValue('/')
      render(<NavBar />)
      // None of the nav links should be marked as active on root path
      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).not.toHaveAttribute('aria-current', 'page')
      })
    })

    it('marks Tips link as active when on tips page', () => {
      mockUsePathname.mockReturnValue('/tips')
      render(<NavBar />)
      const tipsLink = screen.getByRole('link', { name: 'Tips' })
      expect(tipsLink).toHaveAttribute('aria-current', 'page')
    })

    it('marks News link as active when on news page', () => {
      mockUsePathname.mockReturnValue('/news')
      render(<NavBar />)
      const newsLink = screen.getByRole('link', { name: 'News' })
      expect(newsLink).toHaveAttribute('aria-current', 'page')
    })

    it('marks Guides link as active when on guides page', () => {
      mockUsePathname.mockReturnValue('/guides')
      render(<NavBar />)
      const guidesLink = screen.getByRole('link', { name: 'Guides' })
      expect(guidesLink).toHaveAttribute('aria-current', 'page')
    })

    it('marks link as active when on subpage (e.g., /tips/some-post)', () => {
      mockUsePathname.mockReturnValue('/tips/some-post')
      render(<NavBar />)
      const tipsLink = screen.getByRole('link', { name: 'Tips' })
      expect(tipsLink).toHaveAttribute('aria-current', 'page')
    })

    it('marks link as active when on nested subpage', () => {
      mockUsePathname.mockReturnValue('/guides/category/post')
      render(<NavBar />)
      const guidesLink = screen.getByRole('link', { name: 'Guides' })
      expect(guidesLink).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('Feature Toggle Integration', () => {
    it('shows Tips link when tips feature is enabled', () => {
      render(<NavBar />)
      expect(screen.getByRole('link', { name: 'Tips' })).toBeInTheDocument()
    })

    it('shows Guides link when guides feature is enabled', () => {
      render(<NavBar />)
      expect(screen.getByRole('link', { name: 'Guides' })).toBeInTheDocument()
    })

    it('always shows News link', () => {
      render(<NavBar />)
      expect(screen.getByRole('link', { name: 'News' })).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('uses semantic nav element', () => {
      render(<NavBar />)
      const nav = screen.getByRole('navigation')
      expect(nav.tagName).toBe('NAV')
    })

    it('provides ARIA label for navigation', () => {
      render(<NavBar />)
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation')
    })

    it('uses aria-current for active page indication', () => {
      mockUsePathname.mockReturnValue('/tips')
      render(<NavBar />)
      const tipsLink = screen.getByRole('link', { name: 'Tips' })
      expect(tipsLink).toHaveAttribute('aria-current', 'page')
    })

    it('does not set aria-current on inactive links', () => {
      mockUsePathname.mockReturnValue('/tips')
      render(<NavBar />)
      const newsLink = screen.getByRole('link', { name: 'News' })
      const guidesLink = screen.getByRole('link', { name: 'Guides' })
      expect(newsLink).not.toHaveAttribute('aria-current')
      expect(guidesLink).not.toHaveAttribute('aria-current')
    })
  })

  describe('Responsive Design', () => {
    it('applies responsive spacing classes', () => {
      render(<NavBar />)
      const nav = screen.getByRole('navigation')
      expect(nav).toHaveClass('space-x-2', 'sm:space-x-4', 'md:space-x-6')
    })

    it('applies responsive text size classes', () => {
      render(<NavBar />)
      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).toHaveClass('text-xs', 'sm:text-sm')
      })
    })
  })
})
