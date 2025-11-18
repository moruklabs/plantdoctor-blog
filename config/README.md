# Blog Configuration System

## 📖 Overview

This directory contains the **centralized configuration system** for the blog platform. All hardcoded values have been extracted here to make the blog **truly reusable** for different projects.

## 🎯 Goals

1. **Single Source of Truth** - All blog settings in one place
2. **Type Safety** - Full TypeScript types with Zod validation
3. **Reusability** - Easy to clone and customize for new blogs
4. **DRY Principle** - No hardcoded values scattered across codebase

## 📁 Structure

```
config/
├── README.md                 # This file
├── index.ts                  # Main export (import from here)
├── schema.ts                 # TypeScript types + Zod schemas
├── blog.config.ts            # Your actual configuration
└── blog.config.example.ts    # Template for new blogs
```

## 🚀 Quick Start

### For Existing Blog

The configuration is already set up. Import from `@/config`:

```typescript
import { blogConfig, getCanonicalUrl } from '@/config'

// Access site information
const siteName = blogConfig.site.name
const siteUrl = blogConfig.site.url

// Use helper functions
const homeUrl = getCanonicalUrl('/')
const aboutUrl = getCanonicalUrl('/about')
```

### For New Blog

1. **Copy the example config:**

   ```bash
   cp config/blog.config.example.ts config/blog.config.ts
   ```

2. **Fill in your values:**
   - Update site information (name, URL, email)
   - Configure author details
   - Customize navigation
   - Set SEO defaults
   - Choose theme settings

3. **Validate your config:**

   ```bash
   pnpm validate:config
   ```

4. **Start using it:**
   ```typescript
   import { blogConfig } from '@/config'
   ```

## 📋 Configuration Sections

### 1. Site Configuration

Basic site metadata:

```typescript
{
  site: {
    name: 'My Blog',              // Blog name
    tagline: 'My tagline',        // Subtitle/tagline
    description: '...',           // Full description
    url: 'https://blog.com',      // Full URL with protocol
    domain: 'blog.com',           // Domain only
    email: 'hello@blog.com',      // Contact email
    language: 'en',               // ISO 639-1 code
    timezone: 'UTC',              // IANA timezone
  }
}
```

### 2. Author Configuration

Default author information:

```typescript
{
  author: {
    name: 'Your Name',
    email: 'you@example.com',
    url: 'https://yoursite.com',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'Short bio...',
    social: {
      twitter: '@handle',
      github: 'username',
      linkedin: 'in/profile',
    }
  }
}
```

### 3. Content Configuration

Content types and settings:

```typescript
{
  content: {
    types: {
      posts: {
        enabled: true,
        path: '/blog',          // URL path
        title: 'Blog Posts',    // Display name
        perPage: 12,           // Posts per page
      },
      guides: {
        enabled: true,
        path: '/guides',
        title: 'Guides',
        perPage: 10,
      },
    },
    defaultAuthor: 'Your Name',
    dateFormat: 'MMM dd, yyyy',
    excerptLength: 160,
  }
}
```

### 4. SEO Configuration

Search engine optimization defaults:

```typescript
{
  seo: {
    defaultTitle: 'My Blog',
    titleTemplate: '%s | My Blog',
    defaultDescription: '...',
    keywords: ['keyword1', 'keyword2', ...],
    ogImage: 'https://example.com/og-image.jpg',
    twitterHandle: 'yourhandle',
    structuredData: {
      organizationName: 'Your Org',
      organizationType: 'Organization',
      logo: 'https://example.com/logo.png',
    },
  }
}
```

### 5. Navigation Configuration

Header and footer navigation:

```typescript
{
  navigation: {
    header: [
      { label: 'Home', href: '/' },
      { label: 'Blog', href: '/blog' },
      { label: 'About', href: '/about' },
    ],
    footer: {
      sections: [
        {
          title: 'Content',
          links: [
            { label: 'Blog', href: '/blog' },
            { label: 'Guides', href: '/guides' },
          ],
        },
        // More sections...
      ],
    },
  }
}
```

### 6. Theme Configuration

Theme settings:

