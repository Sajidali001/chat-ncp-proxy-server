@echo off
echo Chat NCP Proxy Server Setup Script for VPS
echo ==========================================
echo.
echo This script provides guidance for setting up the Chat NCP Proxy Server on a VPS.
echo.
echo Prerequisites:
echo - A VPS with Ubuntu/Debian Linux
echo - SSH access to your VPS
echo.
echo Setup Steps:
echo 1. SSH into your VPS
echo 2. Update system packages: sudo apt update && sudo apt upgrade -y
echo 3. Install Node.js and npm: sudo apt install -y nodejs npm
echo 4. Install PM2: npm install -g pm2
echo 5. Install Nginx: sudo apt install -y nginx
echo 6. Create directory: sudo mkdir -p /opt/chat-ncp-proxy
echo 7. Clone repository or copy files to /opt/chat-ncp-proxy
echo 8. Configure .env file with your settings
echo 9. Install dependencies: npm install
echo 10. Start with PM2: pm2 start server.js --name chat-ncp-proxy
echo.
echo For detailed instructions, see DEPLOYMENT_GUIDE.md