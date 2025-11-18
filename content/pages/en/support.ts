/**
 * Support Page Content (English)
 *
 * This file contains all text content for the Support page.
 * Organized for easy translation (i18n-ready).
 */

export const supportPageContent = {
  // Page Header
  header: {
    title: 'Support Center',
    description: 'Find answers to common questions and get help when you need it.',
  },

  // FAQ Section
  faq: {
    heading: 'Frequently Asked Questions',
    items: [
      {
        question: 'How can I reset my subscription preferences?',
        answer:
          'You can manage your subscription preferences by clicking the "Manage Preferences" link at the bottom of any newsletter email.',
      },
      {
        question: 'Do you offer refunds for premium content?',
        answer:
          "All our content is currently free. If we introduce premium features in the future, we'll have a clear refund policy posted here.",
      },
      {
        question: 'How do I report a technical issue?',
        answer:
          'Please email us with details about the issue, including your browser, device, and steps to reproduce the problem.',
      },
      {
        question: 'Can I use your content in my own projects?',
        answer:
          'Our content is protected by copyright. For permission to republish or adapt our work, please contact us with details about your intended use.',
      },
    ],
  },

  // Contact Information
  contact: {
    heading: 'Contact Support',
    description: 'Need more help? Reach out to our support team.',
    businessHours: {
      heading: 'Business Hours',
      hours: 'Monday - Friday: 9:00 AM - 5:00 PM (UTC)',
      responseTime: 'We typically respond within 24-48 hours during business days.',
    },
  },

  // Additional Resources
  resources: {
    heading: 'Additional Resources',
    items: [
      {
        title: 'Documentation',
        description: 'Browse our guides and tutorials',
        link: '/guides',
      },
      {
        title: 'Blog Posts',
        description: 'Read our latest articles',
        link: '/tips',
      },
      {
        title: 'Privacy Policy',
        description: 'Learn how we protect your data',
        link: '/privacy-policy',
      },
      {
        title: 'Terms & Conditions',
        description: 'Review our terms of service',
        link: '/terms-and-conditions',
      },
    ],
  },
}
