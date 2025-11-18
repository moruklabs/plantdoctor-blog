import type { Metadata } from 'next'
import { pageMetadata } from '@/config/page-metadata'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = pageMetadata.notFound

export default function NotFound() {
  return (
    <>
      <main className="flex-1 flex items-center justify-center px-4 py-16 min-h-[calc(100vh-200px)]">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              The page you are looking for might have been removed, had its name changed, or is
              temporarily unavailable.
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>

            <div className="pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Popular Pages</h3>
              <nav className="space-y-2">
                <Link href="/tips" className="block text-blue-600 hover:text-blue-800 underline">
                  Tips & Articles
                </Link>
                <Link href="/guides" className="block text-blue-600 hover:text-blue-800 underline">
                  Guides
                </Link>
                <Link href="/apps" className="block text-blue-600 hover:text-blue-800 underline">
                  Apps
                </Link>
                <Link href="/news" className="block text-blue-600 hover:text-blue-800 underline">
                  News
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
