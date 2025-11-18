# Theme Architecture Documentation

**Last Updated:** 2025-11-16
**Status:** Phase 5 - Architecture Defined
**ADR:** See [ADR-007](../DECISIONS.md#adr-007-theme-architecture---css-variables--next-themes)

---

## Overview

The blog platform uses a **CSS Variables + next-themes** architecture following shadcn/ui patterns. This provides:

- Zero runtime JavaScript overhead
- Perfect SSR/SSG compatibility
- System preference detection
- FOUC prevention
- Unlimited theme support

---

## Token System Architecture

### 3-Tier Token System (Modified shadcn/ui Approach)

```
┌─────────────────────────────────────────────────┐
│  Tier 1: Primitive Tokens (Implicit)            │
│  Raw HSL values embedded in semantic tokens     │
│  Example: 222.2 84% 4.9%                        │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  Tier 2: Semantic Tokens (Explicit)             │
│  Purpose-based, theme-aware CSS variables       │
│  Example: --background, --foreground, --primary │
└─────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────┐
│  Tier 3: Component Tokens (As-needed)           │
│  Component-specific values                      │
│  Example: --button-height, --navbar-height      │
└─────────────────────────────────────────────────┘
```

**Note:** This is a pragmatic 2.5-tier approach:

- Primitives are implicit (raw HSL values)
- Semantic tokens are the primary layer
- Component tokens added only when semantic tokens aren't sufficient

---

## Token Reference

### Format: HSL with Space Separation

All color tokens use HSL format with space separation for Tailwind opacity support:

```css
/* Definition */
--background: 0 0% 100%;

/* Usage in CSS */
background-color: hsl(var(--background));

/* Usage with opacity */
background-color: hsl(var(--background) / 0.5); /* 50% opacity */
```

### Semantic Token Categories

#### 1. Layout Tokens

Base-level colors for page structure:

| Token          | Purpose         | Light Value             | Dark Value                   |
| -------------- | --------------- | ----------------------- | ---------------------------- |
| `--background` | Page background | `0 0% 100%` (white)     | `222.2 84% 4.9%` (dark blue) |
| `--foreground` | Primary text    | `222.2 84% 4.9%` (dark) | `210 40% 98%` (light)        |

#### 2. Component Tokens

Surface colors for UI components:

| Token                  | Purpose            | Light Value      | Dark Value       |
| ---------------------- | ------------------ | ---------------- | ---------------- |
| `--card`               | Card background    | `0 0% 100%`      | `222.2 84% 4.9%` |
| `--card-foreground`    | Card text          | `222.2 84% 4.9%` | `210 40% 98%`    |
| `--popover`            | Popover background | `0 0% 100%`      | `222.2 84% 4.9%` |
| `--popover-foreground` | Popover text       | `222.2 84% 4.9%` | `210 40% 98%`    |

#### 3. Action Tokens

Interactive element colors:

| Token                    | Purpose               | Light Value         | Dark Value          |
| ------------------------ | --------------------- | ------------------- | ------------------- |
| `--primary`              | Primary actions       | `222.2 47.4% 11.2%` | `210 40% 98%`       |
| `--primary-foreground`   | Primary button text   | `210 40% 98%`       | `222.2 47.4% 11.2%` |
| `--secondary`            | Secondary actions     | `210 40% 96%`       | `217.2 32.6% 17.5%` |
| `--secondary-foreground` | Secondary button text | `222.2 84% 4.9%`    | `210 40% 98%`       |

#### 4. State Tokens

UI states and feedback:

| Token                      | Purpose            | Light Value         | Dark Value          |
| -------------------------- | ------------------ | ------------------- | ------------------- |
| `--muted`                  | Muted backgrounds  | `210 40% 96%`       | `217.2 32.6% 17.5%` |
| `--muted-foreground`       | Muted text         | `215.4 16.3% 46.9%` | `215 20.2% 65.1%`   |
| `--accent`                 | Accent backgrounds | `210 40% 96%`       | `217.2 32.6% 17.5%` |
| `--accent-foreground`      | Accent text        | `222.2 84% 4.9%`    | `210 40% 98%`       |
| `--destructive`            | Error/danger       | `0 84.2% 60.2%`     | `0 62.8% 30.6%`     |
| `--destructive-foreground` | Error text         | `210 40% 98%`       | `210 40% 98%`       |

#### 5. UI Element Tokens

Form and interface elements:

| Token      | Purpose       | Light Value         | Dark Value          |
| ---------- | ------------- | ------------------- | ------------------- |
| `--border` | Border color  | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` |
| `--input`  | Input borders | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` |
| `--ring`   | Focus rings   | `222.2 84% 4.9%`    | `212.7 26.8% 83.9%` |

#### 6. Utility Tokens

Non-color values:

| Token      | Purpose       | Value    |
| ---------- | ------------- | -------- |
| `--radius` | Border radius | `0.5rem` |

#### 7. Chart Tokens

Data visualization colors:

| Token       | Light Value   | Dark Value    |
| ----------- | ------------- | ------------- |
| `--chart-1` | `12 76% 61%`  | `220 70% 50%` |
| `--chart-2` | `173 58% 39%` | `160 60% 45%` |
| `--chart-3` | `197 37% 24%` | `30 80% 55%`  |
| `--chart-4` | `43 74% 66%`  | `280 65% 60%` |
| `--chart-5` | `27 87% 67%`  | `340 75% 55%` |

---

## Usage Patterns

### In CSS/Tailwind

**Recommended (Semantic tokens via Tailwind):**

```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">Click me</button>
</div>
```

**Direct CSS usage:**

```css
.my-component {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}
```

**With opacity:**

```tsx
<div className="bg-primary/50">
  {' '}
  {/* 50% opacity */}
  Semi-transparent
</div>
```

### In Tailwind Config

Tokens are automatically available in Tailwind via the `tailwind.config.ts` configuration:

```typescript
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'hsl(var(--primary-foreground))',
      },
      // ... etc
    }
  }
}
```

---

## Theme Switching

### Implementation

Theme switching is handled by `next-themes`:

```tsx
// components/organisms/theme-provider.tsx
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/components/organisms/theme-provider'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Theme Toggle Component

```tsx
// components/molecules/theme-toggle.tsx
'use client'

import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-lg p-2 hover:bg-accent"
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  )
}
```

### Available Themes

Current implementation supports:

- **light** - Default light theme
- **dark** - Dark theme (via `.dark` class)
- **system** - Auto-detect from `prefers-color-scheme`

Future themes (Phase 6):

- **minimal** - Minimal color palette
- **bold** - High contrast for accessibility

---

## Adding New Themes

### 1. Define Theme in globals.css

```css
@layer base {
  .minimal {
    --background: 0 0% 98%;
    --foreground: 0 0% 10%;
    --primary: 0 0% 20%;
    --primary-foreground: 0 0% 95%;
    /* ... define all semantic tokens */
  }
}
```

### 2. Update ThemeProvider

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  themes={['light', 'dark', 'minimal', 'bold']} // Add new themes
>
  {children}
</ThemeProvider>
```

