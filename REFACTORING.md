# Blog Platform Refactoring Plan

## Executive Summary

This document outlines the systematic refactoring of the current dating advice application into a **clean, reusable, multi-theme blog platform** with internationalization support and comprehensive SEO optimization.

### Key Goals

1. **Simplify**: Remove tools, podcasts, and complex features
2. **Modularize**: Create reusable, themeable architecture
3. **Internationalize**: Add multi-language support without harming SEO
4. **Optimize**: Achieve 100% Lighthouse scores and full a11y compliance
5. **Document**: Provide clear setup and customization guides

### Development Principles

- **Incremental Changes**: Each phase in a separate branch
- **Test-Driven**: Keep all tests green throughout
- **Clean Code**: Follow DRY principles and best practices
- **Documentation First**: Document changes as we go

---

## Branch Strategy

```
main
├── refactor/phase-1-remove-tools
├── refactor/phase-2-remove-podcasts
├── refactor/phase-3-cleanup-socials
├── refactor/phase-4-simplify-homepage
├── refactor/phase-5-theme-architecture
├── refactor/phase-6-implement-themes
├── refactor/phase-7-internationalization
├── refactor/phase-8-seo-optimization
├── refactor/phase-9-blog-config
├── refactor/phase-10-testing-suite
├── refactor/phase-11-documentation
└── refactor/phase-12-final-cleanup
```

Each branch will:

1. Be created from the previous phase's branch
2. Include tests for the changes
3. Be merged back to main after review
4. Include documentation updates

---

## Phase 1: Remove Tools and AI Features

**Branch**: `refactor/phase-1-remove-tools`
**Priority**: HIGH
**Estimated Time**: 2-3 hours

### Objectives

- Remove all AI-powered tools (photo rating, smart opener, chat assist)
- Remove AI SDK dependencies
- Clean up related types and configurations

### Tasks

1. **Delete Directories**

   ```bash
   rm -rf app/tools/
   rm -rf app/api/ai/
   rm -rf lib/tool-configs/
   ```

2. **Delete Files**

   ```bash
   rm types/ai-tools.ts
   rm types/tool-page.ts
   rm components/templates/tool-page-template.tsx
   rm components/molecules/image-upload.tsx
   rm components/molecules/accessible-textarea.tsx
   ```

3. **Update Dependencies**

   ```bash
   pnpm remove @ai-sdk/openai ai
   ```

4. **Update Feature Toggles**
   - Set all `tools.*` and `toolsWidgets.*` to `false` in `lib/feature-toggles.ts`
   - Remove tool-related toggle definitions

5. **Update Navigation**
   - Remove tools links from `components/organisms/header.tsx`
   - Remove tools section from homepage (`app/page.tsx`)

6. **Update Sitemap**
   - Remove tool routes from `app/sitemap.ts`

7. **Clean Up Structured Data**
   - Remove SoftwareApplication schema from homepage
   - Remove download/join actions related to tools

8. **Run Tests**

   ```bash
   pnpm validate
   pnpm e2e
   ```

9. **Commit and Push**
   ```bash
   git add -A
   git commit -m "refactor: remove AI tools and related dependencies"
   git push origin refactor/phase-1-remove-tools
   ```

---

## Phase 2: Remove Podcasts System

**Branch**: `refactor/phase-2-remove-podcasts`
**Priority**: HIGH
**Estimated Time**: 2 hours

### Objectives

- Remove podcast functionality
- Clean up podcast-related components
- Remove RSS feed dependencies

### Tasks

1. **Delete Directories**

   ```bash
   rm -rf app/podcasts/
   rm -rf content/podcasts/
   rm -rf lib/podcasts/
   ```

2. **Delete Components**

   ```bash
   rm components/organisms/podcast-hero.tsx
   rm components/organisms/podcast-platform-links.tsx
   rm components/organisms/episode-card.tsx
   rm components/organisms/episodes-section.tsx
   rm components/organisms/related-episodes.tsx
   rm components/molecules/audio-player.tsx
   rm components/molecules/episode-sort.tsx
   rm components/molecules/transcript-toc.tsx
   ```

3. **Delete Scripts**

   ```bash
   rm scripts/sync-podcasts.ts
   ```

4. **Update Dependencies**

   ```bash
   pnpm remove fast-xml-parser
   ```

5. **Update Feature Toggles**
   - Set `podcasts.enabled` to `false`
   - Remove podcast-related toggles

6. **Update Navigation**
   - Remove podcast links from header
   - Remove podcast sections from footer

