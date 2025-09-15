#!/bin/bash

# Chat NCP Proxy Server Update Script for VPS
# This script updates the Chat NCP Proxy Server on your VPS

# Navigate to the application directory
cd /opt/chat-ncp-proxy

# Check if there are any changes
echo "Checking for updates..."
git fetch origin

# Get the local and remote commit hashes
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

# Compare the hashes
if [ $LOCAL = $REMOTE ]; then
    echo "No changes detected. Application is up to date."
    exit 0
fi

echo "Updates detected. Pulling changes..."

# Pull the latest changes
git pull origin main

# Install any new dependencies
echo "Installing dependencies..."
npm install

# Restart the application
echo "Restarting application..."
pm2 restart chat-ncp-proxy

echo "Application updated successfully!"