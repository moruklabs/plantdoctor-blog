/**
 * Legal Pages Content (English)
 *
 * This file contains structured content for all legal pages
 * (Terms & Conditions, Privacy Policy, Cookie Policy).
 * Organized for easy translation (i18n-ready).
 */

export const legalContent = {
  // ==========================================================================
  // TERMS & CONDITIONS
  // ==========================================================================
  terms: {
    hero: {
      emoji: '📜',
      title: 'Terms & Conditions',
      subtitle: 'Terms of Service',
    },
    introduction: {
      heading: 'Agreement to Terms',
      paragraphs: [
        'By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.',
        'If you do not agree to abide by the above, please do not use this service.',
      ],
    },
    sections: [
      {
        title: 'Use License',
        content:
          'Permission is granted to temporarily download one copy of the materials on this website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.',
      },
      {
        title: 'Disclaimer',
        content:
          'The materials on this website are provided on an "as is" basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.',
      },
      {
        title: 'Limitations',
        content:
          'In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on this website.',
      },
      {
        title: 'Accuracy of Materials',
        content:
          'The materials appearing on this website could include technical, typographical, or photographic errors. We do not warrant that any of the materials on this website are accurate, complete or current.',
      },
      {
        title: 'Links',
        content:
          "We have not reviewed all of the sites linked to this website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.",
      },
      {
        title: 'Modifications',
        content:
          'We may revise these terms of service for this website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.',
      },
    ],
    contact: {
      heading: 'Questions About Terms?',
      text: 'If you have any questions about these Terms & Conditions, please contact us.',
    },
  },

  // ==========================================================================
  // PRIVACY POLICY
  // ==========================================================================
  privacy: {
    hero: {
      emoji: '🔒',
      title: 'Privacy Policy',
      subtitle: 'How We Protect Your Information',
    },
    introduction: {
      heading: 'Your Privacy Matters',
      paragraphs: [
        'We are committed to protecting your privacy and ensuring you have a positive experience on our website.',
        'This policy outlines our data collection practices and how we use and protect your information.',
      ],
    },
    sections: [
      {
        title: 'Information We Collect',
        content:
          'We collect information you provide directly to us, such as when you subscribe to our newsletter, contact us, or interact with our content. This may include your name, email address, and any other information you choose to provide.',
      },
      {
        title: 'How We Use Your Information',
        content:
          'We use the information we collect to provide, maintain, and improve our services, to communicate with you, to send you updates and marketing communications (with your consent), and to personalize your experience.',
      },
      {
        title: 'Information Sharing and Disclosure',
        content:
          'We do not sell, trade, or otherwise transfer your personally identifiable information to third parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.',
      },
      {
        title: 'Data Security',
        content:
          'We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.',
      },
      {
        title: 'Cookies and Tracking Technologies',
        content:
          'We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.',
      },
      {
        title: 'Your Rights',
        content:
          'You have the right to access, update, or delete your personal information at any time. You may also opt-out of marketing communications and withdraw consent for data processing where applicable.',
      },
      {
        title: 'Changes to Privacy Policy',
        content:
          'We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.',
      },
    ],
    contact: {
      heading: 'Privacy Questions?',
      text: 'If you have any questions about this Privacy Policy, please contact us.',
    },
  },

  // ==========================================================================
  // COOKIE POLICY
  // ==========================================================================
  cookies: {
    hero: {
      emoji: '🍪',
      title: 'Cookie Policy',
      subtitle: 'How We Use Cookies',
    },
    introduction: {
      heading: 'About Cookies',
      paragraphs: [
        'This Cookie Policy explains how we use cookies and similar technologies to recognize you when you visit our website.',
        'It explains what these technologies are and why we use them, as well as your rights to control our use of them.',
      ],
    },
    sections: [
      {
        title: 'What Are Cookies?',
        content:
          'Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.',
      },
      {
        title: 'Why We Use Cookies',
        content:
          'We use cookies for several reasons. Some cookies are required for technical reasons for our website to operate. Other cookies enable us to track and target the interests of our users to enhance the experience on our website.',
      },
      {
        title: 'Types of Cookies We Use',
        content:
          'Essential Cookies: Necessary for the website to function properly. Analytics Cookies: Help us understand how visitors interact with our website. Preference Cookies: Remember your preferences and settings. Marketing Cookies: Track your activity to deliver more relevant advertising.',
      },
      {
        title: 'Third-Party Cookies',
        content:
          'In addition to our own cookies, we may also use various third-party cookies to report usage statistics of our website, deliver advertisements, and provide analytics services.',
      },
      {
        title: 'How to Control Cookies',
        content:
          'You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality may be restricted.',
      },
      {
        title: 'Updates to This Policy',
        content:
          'We may update this Cookie Policy from time to time to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons.',
      },
    ],
    contact: {
      heading: 'Questions About Cookies?',
      text: 'If you have any questions about our use of cookies or other technologies, please contact us.',
    },
  },

  // ==========================================================================
  // SHARED UI ELEMENTS
  // ==========================================================================
  ui: {
    backToHome: 'Back to Home',
    effectiveDate: 'Effective Date',
    lastUpdated: 'Last Updated',
    contactUs: 'Contact Us',
    readMore: 'Read More',
    tableOfContents: 'Table of Contents',
  },
} as const
