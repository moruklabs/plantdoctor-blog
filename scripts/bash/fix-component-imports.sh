#!/bin/bash
#Fix all component imports after reorganization

# Find all TypeScript/TSX files except node_modules, .next, etc.
find . -type f \( -name "*.ts" -o -name "*.tsx" \) \
  -not -path "./node_modules/*" \
  -not -path "./.next/*" \
  -not -path "./out/*" \
  -not -path "./.ai/*" \
  -exec sed -i '' \
  -e "s|from '@/components/breadcrumbs'|from '@/components/molecules/breadcrumbs'|g" \
  -e "s|from '@/components/callout'|from '@/components/molecules/callout'|g" \
  -e "s|from '@/components/featured-post'|from '@/components/molecules/featured-post'|g" \
  -e "s|from '@/components/guide-cta'|from '@/components/molecules/guide-cta'|g" \
  -e "s|from '@/components/image-upload'|from '@/components/molecules/image-upload'|g" \
  -e "s|from '@/components/share-buttons'|from '@/components/molecules/share-buttons'|g" \
  -e "s|from '@/components/table-of-contents'|from '@/components/molecules/table-of-contents'|g" \
  -e "s|from '@/components/tag-cloud'|from '@/components/molecules/tag-cloud'|g" \
  -e "s|from '@/components/turnstile-widget'|from '@/components/molecules/turnstile-widget'|g" \
  -e "s|from '@/components/email-collection-modal'|from '@/components/organisms/email-collection-modal'|g" \
  -e "s|from '@/components/footer'|from '@/components/organisms/footer'|g" \
  -e "s|from '@/components/header'|from '@/components/organisms/header'|g" \
  -e "s|from '@/components/nav-bar'|from '@/components/organisms/nav-bar'|g" \
  -e "s|from '@/components/recent-posts-grid'|from '@/components/organisms/recent-posts-grid'|g" \
  -e "s|from '@/components/related-posts'|from '@/components/organisms/related-posts'|g" \
  -e "s|from '@/components/testimonials'|from '@/components/organisms/testimonials'|g" \
  -e "s|from '@/components/theme-provider'|from '@/components/organisms/theme-provider'|g" \
  -e "s|from '@/components/cookie-consent-banner'|from '@/components/templates/cookie-consent-banner'|g" \
  -e "s|from '@/components/cookie-settings-modal'|from '@/components/templates/cookie-settings-modal'|g" \
  -e "s|from '@/components/conditional-analytics'|from '@/components/analytics/conditional-analytics'|g" \
  -e "s|from '@/components/web-vitals-tracker'|from '@/components/analytics/web-vitals-tracker'|g" \
  {} \;

echo "✅ All component imports updated!"