```typescript
{
  theme: {
    default: 'system',                    // 'light', 'dark', or 'system'
    available: ['light', 'dark', 'system'],
    enableToggle: true,
  }
}
```

## 🛠️ Helper Functions

The configuration includes useful helper functions:

```typescript
import { getCanonicalUrl, isExternalUrl, getPageTitle } from '@/config'

// Get full canonical URL
const url = getCanonicalUrl('/about')
// → "https://blog.com/about"

// Check if URL is external
const isExternal = isExternalUrl('https://google.com')
// → true

// Get page title with template
const title = getPageTitle('About Us')
// → "About Us | My Blog"
```

## ✅ Validation

The configuration is validated using Zod schemas at runtime:

```typescript
import { validateConfig, blogConfig } from '@/config'

// Automatic validation on import
const config = validateConfig(blogConfig)

// TypeScript ensures type safety
const siteName: string = config.site.name // ✅ Type-safe
```

## 🎨 Customization

### Adding New Fields

1. **Update schema.ts:**

   ```typescript
   export const SiteConfigSchema = z.object({
     // ... existing fields
     customField: z.string().optional(),
   })
   ```

2. **Update blog.config.ts:**

   ```typescript
   export const blogConfig: BlogConfig = {
     site: {
       // ... existing fields
       customField: 'my value',
     },
   }
   ```

3. **Use in your code:**
   ```typescript
   import { blogConfig } from '@/config'
   const value = blogConfig.site.customField
   ```

### Disabling Features

To disable a content type (e.g., guides):

```typescript
{
  content: {
    types: {
      guides: {
        enabled: false,  // ← Disable guides
        path: '/guides',
        title: 'Guides',
        perPage: 10,
      },
    }
  }
}
```

## 🔄 Migration Guide

### From Old Config (lib/config.ts)

Old way:

```typescript
import { siteConfig } from '@/lib/config'
const name = siteConfig.appName
```

New way:

```typescript
import { blogConfig } from '@/config'
const name = blogConfig.site.name
```

Backwards compatibility is maintained through getters in `config/index.ts`.

## 📚 Examples

### Creating a New Blog

```bash
# 1. Clone the repository
git clone <repo-url> my-new-blog
cd my-new-blog

# 2. Copy example config
cp config/blog.config.example.ts config/blog.config.ts

# 3. Edit the config
vim config/blog.config.ts
# (Update all TODO items)

# 4. Validate
pnpm validate:config

# 5. Install and run
pnpm install
pnpm dev
```

### Multi-Blog Setup

For managing multiple blogs from one codebase:

```typescript
// config/blogs/blog-a.config.ts
export const blogAConfig: BlogConfig = { ... }

// config/blogs/blog-b.config.ts
export const blogBConfig: BlogConfig = { ... }

// Use environment variable to switch
const blogConfig = process.env.BLOG_NAME === 'blog-a'
  ? blogAConfig
  : blogBConfig
```

## 🧪 Testing

```bash
# Validate configuration
pnpm validate:config

# Type check
pnpm type-check

# Run tests
pnpm test
```

## 📖 Best Practices

1. **Never hardcode values** - Always use config
2. **Validate on deploy** - Run `pnpm validate:config` in CI
3. **Document custom fields** - Add comments for non-obvious settings
4. **Use environment variables** - For environment-specific values
5. **Keep secrets out** - Use `.env` for API keys, not config

## 🔒 Security

**Important:**

- Never commit API keys or secrets to `blog.config.ts`
- Use environment variables for sensitive data
- The config file is committed to git (it's not secret)
- For private values, use `.env.local`

## 📞 Support

For questions or issues with the configuration system:

1. Check this README
2. Review `blog.config.example.ts` for examples
3. Check TypeScript errors (schema validation)
4. Open an issue on GitHub

## 🎯 What's Next?

After setting up your configuration:

1. ✅ Customize theme colors (see `app/globals.css`)
2. ✅ Add your content (MDX files in `content/`)
3. ✅ Configure navigation (already in config)
4. ✅ Set up SEO (already in config)
5. ✅ Deploy!

---

**Made with ❤️ by the Moruk AI team**
