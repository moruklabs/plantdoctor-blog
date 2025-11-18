import { createMDXValidationTest } from '@/lib/test-utils/mdx-validation'

describe('Blog MDX structure', () => {
  createMDXValidationTest({
    directory: 'content/posts',
    canonicalPrefix: 'https://news.plantdoctor.app/tips',
    minFiles: 1,
  })
})