### 3. Update Theme Toggle

Add new theme option to toggle component.

---

## FOUC Prevention

FOUC (Flash of Unstyled Content) is prevented automatically by `next-themes`:

1. **Script injection** - next-themes adds inline script before first paint
2. **localStorage check** - Reads saved theme preference
3. **System check** - Falls back to `prefers-color-scheme` if no saved preference
4. **Class application** - Applies theme class before render

**Manual implementation (if needed):**

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `
    (function() {
      const theme = localStorage.getItem('theme') || 'system';
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      }
    })();
  `,
  }}
/>
```

---

## Best Practices

### ✅ DO

1. **Always use semantic tokens**

   ```tsx
   <div className="bg-background text-foreground"> ✅
   ```

2. **Use Tailwind utilities with theme tokens**

   ```tsx
   <button className="bg-primary hover:bg-primary/90"> ✅
   ```

3. **Use opacity modifiers when needed**

   ```tsx
   <div className="bg-muted/50"> ✅
   ```

4. **Leverage existing tokens before creating new ones**

### ❌ DON'T

1. **Don't use hardcoded colors**

   ```tsx
   <div className="bg-white text-black"> ❌
   <div style={{ color: '#000000' }}> ❌
   ```

2. **Don't bypass semantic tokens**

   ```tsx
   <div style={{ background: 'hsl(222.2 84% 4.9%)' }}> ❌
   ```

3. **Don't use dark: prefix everywhere**

   ```tsx
   <div className="bg-white dark:bg-slate-900"> ❌
   // Instead, use semantic tokens that automatically change
   <div className="bg-background"> ✅
   ```

4. **Don't create component-specific tokens prematurely**
   - Only add Tier 3 tokens when semantic tokens are insufficient

---

## Performance Considerations

### Bundle Size

- **CSS Variables:** 0 KB JavaScript (native CSS)
- **next-themes:** ~4 KB gzipped
- **Total overhead:** ~4 KB

### Runtime Performance

- **Theme switching:** < 16ms (single class toggle)
- **No re-renders:** CSS variables update without React re-renders
- **SSR-friendly:** No hydration overhead

### Lighthouse Impact

- **Performance:** Zero impact (pure CSS)
- **Best Practices:** +5 points (proper theme implementation)
- **Accessibility:** Supports system preferences

---

## Troubleshooting

### Theme not applying on first load

- Ensure `suppressHydrationWarning` is on `<html>` tag
- Verify ThemeProvider wraps entire app
- Check localStorage for saved theme preference

### Colors not changing with theme

- Verify using semantic tokens (not hardcoded colors)
- Check token is defined in both `:root` and `.dark`
- Ensure `hsl(var(--token))` syntax is correct

### Hydration warnings

- Add `suppressHydrationWarning` to `<html>` tag
- ThemeProvider must be client component (`'use client'`)

### FOUC (Flash of Unstyled Content)

- Ensure next-themes is properly initialized
- Check script injection in `<head>` (automatic with next-themes)
- Verify default theme is set

---

## Migration Guide

### From Hardcoded Colors

**Before:**

```tsx
<div className="bg-white dark:bg-slate-900 text-black dark:text-white">
  Content
</div>
```

**After:**

```tsx
<div className="bg-background text-foreground">Content</div>
```

### From Inline Styles

**Before:**

```tsx
<div style={{ backgroundColor: '#ffffff', color: '#000000' }}>Content</div>
```

**After:**

```tsx
<div className="bg-background text-foreground">Content</div>
```

---

## Related Documentation

- [ADR-007: Theme Architecture Decision](../DECISIONS.md#adr-007-theme-architecture---css-variables--next-themes)
- [ADR-002: CSS Custom Properties for Theming](../DECISIONS.md#adr-002-css-custom-properties-for-theming)
- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [shadcn/ui Theming Guide](https://ui.shadcn.com/docs/theming)
- [Tailwind CSS Custom Properties](https://tailwindcss.com/docs/customizing-colors#using-css-variables)

---

## Changelog

### 2025-11-16 - Initial Architecture

- Documented existing shadcn/ui-style token system
- Defined 3-tier (modified) token architecture
- Documented all semantic tokens with values
- Created usage patterns and best practices
- Added migration guide from hardcoded colors
