import type { Metadata } from 'next'
import { InternalLink } from '@/components/links'
import { Heading, Text } from '@/components/atoms'
import { aboutPageContent } from '@/content/pages/en'
import { pageMetadata } from '@/config/page-metadata'

export const metadata: Metadata = pageMetadata.about

export default function AboutPage() {
  const { hero, mission, whatWeOffer, ecosystem, approach, values, cta } = aboutPageContent

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

        {/* Mission Section */}
        <section className="mb-16">
          <Heading level={2} className="mb-8 text-center">
            {mission.heading}
          </Heading>
          <div className="bg-muted rounded-2xl p-8 mb-8">
            <Heading level={3} className="text-2xl mb-4">
              {mission.title}
            </Heading>
            <Text className="text-lg text-foreground">{mission.description}</Text>
          </div>
        </section>

        {/* What We Offer */}
        <section className="mb-16">
          <Heading level={2} className="mb-8 text-center">
            {whatWeOffer.heading}
          </Heading>
          <div className="grid md:grid-cols-2 gap-8">
            {whatWeOffer.items.map((item, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-lg border">
                <div className="text-3xl mb-4">{item.emoji}</div>
                <Heading level={3} className="text-xl mb-3">
                  {item.title}
                </Heading>
                <Text className="text-muted-foreground">{item.description}</Text>
              </div>
            ))}
          </div>
        </section>

        {/* Ecosystem Section */}
        <section className="mb-16">
          <Heading level={2} className="mb-8 text-center">
            {ecosystem.heading}
          </Heading>
          <div className="bg-muted rounded-2xl p-8">
            <Heading level={3} className="text-2xl mb-4">
              {ecosystem.title}
            </Heading>
            <Text className="text-lg text-foreground mb-6">{ecosystem.description}</Text>
            <Text className="text-lg text-foreground">{ecosystem.supportingText}</Text>
          </div>
        </section>

        {/* Our Approach */}
        <section className="mb-16">
          <Heading level={2} className="mb-8 text-center">
            {approach.heading}
          </Heading>
          <div className="bg-muted rounded-2xl p-8 mb-8">
            <Heading level={3} className="text-2xl mb-4">
              {approach.title}
            </Heading>
            <Text className="text-lg text-foreground mb-8">{approach.description}</Text>

            <div className="space-y-6">
              {approach.principles.map((principle, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <Heading level={4} className="text-xl mb-2">
                      {principle.title}
                    </Heading>
                    <Text className="text-muted-foreground">{principle.description}</Text>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <Heading level={2} className="mb-8 text-center">
            {values.heading}
          </Heading>
          <div className="grid md:grid-cols-3 gap-6">
            {values.items.map((value, index) => (
              <div key={index} className="text-center p-6 bg-card rounded-xl shadow-lg border">
                <Heading level={3} className="text-lg mb-3">
                  {value.title}
                </Heading>
                <Text className="text-muted-foreground">{value.description}</Text>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-primary text-primary-foreground rounded-2xl p-12">
          <Heading level={2} className="mb-6">
            {cta.heading}
          </Heading>
          <Text className="text-lg mb-8 opacity-90">{cta.description}</Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <InternalLink
              href="/tips"
              className="inline-flex items-center px-6 py-3 bg-background text-primary rounded-lg font-semibold hover:bg-muted transition-colors"
            >
              {cta.buttonText}
            </InternalLink>
          </div>
        </section>
      </div>
    </>
  )
}
