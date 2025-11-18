import { blogConfig } from '@/config'

export const contactPageMetadata = {
  title: `Contact - ${blogConfig.site.name} | Get in Touch`,
  description:
    'Get in touch. Join our community, suggest content topics, or reach out with questions about our articles and guides.',
  path: '/contact',
} as const

export const contactPageTexts = {
  hero: {
    title: 'Get in Touch',
    lead: "Have questions? Want to suggest a topic? We'd love to hear from you! Connect with us through any of the channels below.",
  },
  faq: {
    title: 'Frequently Asked Questions',
    items: [
      {
        q: '❓ How often do you publish new content?',
        a: 'We publish new articles regularly, covering everything from profile optimization to conversation strategies and relationship building.',
      },
      {
        q: '💡 Can I suggest content topics?',
        a: 'Absolutely! We love hearing what topics our community wants to learn about. Feel free to share your suggestions and ideas with us.',
      },
      {
        q: `🔗 How does the blog relate to ${blogConfig.site.name} app?`,
        a: `Our blog provides in-depth strategies and mindset advice, while the ${blogConfig.site.name} app offers practical tools to implement these strategies in real-time.`,
      },
      {
        q: `📱 Is the ${blogConfig.site.name} app free?`,
        a: 'Visit our main site to learn about current features and pricing. We offer various options to help you succeed.',
      },
      {
        q: '💬 Do you offer personalized advice?',
        a: `While our blog provides general advice, the ${blogConfig.site.name} app offers personalized assistance based on your specific photos, conversations, and scenarios.`,
      },
      {
        q: '🎯 What makes your advice different?',
        a: "Our approach focuses on authenticity and real-world results. We don't believe in manipulation or games—just proven strategies that help you become the best version of yourself.",
      },
    ],
  },
  suggest: {
    title: 'Suggest Content Topics',
    ideaTitle: 'Have an Idea?',
    ideaSubtitle:
      "We're always looking for new topics to cover. What challenges are you facing? What would you like to learn more about?",
    categoriesHeading: 'Popular Topic Categories:',
    categories: [
      'Profile optimization strategies',
      'Conversation starters and flow',
      'Building confidence and overcoming anxiety',
      'Transitioning from online to offline',
      'Reading signals of interest',
      'Long-term relationship building',
    ],
    methodsHeading: 'How to Suggest:',
    methods: [
      'Browse our existing content for inspiration',
      'Think about your own challenges',
      'Share your ideas and feedback',
      "Tell us about topics you'd like to see covered",
    ],
  },
  cta: {
    title: 'Ready to Connect?',
    body: "Don't wait—join thousands of people who are already transforming their lives with proven strategies.",
    browseButton: '📚 Start Reading Our Advice',
    appButton: `🚀 Try ${blogConfig.site.name} App`,
    appButtonLabel: `Try ${blogConfig.site.name} App`,
  },
} as const
