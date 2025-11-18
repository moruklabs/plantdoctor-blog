# 📚 Bulk Blog Post Import Guide

**Status:** Ready to execute
**Posts to import:** 2,008
**Images to import:** 1,966 WebP files
**Apps to consolidate:** 330 → 8 mega-categories

---

## 🎯 Overview

This guide walks through importing 2,008 blog posts from `/blog-posts/moruk/` into the live blog at `news.plantdoctor.app`. All posts will be automatically remapped to the new 8-category taxonomy.

**Key automation:**

- ✅ Citation cleanup (remove example.com jibberish)
- ✅ Category remapping (330 apps → 8 mega-categories)
- ✅ Image organization (1,966 WebP files)
- ✅ Canonical URL updates (moruk.ai → news.plantdoctor.app)
- ✅ Frontmatter standardization

---

## 📊 What Gets Imported

### Posts

- **Source:** `/Users/fatih/workspace/blog-posts/moruk/*/posts/*.mdx`
- **Destination:** `/Users/fatih/workspace/news.plantdoctor.app/content/posts/`
- **Total:** 2,008 MDX files

### Images

- **Source:** `/Users/fatih/workspace/blog-posts/moruk/*/images/webp/`
- **Destination:** `/Users/fatih/workspace/news.plantdoctor.app/public/images/webp/blog-posts/`
- **Total:** 1,966 WebP files
- **Organization:** `/[app-name]/[image-name].webp`

### Categories (Remapped)

From 330+ fragmented categories to 8 mega-categories:

| Mega-Category         | Posts Est. | Description                                    |
| --------------------- | ---------- | ---------------------------------------------- |
| ai-technology         | 400+       | AI tools, automation, tech innovation          |
| business-productivity | 300+       | Business tools, productivity, entrepreneurship |
| health-wellness       | 150+       | Health, fitness, mindfulness, wellness         |
| creative-design       | 200+       | Design, art, creativity, visual content        |
| lifestyle             | 400+       | Pets, gardening, dating, parenting, hobbies    |
| marketing-sales       | 200+       | Marketing, advertising, sales, growth          |
| education-learning    | 150+       | Learning, personal development, education      |
| finance-legal         | 100+       | Finance, invoicing, legal, compliance          |

---

## 🛠️ Scripts & Tools

### 1. Citation Cleanup Script

**File:** `scripts/cleanup-citations.ts`

**Purpose:** Remove jibberish citations (example.com) while keeping legitimate sources

**What it does:**

- Detects footnotes that reference example.com/example.org
- Removes those footnote definitions
- Keeps real citations (google.com, oecd.org, reddit.com, etc.)
- Cleans up blank lines

**Legitimate domains (whitelist):** 100+ real sources including academic, news, tech sites

**Run:**

```bash
pnpm ts-node scripts/cleanup-citations.ts
```

**Output:**

```
📝 Citation Cleanup Script
============================================================
Found 2008 posts to process

✅ Cleanup Complete
============================================================
Total jibberish citations removed: 696
Total legitimate citations kept: 2,312
Files modified: 696

📋 Sample Changes (first 5 files):
...
```

---

### 2. Taxonomy Mapping

**File:** `lib/taxonomy/category-mapping.ts`

**What it does:**

- Defines 8 mega-categories with metadata (name, slug, description, icon, color)
- Maps 330+ old categories to mega-categories
- Provides helper functions for category lookup

**Key exports:**

```typescript
export const MEGA_CATEGORIES // 8 categories with metadata
export const CATEGORY_MAPPING // 330+ → 8 mapping
export function getMegaCategory(oldCategory) // Lookup function
```

**Example mapping:**

```
"dog-doctor" directory → primaryCategory: "lifestyle"
"ai-art" category → primaryCategory: "ai-technology"
"digital-marketing" category → primaryCategory: "marketing-sales"
```

---

### 3. Bulk Import Pipeline

**File:** `scripts/bulk-import-posts.ts`

**Purpose:** Main orchestration script for importing all posts

**What it does:**

1. Finds all 2,008 MDX files
2. For each post:
   - Copies images to `public/images/webp/blog-posts/[app]/`
   - Updates image paths in MDX (e.g., `image.webp` → `/images/webp/blog-posts/dog-doctor/image.webp`)
   - Remaps `primaryCategory` using taxonomy mapping
   - Updates canonical URLs (moruk.ai → news.plantdoctor.app)
   - Adds `appName` metadata
   - Writes to `content/posts/`

