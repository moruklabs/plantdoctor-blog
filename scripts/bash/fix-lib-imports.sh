#!/bin/bash
# Fix all lib imports after reorganization

# Find all TypeScript/TSX files except node_modules, .next, etc.
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./out/*" \
  -not -path "./.ai/*" \
  -exec sed -i '' \
  -e "s|from '@/lib/analytics-helpers'|from '@/lib/analytics/analytics-helpers'|g" \
  -e "s|from '@/lib/gtm'|from '@/lib/analytics/gtm'|g" \
  -e "s|from '@/lib/link-tracking'|from '@/lib/analytics/link-tracking'|g" \
  -e "s|from '@/lib/web-vitals'|from '@/lib/analytics/web-vitals'|g" \
  -e "s|from '@/lib/blog-images'|from '@/lib/content/blog-images'|g" \
  -e "s|from '@/lib/content-utils'|from '@/lib/content/content-utils'|g" \
  -e "s|from '@/lib/guides'|from '@/lib/content/guides'|g" \
  -e "s|from '@/lib/mdx-processor'|from '@/lib/content/mdx-processor'|g" \
  -e "s|from '@/lib/posts'|from '@/lib/content/posts'|g" \
  -e "s|from '@/lib/relatedContent'|from '@/lib/content/relatedContent'|g" \
  -e "s|from '@/lib/podcasts'|from '@/lib/podcasts/podcasts'|g" \
  -e "s|from '@/lib/podcasts-shared'|from '@/lib/podcasts/podcasts-shared'|g" \
  -e "s|from '@/lib/anti-spam'|from '@/lib/security/anti-spam'|g" \
  -e "s|from '@/lib/turnstile'|from '@/lib/security/turnstile'|g" \
  -e "s|from '@/lib/cookie-consent'|from '@/lib/privacy/cookie-consent'|g" \
  -e "s|from '@/lib/guide-structured-data'|from '@/lib/seo/guide-structured-data'|g" \
  -e "s|from '@/lib/utils'|from '@/lib/utils/utils'|g" \
  {} \;

echo "✅ All lib imports updated!"
