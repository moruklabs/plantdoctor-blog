import { blogConfig } from '@/config'

export const termsPageConfig = {
  metadata: {
    title: 'Terms & Conditions',
    description: `Read the Terms and Conditions governing your use of ${blogConfig.site.name}.`,
    path: '/terms-and-conditions',
  },
  labels: {
    pageTitle: 'Terms and Conditions',
    lastUpdatedLabel: 'Last updated:',
    lastUpdatedDate: '1 June 2024',

    section1Title: '1. Acceptance of the Terms',
    section1TextPart1: `By downloading, accessing, or using the ${blogConfig.site.name} mobile application or any related Services, you agree to be bound by these Terms and Conditions ("`,
    section1TermsWord: 'Terms',
    section1TextPart2: `"). If you do not agree, please do not use the Services.`,

    section2Title: '2. Eligibility',
    section2Text: `You must be at least 18 years old to use ${blogConfig.site.name}.`,

    section3Title: '3. User Account',
    section3Items: [
      'You are responsible for maintaining the confidentiality of your login credentials.',
      'You agree to provide accurate information and promptly update it as needed.',
      'We may suspend or terminate your account for violations of these Terms.',
    ],

    section4Title: '4. Acceptable Use',
    section4Intro: 'You agree not to:',
    section4Items: [
      'Use the Services for any unlawful, harmful, or harassing purpose;',
      'Upload content you do not own or have permission to share;',
      'Reverse engineer or attempt to extract source code from the app;',
      'Interfere with the proper functioning of the Services.',
    ],

    section5Title: '5. Intellectual Property',
    section5Text:
      'All content and software forming part of the Services are owned by or licensed to Moruk LLC and are protected by intellectual property laws. You are granted a limited, non-exclusive, non-transferable licence to use the Services for personal, non-commercial purposes.',

    section6Title: '6. Subscription & Payments',
    section6Text:
      'Some features may require payment. All fees, billing cycles, and refund policies are disclosed within the app. In-app purchases are handled by the relevant app store (Apple App Store or Google Play) and subject to its terms.',

    section7Title: '7. Disclaimer of Warranties',
    section7Text:
      'The Services are provided "as is" and "as available" without warranties of any kind. We do not guarantee that the Services will be uninterrupted or error-free.',

    section8Title: '8. Limitation of Liability',
    section8Text:
      'To the fullest extent permitted by law, Moruk LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.',

    section9Title: '9. Indemnity',
    section9Text:
      'You agree to indemnify and hold Moruk LLC harmless from any claims arising out of your use of the Services or violation of these Terms.',

    section10Title: '10. Governing Law',
    section10Text:
      'These Terms are governed by the laws of the State of Wyoming, United States. Any disputes shall be submitted to the exclusive jurisdiction of the courts located in Sheridan County, Wyoming.',

    section11Title: '11. Changes to Terms',
    section11Text:
      'We may update these Terms from time to time. Continued use of the Services after changes become effective constitutes acceptance of the revised Terms.',

    section12Title: '12. Contact',
  },
} as const
