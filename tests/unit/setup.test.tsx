/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

describe('Basic Setup', () => {
  it('should be able to render components', () => {
    const TestComponent = () => <div>Hello Test</div>
    const { getByText } = render(<TestComponent />)
    expect(getByText('Hello Test')).toBeInTheDocument()
  })
})
