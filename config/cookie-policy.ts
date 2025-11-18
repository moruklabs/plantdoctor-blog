import { blogConfig } from '@/config'

export const cookiePolicyPageConfig = {
  metadata: {
    title: 'Cookie Policy',
    description: `Learn how ${blogConfig.company.legal.name} (${blogConfig.site.name}) uses cookies and similar technologies on our website and app.`,
    path: '/cookie-policy',
  },
  labels: {
    pageTitle: 'Cookie Policy',
    effectiveDateLabel: 'Effective date:',
    effectiveDate: '1 June 2024',
    introPart1: `This Cookie Policy explains how <strong>${blogConfig.company.legal.name}</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies and similar technologies when you visit the ${blogConfig.site.name} website or use the mobile application (collectively, the &quot;Services&quot;).`,

    section1Title: '1. What Are Cookies?',
    section1Text:
      'Cookies are small text files placed on your device that allow us to recognise your browser and collect information about your visit.',

    section2Title: '2. Types of Cookies We Use',
    strictlyNecessary:
      'Strictly Necessary Cookies – essential for the operation of the Services (e.g., authentication).',
    performance:
      'Performance Cookies – collect anonymous data on how users interact with the Services so we can improve them.',
    functionality:
      'Functionality Cookies – remember choices you make, such as language preferences.',
    targeting:
      'Targeting/Advertising Cookies – deliver relevant ads or measure campaign effectiveness (only with your consent where required).',

    section3Title: '3. How We Use Cookies',
    useIntro: 'We use cookies to:',
    useItem1: 'Authenticate users and secure their sessions;',
    useItem2: 'Remember preferences and settings;',
    useItem3: 'Analyse traffic and usage patterns to improve performance;',
    useItem4: 'Deliver and measure marketing campaigns.',

    section4Title: '4. Third-Party Cookies',
    section4Text:
      'We may allow approved partners to place cookies through the Services for analytics and advertising purposes. These providers are listed in our Privacy Policy and are bound by data protection agreements.',

    section5Title: '5. Your Choices',
    section5Text1:
      'Most browsers allow you to refuse or delete cookies. Removing cookies may affect the functionality of the Services. You can usually find these settings in your browser\'s "options" or "preferences" menu.',
    section5Text2:
      'Managing Your Consent: When you first visit our website, you will be presented with a cookie consent banner where you can choose to accept all cookies, reject optional cookies, or customize your preferences. You can change your cookie preferences at any time by clicking the "Cookie Settings" link in the footer of our website.',
    section5Text3:
      'We only activate analytics and marketing cookies after you have given explicit consent. Essential cookies remain active as they are necessary for the website to function properly.',

    section6Title: '6. Updates to This Policy',
    section6Text:
      'We may update this Cookie Policy periodically. Material changes will be communicated via the Services or email.',

    section7Title: '7. Contact',
    section7TextPrefix: 'If you have any questions about our use of cookies, please email us at ',
  },
} as const
