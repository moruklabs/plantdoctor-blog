/**
 * Contact Page Content (English)
 *
 * This file contains all text content for the Contact page.
 * Organized for easy translation (i18n-ready).
 */

export const contactPageContent = {
  // Hero Section
  hero: {
    emoji: '📬',
    heading: 'Get in Touch',
    description:
      "Have a question, suggestion, or collaboration idea? We'd love to hear from you. Reach out and we'll get back to you as soon as possible.",
  },

  // FAQ Section
  faq: {
    heading: 'Frequently Asked Questions',
    items: [
      {
        emoji: '✍️',
        question: 'How can I contribute a guest post?',
        answer:
          "We welcome guest contributions! Send us an email with your article idea, outline, and writing samples. We'll review and get back to you within 5-7 business days.",
      },
      {
        emoji: '🤝',
        question: 'Do you offer consulting or partnerships?',
        answer:
          'Yes, we collaborate with companies and organizations on AI education initiatives, content creation, and technical consulting. Contact us to discuss your needs.',
      },
      {
        emoji: '💬',
        question: 'Can I request a specific topic?',
        answer:
          "Absolutely! We value reader input. Use the content suggestion form below to propose topics you'd like us to cover.",
      },
      {
        emoji: '📰',
        question: 'How do I subscribe to your newsletter?',
        answer:
          'You can subscribe using the form on our homepage or at the bottom of any article. We send weekly AI insights and never spam.',
      },
      {
        emoji: '🐛',
        question: 'I found an error in an article. How do I report it?',
        answer:
          "Thank you for helping us maintain accuracy! Email us with the article link and details about the error. We'll review and correct it promptly.",
      },
      {
        emoji: '🔐',
        question: 'How do you handle my personal information?',
        answer:
          'We take privacy seriously. Check our Privacy Policy for details on how we collect, use, and protect your data.',
      },
    ],
  },

  // Content Suggestions Section
  contentSuggestions: {
    heading: 'Suggest Content',
    hero: {
      title: 'What would you like to learn about?',
      description:
        "Your feedback shapes our content. Tell us what AI topics, tutorials, or guides you'd like to see.",
    },
    categories: {
      heading: 'Popular Topics',
      items: [
        'Machine Learning Fundamentals',
        'Large Language Models (LLMs)',
        'Computer Vision',
        'Natural Language Processing',
        'AI Ethics & Safety',
        'Deep Learning Architectures',
        'AI Tools & Frameworks',
        'Industry Applications',
      ],
    },
    howToSuggest: {
      heading: 'How to Suggest',
      steps: [
        'Email us with your topic idea',
        "Include specific questions or angles you'd like covered",
        "We'll review and add popular requests to our content calendar",
      ],
    },
  },

  // Call to Action Section
  cta: {
    heading: 'Ready to Connect?',
    description: 'Choose the best way to reach us based on your needs.',
    buttons: [
      {
        text: 'Send Email',
        variant: 'default' as const,
      },
      {
        text: 'Suggest Content',
        variant: 'outline' as const,
      },
    ],
  },
}
