#!/bin/bash
# File: deploy.sh
# Website: celebrate.oze.au
# Description: Deployment script — commits, pushes to GitHub, triggers Hostinger deploy via GitHub Actions
# Version: 26.04.002
# Date: 17 Apr 2026
# Author: Colin Dixon
set -e

echo "Preparing to deploy celebrate.oze.au..."

# Ensure we are on the main branch
branch=$(git branch --show-current)
if [ "$branch" != "main" ]; then
    echo "Error: You are on branch '$branch', not 'main'. Aborting."
    exit 1
fi

# Show current status
git status --short

# Stage all changes
git add .

# Check whether anything is actually staged
if git diff --cached --quiet; then
    echo "No changes staged. Nothing to commit."
    exit 0
fi

# Prompt for a commit message
echo "Enter a commit message (or press Enter for 'Routine site update'):"
read -r message
if [ -z "$message" ]; then
    message="Routine site update"
fi

# Commit and push — GitHub Actions will rsync to Hostinger automatically
git commit -m "$message"
git push origin main

echo ""
echo "Pushed to GitHub. GitHub Actions is now deploying to Hostinger."
echo "Check progress: https://github.com/coldix/celebrate-oze-au/actions"
echo ""
echo "Live URLs (available in ~30 seconds):"
echo "  https://celebrate.oze.au"
echo "  https://celebrate.oze.au/shirley90/"
echo "  https://celebrate.oze.au/legal/terms.html"
