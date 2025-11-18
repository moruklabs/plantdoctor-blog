import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/organisms/footer'

// Mock the ExternalLink component
jest.mock('@/components/links', () => ({
  ExternalLink: ({ href, children, className }: any) => (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer nofollow">
      {children}
    </a>
  ),
}))

// Mock the config files
jest.mock('@/lib/config', () => ({
  siteConfig: {
    app: {
      news: '/news',
      tips: '/tips',
      guides: '/guides',
    },
    pages: {
      privacy: '/privacy',
      terms: '/terms',
      cookies: '/cookies',
      support: '/support',
    },
  },
}))

jest.mock('@/config', () => ({
  blogConfig: {
    site: {
      name: 'Plant Doctor Blog',
    },
  },
}))

jest.mock('@/config/footer', () => ({
  FOOTER_COPY: {
    brandHeading: 'About Plant Doctor',
    brandDescription: 'helps you grow.',
    landingPageUrl: 'https://plantdoctor.app',
  },
}))

jest.mock('@/config/constants', () => ({
  BLOG_CONSTANTS: {
    MORUK_URL: 'https://moruk.com',
    UMBRELLA_BRAND_NAME: 'Moruk',
    ORGANIZATION_NAME: 'Moruk Labs',
    APPS: {
      PLANT_DOCTOR: 'https://apps.apple.com/plant-doctor',
    },
  },
}))

describe('Footer Organism', () => {
  it('renders without crashing', () => {
    render(<Footer />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  describe('Footer Brand Section', () => {
    it('renders brand heading', () => {
      render(<Footer />)
      expect(screen.getByText('About Plant Doctor')).toBeInTheDocument()
    })

    it('renders brand description with links', () => {
      render(<Footer />)
      expect(screen.getByText(/helps you grow/i)).toBeInTheDocument()
      expect(screen.getByText('Plant Doctor')).toHaveAttribute('href', 'https://plantdoctor.app')
      expect(screen.getByText('Moruk')).toHaveAttribute('href', 'https://moruk.com')
    })

    it('renders App Store download button', () => {
      render(<Footer />)
      const downloadButton = screen.getByText('Download on App Store')
      expect(downloadButton).toBeInTheDocument()
      expect(downloadButton).toHaveAttribute('href', 'https://apps.apple.com/plant-doctor')
      expect(downloadButton).toHaveClass('bg-primary')
    })
  })

  describe('Content Section', () => {
    it('renders Content heading', () => {
      render(<Footer />)
      expect(screen.getByText('Content')).toBeInTheDocument()
    })

    it('renders all content navigation links', () => {
      render(<Footer />)
      const newsLink = screen.getByRole('link', { name: 'News' })
      const tipsLink = screen.getByRole('link', { name: 'Tips' })
      const guidesLink = screen.getByRole('link', { name: 'Guides' })

      expect(newsLink).toHaveAttribute('href', '/news')
      expect(tipsLink).toHaveAttribute('href', '/tips')
      expect(guidesLink).toHaveAttribute('href', '/guides')
    })

    it('applies hover styles to content links', () => {
      render(<Footer />)
      const newsLink = screen.getByRole('link', { name: 'News' })
      expect(newsLink).toHaveClass('hover:text-primary')
    })
  })

  describe('Legal Section', () => {
    it('renders Legal heading', () => {
      render(<Footer />)
      expect(screen.getByText('Legal')).toBeInTheDocument()
    })

    it('renders all legal navigation links', () => {
      render(<Footer />)
      const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' })
      const termsLink = screen.getByRole('link', { name: 'Terms & Conditions' })
      const cookiesLink = screen.getByRole('link', { name: 'Cookie Policy' })
      const supportLink = screen.getByRole('link', { name: 'Support' })

      expect(privacyLink).toHaveAttribute('href', '/privacy')
      expect(termsLink).toHaveAttribute('href', '/terms')
      expect(cookiesLink).toHaveAttribute('href', '/cookies')
      expect(supportLink).toHaveAttribute('href', '/support')
    })

    it('applies hover styles to legal links', () => {
      render(<Footer />)
      const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' })
      expect(privacyLink).toHaveClass('hover:text-primary')
    })
  })

  describe('Footer Bottom Section', () => {
    it('renders copyright notice with year 2025', () => {
      render(<Footer />)
      expect(screen.getByText(/© 2025/)).toBeInTheDocument()
    })

    it('renders organization name in copyright', () => {
      render(<Footer />)
      expect(screen.getByText(/Moruk Labs/)).toBeInTheDocument()
    })

    it('renders site name in copyright', () => {
      render(<Footer />)
      expect(screen.getByText(/Plant Doctor Blog/)).toBeInTheDocument()
    })

    it('applies border and spacing styles', () => {
      render(<Footer />)
      const footerBottom = screen.getByText(/© 2025/).closest('div')
      expect(footerBottom).toHaveClass('border-t', 'mt-8', 'pt-8')
    })
  })

  describe('Layout and Structure', () => {
    it('applies muted background to footer', () => {
      render(<Footer />)
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('bg-muted/50')
    })

    it('renders with 3-column grid layout', () => {
      render(<Footer />)
      // Check that the grid container exists with grid-cols-3
      const gridContainer = screen.getByRole('contentinfo').querySelector('.grid-cols-3')
      expect(gridContainer).toBeInTheDocument()
    })

    it('applies container padding and spacing', () => {
      render(<Footer />)
      const container = screen.getByRole('contentinfo').querySelector('.container')
      expect(container).toHaveClass('mx-auto', 'px-4', 'py-8')
    })
  })

  describe('Accessibility', () => {
    it('uses semantic footer element', () => {
      render(<Footer />)
      const footer = screen.getByRole('contentinfo')
      expect(footer.tagName).toBe('FOOTER')
    })

    it('renders headings with proper hierarchy', () => {
      render(<Footer />)
      const h3 = screen.getByRole('heading', { level: 3 })
      const h4Elements = screen.getAllByRole('heading', { level: 4 })

      expect(h3).toBeInTheDocument()
      expect(h4Elements).toHaveLength(2) // Content and Legal sections
    })

    it('renders lists for navigation sections', () => {
      render(<Footer />)
      const lists = screen.getAllByRole('list')
      expect(lists.length).toBeGreaterThan(0)
    })
  })
})
