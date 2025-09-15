@echo off
echo Starting TypeGPT Proxy Server...
echo Server will be available at http://192.168.1.249:7000
echo Press Ctrl+C to stop the server
cd /d "E:\Qoder All\TypeGPT\typegpt-proxy-server"
node server.js
pause