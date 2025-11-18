import bundleAnalyzer from '@next/bundle-analyzer'
import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Only export static files when explicitly requested for CI/Lighthouse testing
  output: process.env.NEXT_STATIC_EXPORT === 'true' ? 'export' : undefined,
  // Disable trailing slash for consistent URLs across all environments
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/webp', 'image/avif'],
    // Only disable optimization for static exports (required for CI/Lighthouse)
    // Enable optimization for normal deployments for better performance
    unoptimized: process.env.NEXT_STATIC_EXPORT === 'true',
  },
  // Optimize JavaScript bundles and reduce unused code
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-navigation-menu',
      'autoprefixer',
      'clsx',
      'dotenv',
      'gray-matter',
      'marked',
      'next',
      'next-themes',
      'react',
      'react-dom',
      'tailwind-merge',
      'tailwindcss-animate',
    ],
  },
  // Modularize imports to reduce bundle size
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      preventFullImport: true,
    },
  },
  // Modern bundling optimizations
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Compiler optimizations for production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // Enable React compiler optimizations
    reactRemoveProperties:
      process.env.NODE_ENV === 'production' ? { properties: ['^data-testid$'] } : false,
  },
  // Webpack optimizations for bundle size
  webpack: (config, { dev, isServer }) => {
    // Add persistent filesystem caching for faster rebuilds
    config.cache = {
      type: 'filesystem',
      cacheDirectory: path.join(process.cwd(), '.next/cache/webpack'),
      buildDependencies: {
        config: [
          path.join(process.cwd(), 'next.config.mjs'),
          path.join(process.cwd(), 'package.json'),
        ],
      },
    }

    // Increase parallelism for faster builds
    config.parallelism = 8

    // Optimize bundle size for production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        sideEffects: false,
        usedExports: true,
        // Tree shaking optimizations
        innerGraph: true,
        mangleExports: true,
      }

      // Reduce bundle size by optimizing imports
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': './',
      }
    }

    return config
  },
  // Add 301 redirects for URL structure changes
  async redirects() {
    return [
      {
        source: '/blog/dating-profile-optimization-guide',
        destination: '/guides/dating-profile-optimization-guide',
        permanent: true, // 301 redirect for SEO
      },
    ]
  },
  // Only add headers for non-static builds
  ...(process.env.NEXT_STATIC_EXPORT !== 'true' && {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'DENY',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
            {
              key: 'Referrer-Policy',
              value: 'strict-origin-when-cross-origin',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'same-origin',
            },
            {
              key: 'Content-Security-Policy',
              value: [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: blob: https://images.unsplash.com https://via.placeholder.com https://www.googletagmanager.com https://www.google-analytics.com",
                "font-src 'self' data:",
                "connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://region1.analytics.google.com https://us-central1-morukbase.cloudfunctions.net https://api.telegram.org",
                "frame-src 'self'",
                "frame-ancestors 'none'",
                "base-uri 'self'",
                "form-action 'self'",
              ].join('; '),
            },
          ],
        },
        {
          source: '/manifest.json',
          headers: [
            {
              key: 'X-Robots-Tag',
              value: 'noindex, nofollow, noarchive',
            },
          ],
        },
        {
          source: '/favicon.ico',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
            {
              key: 'X-Robots-Tag',
              value: 'noindex, nofollow, noimageindex, noarchive',
            },
          ],
        },
        {
          source: '/_next/static/(.*)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
            {
              key: 'X-Robots-Tag',
              value: 'noindex, nofollow, noarchive',
            },
          ],
        },
      ]
    },
  }),
}

// Bundle analyzer configuration
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

// Compose plugins: bundle analyzer → nextConfig
export default withBundleAnalyzer(nextConfig)
