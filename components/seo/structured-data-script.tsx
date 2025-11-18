/**
 * Structured Data Script Component
 *
 * Reusable component for rendering schema.org JSON-LD structured data.
 * Provides type-safe API and eliminates manual JSON.stringify calls.
 *
 * Single Responsibility: Safely serialize and render structured data scripts.
 *
 * @example
 * ```tsx
 * import { StructuredDataScript } from '@/components/seo'
 * import { createOrganizationSchema } from '@/lib/seo'
 *
 * export function MyComponent() {
 *   const schema = createOrganizationSchema({
 *     name: blogConfig.site.name,
 *     url: blogConfig.site.url,
 *     sameAs: []
 *   })
 *
 *   return (
 *     <div>
 *       {/* ...content... *\/}
 *       <StructuredDataScript data={schema} />
 *     </div>
 *   )
 * }
 * ```
 */

// Type for JSON-LD structured data - accepts any serializable object
type JsonLdObject = Record<string, unknown>

interface StructuredDataScriptProps {
  /**
   * Structured data object (schema.org type)
   * Type safety is enforced by factory functions in lib/seo/
   * This component accepts any serializable object for JSON-LD
   */
  data: JsonLdObject | JsonLdObject[] | undefined | null
}

/**
 * Renders a JSON-LD script tag with structured data
 *
 * @param data - Schema.org structured data object
 */
export function StructuredDataScript({ data }: StructuredDataScriptProps) {
  // Don't render anything if data is null or undefined
  if (!data) {
    return null
  }

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
