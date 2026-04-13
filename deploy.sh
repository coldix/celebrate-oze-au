#!/bin/bash
# File: deploy.sh
# Website: celebrate.oze.au
# Description: Deployment automation script
# Version: 26.04.001
# Date: 13 Apr 2026 | 8:35 PM AEDT
# Author: Colin Dixon
set -e

echo "Preparing to launch celebrate.oze.au updates..."

# Ensure we are on the main branch
branch=$(git branch --show-current)
if [ "$branch" != "main" ]; then
    echo "Error: You are on branch '$branch', not 'main'. Aborting."
    exit 1
fi

# Show current status first to verify what is being staged
git status --short

# Stage all changes
git add .

# Check whether anything is actually staged
if git diff --cached --quiet; then
    echo "No changes staged. Nothing to commit."
    exit 0
fi

# Prompt for a custom commit message
echo "Enter a commit message (or press Enter to use 'Routine site update'):"
read -r message

# Set default message if left blank
if [ -z "$message" ]; then
    message="Routine site update"
fi

# Commit the changes
git commit -m "$message"

# Push to trigger Hostinger deployment
git push origin main

echo "Successfully pushed to main. Hostinger deployment triggered."
echo ""
echo "Live URLs:"
echo "  https://celebrate.oze.au"
echo "  https://celebrate.oze.au/shirley90/"