7. **Update Tests**
   - Remove or skip podcast-related tests
   - Update sitemap tests

8. **Run Tests**
   ```bash
   pnpm validate
   pnpm e2e
   ```

---

## Phase 3: Cleanup Social Features and Security

**Branch**: `refactor/phase-3-cleanup-socials`
**Priority**: MEDIUM
**Estimated Time**: 1-2 hours

### Objectives

- Simplify social media configuration
- Remove Cloudflare Turnstile references
- Clean up CSP headers

### Tasks

1. **Update Social Links Configuration**
   - Create `blog.config.ts` with customizable social links
   - Replace hardcoded placeholders with config values

2. **Update CSP Headers**
   - Remove Cloudflare Turnstile from `next.config.mjs`
   - Simplify security headers

3. **Clean Footer**
   - Simplify footer to show only essential links
   - Make social links optional/configurable

4. **Update Structured Data**
   - Remove unnecessary social media schemas
   - Simplify organization schema

---

## Phase 4: Simplify Homepage

**Branch**: `refactor/phase-4-simplify-homepage`
**Priority**: HIGH
**Estimated Time**: 3-4 hours

### Objectives

- Create minimal, clean blog landing page
- Focus on: Title, Tagline, "Read Tips" button
- Remove all tool widgets and complex sections

### New Homepage Structure

```tsx
<main>
  <Hero>
    <h1>{blogTitle}</h1>
    <p>{tagline}</p>
    <Button href="/tips">Read Tips</Button>
  </Hero>

  <RecentPosts limit={3} />

  <FeaturedGuides limit={2} />
</main>
```

### Tasks

1. **Redesign Homepage Component**
   - Create new minimal `app/page.tsx`
   - Focus on typography and whitespace
   - Mobile-first responsive design

2. **Create Hero Component**
   - Simple, centered hero section
   - Configurable title and tagline
   - Primary CTA button

3. **Simplify Structured Data**
   - Keep only essential schemas
   - Organization + WebSite + WebPage

4. **Update Metadata**
   - Simplify meta descriptions
   - Clean OpenGraph data

---

## Phase 5: Theme System Architecture

**Branch**: `refactor/phase-5-theme-architecture`
**Priority**: HIGH
**Estimated Time**: 4-5 hours

### Objectives

- Implement proper multi-theme architecture
- Create theme configuration system
- Set up theme switching mechanism

### Architecture Design

```typescript
// themes/types.ts
interface Theme {
  name: string
  colors: ColorPalette
  typography: Typography
  spacing: Spacing
  components: ComponentStyles
}

// themes/registry.ts
const themes: Record<string, Theme> = {
  default: defaultTheme,
  dark: darkTheme,
  minimal: minimalTheme,
  bold: boldTheme,
}
```

### Tasks

1. **Create Theme Structure**

   ```
   themes/
   ├── types.ts           # Theme interfaces
   ├── registry.ts        # Theme registry
   ├── provider.tsx       # Enhanced theme provider
   ├── default/
   │   ├── index.ts
   │   ├── colors.ts
   │   ├── typography.ts
   │   └── components.ts
   ├── dark/
   ├── minimal/
   └── bold/
   ```

2. **Implement Theme Provider**
   - Extend next-themes
   - Add theme configuration context
   - Support dynamic theme loading

3. **Create CSS Variable System**
   - Design token system
   - Semantic color naming
   - Component-level tokens

4. **Update Tailwind Config**
   - Dynamic theme integration
   - Custom plugin for theme utilities

5. **Add Theme Switcher UI**
   - Create theme selector component
   - Add to header or settings
   - Persist user preference

---

## Phase 6: Implement Themes

**Branch**: `refactor/phase-6-implement-themes`
**Priority**: HIGH
**Estimated Time**: 6-8 hours

### Objectives

- Create 4 distinct themes
- Ensure consistent application across components
- Test all themes thoroughly

### Theme Specifications

#### 1. Default Theme (Light, Professional)

```css
:root {
  --primary: hsl(215, 100%, 50%); /* Blue */
  --background: hsl(0, 0%, 100%); /* White */
  --foreground: hsl(0, 0%, 10%); /* Near black */
  --font-sans: 'Inter', system-ui;
  --font-serif: 'Playfair Display', serif;
}
```

#### 2. Dark Theme (Dark, Modern)

```css
.dark {
  --primary: hsl(215, 100%, 60%); /* Light blue */
  --background: hsl(0, 0%, 8%); /* Near black */
  --foreground: hsl(0, 0%, 95%); /* Near white */
}
```

