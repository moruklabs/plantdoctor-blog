#!/bin/bash
set -euo pipefail

echo "🔧 Setting up actionlint for GitHub workflow validation..."

# Check if actionlint is already installed
if command -v actionlint >/dev/null 2>&1; then
    echo "✅ actionlint is already installed: $(actionlint --version)"
    exit 0
fi

# Detect platform and install accordingly
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍺 Detected macOS - installing via Homebrew..."
    if command -v brew >/dev/null 2>&1; then
        brew install actionlint
        echo "✅ actionlint installed successfully via Homebrew"
    else
        echo "❌ Homebrew not found. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Detected Linux - downloading binary..."
    curl -s https://api.github.com/repos/rhysd/actionlint/releases/latest | \
        grep browser_download_url | grep linux_amd64 | cut -d '"' -f 4 | \
        xargs curl -L -o actionlint
    chmod +x actionlint

    # Try to move to system path
    if sudo mv actionlint /usr/local/bin/ 2>/dev/null; then
        echo "✅ actionlint installed to /usr/local/bin/"
    else
        echo "⚠️  Could not install to /usr/local/bin/ (permission denied)"
        echo "   Moving to ~/bin/ instead..."
        mkdir -p ~/bin
        mv actionlint ~/bin/
        echo "✅ actionlint installed to ~/bin/"
        echo "ℹ️  Make sure ~/bin is in your PATH"
    fi
else
    echo "❌ Unsupported platform: $OSTYPE"
    echo "   Please install actionlint manually:"
    echo "   https://github.com/rhysd/actionlint#installation"
    exit 1
fi

# Verify installation
if command -v actionlint >/dev/null 2>&1; then
    echo "🎉 Setup complete! actionlint version: $(actionlint --version)"
else
    echo "❌ Installation failed. Please check the error messages above."
    exit 1
fi
