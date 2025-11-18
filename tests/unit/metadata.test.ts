/**
 * @jest-environment jsdom
 */
import { metadata as homeMetadata } from '@/app/page'
import { metadata as tipsMetadata } from '@/app/tips/page'
import { metadata as aboutMetadata } from '@/app/about/page'
import { metadata as contactMetadata } from '@/app/contact/page'
import { metadata as notFoundMetadata } from '@/app/not-found'

describe('Canonical URLs', () => {
  it('should have canonical URL on homepage', () => {
    expect(homeMetadata.alternates?.canonical).toBe('https://news.plantdoctor.app')
  })

  it('should have canonical URL on tips page', () => {
    expect(tipsMetadata.alternates?.canonical).toBe('https://news.plantdoctor.app/tips')
  })

  it('should have canonical URL on about page', () => {
    expect(aboutMetadata.alternates?.canonical).toBe('https://news.plantdoctor.app/about')
  })

  it('should have canonical URL on contact page', () => {
    expect(contactMetadata.alternates?.canonical).toBe('https://news.plantdoctor.app/contact')
  })

  it('should have canonical URL on 404 page', () => {
    expect(notFoundMetadata.alternates?.canonical).toBe('https://news.plantdoctor.app')
  })
})

describe('Metadata Structure', () => {
  it('should have consistent metadata structure across pages', () => {
    const pages = [
      { name: 'home', metadata: homeMetadata },
      { name: 'tips', metadata: tipsMetadata },
      { name: 'about', metadata: aboutMetadata },
      { name: 'contact', metadata: contactMetadata },
      { name: 'notFound', metadata: notFoundMetadata },
    ]

    pages.forEach(({ metadata }) => {
      expect(metadata.title).toBeDefined()
      expect(metadata.description).toBeDefined()
      expect(metadata.alternates?.canonical).toBeDefined()
      expect(metadata.alternates?.canonical).toMatch(/^https:\/\/news.plantdoctor.app/)
    })
  })
})