#### 3. Minimal Theme (Monochrome, Clean)

```css
.minimal {
  --primary: hsl(0, 0%, 0%); /* Black */
  --background: hsl(0, 0%, 100%); /* White */
  --foreground: hsl(0, 0%, 0%); /* Black */
  --font-sans: 'Helvetica Neue', sans-serif;
}
```

#### 4. Bold Theme (Colorful, Playful)

```css
.bold {
  --primary: hsl(330, 100%, 50%); /* Magenta */
  --secondary: hsl(50, 100%, 50%); /* Yellow */
  --background: hsl(330, 100%, 98%); /* Light pink */
  --foreground: hsl(330, 100%, 10%); /* Dark purple */
  --font-sans: 'Poppins', sans-serif;
}
```

### Tasks

1. **Implement Each Theme**
   - Define color palettes
   - Set typography scales
   - Configure spacing systems
   - Style components

2. **Update Components**
   - Ensure all use theme variables
   - Remove hardcoded colors
   - Test with each theme

3. **Create Theme Preview**
   - Build theme showcase page
   - Document theme usage
   - Provide customization guide

---

## Phase 7: Internationalization (i18n)

**Branch**: `refactor/phase-7-internationalization`
**Priority**: HIGH
**Estimated Time**: 8-10 hours

### Objectives

- Add multi-language support
- Maintain SEO optimization
- Implement language switching

### Implementation Strategy

#### Library Choice: `next-intl` (App Router optimized)

#### File Structure

```
locales/
├── en/
│   ├── common.json
│   ├── blog.json
│   ├── navigation.json
│   └── metadata.json
├── es/
├── fr/
├── de/
└── ja/
```

#### Routing Strategy

```
/[locale]/tips/[slug]
/[locale]/guides/[slug]
/[locale]/about
```

### Tasks

1. **Install and Configure next-intl**

   ```bash
   pnpm add next-intl
   ```

2. **Set Up Middleware**

   ```typescript
   // middleware.ts
   import createMiddleware from 'next-intl/middleware'

   export default createMiddleware({
     locales: ['en', 'es', 'fr', 'de', 'ja'],
     defaultLocale: 'en',
     localePrefix: 'as-needed',
   })
   ```

3. **Create Translation Files**
   - Extract all strings from components
   - Create JSON translation files
   - Set up translation keys

4. **Update Routing**
   - Add locale parameter to routes
   - Update links to include locale
   - Handle locale switching

5. **SEO Considerations**
   - Implement hreflang tags
   - Update sitemap for multiple languages
   - Locale-specific metadata

6. **Content Translation Strategy**
   - MDX file organization per locale
   - Fallback to default language
   - Translation workflow documentation

---

## Phase 8: SEO Optimization

**Branch**: `refactor/phase-8-seo-optimization`
**Priority**: HIGH
**Estimated Time**: 4-6 hours

### Objectives

- Achieve 100% Lighthouse scores
- Implement comprehensive structured data
- Optimize for Core Web Vitals

### SEO Checklist

#### Technical SEO

- [x] Dynamic sitemap generation
- [ ] Robots.txt optimization
- [ ] Canonical URLs for all pages
- [ ] Hreflang tags (with i18n)
- [ ] XML sitemap per locale
- [ ] JSON-LD structured data

#### Performance SEO

- [ ] Image optimization (WebP, AVIF)
- [ ] Lazy loading for images
- [ ] Resource hints (preconnect, prefetch)
- [ ] Critical CSS inlining
- [ ] Font optimization
- [ ] Bundle size optimization

#### Content SEO

- [ ] Meta descriptions (unique per page)
- [ ] OpenGraph tags (complete)
- [ ] Twitter Cards
- [ ] Schema.org markup
- [ ] Breadcrumbs
- [ ] FAQ schema where applicable

### Tasks

1. **Audit Current SEO**
   - Run Lighthouse on all page types
   - Check structured data with Google tool
   - Analyze Core Web Vitals

2. **Optimize Images**
   - Convert to WebP/AVIF
   - Implement responsive images
   - Add proper alt texts

3. **Enhance Structured Data**

   ```typescript
   // lib/seo/schemas/
   ├── article.ts
   ├── blog-posting.ts
   ├── organization.ts
   ├── person.ts
   ├── website.ts
   └── breadcrumbs.ts
   ```

4. **Performance Optimization**
   - Implement code splitting
   - Optimize bundle sizes
   - Add resource hints
   - Minimize layout shifts

---

## Phase 9: Blog Configuration System

