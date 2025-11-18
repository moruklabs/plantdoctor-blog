#!/bin/bash

# Lighthouse Theme Audit Script
#
# Runs comprehensive Lighthouse audits for both light and dark themes
# across mobile, tablet, and desktop viewports

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         LIGHTHOUSE THEME AUDIT                                     ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Create results directory
RESULTS_DIR=".lighthouse-results"
mkdir -p "$RESULTS_DIR"

# URLs to test
URLS=(
  "http://localhost:3000/"
  "http://localhost:3000/tips"
  "http://localhost:3000/tips/12-one-liners-ab-test-tonight"
)

URL_NAMES=(
  "homepage"
  "tips"
  "single-tip"
)

# Viewports
VIEWPORTS=("mobile" "tablet" "desktop")

# Themes
THEMES=("light" "dark")

# Function to run Lighthouse
run_lighthouse() {
  local url=$1
  local url_name=$2
  local viewport=$3
  local theme=$4
  local output_file="${RESULTS_DIR}/${theme}-${viewport}-${url_name}.json"

  echo -e "${YELLOW}Running: ${theme} theme - ${viewport} - ${url_name}${NC}"

  # Select config file based on viewport
  local config_file=".lighthouseci/lighthouse.${viewport}.js"

  # For dark theme, we need to inject JavaScript to set the theme
  local extra_headers=""
  if [ "$theme" = "dark" ]; then
    extra_headers='--extra-headers={"Cookie":"theme=dark"}'
  fi

  # Run Lighthouse using the CLI directly
  npx lighthouse "$url" \
    --output=json \
    --output-path="$output_file" \
    --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
    --config-path="$config_file" \
    --quiet \
    $extra_headers || {
      echo -e "${RED}✗ Failed: ${theme} - ${viewport} - ${url_name}${NC}"
      return 1
    }

  echo -e "${GREEN}✓ Completed: ${theme} - ${viewport} - ${url_name}${NC}"

  # Extract and display scores
  if [ -f "$output_file" ]; then
    local perf=$(jq -r '.categories.performance.score * 100 | floor' "$output_file")
    local a11y=$(jq -r '.categories.accessibility.score * 100 | floor' "$output_file")
    local bp=$(jq -r '.categories["best-practices"].score * 100 | floor' "$output_file")
    local seo=$(jq -r '.categories.seo.score * 100 | floor' "$output_file")

    echo -e "  Scores: Perf=${perf} A11y=${a11y} BP=${bp} SEO=${seo}"
  fi

  echo ""
}

# Check if server is running
if ! curl -s http://localhost:3000 > /dev/null; then
  echo -e "${RED}Error: Dev server not running at http://localhost:3000${NC}"
  echo "Please run 'pnpm dev' in another terminal"
  exit 1
fi

echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Total audits count
total=$((${#THEMES[@]} * ${#VIEWPORTS[@]} * ${#URLS[@]}))
current=0

# Run audits
for theme in "${THEMES[@]}"; do
  for viewport in "${VIEWPORTS[@]}"; do
    for i in "${!URLS[@]}"; do
      url="${URLS[$i]}"
      url_name="${URL_NAMES[$i]}"

      current=$((current + 1))
      echo -e "${BLUE}[${current}/${total}]${NC}"

      run_lighthouse "$url" "$url_name" "$viewport" "$theme"
    done
  done
done

# Generate summary report
echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         GENERATING SUMMARY REPORT                                  ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo ""

REPORT_FILE="${RESULTS_DIR}/theme-audit-summary.txt"

{
  echo "═══════════════════════════════════════════════════════════════════════"
  echo "                 LIGHTHOUSE THEME AUDIT RESULTS                       "
  echo "═══════════════════════════════════════════════════════════════════════"
  echo ""
  echo "Generated: $(date)"
  echo ""

  for viewport in "${VIEWPORTS[@]}"; do
    echo "╔═══════════════════════════════════════════════════════════════════╗"
    echo "║  ${viewport^^}                                                         "
    echo "╚═══════════════════════════════════════════════════════════════════╝"
    echo ""

    for i in "${!URLS[@]}"; do
      url_name="${URL_NAMES[$i]}"

      echo "📄 ${url_name}"
      echo ""

      for theme in "${THEMES[@]}"; do
        result_file="${RESULTS_DIR}/${theme}-${viewport}-${url_name}.json"

        if [ -f "$result_file" ]; then
          perf=$(jq -r '.categories.performance.score * 100 | floor' "$result_file")
          a11y=$(jq -r '.categories.accessibility.score * 100 | floor' "$result_file")
          bp=$(jq -r '.categories["best-practices"].score * 100 | floor' "$result_file")
          seo=$(jq -r '.categories.seo.score * 100 | floor' "$result_file")

          # Get Core Web Vitals
          fcp=$(jq -r '.audits["first-contentful-paint"].numericValue / 1000' "$result_file")
          lcp=$(jq -r '.audits["largest-contentful-paint"].numericValue / 1000' "$result_file")
          tbt=$(jq -r '.audits["total-blocking-time"].numericValue' "$result_file")
          cls=$(jq -r '.audits["cumulative-layout-shift"].numericValue' "$result_file")
          si=$(jq -r '.audits["speed-index"].numericValue / 1000' "$result_file")

          theme_icon="☀️"
          [ "$theme" = "dark" ] && theme_icon="🌙"

          echo "  ${theme_icon} ${theme^} Theme:"
          echo "    Scores:"
          echo "      Performance:     ${perf}/100"
          echo "      Accessibility:   ${a11y}/100"
          echo "      Best Practices:  ${bp}/100"
          echo "      SEO:             ${seo}/100"
          echo ""
          echo "    Core Web Vitals:"
          echo "      FCP: ${fcp}s"
          echo "      LCP: ${lcp}s"
          echo "      TBT: ${tbt}ms"
          echo "      CLS: ${cls}"
          echo "      SI:  ${si}s"
          echo ""
        fi
      done

      echo "  ─────────────────────────────────────────────────────────────────"
      echo ""
    done
  done

  echo ""
  echo "╔═══════════════════════════════════════════════════════════════════╗"
  echo "║  THEME COMPARISON                                                 ║"
  echo "╚═══════════════════════════════════════════════════════════════════╝"
  echo ""

  for i in "${!URLS[@]}"; do
    url_name="${URL_NAMES[$i]}"
    echo "📄 ${url_name}"

    for viewport in "${VIEWPORTS[@]}"; do
      echo ""
      echo "  ${viewport^}:"

      light_file="${RESULTS_DIR}/light-${viewport}-${url_name}.json"
      dark_file="${RESULTS_DIR}/dark-${viewport}-${url_name}.json"

      if [ -f "$light_file" ] && [ -f "$dark_file" ]; then
        # Performance
        light_perf=$(jq -r '.categories.performance.score * 100 | floor' "$light_file")
        dark_perf=$(jq -r '.categories.performance.score * 100 | floor' "$dark_file")
        delta_perf=$((dark_perf - light_perf))
        [ $delta_perf -gt 0 ] && delta_perf="+${delta_perf}"

        # Accessibility
        light_a11y=$(jq -r '.categories.accessibility.score * 100 | floor' "$light_file")
        dark_a11y=$(jq -r '.categories.accessibility.score * 100 | floor' "$dark_file")
        delta_a11y=$((dark_a11y - light_a11y))
        [ $delta_a11y -gt 0 ] && delta_a11y="+${delta_a11y}"

        # Best Practices
        light_bp=$(jq -r '.categories["best-practices"].score * 100 | floor' "$light_file")
        dark_bp=$(jq -r '.categories["best-practices"].score * 100 | floor' "$dark_file")
        delta_bp=$((dark_bp - light_bp))
        [ $delta_bp -gt 0 ] && delta_bp="+${delta_bp}"

        # SEO
        light_seo=$(jq -r '.categories.seo.score * 100 | floor' "$light_file")
        dark_seo=$(jq -r '.categories.seo.score * 100 | floor' "$dark_file")
        delta_seo=$((dark_seo - light_seo))
        [ $delta_seo -gt 0 ] && delta_seo="+${delta_seo}"

        echo "    Performance:     ☀️  ${light_perf}  |  🌙 ${dark_perf}  (${delta_perf})"
        echo "    Accessibility:   ☀️  ${light_a11y}  |  🌙 ${dark_a11y}  (${delta_a11y})"
        echo "    Best Practices:  ☀️  ${light_bp}  |  🌙 ${dark_bp}  (${delta_bp})"
        echo "    SEO:             ☀️  ${light_seo}  |  🌙 ${dark_seo}  (${delta_seo})"
      fi
    done

    echo ""
  done

} > "$REPORT_FILE"

# Display the report
cat "$REPORT_FILE"

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         AUDIT COMPLETE                                             ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "📊 Full report saved to: ${REPORT_FILE}"
echo -e "📁 JSON results saved to: ${RESULTS_DIR}/"
echo ""
