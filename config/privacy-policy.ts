import { blogConfig } from '@/config'

export const privacyPageConfig = {
  metadata: {
    title: 'Privacy Policy',
    description: `Understand how ${blogConfig.company.legal.name} (${blogConfig.site.name}) collects, uses, and protects your personal information.`,
    path: '/privacy-policy',
  },
  labels: {
    pageTitle: 'Privacy Policy',
    effectiveDateLabel: 'Effective date:',
    section1Title: '1. Information We Collect',
    infoYouProvideLabel: 'Information you provide to us.',
    infoYouProvideText:
      'Account details, email address, profile photos, chat screenshots, and any other information you choose to share.',
    autoCollectedLabel: 'Automatically collected information.',
    autoCollectedText:
      'Device type, operating system version, IP address, usage data, and diagnostic logs.',
    cookiesLabel: 'Cookies & similar technologies.',
    cookiesTextBeforeLink: 'See our',
    cookiesTextAfterLink:
      'for details. We use cookies to improve your experience, analyze traffic, and understand user behavior. Analytics and user statistics tracking are only activated after you provide consent through our cookie banner.',
    cookiePolicyLinkText: 'Cookie Policy',

    section2Title: '2. How We Use Your Information',
    useItem1: 'To operate and maintain the Services;',
    useItem2: 'To personalise features such as photo rating or chat assistance;',
    useItem3:
      'To communicate with you, including updates and promotional messages (you may opt out);',
    useItem4: 'To monitor, analyse, and improve the Services and develop new features;',
    useItem5: 'To detect, prevent, and address technical issues or fraud;',
    useItem6: 'To comply with legal obligations.',

    section3Title: '3. Legal Basis for Processing (GDPR)',
    legalBasisText:
      'We process your personal data under the following bases: (a) your consent; (b) performance of a contract; (c) legitimate interests; and (d) compliance with legal obligations.',

    section4Title: '4. Sharing Your Information',
    sharingText:
      'We do not sell your personal data. We share information only with trusted processors who assist us in delivering the Services (e.g., cloud hosting, analytics) under strict data protection agreements, or when required by law.',

    section5Title: '5. International Transfers',
    internationalTransfersText:
      'Your data may be processed outside the European Economic Area. Where this occurs, we rely on EU Standard Contractual Clauses or other lawful transfer mechanisms.',

    section6Title: '6. Data Retention',
    dataRetentionText:
      'We retain personal data only as long as necessary to fulfil the purposes outlined in this policy, unless a longer retention period is required or permitted by law.',

    section7Title: '7. Your Rights',
    yourRightsTextBeforeContact:
      'Depending on your location, you may have rights to access, rectify, erase, restrict, or object to processing of your personal data, and the right to data portability. To exercise these rights, contact',
    yourRightsTextAfterContact: '.',

    section8Title: '8. Security',
    securityText:
      'We implement reasonable administrative, technical, and physical safeguards to protect your information. However, no Internet transmission is 100% secure.',

    section9Title: "9. Children's Privacy",
    childrensPrivacyTextBeforeSiteName:
      'is not directed to children under 16. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us for deletion.',

    section10Title: '10. Changes to This Policy',
    changesText:
      'We may update this Privacy Policy from time to time. Material changes will be notified via the app or email.',

    section11Title: '11. Contact',
    contactPhoneLabel: 'Phone:',
    contactEmailLabel: 'Email:',
  },
} as const

export function buildPrivacyIntroHtml(): string {
  const contactEmail = blogConfig.company.contact.email
  const contactEmailHref = `mailto:${contactEmail}`
  const companyName = blogConfig.company.legal.name
  const companyAddressCity = blogConfig.company.legal.city
  const companyAddressState = blogConfig.company.legal.state
  const companyAddressCountry = blogConfig.company.legal.country

  return `
  This Privacy Policy explains how <strong>${companyName}</strong> ("<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>")
  collects, uses, shares, and safeguards your information when you use the ${blogConfig.site.name} mobile application,
  website, and related services (collectively, the "<strong>Services</strong>"). We are registered in ${companyAddressCity},
  ${companyAddressState}, ${companyAddressCountry}. If you have any questions, please contact us at
  <a href="${contactEmailHref}" class="text-primary hover:underline">${contactEmail}</a>.
`
}
