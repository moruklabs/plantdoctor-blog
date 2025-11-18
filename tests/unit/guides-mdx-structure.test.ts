import { createMDXValidationTest } from '@/lib/test-utils/mdx-validation'

describe('Guides MDX structure', () => {
  createMDXValidationTest({
    directory: 'guides',
    canonicalPrefix: 'https://news.plantdoctor.app/guides',
  })
})
