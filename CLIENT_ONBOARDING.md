# TypeGPT Proxy Server - Client Onboarding Workflow

This document explains the complete workflow for onboarding clients who will use your proxy server with n8n.

## Workflow Overview

1. **You**: Run the proxy server
2. **You**: Register a new client for each customer
3. **You**: Provide the client API key to your customer
4. **Customer**: Configures n8n to use your proxy server with their API key
5. **Customer**: Uses the API through n8n workflows

## Step-by-Step Process

### Step 1: Start the Proxy Server

Run the server using either:
- Double-click `start-server.bat`
- Or run in terminal:
  ```bash
  cd "E:\Qoder All\TypeGPT\typegpt-proxy-server"
  node server.js
  ```

### Step 2: Verify Server is Running

Run PowerShell script:
```powershell
.\check-server.ps1
```

Or manually check:
```bash
curl http://192.168.1.249:7000/health
```

### Step 3: Register a New Client for a Customer

Each customer needs their own API key. Register a client using one of these methods:

#### Method 1: Using cURL
```bash
curl -X POST http://192.168.1.249:7000/admin/register-client \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "super-secret-admin-key-12345",
    "clientName": "Customer Company Name",
    "clientApiKey": "customer-unique-api-key-123"
  }'
```

#### Method 2: Using the Dashboard
1. Open browser to: http://192.168.1.249:7000
2. Fill in the "Register New Client" form
3. Click "Register Client"

### Step 4: Provide API Key to Customer

Provide the customer with:
1. **Server Address**: `http://192.168.1.249:7000`
2. **Their API Key**: (e.g., `customer-unique-api-key-123`)
3. **Integration Guide**: [N8N_INTEGRATION.md](file:///E:/Qoder%20All/TypeGPT/typegpt-proxy-server/N8N_INTEGRATION.md)

### Step 5: Customer Configures n8n

The customer follows these steps in n8n:

1. Create a new workflow
2. Add an "HTTP Request" node
3. Configure the node:
   - **Method**: POST
   - **URL**: `http://192.168.1.249:7000/v1/chat/completions`
   - **Headers**:
     - `Authorization: Bearer customer-unique-api-key-123`
     - `Content-Type: application/json`
   - **Body** (JSON):
     ```json
     {
       "model": "gpt-4o",
       "messages": [
         {
           "role": "user",
           "content": "Hello from n8n!"
         }
       ]
     }
     ```

### Step 6: Customer Tests the Integration

The customer runs their workflow to verify everything works correctly.

## Example Client Onboarding

### For Customer: "ACME Corp"

1. Register the client:
   ```bash
   curl -X POST http://192.168.1.249:7000/admin/register-client \
     -H "Content-Type: application/json" \
     -d '{
       "adminKey": "super-secret-admin-key-12345",
       "clientName": "ACME Corp",
       "clientApiKey": "acme-corp-api-key-xyz789"
     }'
   ```

2. Response:
   ```json
   {
     "message": "Client ACME Corp registered successfully.",
     "clientApiKey": "acme-corp-api-key-xyz789"
   }
   ```

3. Provide to ACME Corp:
   - Server Address: `http://192.168.1.249:7000`
   - API Key: `acme-corp-api-key-xyz789`
   - Documentation: [N8N_INTEGRATION.md](file:///E:/Qoder%20All/TypeGPT/typegpt-proxy-server/N8N_INTEGRATION.md)

## Best Practices for Selling API Access

1. **Unique API Keys**: Generate a unique API key for each customer
2. **Descriptive Names**: Use customer names when registering clients
3. **Secure Distribution**: Send API keys securely to customers
4. **Documentation**: Provide clear integration instructions
5. **Support**: Offer support for integration issues
6. **Monitoring**: Track usage per customer (future enhancement)
7. **Billing**: Implement usage-based billing (future enhancement)

## Troubleshooting Common Issues

### Issue 1: "Connection Refused" in n8n
**Solution**: 
- Verify the proxy server is running
- Check firewall settings
- Confirm the IP address is correct

### Issue 2: "401 Unauthorized" Error
**Solution**:
- Verify the API key is correct
- Check that the Authorization header is properly formatted

### Issue 3: "500 Internal Server Error"
**Solution**:
- This indicates an issue with the TypeGPT API
- Check your TypeGPT API key in the .env file
- Verify the TypeGPT API is functioning

## Scaling Your Service

As you acquire more customers, consider:
1. **Database Integration**: Store client information in a database
2. **Rate Limiting**: Implement per-client rate limits
3. **Usage Analytics**: Track API usage per client
4. **Billing Integration**: Automate invoicing based on usage
5. **Load Balancing**: Scale the proxy server for high availability

## Support Resources

- **Technical Documentation**: [DOCUMENTATION.md](file:///E:/Qoder%20All/TypeGPT/typegpt-proxy-server/DOCUMENTATION.md)
- **n8n Integration Guide**: [N8N_INTEGRATION.md](file:///E:/Qoder%20All/TypeGPT/typegpt-proxy-server/N8N_INTEGRATION.md)
- **Client Integration Guide**: [CLIENT_INTEGRATION.md](file:///E:/Qoder%20All/TypeGPT/typegpt-proxy-server/CLIENT_INTEGRATION.md)
- **Dashboard**: http://192.168.1.249:7000

Your proxy server is now ready to be sold as a service to customers who will use it with n8n and other automation tools!