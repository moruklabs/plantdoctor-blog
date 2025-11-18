import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from '@/components/links/external-link'
import { blogConfig } from '@/config'
import { generateLegalPageMetadata } from '@/lib/metadata'
import { BLOG_CONSTANTS } from '@/config/constants'
import { buildPrivacyIntroHtml, privacyPageConfig } from '@/config/privacy-policy'

export const metadata: Metadata = generateLegalPageMetadata(privacyPageConfig.metadata)

// Use centralized company info from blogConfig
const contactEmail = blogConfig.company.contact.email
const contactPhone = blogConfig.company.contact.phone || ''
const contactPhoneHref = blogConfig.company.contact.phoneHref || ''
const contactEmailHref = BLOG_CONSTANTS.COMPANY_EMAIL_HREF

const companyName = blogConfig.company.legal.name
const companyAddress = `${blogConfig.company.legal.address}, ${blogConfig.company.legal.city} ${blogConfig.company.legal.state} ${blogConfig.company.legal.postalCode}, ${blogConfig.company.legal.country}`
// Address parts available via blogConfig if needed elsewhere

// Page Content
const pageTitle = privacyPageConfig.labels.pageTitle
const effectiveDate = new Date(blogConfig.company.legalDocs.effectiveDate).toLocaleDateString(
  blogConfig.formatting.date.locale,
  { year: 'numeric', month: 'long', day: 'numeric' },
)
const effectiveDateLabel = privacyPageConfig.labels.effectiveDateLabel

// Introduction HTML generated via config helper
const introHtml = buildPrivacyIntroHtml()

// Section 1: Information We Collect
const section1Title = privacyPageConfig.labels.section1Title
const infoYouProvideLabel = privacyPageConfig.labels.infoYouProvideLabel
const infoYouProvideText = privacyPageConfig.labels.infoYouProvideText
const autoCollectedLabel = privacyPageConfig.labels.autoCollectedLabel
const autoCollectedText = privacyPageConfig.labels.autoCollectedText
const cookiesLabel = privacyPageConfig.labels.cookiesLabel
const cookiesTextBeforeLink = privacyPageConfig.labels.cookiesTextBeforeLink
const cookiesTextAfterLink = privacyPageConfig.labels.cookiesTextAfterLink
const cookiePolicyLinkText = privacyPageConfig.labels.cookiePolicyLinkText

// Section 2: How We Use Your Information
const section2Title = privacyPageConfig.labels.section2Title
const useItem1 = privacyPageConfig.labels.useItem1
const useItem2 = privacyPageConfig.labels.useItem2
const useItem3 = privacyPageConfig.labels.useItem3
const useItem4 = privacyPageConfig.labels.useItem4
const useItem5 = privacyPageConfig.labels.useItem5
const useItem6 = privacyPageConfig.labels.useItem6

// Section 3: Legal Basis for Processing (GDPR)
const section3Title = privacyPageConfig.labels.section3Title
const legalBasisText = privacyPageConfig.labels.legalBasisText

// Section 4: Sharing Your Information
const section4Title = privacyPageConfig.labels.section4Title
const sharingText = privacyPageConfig.labels.sharingText

// Section 5: International Transfers
const section5Title = privacyPageConfig.labels.section5Title
const internationalTransfersText = privacyPageConfig.labels.internationalTransfersText

// Section 6: Data Retention
const section6Title = privacyPageConfig.labels.section6Title
const dataRetentionText = privacyPageConfig.labels.dataRetentionText

// Section 7: Your Rights
const section7Title = privacyPageConfig.labels.section7Title
const yourRightsTextBeforeContact = privacyPageConfig.labels.yourRightsTextBeforeContact
const yourRightsTextAfterContact = privacyPageConfig.labels.yourRightsTextAfterContact

// Section 8: Security
const section8Title = privacyPageConfig.labels.section8Title
const securityText = privacyPageConfig.labels.securityText

// Section 9: Children's Privacy
const section9Title = privacyPageConfig.labels.section9Title
const childrensPrivacyTextBeforeSiteName =
  privacyPageConfig.labels.childrensPrivacyTextBeforeSiteName

// Section 10: Changes to This Policy
const section10Title = privacyPageConfig.labels.section10Title
const changesText = privacyPageConfig.labels.changesText

// Section 11: Contact
const section11Title = privacyPageConfig.labels.section11Title
const contactPhoneLabel = privacyPageConfig.labels.contactPhoneLabel
const contactEmailLabel = privacyPageConfig.labels.contactEmailLabel

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl prose prose-slate dark:prose-invert">
      <h1>{pageTitle}</h1>
      <p>
        {effectiveDateLabel} {effectiveDate}
      </p>

      <p dangerouslySetInnerHTML={{ __html: introHtml }} />

      <h2>{section1Title}</h2>
      <ul>
        <li>
          <strong>{infoYouProvideLabel}</strong> {infoYouProvideText}
        </li>
        <li>
          <strong>{autoCollectedLabel}</strong> {autoCollectedText}
        </li>
        <li>
          <strong>{cookiesLabel}</strong> {cookiesTextBeforeLink}{' '}
          <Link href="/cookie-policy" className="text-primary hover:underline">
            {cookiePolicyLinkText}
          </Link>{' '}
          {cookiesTextAfterLink}
        </li>
      </ul>

      <h2>{section2Title}</h2>
      <ul>
        <li>{useItem1}</li>
        <li>{useItem2}</li>
        <li>{useItem3}</li>
        <li>{useItem4}</li>
        <li>{useItem5}</li>
        <li>{useItem6}</li>
      </ul>

      <h2>{section3Title}</h2>
      <p>{legalBasisText}</p>

      <h2>{section4Title}</h2>
      <p>{sharingText}</p>

      <h2>{section5Title}</h2>
      <p>{internationalTransfersText}</p>

      <h2>{section6Title}</h2>
      <p>{dataRetentionText}</p>

      <h2>{section7Title}</h2>
      <p>
        {yourRightsTextBeforeContact}{' '}
        <ExternalLink href={contactEmailHref} className="text-primary hover:underline">
          {contactEmail}
        </ExternalLink>
        {yourRightsTextAfterContact}
      </p>

      <h2>{section8Title}</h2>
      <p>{securityText}</p>

      <h2>{section9Title}</h2>
      <p>
        {blogConfig.site.name} {childrensPrivacyTextBeforeSiteName}
      </p>

      <h2>{section10Title}</h2>
      <p>{changesText}</p>

      <h2>{section11Title}</h2>
      <p>
        {companyName} &ndash; {companyAddress}
        <br />
        {contactPhoneLabel}{' '}
        <ExternalLink href={contactPhoneHref} className="text-primary hover:underline">
          {contactPhone}
        </ExternalLink>
        <br />
        {contactEmailLabel}{' '}
        <ExternalLink href={contactEmailHref} className="text-primary hover:underline">
          {contactEmail}
        </ExternalLink>
      </p>
    </div>
  )
}
