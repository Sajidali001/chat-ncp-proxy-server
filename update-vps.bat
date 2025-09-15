@echo off
echo Chat NCP Proxy Server Update Script for VPS
echo ==========================================
echo.
echo This script provides guidance for updating the Chat NCP Proxy Server on your VPS.
echo.
echo Update Steps:
echo 1. SSH into your VPS
echo 2. Navigate to the application directory: cd /opt/chat-ncp-proxy
echo 3. Pull latest changes: git pull origin main
echo 4. Install dependencies: npm install
echo 5. Restart application: pm2 restart chat-ncp-proxy
echo.
echo For automated updates, see DEPLOYMENT_GUIDE.md