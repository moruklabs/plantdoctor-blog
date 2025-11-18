import { Heading, Text } from '@/components/atoms'
import { topicSuggestionsConfig } from '@/config/topic-suggestions'

interface TopicSuggestionsProps {
  title?: string
  subtitle?: string
  categories?: string[]
  suggestionMethods?: string[]
  className?: string
}

const defaultCategories = [...topicSuggestionsConfig.categories]

const defaultSuggestionMethods = [...topicSuggestionsConfig.suggestionMethods]

export function TopicSuggestions({
  title = topicSuggestionsConfig.title,
  subtitle = topicSuggestionsConfig.subtitle,
  categories = defaultCategories,
  suggestionMethods = defaultSuggestionMethods,
  className = '',
}: TopicSuggestionsProps) {
  return (
    <section className={`mb-16 ${className}`}>
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">💭</div>
          <Heading level={3} className="mb-4">
            {title}
          </Heading>
          <Text variant="lead" className="max-w-2xl mx-auto">
            {subtitle}
          </Text>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Heading level={4} className="mb-3">
              {topicSuggestionsConfig.categoriesHeading}
            </Heading>
            <ul className="space-y-2 text-gray-600">
              {categories.map((category) => (
                <li key={category}>• {category}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <Heading level={4} className="mb-3">
              {topicSuggestionsConfig.methodsHeading}
            </Heading>
            <ul className="space-y-2 text-gray-600">
              {suggestionMethods.map((method) => (
                <li key={method}>• {method}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
