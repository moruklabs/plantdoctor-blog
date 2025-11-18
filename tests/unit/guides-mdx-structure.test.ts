import { createMDXValidationTest } from '@/lib/test-utils/mdx-validation'

describe('Guides MDX structure', () => {
  createMDXValidationTest({
    directory: 'guides',
    canonicalPrefix: 'https://blog.plantdoctor.app/guides',
  })
})
