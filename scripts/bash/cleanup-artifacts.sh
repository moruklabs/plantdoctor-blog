#!/bin/bash

# GitHub Actions Artifact Cleanup Script
# This script helps clean up old artifacts to free storage quota
export GH_PAGER=cat
echo "🧹 GitHub Actions Artifact Cleanup Script"
echo "=========================================="

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "❌ Not authenticated with GitHub CLI."
    echo "Run: gh auth login"
    exit 1
fi

echo "📊 Current artifact storage usage:"
gh api repos/:owner/:repo/actions/artifacts --paginate | jq '.artifacts | length'

echo ""
echo "🗑️  Cleaning up artifacts older than 1 day..."

# List and delete artifacts older than 1 day
artifacts=$(gh api repos/:owner/:repo/actions/artifacts --paginate | jq -r '.artifacts[] | select((.created_at | fromdateiso8601) < (now - 1*24*3600)) | .id')

if [ -z "$artifacts" ]; then
    echo "✅ No old artifacts found to clean up."
else
    echo "Found $(echo "$artifacts" | wc -l) artifacts to delete..."

    for artifact_id in $artifacts; do
        echo "Deleting artifact ID: $artifact_id"
        gh api repos/:owner/:repo/actions/artifacts/$artifact_id -X DELETE
    done

    echo "✅ Cleanup completed!"
fi

echo ""
echo "📊 Updated artifact storage usage:"
gh api repos/:owner/:repo/actions/artifacts --paginate | jq '.artifacts | length'

echo ""
echo "💡 Tips to prevent future issues:"
echo "   - Lighthouse CI artifact upload is now disabled"
echo "   - Set up automatic artifact cleanup with retention policies"
echo "   - Monitor storage usage regularly"
