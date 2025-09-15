#!/bin/bash

# Health check script for Chat NCP Proxy Server
# This script checks if the server is running and responding properly

# Server configuration
SERVER_HOST="localhost"
SERVER_PORT="7000"
HEALTH_ENDPOINT="/health"

# Perform health check
echo "Checking server health at http://$SERVER_HOST:$SERVER_PORT$HEALTH_ENDPOINT"

# Use curl to check health endpoint
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://$SERVER_HOST:$SERVER_PORT$HEALTH_ENDPOINT)

if [ "$RESPONSE" -eq 200 ]; then
    echo "✅ Server is healthy and responding correctly"
    exit 0
else
    echo "❌ Server health check failed with HTTP code: $RESPONSE"
    exit 1
fi