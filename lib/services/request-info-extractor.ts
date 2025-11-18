/**
 * Request Info Extractor Utility
 *
 * Extracts request metadata from Next.js request object.
 * Single Responsibility: Request header extraction and formatting
 */

import type { NextRequest } from 'next/server'

/**
 * Request metadata extracted from Next.js request
 */
export interface RequestMetadata {
  userAgent: string | null
  ip: string | null
  referer: string | null
  acceptLanguage: string | null
  acceptEncoding: string | null
  host: string | null
  origin: string | null
  timestamp: string
  allHeaders: Record<string, string>
}

/**
 * Extract request metadata from Next.js request
 *
 * @param request - Next.js request object
 * @returns Structured request metadata
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const metadata = extractRequestInfo(request)
 *   console.log('Request from IP:', metadata.ip)
 * }
 * ```
 */
export function extractRequestInfo(request: NextRequest): RequestMetadata {
  return {
    userAgent: request.headers.get('user-agent'),
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
    referer: request.headers.get('referer'),
    acceptLanguage: request.headers.get('accept-language'),
    acceptEncoding: request.headers.get('accept-encoding'),
    host: request.headers.get('host'),
    origin: request.headers.get('origin'),
    timestamp: new Date().toISOString(),
    allHeaders: Object.fromEntries(request.headers.entries()),
  }
}

/**
 * Get remote IP address from request headers
 * Checks x-forwarded-for first, then x-real-ip
 *
 * @param request - Next.js request object
 * @returns IP address or undefined
 */
export function getRemoteIp(request: NextRequest): string | undefined {
  return request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
}