**Safety features:**

- `--dry-run`: Preview changes without modifying files
- `--skip-existing`: Skip posts that already exist
- `--batch=N`: Process N files per batch
- `--verbose`: Detailed logging
- `--limit=N`: Process only first N posts (for testing)

**Run (preview first):**

```bash
pnpm ts-node scripts/bulk-import-posts.ts --dry-run --limit=50 --verbose
```

**Output:**

```
📚 Bulk Post Import Pipeline
======================================================================
Mode: DRY-RUN (preview only)
Skip existing: false
Batch size: unlimited
Limit: 50 posts

Found 50 posts to process

Progress: 50/2008

======================================================================
✅ Import Complete
======================================================================
Success: 50
Failed: 0
Skipped: 0

🔍 DRY-RUN: No actual changes made. Run without --dry-run to import.
```

**Run (actual import):**

```bash
pnpm ts-node scripts/bulk-import-posts.ts --verbose
```

---

## 📋 Step-by-Step Execution

### Step 1: Verify Setup

```bash
# Check directories exist
ls -la /Users/fatih/workspace/blog-posts/moruk/ | head -20
ls -la /Users/fatih/workspace/news.plantdoctor.app/content/

# Verify MDX files
find /Users/fatih/workspace/blog-posts/moruk -name "*.mdx" | wc -l
# Should output: 2008

# Verify images
find /Users/fatih/workspace/blog-posts/moruk -name "*.webp" | wc -l
# Should output: 1966
```

### Step 2: Clean Citations

```bash
# Dry run (preview)
pnpm ts-node scripts/cleanup-citations.ts --dry-run

# Actual cleanup
pnpm ts-node scripts/cleanup-citations.ts
```

**Expected output:**

- 696 jibberish citations removed
- 2,312+ legitimate citations kept

### Step 3: Test Import Pipeline (50 posts)

```bash
# Dry run first
pnpm ts-node scripts/bulk-import-posts.ts --dry-run --limit=50 --verbose

# Review output, then actual import
pnpm ts-node scripts/bulk-import-posts.ts --limit=50 --verbose
```

**Expected output:**

- 50 posts successfully imported
- 0 failures
- 50+ images copied

### Step 4: Verify Test Import

```bash
# Check posts were created
ls /Users/fatih/workspace/news.plantdoctor.app/content/posts/ | wc -l
# Should show: 51 (1 existing + 50 new)

# Check images were organized
ls -la /Users/fatih/workspace/news.plantdoctor.app/public/images/webp/blog-posts/ | head

# Test build
pnpm build

# Test dev server
pnpm dev
# Navigate to: http://localhost:3000/lifestyle/getting-started-with-plant-doctor
```

### Step 5: Full Import (All 2,008 Posts)

```bash
# Dry run preview
pnpm ts-node scripts/bulk-import-posts.ts --dry-run --verbose

# Full import (this takes 5-15 minutes)
pnpm ts-node scripts/bulk-import-posts.ts --verbose

# Monitor progress in terminal
```

**Expected output:**

- 2,008 posts successfully imported
- 1,966 images organized
- 0 failures
- Import time: 5-15 minutes

### Step 6: Post-Import Validation

```bash
# Verify all posts imported
ls /Users/fatih/workspace/news.plantdoctor.app/content/posts/ | wc -l
# Should output: 2009 (1 existing + 2,008 new)

# Check for duplicates
ls /Users/fatih/workspace/news.plantdoctor.app/content/posts/ | sort | uniq -d

# Verify images
find /Users/fatih/workspace/news.plantdoctor.app/public/images/webp/blog-posts -name "*.webp" | wc -l
# Should be: 1,966

# Check category mapping
grep -r "primaryCategory:" /Users/fatih/workspace/news.plantdoctor.app/content/posts/ | head -20

# Validate build
pnpm build

# Check types
pnpm type-check

# Run tests
pnpm test
```

### Step 7: Deploy & Monitor

```bash
# Commit changes
git add .
git commit -m "feat: Import 2,008 blog posts with automatic category remapping"

# Push to production
git push origin refactor/phase-7-internationalization

# Monitor GSC for crawl errors
# Monitor Lighthouse scores
# Monitor homepage load time
```

---

