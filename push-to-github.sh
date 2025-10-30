#!/bin/bash

# FHEVault - GitHub Push Script
# This script prepares and pushes the repository to GitHub

echo "🚀 FHEVault - Pushing to GitHub"
echo "================================"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "✅ Remote 'origin' already configured"
    CURRENT_REMOTE=$(git remote get-url origin)
    echo "   Current remote: $CURRENT_REMOTE"
    echo ""
    read -p "Do you want to change the remote? (y/n): " CHANGE_REMOTE
    if [ "$CHANGE_REMOTE" = "y" ] || [ "$CHANGE_REMOTE" = "Y" ]; then
        read -p "Enter new GitHub repository URL: " NEW_REMOTE
        git remote set-url origin "$NEW_REMOTE"
        echo "✅ Remote updated to: $NEW_REMOTE"
    fi
else
    echo "⚠️  No remote configured"
    read -p "Enter your GitHub repository URL (e.g., https://github.com/yourusername/fhevault.git): " REMOTE_URL
    git remote add origin "$REMOTE_URL"
    echo "✅ Remote 'origin' added: $REMOTE_URL"
fi

echo ""
echo "📋 Staging files..."
echo "   Excluding: .replit, .config/, .upm/, replit.nix, replit.md, attached_assets/"

# Add all files (gitignore will handle exclusions)
git add .

echo "✅ Files staged"
echo ""

# Show what will be committed
echo "📝 Files to be committed:"
git status --short

echo ""
read -p "Review the files above. Continue with commit? (y/n): " CONTINUE
if [ "$CONTINUE" != "y" ] && [ "$CONTINUE" != "Y" ]; then
    echo "❌ Push cancelled"
    exit 1
fi

echo ""
read -p "Enter commit message (or press Enter for default): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Initial commit: FHEVault - Confidential Strategy Vault DApp"
fi

echo ""
echo "💾 Creating commit..."
git commit -m "$COMMIT_MSG"
echo "✅ Commit created"

echo ""
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "📚 Next Steps:"
    echo "   1. Visit your GitHub repository to verify the code"
    echo "   2. Deploy to Vercel using the VERCEL_QUICKSTART.md guide"
    echo "   3. Set VITE_CONTRACT_ADDRESS environment variable in Vercel"
    echo ""
    echo "🎉 Your FHEVault DApp is ready for deployment!"
else
    echo ""
    echo "❌ Push failed. Please check the error messages above."
    echo ""
    echo "Common issues:"
    echo "   - Authentication required: Use a Personal Access Token"
    echo "   - Repository doesn't exist: Create it on GitHub first"
    echo "   - Branch conflicts: Pull latest changes first"
fi
