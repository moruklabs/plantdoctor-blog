import type { Metadata } from 'next'
import { BLOG_CONSTANTS } from './constants'

const base = BLOG_CONSTANTS.BLOG_URL

export const pageMetadata = {
  home: {
    alternates: { canonical: base },
  } satisfies Partial<Metadata>,

  postNotFound: {
    title: 'Post Not Found',
    description: 'The requested blog post could not be found.',
  } satisfies Metadata,

  notFound: {
    title: `404 - Page Not Found | ${BLOG_CONSTANTS.SITE_NAME}`,
    description:
      'The page you are looking for could not be found. Browse our latest articles instead.',
    robots: 'noindex, follow',
    alternates: { canonical: base },
    openGraph: {
      title: `404 - Page Not Found | ${BLOG_CONSTANTS.SITE_NAME}`,
      description:
        'The page you are looking for could not be found. Browse our latest articles instead.',
      siteName: BLOG_CONSTANTS.SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `404 - Page Not Found | ${BLOG_CONSTANTS.SITE_NAME}`,
      description:
        'The page you are looking for could not be found. Browse our latest articles instead.',
    },
  } satisfies Metadata,

  about: {
    title: `About | ${BLOG_CONSTANTS.SITE_NAME}`,
    description:
      'Learn about our mission to share practical, high-signal insights with clarity and depth.',
    alternates: { canonical: `${base}/about` },
  } satisfies Metadata,

  cookiePolicy: {
    title: `Cookie Policy | ${BLOG_CONSTANTS.SITE_NAME} – ${BLOG_CONSTANTS.ORGANIZATION_NAME}`,
    description: `Learn how ${BLOG_CONSTANTS.ORGANIZATION_NAME} (${BLOG_CONSTANTS.SITE_NAME}) uses cookies and similar technologies on our website.`,
    alternates: { canonical: `${base}/cookie-policy` },
  } satisfies Metadata,

  terms: {
    title: `Terms & Conditions | ${BLOG_CONSTANTS.SITE_NAME} – ${BLOG_CONSTANTS.ORGANIZATION_NAME}`,
    description: `Read the Terms and Conditions governing your use of ${BLOG_CONSTANTS.SITE_NAME}.`,
    alternates: { canonical: `${base}/terms-and-conditions` },
  } satisfies Metadata,

  guideNotFound: {
    title: 'Guide Not Found',
    description: 'The requested guide could not be found.',
  } satisfies Metadata,
} as const
