#!/bin/bash

# Generate Lighthouse CI URL configuration
# Excludes 404.html and other error pages from testing

set -e

echo "Generating Lighthouse CI URLs from build..."

# Check if out directory exists
if [ ! -d "./out" ]; then
    echo "Error: ./out directory not found. Run 'pnpm build' first."
    exit 1
fi

# Generate URL list, excluding error pages
urls=$(find ./out -name "*.html" \
    ! -name "404.html" \
    ! -name "500.html" \
    ! -name "_*.html" \
    | sed 's|^\./out||' \
    | sed 's|/index\.html$|/|' \
    | sed 's|^|        "http://localhost|' \
    | sed 's|$|",|' \
    | sort)

echo "Found URLs to test:"
echo "$urls" | sed 's/^        /  /'

# Generate the configuration fragment
cat > .lighthouse-urls.tmp << EOF
      url: [
$urls
      ],
EOF

echo ""
echo "Configuration fragment saved to .lighthouse-urls.tmp"
echo "Manually update lighthouse.ci.js with these URLs, or use the update script."
