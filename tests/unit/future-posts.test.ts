import { getAllPosts, getPostBySlug, isPostPublished } from '@/lib/content/posts'
import * as fs from 'fs'
import * as path from 'path'

// Mock the posts directory to use test fixtures
jest.mock('fs')
jest.mock('path')

const mockFs = fs as jest.Mocked<typeof fs>
const mockPath = path as jest.Mocked<typeof path>

describe('Future Post Filtering', () => {
  const mockPostsDir = '/mock/posts'

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock path.join to return our mock directory
    mockPath.join.mockImplementation((...args) => {
      if (args[args.length - 1] === 'posts') {
        return mockPostsDir
      }
      return args.join('/')
    })

    // Mock process.cwd()
    jest.spyOn(process, 'cwd').mockReturnValue('/mock')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('isPostPublished', () => {
    const originalDate = Date

    beforeEach(() => {
      // Mock current date to 2025-09-15
      global.Date = class extends originalDate {
        constructor(dateString?: string | number) {
          super()
          // If a date string is provided, parse it normally
          // Otherwise, return the mocked "today" date
          if (dateString) {
            return new originalDate(dateString)
          }
          return new originalDate('2025-09-15T12:00:00Z')
        }
        static now() {
          return new originalDate('2025-09-15T12:00:00Z').getTime()
        }
      } as DateConstructor
    })

    afterEach(() => {
      global.Date = originalDate
    })

    it('should return false for future dates', () => {
      expect(isPostPublished('2025-09-20')).toBe(false)
      expect(isPostPublished('2025-12-31')).toBe(false)
      expect(isPostPublished('2026-01-01')).toBe(false)
    })

    it("should return true for today's date", () => {
      expect(isPostPublished('2025-09-15')).toBe(true)
    })

    it('should return true for past dates', () => {
      expect(isPostPublished('2025-09-14')).toBe(true)
      expect(isPostPublished('2025-08-01')).toBe(true)
      expect(isPostPublished('2024-01-01')).toBe(true)
    })

    it('should handle date strings in different formats', () => {
      expect(isPostPublished('2025-09-15T00:00:00Z')).toBe(true)
      expect(isPostPublished('2025-09-15T23:59:59Z')).toBe(true)
    })
  })

  describe('getAllPosts with future date filtering', () => {
    const originalDate = Date

    beforeEach(() => {
      // Mock current date to 2025-09-15
      global.Date = class extends originalDate {
        constructor(dateString?: string | number) {
          super()
          if (dateString) {
            return new originalDate(dateString)
          }
          return new originalDate('2025-09-15T12:00:00Z')
        }
        static now() {
          return new originalDate('2025-09-15T12:00:00Z').getTime()
        }
      } as DateConstructor

      // Mock file system
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readdirSync.mockReturnValue([
        'past-post.mdx',
        'today-post.mdx',
        'future-post.mdx',
        'draft-post.mdx',
      ] as any)

      // Mock file reading for each post
      mockFs.readFileSync.mockImplementation((filePath: fs.PathOrFileDescriptor) => {
        const filePathStr = filePath.toString()

        if (filePathStr.includes('past-post.mdx')) {
          return `---
title: 'Past Post'
description: 'A post from the past'
tags: ['test']
date: '2025-09-10'
draft: false
canonical: 'https://blog.plantdoctor.app/blog/past-post'
readingTime: 5
---

# Past Post

This is a past post.`
        }

        if (filePathStr.includes('today-post.mdx')) {
          return `---
title: 'Today Post'
description: 'A post from today'
tags: ['test']
date: '2025-09-15'
draft: false
canonical: 'https://blog.plantdoctor.app/blog/today-post'
readingTime: 5
---

# Today Post

This is today's post.`
        }

        if (filePathStr.includes('future-post.mdx')) {
          return `---
title: 'Future Post'
description: 'A post from the future'
tags: ['test']
date: '2025-09-20'
draft: false
canonical: 'https://blog.plantdoctor.app/blog/future-post'
readingTime: 5
---

# Future Post

This is a future post.`
        }

        if (filePathStr.includes('draft-post.mdx')) {
          return `---
title: 'Draft Post'
description: 'A draft post'
tags: ['test']
date: '2025-09-10'
draft: true
canonical: 'https://blog.plantdoctor.app/blog/draft-post'
readingTime: 5
---

# Draft Post

This is a draft post.`
        }

        return ''
      })
    })

    afterEach(() => {
      global.Date = originalDate
    })

    it('should exclude future-dated posts', async () => {
      const posts = await getAllPosts()
      const slugs = posts.map((p) => p.metadata.slug)

      expect(slugs).not.toContain('future-post')
    })

    it("should include today's posts", async () => {
      const posts = await getAllPosts()
      const slugs = posts.map((p) => p.metadata.slug)

      expect(slugs).toContain('today-post')
    })

    it('should include past posts', async () => {
      const posts = await getAllPosts()
      const slugs = posts.map((p) => p.metadata.slug)

      expect(slugs).toContain('past-post')
    })

    it('should still exclude draft posts regardless of date', async () => {
      const posts = await getAllPosts()
      const slugs = posts.map((p) => p.metadata.slug)

      expect(slugs).not.toContain('draft-post')
    })

    it('should return posts sorted by date descending', async () => {
      const posts = await getAllPosts()
      const dates = posts.map((p) => new Date(p.metadata.date).getTime())

      for (let i = 1; i < dates.length; i++) {
        expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i])
      }
    })

    it('should return exactly 2 posts (past and today, excluding future and draft)', async () => {
      const posts = await getAllPosts()

      expect(posts.length).toBe(2)
    })
  })

  describe('getPostBySlug should not filter by date', () => {
    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true)
      mockFs.readFileSync.mockReturnValue(`---
title: 'Future Post'
description: 'A future post'
tags: ['test']
date: '2099-12-31'
draft: false
canonical: 'https://blog.plantdoctor.app/blog/future-post'
readingTime: 5
---

# Future Post

This post is from the future.`)
    })

    it('should fetch future posts by slug (for preview functionality)', async () => {
      const post = await getPostBySlug('future-post')

      expect(post.metadata.title).toBe('Future Post')
      expect(post.metadata.date).toBe('2099-12-31')
    })
  })
})
