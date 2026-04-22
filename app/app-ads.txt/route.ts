import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

export async function GET() {
  const body = 'google.com, pub-9347276405837051, DIRECT, f08c47fec0942fa0\n'

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