**Branch**: `refactor/phase-9-blog-config`
**Priority**: HIGH
**Estimated Time**: 3-4 hours

### Objectives

- Create centralized configuration
- Make blog easily customizable
- Provide configuration validation

### Configuration Structure

```typescript
// blog.config.ts
export const blogConfig = {
  // Site Information
  site: {
    name: 'My Blog',
    description: 'A minimal blog platform',
    url: 'https://myblog.com',
    logo: '/logo.svg',
    favicon: '/favicon.ico',
  },

  // Theme Settings
  theme: {
    default: 'light',
    available: ['light', 'dark', 'minimal', 'bold'],
  },

  // Localization
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'fr'],
    localeDetection: true,
  },

  // Content Settings
  content: {
    postsPerPage: 10,
    excerptLength: 150,
    enableComments: false,
    enableSearch: true,
  },

  // SEO Settings
  seo: {
    titleTemplate: '%s | My Blog',
    defaultImage: '/og-image.jpg',
    twitterHandle: '@myblog',
  },

  // Social Links
  social: {
    twitter: 'https://twitter.com/myblog',
    github: 'https://github.com/myblog',
    linkedin: null,
    instagram: null,
  },

  // Features
  features: {
    tips: true,
    guides: true,
    newsletter: false,
    rss: true,
  },

  // Navigation
  navigation: {
    header: [
      { label: 'Tips', href: '/tips' },
      { label: 'Guides', href: '/guides' },
      { label: 'About', href: '/about' },
    ],
    footer: [
      { label: 'Privacy', href: '/privacy-policy' },
      { label: 'Terms', href: '/terms-and-conditions' },
    ],
  },
}
```

### Tasks

1. **Create Configuration Schema**
   - Use Zod for validation
   - Provide TypeScript types
   - Add default values

2. **Replace Hardcoded Values**
   - Update all components
   - Remove placeholders
   - Use config values

3. **Create Config Validator**
   - Validate on build
   - Provide helpful errors
   - Check required fields

4. **Document Configuration**
   - Create setup guide
   - Provide examples
   - List all options

---

## Phase 10: Testing Suite Enhancement

**Branch**: `refactor/phase-10-testing-suite`
**Priority**: HIGH
**Estimated Time**: 6-8 hours

### Objectives

- Add comprehensive a11y testing
- Implement Lighthouse CI
- Increase test coverage

### Testing Strategy

#### Accessibility Testing

```typescript
// tests/a11y/
├── axe-tests.spec.ts       # Axe-core integration
├── keyboard-nav.spec.ts    # Keyboard navigation
├── screen-reader.spec.ts   # Screen reader compatibility
└── color-contrast.spec.ts  # Color contrast checks
```

#### Lighthouse CI Configuration

```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      staticDistDir: './out',
      url: ['/', '/tips', '/guides', '/tips/sample-post'],
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
      },
    },
  },
}
```

### Tasks

1. **Install Testing Libraries**

   ```bash
   pnpm add -D @axe-core/playwright @lhci/cli
   ```

2. **Create a11y Test Suite**
   - Page-level accessibility tests
   - Component accessibility tests
   - Keyboard navigation tests
   - ARIA compliance tests

3. **Set Up Lighthouse CI**
   - Configure thresholds
   - Add to CI pipeline
   - Create performance budget

4. **Visual Regression Testing**
   - Set up Percy or Chromatic
   - Capture theme variations
   - Test responsive layouts

5. **Coverage Reports**
   - Configure coverage thresholds
   - Generate coverage badges
   - Add to documentation

---

## Phase 11: Documentation

**Branch**: `refactor/phase-11-documentation`
**Priority**: MEDIUM
**Estimated Time**: 4-6 hours

### Objectives

- Create comprehensive documentation
- Provide setup guides
- Include examples and best practices

### Documentation Structure

```
docs/
├── README.md                 # Main documentation
├── SETUP.md                 # Quick start guide
├── CONFIGURATION.md         # Configuration reference
├── THEMES.md               # Theme customization
├── I18N.md                 # Internationalization guide
├── SEO.md                  # SEO optimization guide
├── DEPLOYMENT.md           # Deployment guide
├── CONTRIBUTING.md         # Contribution guidelines
└── examples/
    ├── basic-blog/
    ├── multi-language/
    └── custom-theme/
```

### Tasks

1. **Create Setup Documentation**
   - Prerequisites
   - Installation steps
   - Initial configuration
   - First deployment

2. **Write Theme Guide**
   - Theme structure
   - Creating custom themes
   - Component styling
   - Design tokens

