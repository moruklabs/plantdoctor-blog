import type { Metadata } from 'next'
import { ExternalLink } from '@/components/links'
import { Heading, Text } from '@/components/atoms'
import { generatePageMetadata } from '@/lib/content/meta-helpers'
import { blogConfig } from '@/config'
import { BLOG_CONSTANTS } from '@/config/constants'

export const metadata: Metadata = generatePageMetadata(
  'Community',
  'Join the Plant Doctor community. Connect with fellow gardening enthusiasts, review the app, and help us grow.',
  '/community',
)

export default function CommunityPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🌿</div>
          <Heading level={1} className="text-4xl md:text-5xl mb-6">
            Join the Plant Doctor Community
          </Heading>
          <Text variant="lead" className="text-muted-foreground max-w-3xl mx-auto">
            Connect with fellow plant lovers, share your gardening wins, get help diagnosing plant
            problems, and help us build the best plant care app on the market.
          </Text>
        </div>

        {/* Ways to contribute */}
        <section className="mb-16">
          <Heading level={2} className="mb-8 text-center">
            Get Involved
          </Heading>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-6 shadow-lg border">
              <div className="text-3xl mb-4">⭐</div>
              <Heading level={3} className="text-xl mb-3">
                Review Plant Doctor
              </Heading>
              <Text className="text-muted-foreground mb-4">
                Loving the app? Leave a review on the App Store. Your feedback helps other gardeners
                discover Plant Doctor and helps us improve.
              </Text>
              <ExternalLink
                href={BLOG_CONSTANTS.APPS.PLANT_DOCTOR}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
              >
                Review on App Store
              </ExternalLink>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border">
              <div className="text-3xl mb-4">✍️</div>
              <Heading level={3} className="text-xl mb-3">
                Suggest Content
              </Heading>
              <Text className="text-muted-foreground mb-4">
                Have a plant care topic you&apos;d love to see covered? We welcome content
                suggestions from the community — your questions drive our articles.
              </Text>
              <a
                href={`mailto:${blogConfig.company.contact.email}?subject=Content Suggestion`}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
              >
                Suggest a Topic
              </a>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border">
              <div className="text-3xl mb-4">🌱</div>
              <Heading level={3} className="text-xl mb-3">
                Share Your Plant Journey
              </Heading>
              <Text className="text-muted-foreground mb-4">
                Have a success story using Plant Doctor? A tricky diagnosis you solved? We&apos;d
                love to feature community stories in the blog.
              </Text>
              <a
                href={`mailto:${blogConfig.company.contact.email}?subject=My Plant Story`}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
              >
                Share Your Story
              </a>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border">
              <div className="text-3xl mb-4">📧</div>
              <Heading level={3} className="text-xl mb-3">
                Contact the Team
              </Heading>
              <Text className="text-muted-foreground mb-4">
                Got a bug report, feature request, or just want to say hello? The Plant Doctor team
                reads every message and values your input.
              </Text>
              <a
                href={`mailto:${blogConfig.company.contact.email}`}
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors text-sm"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-primary text-primary-foreground rounded-2xl p-12">
          <Heading level={2} className="mb-6">
            Ready to Grow Together?
          </Heading>
          <Text className="text-lg mb-8 opacity-90">
            Plant Doctor is built for plant lovers, by plant lovers. Download the app and join a
            growing community of gardeners around the world.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ExternalLink
              href={BLOG_CONSTANTS.APPS.PLANT_DOCTOR}
              className="inline-flex items-center px-6 py-3 bg-background text-primary rounded-lg font-semibold hover:bg-muted transition-colors"
            >
              Download Plant Doctor
            </ExternalLink>
            <a
              href={`mailto:${blogConfig.company.contact.email}`}
              className="inline-flex items-center px-6 py-3 border-2 border-primary-foreground text-primary-foreground rounded-lg font-semibold hover:bg-primary-foreground hover:text-primary transition-colors"
            >
              Say Hello
            </a>
          </div>
        </section>
      </div>
    </>
  )
}
