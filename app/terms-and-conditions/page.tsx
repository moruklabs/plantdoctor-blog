import type { Metadata } from 'next'
import { Heading, Text } from '@/components/atoms'
import { legalContent } from '@/content/pages/en'
import { generateLegalPageMetadata, formatLegalDate } from '@/lib/content/meta-helpers'
import { blogConfig } from '@/config'

export const metadata: Metadata = generateLegalPageMetadata(
  'Terms & Conditions',
  legalContent.terms.introduction.paragraphs[0],
  '/terms-and-conditions',
)

export default function TermsPage() {
  const { terms } = legalContent
  const { email } = blogConfig.company.contact
  const effectiveDate = blogConfig.company.legalDocs.effectiveDate

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">{terms.hero.emoji}</div>
        <Heading level={1} className="text-4xl mb-2">
          {terms.hero.title}
        </Heading>
        <Text variant="caption" className="text-muted-foreground">
          {formatLegalDate(effectiveDate)}
        </Text>
      </div>

      {/* Introduction */}
      <section className="mb-12">
        <Heading level={2} className="text-2xl mb-4">
          {terms.introduction.heading}
        </Heading>
        {terms.introduction.paragraphs.map((paragraph, index) => (
          <Text key={index} className="mb-4">
            {paragraph}
          </Text>
        ))}
      </section>

      {/* Sections */}
      <div className="space-y-8">
        {terms.sections.map((section, index) => (
          <section key={index}>
            <Heading level={2} className="text-2xl mb-3">
              {section.title}
            </Heading>
            <Text className="text-muted-foreground">{section.content}</Text>
          </section>
        ))}
      </div>

      {/* Contact Section */}
      <section className="mt-12 p-6 bg-muted rounded-lg">
        <Heading level={2} className="text-xl mb-3">
          {terms.contact.heading}
        </Heading>
        <Text className="mb-2">{terms.contact.text}</Text>
        <a href={`mailto:${email}`} className="text-primary hover:underline font-medium">
          {email}
        </a>
      </section>
    </div>
  )
}
