#!/bin/bash
# Automatic session start protocol enforcement

echo "🚀 Starting new session - executing mandatory protocol..."

# Protocol 1: New Session Start
echo "📖 Step 1: Reading STATUS.md..."
cat STATUS.md | head -50

echo -e "\n📋 Step 2: Reading TODO.md In Progress section..."
sed -n '/## 🔥 In Progress/,/## 📌 Up Next/p' TODO.md

echo -e "\n📐 Step 3: Recent architectural decisions..."
tail -50 DECISIONS.md | grep -E "^## ADR-" | head -3

echo -e "\n🔍 Step 4: Git status..."
git status --short
git log --oneline -3

echo -e "\n✅ Mandatory protocol complete!"
echo "📍 Current phase: $(grep "Current Phase:" STATUS.md | head -1)"
echo "🎯 Next action: Check TODO.md for highest priority task"