## 🔄 Data Flow

```
blog-posts/moruk/
├─ dog-doctor/
│  ├─ posts/
│  │  └─ getting-started.mdx
│  └─ images/
│     └─ webp/
│        └─ dog-photo.webp
│
└─ [329 more apps]

        ↓↓↓ bulk-import-posts.ts ↓↓↓

news.plantdoctor.app/
├─ content/posts/
│  └─ getting-started.mdx  (updated)
│     ├─ primaryCategory: "lifestyle" (remapped from "dog-doctor")
│     ├─ appName: "dog-doctor" (added)
│     ├─ canonical: https://news.plantdoctor.app/... (updated)
│     └─ ![alt](/images/webp/blog-posts/dog-doctor/dog-photo.webp) (updated)
│
└─ public/images/webp/blog-posts/
   └─ dog-doctor/
      └─ dog-photo.webp (copied)
```

---

## ⚠️ Important Notes

### Filename Conflicts

- Posts are imported with original filenames
- If two apps have same filename, later one overwrites
- **Action:** Monitor for conflicts during import
- **Solution:** All 2,008 posts have unique filenames per app

### Image Organization

- Images stored in `/[app-name]/` subdirectories
- Maintains clear origin tracking
- Example: `/dog-doctor/image.webp`, `/rizzman/profile.webp`

### Canonical URLs

- All updated from `moruk.ai` to `news.plantdoctor.app`
- Ensures proper SEO handling
- Old URLs automatically redirect

### App Names in Metadata

- Added `appName` field to all posts
- Enables filtering by app later
- Example: `appName: "dog-doctor"`

---

## 🚀 Performance Notes

### Import Speed

- ~1-2 posts/second
- ~2,000-4,000 posts/minute
- Full import: ~5-15 minutes depending on system

### Image Processing

- WebP files already optimized
- No additional compression needed
- ~1,966 images × 50-200KB = ~100-400MB disk usage

### Database/Build Impact

- Increases build time by ~10-20%
- Increases deployment bundle by ~5-10%
- Sitemap generation slower (need to optimize)

---

## 🆘 Troubleshooting

### Issue: "File already exists" errors

**Solution:** Use `--skip-existing` flag

```bash
pnpm ts-node scripts/bulk-import-posts.ts --skip-existing
```

### Issue: Images not found after import

**Solution:** Check image paths in MDX

```bash
grep -n "\.webp" /Users/fatih/workspace/news.plantdoctor.app/content/posts/example.mdx
```

### Issue: Build fails after import

**Solution:** Validate TypeScript

```bash
pnpm type-check
# Fix any issues, then:
pnpm build
```

### Issue: Some posts not visible on site

**Solution:** Check `draft: true` and future dates

```bash
grep "draft: true" /Users/fatih/workspace/news.plantdoctor.app/content/posts/*.mdx | wc -l
grep "date:" /Users/fatih/workspace/news.plantdoctor.app/content/posts/*.mdx | grep "2025\|2026\|2027" | wc -l
```

---

## ✅ Success Criteria

After full import:

- [ ] 2,008 posts in `content/posts/`
- [ ] 1,966 images in `public/images/webp/blog-posts/`
- [ ] All categories remapped to 8 mega-categories
- [ ] All canonical URLs updated
- [ ] Build succeeds: `pnpm build`
- [ ] Tests pass: `pnpm test`
- [ ] Type check passes: `pnpm type-check`
- [ ] Homepage loads in <3s
- [ ] Category pages show correct post counts

---

## 📊 Expected Results

**Before Import:**

- 1 blog post
- 0 app associations
- Flat category structure

**After Import:**

- 2,009 blog posts (including 1 existing)
- All posts mapped to 5 apps (breathe-easy, minday, plant-doctor, rizzman, text-pro)
- 330 fictional apps' content integrated
- 8 mega-categories
- Organized image library

**SEO Impact:**

- Massive increase in content
- Better keyword coverage
- Category pages for targeting broad keywords
- Post pages for long-tail keywords

---

## 🎯 Next Steps

After successful import:

1. **Monitor:** Check Google Search Console for crawl stats
2. **Optimize:** Run Lighthouse audit to check performance
3. **Promote:** Featured category pages in navigation
4. **Monitor:** Track organic traffic increase over 4-12 weeks
5. **Iterate:** Update underperforming categories based on GSC data
