#!/bin/bash

# Chat NCP Proxy Server Setup Script for VPS
# This script automates the initial setup of the Chat NCP Proxy Server on a fresh VPS

# Update system packages
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
echo "Installing Node.js and npm..."
sudo apt install -y nodejs npm

# Install PM2 for process management
echo "Installing PM2..."
npm install -g pm2

# Install Nginx
echo "Installing Nginx..."
sudo apt install -y nginx

# Create application directory
echo "Creating application directory..."
sudo mkdir -p /opt/chat-ncp-proxy
sudo chown $USER:$USER /opt/chat-ncp-proxy

# Navigate to application directory
cd /opt/chat-ncp-proxy

# Clone the repository (you'll need to set this up after creating the GitHub repo)
echo "Setting up Git repository..."
git init

# Note: You'll need to add the remote origin after creating your GitHub repository
# git remote add origin https://github.com/your-username/chat-ncp-proxy-server.git
# git pull origin main

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Create your GitHub repository"
echo "2. Add the remote origin to this repository"
echo "3. Push your local code to GitHub"
echo "4. Pull the code on your VPS"
echo "5. Configure your .env file"
echo "6. Install dependencies with 'npm install'"
echo "7. Start the application with 'pm2 start server.js --name chat-ncp-proxy'"