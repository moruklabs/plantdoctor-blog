#!/bin/bash
set -e

# Convert JPEG and PNG images to WebP format
# Only converts if the WebP version doesn't already exist

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo -e "${RED}Error: cwebp is not installed${NC}"
    echo "Install it with: brew install webp (macOS) or apt-get install webp (Ubuntu)"
    exit 1
fi

# Create webp directory if it doesn't exist
mkdir -p public/images/webp

converted_count=0
skipped_count=0
error_count=0

# Function to convert a single image
convert_image() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local base_name="${filename%.*}"
    local output_file="public/images/webp/${base_name}.webp"

    # Skip if WebP version already exists
    if [ -f "$output_file" ]; then
        echo -e "${YELLOW}Skipped:${NC} $filename (WebP already exists)"
        skipped_count=$((skipped_count + 1))
        return 0
    fi

    # Convert to WebP with quality 85 (good balance between size and quality)
    if cwebp -q 85 "$input_file" -o "$output_file" &> /dev/null; then
        echo -e "${GREEN}Converted:${NC} $filename → ${base_name}.webp"
        converted_count=$((converted_count + 1))
    else
        echo -e "${RED}Error converting:${NC} $filename"
        error_count=$((error_count + 1))
    fi
    return 0
}

echo "Starting WebP conversion..."
echo ""

# Process JPEG images
if [ -d "public/images/jpeg" ]; then
    echo "Processing JPEG images..."
    shopt -s nullglob
    for img in public/images/jpeg/*.jpg public/images/jpeg/*.jpeg public/images/jpeg/*.JPG public/images/jpeg/*.JPEG; do
        [ -e "$img" ] || continue
        convert_image "$img"
    done
    shopt -u nullglob
fi

# Process PNG images
if [ -d "public/images/png" ]; then
    echo ""
    echo "Processing PNG images..."
    shopt -s nullglob
    for img in public/images/png/*.png public/images/png/*.PNG; do
        [ -e "$img" ] || continue
        convert_image "$img"
    done
    shopt -u nullglob
fi

echo ""
echo "================================"
echo -e "${GREEN}Converted:${NC} $converted_count images"
echo -e "${YELLOW}Skipped:${NC} $skipped_count images (already exist)"
[ $error_count -gt 0 ] && echo -e "${RED}Errors:${NC} $error_count images"
echo "================================"

exit 0
