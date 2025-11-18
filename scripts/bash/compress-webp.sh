#!/bin/bash
set -e

# Compress WebP images and remove metadata
# Creates backups before modifying files

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default quality (can be overridden with -q flag)
QUALITY=85
BACKUP_DIR="public/images/webp/.backup"
SKIP_BACKUP=false

# Parse command line arguments
while getopts "q:s" opt; do
    case $opt in
        q)
            QUALITY=$OPTARG
            ;;
        s)
            SKIP_BACKUP=true
            ;;
        \?)
            echo "Usage: $0 [-q quality] [-s skip backup]"
            echo "  -q: Set quality (default: 85, range: 0-100)"
            echo "  -s: Skip backup creation"
            exit 1
            ;;
    esac
done

# Check if cwebp is installed
if ! command -v cwebp &> /dev/null; then
    echo -e "${RED}Error: cwebp is not installed${NC}"
    echo "Install it with: brew install webp (macOS) or apt-get install webp (Ubuntu)"
    exit 1
fi

# Check if webp directory exists
if [ ! -d "public/images/webp" ]; then
    echo -e "${RED}Error: public/images/webp directory not found${NC}"
    exit 1
fi

# Create backup directory if needed
if [ "$SKIP_BACKUP" = false ]; then
    mkdir -p "$BACKUP_DIR"
    echo -e "${BLUE}Backup directory: $BACKUP_DIR${NC}"
fi

processed_count=0
skipped_count=0
error_count=0
total_original_size=0
total_compressed_size=0

# Function to get file size in bytes
get_file_size() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        stat -f%z "$1"
    else
        stat -c%s "$1"
    fi
}

# Function to format bytes to human readable
format_bytes() {
    local bytes=$1
    if [ $bytes -lt 1024 ]; then
        echo "${bytes}B"
    elif [ $bytes -lt 1048576 ]; then
        echo "$(awk -v b="$bytes" 'BEGIN {printf "%.1f", b/1024}')KB"
    else
        echo "$(awk -v b="$bytes" 'BEGIN {printf "%.1f", b/1048576}')MB"
    fi
}

# Function to compress a single image
compress_image() {
    local input_file="$1"
    local filename=$(basename "$input_file")
    local temp_file="${input_file}.tmp"

    # Get original file size
    local original_size=$(get_file_size "$input_file")

    # Backup original if not skipping
    if [ "$SKIP_BACKUP" = false ]; then
        cp "$input_file" "$BACKUP_DIR/$filename"
    fi

    # Compress and remove metadata
    # -metadata none: Remove all metadata (EXIF, XMP, ICCP)
    # -m 6: Maximum compression effort
    # -q: Quality setting
    if cwebp -q "$QUALITY" -m 6 -metadata none "$input_file" -o "$temp_file" 2>/dev/null; then
        local compressed_size=$(get_file_size "$temp_file")

        # Only replace if compression actually reduced size
        if [ $compressed_size -lt $original_size ]; then
            mv "$temp_file" "$input_file"

            local savings=$((original_size - compressed_size))
            local percent=$(awk -v s="$savings" -v o="$original_size" 'BEGIN {printf "%.1f", (s * 100.0) / o}')

            echo -e "${GREEN}Compressed:${NC} $filename"
            echo -e "  Before: $(format_bytes $original_size) → After: $(format_bytes $compressed_size) ${BLUE}(saved ${percent}%)${NC}"

            total_original_size=$((total_original_size + original_size))
            total_compressed_size=$((total_compressed_size + compressed_size))
            processed_count=$((processed_count + 1))
        else
            # Compressed file is larger, keep original
            rm "$temp_file"
            echo -e "${YELLOW}Skipped:${NC} $filename (compressed version would be larger)"
            skipped_count=$((skipped_count + 1))
        fi
    else
        # Compression failed
        [ -f "$temp_file" ] && rm "$temp_file"
        echo -e "${RED}Error compressing:${NC} $filename"
        error_count=$((error_count + 1))
    fi
    return 0
}

echo "Starting WebP compression and metadata removal..."
echo -e "${BLUE}Quality setting: $QUALITY${NC}"
echo ""

# Process all WebP images
shopt -s nullglob
for img in public/images/webp/*.webp; do
    [ -e "$img" ] || continue
    # Skip backup directory
    [[ "$img" == *"/.backup/"* ]] && continue
    compress_image "$img"
done
shopt -u nullglob

echo ""
echo "================================"
echo -e "${GREEN}Processed:${NC} $processed_count images"
echo -e "${YELLOW}Skipped:${NC} $skipped_count images (already optimal)"
[ $error_count -gt 0 ] && echo -e "${RED}Errors:${NC} $error_count images"

if [ $processed_count -gt 0 ]; then
    total_savings=$((total_original_size - total_compressed_size))
    total_percent=$(awk -v s="$total_savings" -v o="$total_original_size" 'BEGIN {printf "%.1f", (s * 100.0) / o}')
    echo ""
    echo -e "${BLUE}Total size reduction:${NC}"
    echo -e "  Before: $(format_bytes $total_original_size)"
    echo -e "  After:  $(format_bytes $total_compressed_size)"
    echo -e "  Saved:  $(format_bytes $total_savings) ${GREEN}($total_percent%)${NC}"
fi

if [ "$SKIP_BACKUP" = false ] && [ $processed_count -gt 0 ]; then
    echo ""
    echo -e "${BLUE}Backups saved to: $BACKUP_DIR${NC}"
    echo -e "To restore backups: cp $BACKUP_DIR/* public/images/webp/"
    echo -e "To delete backups: rm -rf $BACKUP_DIR"
fi

echo "================================"

exit 0
