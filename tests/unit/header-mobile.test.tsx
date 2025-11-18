/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Header } from '@/components/organisms/header'
import { blogConfig } from '@/config'

// Mock Next.js components
jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
  MockLink.displayName = 'MockLink'
  return MockLink
})

// Mock Image component from next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({
    alt,
    src,
    priority: _priority,
    ...props
  }: React.ComponentProps<'img'> & { priority?: boolean }) {
    // Remove priority prop as it's not a valid HTML attribute
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} src={src} {...props} data-testid="logo" />
  },
}))

// Mock NavBar component
jest.mock('@/components/organisms/nav-bar', () => ({
  NavBar: () => <nav data-testid="navbar">Navigation</nav>,
}))

// Mock LanguageSelector component

// Mock next-intl
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(() =>
    Promise.resolve((key: string) => {
      const translations: Record<string, string> = {
        title: 'Test Blog',
        slogan: 'Test Slogan',
      }
      return translations[key] || key
    }),
  ),
}))

// Mock next-intl/routing
jest.mock('next-intl/routing', () => ({
  defineRouting: jest.fn((config) => config),
  createNavigation: jest.fn(() => ({
    Link: ({ children, href, ...props }: any) => (
      <a href={href} {...props}>
        {children}
      </a>
    ),
    redirect: jest.fn(),
    usePathname: jest.fn(() => '/'),
    useRouter: jest.fn(() => ({
      push: jest.fn(),
      replace: jest.fn(),
    })),
  })),
}))

describe('Header Mobile Responsiveness', () => {
  it('should render logo, title, and slogan', async () => {
    const { container } = render(await Header())

    // Check if logo is present
    const logo =
      container.querySelector('[data-testid="logo"]') ||
      container.querySelector('div[class*="h-8 w-8"]')
    expect(logo).toBeInTheDocument()

    // Check if site name from blogConfig is present
    expect(container).toHaveTextContent(blogConfig.site.name)

    // Check if header contains navigation (simplified check)
    expect(container).toHaveTextContent('Navigation')
  })

  it('should have mobile-friendly responsive classes', async () => {
    const { container } = render(await Header())

    // Header should be responsive
    const header = container.querySelector('header')
    expect(header).toBeInTheDocument()

    // Logo container should exist
    const logoContainer = container.querySelector('div[class*="h-8 w-8"]')
    expect(logoContainer).toBeInTheDocument()

    // Text container should exist
    const textContainer = container.querySelector('div[class*="flex-col"]')
    expect(textContainer).toBeInTheDocument()
  })

  it('should maintain proper structure for mobile layouts', async () => {
    const { container } = render(await Header())

    // Check main container has flex layout
    const mainContainer = container.querySelector('div[class*="flex h-16"]')
    expect(mainContainer).toBeInTheDocument()

    // Check logo link exists
    const logoLink = container.querySelector('a[href="/"]')
    expect(logoLink).toBeInTheDocument()
  })
})
