'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface TocItem {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Only collect headings inside the main blog article to avoid capturing
    // footer or sidebar headings.
    const article = document.querySelector('article')
    if (!article) return

    const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const usedIds = new Set<string>()

    // First, collect all existing IDs from headings to avoid conflicts
    headings.forEach((heading) => {
      if (heading.id) {
        usedIds.add(heading.id)
      }
    })

    const tocItems: TocItem[] = Array.from(headings).map((heading, index) => {
      let finalId = heading.id

      // Only generate new ID if heading doesn't already have one
      if (!finalId) {
        // Generate base ID from text content
        const baseId =
          heading.textContent
            ?.toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters except letters, numbers, spaces, hyphens
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
            .trim() || `heading-${index}`

        // Ensure uniqueness by adding suffix if needed
        let uniqueId = baseId
        let counter = 1
        while (usedIds.has(uniqueId)) {
          uniqueId = `${baseId}-${counter}`
          counter++
        }

        finalId = uniqueId
        usedIds.add(finalId)

        // Set the ID on the heading element
        heading.id = finalId
      }

      return {
        id: finalId,
        text: heading.textContent || '',
        level: Number.parseInt(heading.tagName.charAt(1)),
      }
    })

    setToc(tocItems)

    // Set up intersection observer for active heading tracking
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -80% 0px' },
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  if (toc.length === 0) return null

  return (
    <aside className="sticky top-40">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Table of Contents</CardTitle>
        </CardHeader>
        <CardContent>
          <nav>
            <ul className="space-y-2">
              {toc.map((item, index) => (
                <li key={`${item.id}-${index}`}>
                  <a
                    href={`#${item.id}`}
                    className={`block text-sm transition-colors hover:text-primary ${
                      activeId === item.id ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}
                    style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </CardContent>
      </Card>
    </aside>
  )
}
