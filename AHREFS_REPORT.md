# Ahrefs Audit Report: blog.plantdoctor.app

> **Data source:** Ahrefs site audit (2026-03-27) + Google Search Console (through 2026-03-26)
> **Framework:** Next.js blog platform

---

## Critical Issues

### 1. robots.txt References Wrong Domain

**What:** `public/robots.txt` contains:
```
Sitemap: https://news.plantdoctor.app/sitemap.xml
Sitemap: https://news.plantdoctor.app/news-sitemap.xml
Sitemap: https://news.plantdoctor.app/image-sitemap.xml
```

The blog is served at `blog.plantdoctor.app`, not `news.plantdoctor.app`.

**Impact:** Google cannot find the sitemaps because the URLs point to a non-existent domain.

**Solution:** Update all sitemap references:
```
Sitemap: https://blog.plantdoctor.app/sitemap.xml
Sitemap: https://blog.plantdoctor.app/news-sitemap.xml
Sitemap: https://blog.plantdoctor.app/image-sitemap.xml
```

---

## High Issues

### 2. High-Impression Pages with Near-Zero CTR

Several blog pages rank with significant impressions but get almost no clicks — wasted ranking potential.

| Page (slug) | Impressions | Clicks | CTR | Position |
|-------------|------------|--------|-----|----------|
| `best-plant-disease-id-apps-2025-tested` | 3,541 | 2 | 0.06% | 15.58 |
| `is-neem-oil-safe-on-edible-plants...` | 2,106 | 3 | 0.14% | 8.49 |
| `bti-hydrogen-peroxide-de-beat-fungus-gnats` | 1,520 | 4 | 0.26% | 7.43 |
| `cat-safe-monstera-alternatives` | 865 | 7 | 0.81% | 8.13 |
| `dracaena-brown-tips-water-fix` | 625 | 2 | 0.32% | 5.63 |
| `basil-cold-damage-vs-downy-mildew-quick-guide` | 392 | 5 | 1.28% | 21.97 |

**Reason:** Two factors:
1. Low position (page 2+) for competitive queries
2. Weak title tags / meta descriptions that don't compel clicks

**Solution:**
1. **Priority target: `best-plant-disease-id-apps-2025-tested`** — this is a money page with 3,541 impressions at position 15.58. Optimize content depth, title tag, and internal linking to move from page 2 to page 1.
2. Optimize title/meta descriptions for the top 10 high-impression pages to improve CTR.
3. Build internal links from high-authority pages to these underperforming pages.

---

### 3. Blog Home Gets Zero Clicks

**What:** `blog.plantdoctor.app/` gets 190 impressions but 0 clicks at position 8.34.

**Reason:** Likely competing with `plantdoctor.app/` (the main landing) for branded queries.

**Solution:** Ensure `blog.plantdoctor.app/` has a distinct, non-branded title tag focused on content (e.g., "Plant Care Tips & Guides" rather than "PlantDoctor Blog").

---

## Medium Issues

### 4. No Static Sitemap in Repository

**What:** No `sitemap.xml` in `public/` directory.

**Note:** May be dynamically generated at build time by Next.js. Verify by checking `blog.plantdoctor.app/sitemap.xml` in browser.

**Solution:** If not accessible, add dynamic sitemap generation to the Next.js app.

---

## Search Console Insights

### Traffic Contribution

The blog is the primary organic discovery channel for the PlantDoctor ecosystem:
- Landing page (`plantdoctor.app/`) → 328 clicks (branded queries)
- Blog pages (`blog.plantdoctor.app/tips/*`) → ~71 clicks (non-branded, informational queries)

### High-Potential Keywords (Not Yet Ranking)

Pages with impressions but 0 clicks and decent position:

| Page (slug) | Impressions | Position | Opportunity |
|-------------|------------|----------|-------------|
| `smartphone-ai-plant-diagnosis-guide` | 216 | 3.95 | High — almost page 1 top |
| `four-week-fungus-gnat-plan` | 184 | 7.35 | High — page 1 already |
| `fix-fertilizer-burn-flush-recover-prevent` | 278 | 7.45 | High — page 1 already |
| `fix-peace-lily-brown-tips-water-salts-humidity` | 256 | 7.13 | High — page 1 already |

These pages rank on page 1 but get 0 clicks — **title/meta optimization could unlock 5-15 clicks/month each**.

---

## Priority Action Items

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | Fix robots.txt domain (`news.` → `blog.`) | Critical | Trivial |
| 2 | Optimize title/meta for top 10 high-impression pages | High | Medium |
| 3 | Deep-optimize "best plant disease id apps 2025" page | High | Medium |
| 4 | Optimize titles for 0-click page-1 pages | Medium | Low |
| 5 | Verify sitemap accessibility | Medium | Low |
