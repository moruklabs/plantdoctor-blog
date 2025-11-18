// ==========================================================================
// BLOG CONSTANTS (centralized metadata)
// Break into base + derived to avoid duplication
// ==========================================================================
const APP_SHORT_NAME = 'plant-doctor'
function phoneToHref(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '')
  return `tel:+${digits}`
}

function emailToHref(email: string): string {
  return `mailto:${email}`
}

const BASE = {
  // Brand names
  UMBRELLA_BRAND_NAME: 'Moruk',
  BRAND_NAME: 'Plant Doctor',
  SITE_NAME: 'Plant Doctor News',
  AUTHOR_NAME: 'Plant Doctor Team',
  ORGANIZATION_NAME: 'Plant Doctor',

  // URLs and domains
  LANDING_PAGE_URL: 'https://plantdoctor.app',
  BLOG_DOMAIN: 'blog.plantdoctor.app',
  BLOG_URL: `https://blog.plantdoctor.app`,
  COMPANY_URL: 'https://moruk.ai',
  MORUK_URL: 'https://moruk.ai',
  APP_URL: 'https://plantdoctor.app',

  // Contact information
  COMPANY_EMAIL: 'hey@plantdoctor.app',
  COMPANY_EMAIL_HREF: emailToHref('hey@plantdoctor.app'),

  // Social media links
  TWITTER_URL: `https://moruk.link/${APP_SHORT_NAME}twitter`,
  GITHUB_URL: `https://moruk.link/${APP_SHORT_NAME}github`,
  LINKEDIN_URL: `https://moruk.link/${APP_SHORT_NAME}linkedin`,
  DISCORD_URL: `https://moruk.link/${APP_SHORT_NAME}discord`,
  YOUTUBE_URL: `https://moruk.link/${APP_SHORT_NAME}youtube`,
  TIKTOK_URL: `https://moruk.link/${APP_SHORT_NAME}tiktok`,
  INSTAGRAM_URL: `https://moruk.link/${APP_SHORT_NAME}instagram`,
  FACEBOOK_URL: `https://moruk.link/${APP_SHORT_NAME}facebook`,
  TELEGRAM_URL: `https://moruk.link/${APP_SHORT_NAME}telegram`,
  PINTEREST_URL: `https://moruk.link/${APP_SHORT_NAME}pinterest`,
  REDDIT_URL: `https://moruk.link/${APP_SHORT_NAME}reddit`,
  BLUESKY_URL: `https://moruk.link/${APP_SHORT_NAME}bluesky`,

  // Site information
  SITE_TAGLINE: 'AI Plant Doctor | Identify Plants, Breeds & Diseases',

  // Default description
  DEFAULT_DESCRIPTION:
    'Identify plants, recognize breeds, and diagnose diseases with AI-powered plant identification. Expert guides on plant care, disease treatment, and botanical knowledge.',

  // Author bio
  AUTHOR_BIO:
    'A team of plant experts, botanists, and AI engineers dedicated to helping plant enthusiasts identify species, recognize breeds, and diagnose diseases accurately.',

  // SEO keywords
  SEO_KEYWORDS: [
    'plant identification',
    'plant disease diagnosis',
    'AI plant doctor',
    'plant breed identification',
    'plant care guide',
    'botanical identification',
    'plant health',
    'disease treatment',
    'plant species recognition',
    'garden care',
  ] as const,

  // Company address
  COMPANY_ADDRESS: '1908 Thomes Ave STE 12470',
  COMPANY_CITY: 'Cheyenne',
  COMPANY_STATE: 'WY',
  COMPANY_COUNTRY: 'United States',
  COMPANY_POSTAL_CODE: '82001',

  // Company contact
  COMPANY_PHONE: '+1 (888) 432-2048',
  COMPANY_PHONE_HREF: phoneToHref('+1 (888) 432-2048'),

  // Localization
  SITE_LANGUAGE: 'en',
  SITE_TIMEZONE: 'UTC',

  // Legal documents
  LEGAL_DOCS_DATE: '2024-06-01',

  // Assets
  ASSETS_PATH: '/images',
} as const

// Derived constants (computed from BASE)
const DERIVED = {
  AUTHOR_AVATAR: `${BASE.BLOG_URL}${BASE.ASSETS_PATH}/author-avatar.jpg`,
  OG_IMAGE: `${BASE.BLOG_URL}${BASE.ASSETS_PATH}/og-default.jpg`,
  LOGO: `${BASE.BLOG_URL}${BASE.ASSETS_PATH}/logo.png`,
  ICON_48x48: '/icon-48x48.png',
  ICON_32x32: `/icon-32x32.png`,
} as const

export const BLOG_CONSTANTS = {
  ...BASE,
  ...DERIVED,
  // App Store portfolio and apps
  APPS: {
    DEVELOPER_PORTFOLIO: 'https://apps.apple.com/no/developer/moruk-llc/id1826185873',
    BREATHE_EASY: 'https://apps.apple.com/no/app/breathe-easy-calm-sleep/id6749237683',
    TEXT_PRO: 'https://apps.apple.com/no/app/textpro-ai-word-char-counter/id6748658370',
    RIZZMAN: 'https://apps.apple.com/no/app/rizzman-ai-dating-assistant/id6747261524',
    MINDAY: 'https://apps.apple.com/no/app/minday-daily-mindfulness/id6748837227',
    PLANT_DOCTOR: 'https://apps.apple.com/no/app/plant-doctor-ai-disease-id/id6748545235',
  } as const,
  // Web portfolio landing pages
  PORTFOLIO: {
    RIZZMAN_AI: 'https://moruk.link/rizzman',
    EASY_BREATH: 'https://moruk.link/easybreath',
    EASY_MEDITATE: 'https://moruk.link/easymeditate',
    PLANT_DOCTOR: 'https://moruk.link/plantdoctor',
    PRO_TEXT: 'https://moruk.link/protext',
    CRASH_CASTS: 'https://moruk.link/crashcasts',
    OPEN_POD: 'https://moruk.link/openpod',
    THE_INTERVAL: 'https://moruk.link/interval',
    MOKUM_LIVE: 'https://moruk.link/mokum-live',
    WIZBUDDY_AI: 'https://moruk.link/wizbuddy-ai',
    CAT_DOCTOR: 'https://moruk.link/catdoctor',
    DOG_DOCTOR: 'https://moruk.link/dogdoctor',
    ATOMIC_HABIT: 'https://moruk.link/atomichabit',
    PALM_READER_PRO: 'https://moruk.link/palm-reader-pro',
    TWIN_FLAME_PRO: 'https://moruk.link/twin-flame-pro',
    CRYSTAL_MOM: 'https://moruk.link/crystal-mom',
  } as const,
} as const
