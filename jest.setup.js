// Mock 'marked' for tests to avoid ESM module errors
jest.mock('marked', () => {
  // Stub marked parser and configuration method
  const markedMock = (content) => `<p>${content}</p>`
  markedMock.setOptions = () => {}
  return { marked: markedMock }
})

import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// Polyfill TextEncoder and TextDecoder for jsdom
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Polyfill crypto.subtle for jsdom using Node.js crypto
import { webcrypto } from 'node:crypto'

// Set crypto on global object
Object.defineProperty(global, 'crypto', {
  value: webcrypto,
  writable: true,
  configurable: true,
})

// Mock window.open
global.window.open = jest.fn()

// Mock fetch
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({ success: true }),
  text: jest.fn().mockResolvedValue(
    `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
      <channel>
        <title>Mock Podcast</title>
        <description>Mock Description</description>
        <language>en</language>
        <itunes:image href="https://example.com/image.jpg"/>
        <lastBuildDate>Thu, 01 Jan 2025 00:00:00 GMT</lastBuildDate>
        <item>
          <title>Mock Episode 1</title>
          <description>Mock episode 1 description</description>
          <pubDate>Thu, 01 Jan 2025 00:00:00 GMT</pubDate>
          <guid>mock-episode-1</guid>
          <enclosure url="https://example.com/audio1.mp3" type="audio/mpeg" length="1000000"/>
          <itunes:duration>1800</itunes:duration>
        </item>
        <item>
          <title>Mock Episode 2</title>
          <description>Mock episode 2 description</description>
          <pubDate>Thu, 31 Dec 2024 00:00:00 GMT</pubDate>
          <guid>mock-episode-2</guid>
          <enclosure url="https://example.com/audio2.mp3" type="audio/mpeg" length="2000000"/>
          <itunes:duration>2400</itunes:duration>
        </item>
        <item>
          <title>Mock Episode 3</title>
          <description>Mock episode 3 description</description>
          <pubDate>Thu, 30 Dec 2024 00:00:00 GMT</pubDate>
          <guid>mock-episode-3</guid>
          <enclosure url="https://example.com/audio3.mp3" type="audio/mpeg" length="1500000"/>
          <itunes:duration>2100</itunes:duration>
        </item>
      </channel>
    </rss>`,
  ),
})
