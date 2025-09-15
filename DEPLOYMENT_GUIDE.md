# Deployment Guide for Chat NCP Proxy Server

This guide provides step-by-step instructions for deploying the Chat NCP Proxy Server on your VPS, hosting it on GitHub, and setting up automatic updates.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Deploying to VPS](#deploying-to-vps)
3. [Hosting on GitHub](#hosting-on-github)
4. [Setting Up Automatic Updates](#setting-up-automatic-updates)
5. [Updating the Deployment](#updating-the-deployment)

## Prerequisites

Before deploying, ensure you have:
- A VPS with Docker installed (you mentioned you have this with Contabo)
- A GitHub account (username: Sajidali001)
- SSH access to your VPS
- Basic knowledge of command line operations

## Deploying to VPS

### Step 1: Prepare Your VPS

1. SSH into your VPS:
   ```bash
   ssh username@your-vps-ip
   ```

2. Create a directory for the application:
   ```bash
   mkdir -p /opt/chat-ncp-proxy
   cd /opt/chat-ncp-proxy
   ```

### Step 2: Install Node.js (if not already installed)

```bash
# Update package list
sudo apt update

# Install Node.js and npm
sudo apt install -y nodejs npm

# Verify installation
node --version
npm --version
```

### Step 3: Deploy the Application

You have two options for deploying the application:

#### Option A: Manual Deployment (Recommended for first deployment)

1. Copy the application files to your VPS:
   ```bash
   # From your local machine, run this command:
   scp -r /path/to/local/typegpt-proxy-server/* username@your-vps-ip:/opt/chat-ncp-proxy/
   ```

2. SSH back into your VPS and navigate to the application directory:
   ```bash
   cd /opt/chat-ncp-proxy
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create and configure the .env file:
   ```bash
   nano .env
   ```
   
   Add your configuration:
   ```
   PORT=7000
   ADMIN_KEY=your-super-secret-admin-key
   A4F_API_KEY=your-upstream-api-key
   A4F_BASE_URL=https://your-upstream-api-base-url
   ```

5. Test the application:
   ```bash
   node server.js
   ```

6. Verify it's working by accessing the health endpoint:
   ```bash
   curl http://localhost:7000/health
   ```

#### Option B: Docker Deployment (Recommended for production)

1. Create a Dockerfile in the application directory:
   ```bash
   nano Dockerfile
   ```

   Add the following content:
   ```dockerfile
   FROM node:18-alpine

   # Create app directory
   WORKDIR /usr/src/app

   # Copy package files
   COPY package*.json ./

   # Install dependencies
   RUN npm ci --only=production

   # Copy app source
   COPY . .

   # Expose port
   EXPOSE 7000

   # Start the application
   CMD ["node", "server.js"]
   ```

2. Create a docker-compose.yml file:
   ```bash
   nano docker-compose.yml
   ```

   Add the following content:
   ```yaml
   version: '3.8'

   services:
     chat-ncp-proxy:
       build: .
       ports:
         - "7000:7000"
       environment:
         - PORT=7000
         - ADMIN_KEY=your-super-secret-admin-key
         - A4F_API_KEY=your-upstream-api-key
         - A4F_BASE_URL=https://your-upstream-api-base-url
       volumes:
         - ./logs:/usr/src/app/logs
       restart: unless-stopped
   ```

3. Build and run the Docker container:
   ```bash
   docker-compose up -d
   ```

### Step 4: Set Up Nginx as a Reverse Proxy (Optional but Recommended)

1. Install Nginx:
   ```bash
   sudo apt install -y nginx
   ```

2. Create an Nginx configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/chat-ncp-proxy
   ```

   Add the following content (adjust domain and port as needed):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:7000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/chat-ncp-proxy /etc/nginx/sites-enabled/
   ```

4. Test Nginx configuration:
   ```bash
   sudo nginx -t
   ```

5. Restart Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

### Step 5: Set Up SSL with Let's Encrypt (Optional but Recommended)

1. Install Certbot:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. Obtain SSL certificate:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. Follow the prompts to complete the SSL setup.

## Hosting on GitHub

### Step 1: Create a GitHub Repository

1. Go to GitHub and create a new repository (e.g., `chat-ncp-proxy-server`)
2. Do NOT initialize with a README, .gitignore, or license

### Step 2: Initialize Git in Your Local Project

1. Navigate to your project directory:
   ```bash
   cd e:\Qoder All\TypeGPT\typegpt-proxy-server
   ```

2. Initialize Git:
   ```bash
   git init
   ```

3. Add all files:
   ```bash
   git add .
   ```

4. Commit the files:
   ```bash
   git commit -m "Initial commit"
   ```

5. Add the remote repository:
   ```bash
   git remote add origin https://github.com/Sajidali001/chat-ncp-proxy-server.git
   ```

6. Push to GitHub:
   ```bash
   git branch -M main
   git push -u origin main
   ```

## Setting Up Automatic Updates

### Option 1: Using GitHub Actions (Recommended)

1. Create a GitHub Actions workflow file:
   ```bash
   mkdir -p .github/workflows
   nano .github/workflows/deploy.yml
   ```

2. Add the following content:
   ```yaml
   name: Deploy to VPS

   on:
     push:
       branches: [ main ]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v3

       - name: Deploy to VPS
         uses: appleboy/ssh-action@v0.1.5
         with:
           host: ${{ secrets.VPS_HOST }}
           username: ${{ secrets.VPS_USERNAME }}
           key: ${{ secrets.VPS_SSH_KEY }}
           script: |
             cd /opt/chat-ncp-proxy
             git pull origin main
             npm install
             pm2 restart chat-ncp-proxy || pm2 start server.js --name chat-ncp-proxy
   ```

3. Set up secrets in your GitHub repository:
   - Go to your repository settings
   - Click on "Secrets and variables" → "Actions"
   - Add the following secrets:
     - `VPS_HOST`: Your VPS IP address
     - `VPS_USERNAME`: Your VPS username
     - `VPS_SSH_KEY`: Your private SSH key

### Option 2: Using a Simple Script on VPS

1. Create an update script on your VPS:
   ```bash
   nano /opt/chat-ncp-proxy/update.sh
   ```

2. Add the following content:
   ```bash
   #!/bin/bash

   # Navigate to the application directory
   cd /opt/chat-ncp-proxy

   # Pull the latest changes
   git pull origin main

   # Install any new dependencies
   npm install

   # Restart the application
   pm2 restart chat-ncp-proxy || pm2 start server.js --name chat-ncp-proxy

   echo "Application updated successfully"
   ```

3. Make the script executable:
   ```bash
   chmod +x /opt/chat-ncp-proxy/update.sh
   ```

4. Set up a cron job to run the update script periodically:
   ```bash
   crontab -e
   ```

   Add this line to check for updates every hour:
   ```bash
   0 * * * * /opt/chat-ncp-proxy/update.sh >> /opt/chat-ncp-proxy/logs/update.log 2>&1
   ```

## Updating the Deployment

### Manual Update Process

1. Make changes to your local code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```

3. On your VPS, pull the changes:
   ```bash
   cd /opt/chat-ncp-proxy
   git pull origin main
   ```

4. Install any new dependencies:
   ```bash
   npm install
   ```

5. Restart the application:
   ```bash
   # If using PM2
   pm2 restart chat-ncp-proxy

   # If running directly
   # First stop the current process (find PID with `ps aux | grep node`)
   # kill -9 PID
   # Then start the server again
   # node server.js
   ```

### Automated Update Process

If you've set up GitHub Actions or the cron job script, updates will happen automatically when you push to the main branch.

## Production Considerations

1. **Use PM2 for Process Management**:
   ```bash
   # Install PM2 globally
   npm install -g pm2

   # Start the application with PM2
   pm2 start server.js --name chat-ncp-proxy

   # Save PM2 configuration
   pm2 save

   # Set PM2 to start on boot
   pm2 startup
   ```

2. **Monitor Logs**:
   ```bash
   # View application logs
   pm2 logs chat-ncp-proxy

   # View specific lines
   pm2 logs chat-ncp-proxy --lines 100
   ```

3. **Set Up Firewall**:
   ```bash
   # Allow only necessary ports
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```

4. **Regular Backups**:
   - Backup your .env file securely
   - Backup any persistent data if you add database storage

## Troubleshooting

1. **Application Won't Start**:
   - Check logs: `pm2 logs chat-ncp-proxy`
   - Verify .env file is correctly configured
   - Ensure all dependencies are installed: `npm install`

2. **Port Already in Use**:
   - Check what's using the port: `lsof -i :7000`
   - Kill the process: `kill -9 PID`

3. **Nginx Configuration Issues**:
   - Test configuration: `sudo nginx -t`
   - Check logs: `sudo tail -f /var/log/nginx/error.log`

4. **SSL Certificate Issues**:
   - Renew certificate: `sudo certbot renew`
   - Check certificate status: `sudo certbot certificates`

## Conclusion

You now have a fully deployed Chat NCP Proxy Server with automatic update capabilities. The setup includes:

- Secure deployment on your VPS
- GitHub hosting for version control at https://github.com/Sajidali001/chat-ncp-proxy-server
- Automatic updates through GitHub Actions or cron jobs
- Production-ready configuration with PM2 process management
- SSL encryption with Let's Encrypt
- Nginx reverse proxy for better performance and security

Remember to regularly update your dependencies and monitor your application for optimal performance and security.