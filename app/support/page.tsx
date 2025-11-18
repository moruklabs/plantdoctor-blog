import type { Metadata } from 'next'
import { Heading, Text } from '@/components/atoms'
import { blogConfig } from '@/config'
import { generatePageMetadata } from '@/lib/metadata'
import { supportPageContent } from '@/content/pages/en'

export const metadata: Metadata = generatePageMetadata({
  title: supportPageContent.header.title,
  description: supportPageContent.header.description,
  path: '/support',
})

export default function SupportPage() {
  const content = supportPageContent
  const company = blogConfig.company

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <Heading level={1}>{blogConfig.site.name} Support</Heading>
      <Text>{content.header.description}</Text>

      <Heading level={2}>{content.faq.heading}</Heading>
      {content.faq.items.map((item, index) => (
        <div key={index}>
          <Heading level={3}>{item.question}</Heading>
          <Text>{item.answer}</Text>
        </div>
      ))}

      <Heading level={2}>{content.contact.heading}</Heading>
      <Text>{content.contact.description}</Text>
      <ul>
        <li>
          <strong>Email:</strong>{' '}
          <a href={`mailto:${company.contact.email}`} className="text-primary hover:underline">
            {company.contact.email}
          </a>
        </li>
        <li>
          <strong>Company:</strong> {company.legal.name}, {company.legal.address},{' '}
          {company.legal.city} {company.legal.state} {company.legal.postalCode},{' '}
          {company.legal.country}
        </li>
        {company.contact.phone && (
          <li>
            <strong>Phone:</strong>{' '}
            <a href={company.contact.phoneHref} className="text-primary hover:underline">
              {company.contact.phone}
            </a>
          </li>
        )}
      </ul>

      <Heading level={2}>{content.contact.businessHours.heading}</Heading>
      <Text>{content.contact.businessHours.hours}</Text>
      <Text>{content.contact.businessHours.responseTime}</Text>

      <Heading level={2}>{content.resources.heading}</Heading>
      <ul>
        {content.resources.items.map((resource, index) => (
          <li key={index}>
            <a href={resource.link} className="text-primary hover:underline">
              <strong>{resource.title}</strong>
            </a>
            {' - '}
            {resource.description}
          </li>
        ))}
      </ul>
    </div>
  )
}