3. **Document i18n Process**
   - Adding languages
   - Translation workflow
   - Content management
   - SEO considerations

4. **Create Examples**
   - Basic blog setup
   - Custom theme example
   - Multi-language blog
   - Advanced configurations

---

## Phase 12: Final Cleanup and Optimization

**Branch**: `refactor/phase-12-final-cleanup`
**Priority**: LOW
**Estimated Time**: 2-3 hours

### Objectives

- Remove all remaining dating-specific content
- Optimize bundle size
- Final performance tuning

### Tasks

1. **Content Cleanup**
   - Remove sample dating content
   - Add generic blog samples
   - Update all placeholders

2. **Dependency Audit**

   ```bash
   pnpm audit
   pnpm depcheck
   ```

3. **Bundle Analysis**

   ```bash
   pnpm analyze
   ```

4. **Performance Optimization**
   - Tree shaking verification
   - Dead code elimination
   - CSS purging

5. **Final Testing**
   - Full test suite
   - Manual QA
   - Cross-browser testing
   - Mobile testing

6. **Create Release**
   - Version tagging
   - Changelog
   - Release notes

---

## Success Metrics

### Performance

- [ ] Lighthouse Performance: 95+
- [ ] Lighthouse Accessibility: 100
- [ ] Lighthouse SEO: 100
- [ ] Lighthouse Best Practices: 95+
- [ ] First Contentful Paint: <1.5s
- [ ] Time to Interactive: <3.5s

### Code Quality

- [ ] TypeScript strict mode enabled
- [ ] 80%+ test coverage
- [ ] Zero ESLint errors
- [ ] Zero TypeScript errors
- [ ] All tests passing

### Features

- [ ] 4+ themes available
- [ ] 3+ languages supported
- [ ] Full keyboard navigation
- [ ] Screen reader compatible
- [ ] Mobile responsive
- [ ] Offline support (PWA)

### Developer Experience

- [ ] <5 min setup time
- [ ] Clear documentation
- [ ] Example projects
- [ ] Active CI/CD pipeline
- [ ] Automated deployments

---

## Risk Mitigation

### Potential Risks

1. **Breaking Changes**: Mitigated by incremental branches and testing
2. **SEO Impact**: Mitigated by careful URL preservation and redirects
3. **Performance Regression**: Mitigated by Lighthouse CI
4. **Accessibility Issues**: Mitigated by a11y testing suite
5. **i18n Complexity**: Mitigated by using proven library (next-intl)

### Rollback Strategy

- Each phase in separate branch
- Tag stable versions before major changes
- Keep backup of original codebase
- Document all changes

---

## Timeline Estimation

| Phase    | Duration   | Dependencies |
| -------- | ---------- | ------------ |
| Phase 1  | 2-3 hours  | None         |
| Phase 2  | 2 hours    | Phase 1      |
| Phase 3  | 1-2 hours  | Phase 2      |
| Phase 4  | 3-4 hours  | Phase 3      |
| Phase 5  | 4-5 hours  | Phase 4      |
| Phase 6  | 6-8 hours  | Phase 5      |
| Phase 7  | 8-10 hours | Phase 6      |
| Phase 8  | 4-6 hours  | Phase 7      |
| Phase 9  | 3-4 hours  | Phase 8      |
| Phase 10 | 6-8 hours  | Phase 9      |
| Phase 11 | 4-6 hours  | Phase 10     |
| Phase 12 | 2-3 hours  | Phase 11     |

**Total Estimated Time**: 46-61 hours

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Set up branch protection** on main branch
3. **Create project board** for tracking progress
4. **Begin with Phase 1** after approval
5. **Document progress** in project wiki

---

## Notes and Considerations

### Theme System Best Practices

- Use CSS custom properties for maximum flexibility
- Implement theme inheritance for variants
- Support system preference detection
- Provide theme preview functionality

### i18n Best Practices

- Use locale-specific URLs for SEO
- Implement proper fallback chains
- Consider RTL language support
- Use ISO 639-1 language codes

### SEO Best Practices

- Keep URLs consistent during refactoring
- Implement 301 redirects for changed URLs
- Maintain existing meta descriptions
- Test with Google Search Console

### Accessibility Best Practices

- Follow WCAG 2.1 Level AA guidelines
- Test with actual screen readers
- Ensure keyboard navigation works
- Provide skip navigation links

---

This refactoring plan provides a comprehensive roadmap for transforming the current application into a clean, reusable blog platform. Each phase builds upon the previous one, ensuring a stable and tested progression toward the final goal.
