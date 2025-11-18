import { Heading, Text } from '@/components/atoms'
import { TESTIMONIALS, TESTIMONIALS_COPY } from '@/config/testimonials'
import Link from 'next/link'
import { getUrlForApp } from '@/lib/content/apps'

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Heading level={2} className="text-4xl mb-6 text-foreground">
              {TESTIMONIALS_COPY.title}
            </Heading>
            <Text variant="lead" className="text-muted-foreground max-w-3xl mx-auto">
              {TESTIMONIALS_COPY.lead}
            </Text>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial) => {
              const CardWrapper = testimonial.appSlug
                ? ({ children }: { children: React.ReactNode }) => (
                    <Link
                      href={getUrlForApp(testimonial.appSlug!)}
                      className="block bg-card rounded-xl shadow-lg p-6 hover:shadow-xl transition-all relative overflow-hidden border hover:border-primary group"
                    >
                      {children}
                    </Link>
                  )
                : ({ children }: { children: React.ReactNode }) => (
                    <div className="bg-card rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow relative overflow-hidden border">
                      {children}
                    </div>
                  )

              return (
                <CardWrapper key={testimonial.id}>
                  {/* Icon badge */}
                  {testimonial.icon && (
                    <div className="absolute top-4 right-4 text-3xl opacity-20">
                      {testimonial.icon}
                    </div>
                  )}

                  {/* Star rating */}
                  <div
                    className="flex items-center gap-1 mb-4"
                    role="img"
                    aria-label={`${testimonial.rating} out of 5 stars`}
                  >
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-primary text-xl">
                        ⭐
                      </span>
                    ))}
                  </div>

                  {/* Achievement badge */}
                  {testimonial.achievement && (
                    <div className="inline-block bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      {testimonial.achievement}
                    </div>
                  )}

                  {/* Testimonial text */}
                  <Text className="text-foreground mb-6">&quot;{testimonial.text}&quot;</Text>

                  {/* User info */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.name}, {testimonial.age}
                      </p>
                      {testimonial.platform && (
                        <p className="text-sm text-muted-foreground">{testimonial.platform} user</p>
                      )}
                    </div>
                    {testimonial.appSlug && (
                      <div className="text-primary group-hover:translate-x-1 transition-transform">
                        →
                      </div>
                    )}
                  </div>
                </CardWrapper>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
