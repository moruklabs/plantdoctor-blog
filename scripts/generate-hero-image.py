#!/usr/bin/env python3
"""
CLI tool for generating hero images using Azure OpenAI DALL-E API.
Install required packages: `pip install requests pillow azure-identity`

Usage:
    python generate-hero-image.py "your prompt here" output.webp
    python generate-hero-image.py "your prompt" output.png --size 1024x1024 --quality standard
    python generate-hero-image.py "your prompt" output.webp --quality high --size 1536x1024
"""
import os
import sys
import argparse
import requests
import base64
from PIL import Image
from io import BytesIO
from pathlib import Path

# You will need to set these environment variables or edit the following values.
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT", "https://eas-2.openai.azure.com/")
deployment = os.getenv("DEPLOYMENT_NAME", "gpt-image-1")
api_version = os.getenv("OPENAI_API_VERSION", "2025-04-01-preview")
subscription_key = os.getenv("AZURE_OPENAI_API_KEY")

if not subscription_key:
    print("Error: AZURE_OPENAI_API_KEY environment variable is required", file=sys.stderr)
    sys.exit(1)

def decode_and_save_image(b64_data, output_path, output_format, quality=95):
    """Decode base64 image data and save to file with optional format conversion."""
    image = Image.open(BytesIO(base64.b64decode(b64_data)))

    # Determine output format from file extension if not explicitly provided
    if output_format is None:
        output_format = Path(output_path).suffix[1:].lower() or "png"

    # If webp or other format requested, convert from PNG
    if output_format.lower() == "webp":
        # Save as webp with quality setting
        image.save(output_path, format="WEBP", quality=quality, method=6)
    elif output_format.lower() == "jpg" or output_format.lower() == "jpeg":
        # Convert RGBA to RGB for JPEG
        if image.mode == "RGBA":
            rgb_image = Image.new("RGB", image.size, (255, 255, 255))
            rgb_image.paste(image, mask=image.split()[3])  # Use alpha channel as mask
            image = rgb_image
        image.save(output_path, format="JPEG", quality=quality)
    else:
        # Save as PNG or other supported format
        image.save(output_path, format=output_format.upper())

    return output_path

def generate_image(prompt, output_path, size="1536x1024", quality="high", output_format=None):
    """Generate an image using Azure OpenAI DALL-E API."""
    base_path = f'openai/deployments/{deployment}/images'
    params = f'?api-version={api_version}'

    generation_url = f"{endpoint}{base_path}/generations{params}"
    generation_body = {
        "prompt": prompt,
        "n": 1,
        "size": size,
        "quality": quality,
        "output_format": "png"  # Always request PNG from API
    }

    print(f"Generating image with prompt: '{prompt}'")
    print(f"Size: {size}, Quality: {quality}")

    try:
        response = requests.post(
            generation_url,
            headers={
                'Api-Key': subscription_key,
                'Content-Type': 'application/json',
            },
            json=generation_body,
            timeout=180  # Increased to 3 minutes for complex prompts
        )
        response.raise_for_status()
        response_data = response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error making API request: {e}", file=sys.stderr)
        if hasattr(e, 'response') and e.response is not None:
            try:
                error_details = e.response.json()
                print(f"Error details: {error_details}", file=sys.stderr)
            except:
                print(f"Response text: {e.response.text}", file=sys.stderr)
        sys.exit(1)

    if 'data' not in response_data or not response_data['data']:
        print("Error: No image data in API response", file=sys.stderr)
        sys.exit(1)

    # Determine output format from file extension
    if output_format is None:
        output_format = Path(output_path).suffix[1:].lower() or "png"

    # Extract quality value for image conversion (webp/jpeg)
    # Map quality string to numeric value
    quality_map = {
        "low": 70,
        "medium": 85,
        "high": 95,
        "auto": 95
    }
    conversion_quality = quality_map.get(quality.lower(), 95)

    # Decode and save the first image
    b64_img = response_data['data'][0]['b64_json']
    saved_path = decode_and_save_image(b64_img, output_path, output_format, conversion_quality)

    print(f"Image saved to: '{saved_path}'")
    return saved_path

def generate_content_image(content_type, slug, prompt, size="1536x1024", quality="high"):
    """
    Generate hero image for tips, guides, or news content.

    Args:
        content_type: One of 'tips', 'guides', 'news'
        slug: The URL slug for the content (e.g., 'plant-science-november-2025')
        prompt: Image generation prompt
        size: Image size (default: 1536x1024)
        quality: Image quality (default: high)

    Returns:
        Path to the saved image
    """
    # Get the project root (assuming script is in scripts/ directory)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent

    # Build output path
    output_dir = project_root / "public" / "images" / "webp" / content_type
    output_dir.mkdir(parents=True, exist_ok=True)

    output_path = output_dir / f"{slug}.webp"

    print(f"\n{'='*60}")
    print(f"Generating {content_type} hero image")
    print(f"Slug: {slug}")
    print(f"Output: {output_path}")
    print(f"{'='*60}\n")

    return generate_image(
        prompt=prompt,
        output_path=str(output_path),
        size=size,
        quality=quality
    )

def main():
    parser = argparse.ArgumentParser(
        description="Generate hero images using Azure OpenAI DALL-E API",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Generate for specific content type (tips/guides/news)
  %(prog)s --type news --slug "plant-science-november-2025" "Beautiful plant science collage"
  %(prog)s --type tips --slug "winter-care-guide" "Winter houseplant care illustration"
  %(prog)s --type guides --slug "succulent-rescue" "Succulent rescue guide artwork"

  # Generate to custom path
  %(prog)s "a beautiful sunset over mountains" output.webp
  %(prog)s "your prompt" output.png --size 1024x1024 --quality standard
  %(prog)s "your prompt" output.webp --quality high --size 1536x1024
        """
    )

    parser.add_argument(
        "prompt",
        nargs="?",
        help="Image generation prompt"
    )

    parser.add_argument(
        "output",
        nargs="?",
        help="Output file path (format determined by extension: .png, .webp, .jpg)"
    )

    parser.add_argument(
        "--type",
        choices=["tips", "guides", "news"],
        help="Content type (tips, guides, or news). When used with --slug, generates to correct directory."
    )

    parser.add_argument(
        "--slug",
        help="Content slug (URL-friendly name). Used with --type to auto-generate path."
    )

    parser.add_argument(
        "--size",
        default="1536x1024",
        help="Image size (default: 1536x1024). Options: 1024x1024, 1792x1024, 1024x1792, 1536x1024"
    )

    parser.add_argument(
        "--quality",
        default="high",
        choices=["low", "medium", "high", "auto"],
        help="Image quality (default: high). Options: low, medium, high, auto"
    )

    args = parser.parse_args()

    # Validate arguments
    if args.type and args.slug:
        # Content-type mode
        if not args.prompt:
            print("Error: prompt is required", file=sys.stderr)
            parser.print_help()
            sys.exit(1)

        try:
            generate_content_image(
                content_type=args.type,
                slug=args.slug,
                prompt=args.prompt,
                size=args.size,
                quality=args.quality
            )
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            sys.exit(1)
    else:
        # Custom path mode
        if not args.prompt or not args.output:
            print("Error: Both prompt and output path are required (or use --type and --slug)", file=sys.stderr)
            parser.print_help()
            sys.exit(1)

        # Validate output path
        output_path = Path(args.output)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Generate the image
        try:
            generate_image(
                prompt=args.prompt,
                output_path=str(output_path),
                size=args.size,
                quality=args.quality
            )
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            sys.exit(1)

if __name__ == "__main__":
    main()
