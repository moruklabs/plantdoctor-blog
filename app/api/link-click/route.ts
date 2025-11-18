import { NextRequest, NextResponse } from 'next/server'

async function sendToTelegram(
  linkUrl: string,
  linkText: string,
  requestInfo: Record<string, unknown>,
) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.debug('[Warning] Telegram credentials not configured. Skipping Telegram notification.')
    return
  }

  const message = `
🔗 *External Link Clicked*

📎 *Link:* ${linkUrl}
📝 *Text:* ${linkText}
⏰ *Time:* ${requestInfo.timestamp}
🌐 *IP:* ${requestInfo.ip || 'N/A'}
🔗 *Referer:* ${requestInfo.referer || 'N/A'}
🖥️ *User Agent:* ${requestInfo.userAgent || 'N/A'}
  `.trim()

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Telegram API error:', errorData)
    }
  } catch (error) {
    console.error('Failed to send Telegram notification:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url, text } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'Link URL is required' }, { status: 400 })
    }

    // Collect request info
    const requestInfo = {
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      referer: request.headers.get('referer'),
      acceptLanguage: request.headers.get('accept-language'),
      host: request.headers.get('host'),
      origin: request.headers.get('origin'),
      timestamp: new Date().toISOString(),
    }

    // Log click to console
    console.log('External link clicked:', {
      url,
      text: text || 'unknown',
      requestInfo,
    })

    // Send notification to Telegram (async, don't block response)
    sendToTelegram(url, text || 'unknown', requestInfo).catch((error) => {
      console.error('Telegram notification failed:', error)
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Link click tracking error:', error)
    return NextResponse.json({ error: 'Failed to track link click' }, { status: 500 })
  }
}
