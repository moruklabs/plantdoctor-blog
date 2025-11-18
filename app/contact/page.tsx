import type { Metadata } from 'next'
import { Heading, Text } from '@/components/atoms'
import { contactPageContent } from '@/content/pages/en'
import { generatePageMetadata } from '@/lib/content/meta-helpers'
import { blogConfig } from '@/config'

export const metadata: Metadata = generatePageMetadata(
  'Contact',
  contactPageContent.hero.description,
  '/contact',
)

export default function ContactPage() {
  const { hero, faq, contentSuggestions, cta } = contactPageContent
  const contactEmail = blogConfig.company.contact.email

  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">{hero.emoji}</div>
          <Heading level={1} className="text-4xl md:text-5xl mb-6">
            {hero.heading}
          </Heading>
          <Text variant="lead" className="text-muted-foreground max-w-3xl mx-auto">
            {hero.description}
          </Text>
        </div>

        {/* FAQ Section */}
        <section className="mb-16">
          <Heading level={2} className="mb-8 text-center">
            {faq.heading}
          </Heading>
          <div className="space-y-6">
            {faq.items.map((item) => (
              <div key={item.question} className="bg-card rounded-xl p-6 shadow-lg border">
                <Heading level={3} className="text-xl mb-3">
                  {item.emoji} {item.question}
                </Heading>
                <Text className="text-muted-foreground">{item.answer}</Text>
              </div>
            ))}
          </div>
        </section>

        {/* Content Suggestions */}
        <section className="mb-16">
          <Heading level={2} className="mb-8 text-center">
            {contentSuggestions.heading}
          </Heading>
          <div className="bg-muted rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">💭</div>
              <Heading level={3} className="text-2xl mb-4">
                {contentSuggestions.hero.title}
              </Heading>
              <Text className="text-lg text-foreground max-w-2xl mx-auto">
                {contentSuggestions.hero.description}
              </Text>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl p-6 shadow-lg border">
                <Heading level={4} className="mb-3">
                  {contentSuggestions.categories.heading}
                </Heading>
                <ul className="space-y-2 text-muted-foreground">
                  {contentSuggestions.categories.items.map((topic) => (
                    <li key={topic}>• {topic}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-card rounded-xl p-6 shadow-lg border">
                <Heading level={4} className="mb-3">
                  {contentSuggestions.howToSuggest.heading}
                </Heading>
                <ul className="space-y-2 text-muted-foreground">
                  {contentSuggestions.howToSuggest.steps.map((step, index) => (
                    <li key={index}>
                      {index + 1}. {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-primary text-primary-foreground rounded-2xl p-12">
          <Heading level={2} className="mb-6">
            {cta.heading}
          </Heading>
          <Text className="text-lg mb-8 opacity-90">{cta.description}</Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center px-6 py-3 bg-background text-primary rounded-lg font-semibold hover:bg-muted transition-colors"
            >
              {cta.buttons[0].text}
            </a>
            <a
              href={`mailto:${contactEmail}?subject=Content Suggestion`}
              className="inline-flex items-center px-6 py-3 border-2 border-primary-foreground text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground hover:text-primary transition-colors"
            >
              {cta.buttons[1].text}
            </a>
          </div>
        </section>
      </div>
    </>
  )
}
