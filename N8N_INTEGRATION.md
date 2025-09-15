# Using TypeGPT Proxy Server with n8n

This guide explains how to use your TypeGPT proxy server with n8n workflows.

## Network Configuration

Your local IP address is: **192.168.1.249**
Proxy server port: **7000**

For n8n to connect to your proxy server, use this base URL:
```
http://192.168.1.249:7000
```

## Prerequisites

1. Your proxy server must be running:
   ```bash
   cd "E:\Qoder All\TypeGPT\typegpt-proxy-server"
   node server.js
   ```

2. Register a client to get an API key:
   ```bash
   curl -X POST http://192.168.1.249:7000/admin/register-client \
     -H "Content-Type: application/json" \
     -d '{
       "adminKey": "super-secret-admin-key-12345",
       "clientName": "n8n Client",
       "clientApiKey": "n8n-client-key-123"
     }'
   ```

## n8n HTTP Node Configuration

### 1. Create a new HTTP Request node in n8n

### 2. Configure the node with these settings:

**Method**: POST
**URL**: `http://192.168.1.249:7000/v1/chat/completions`
**Authentication**: None (we'll add the API key in headers)

### 3. Add Headers:
```
Authorization: Bearer n8n-client-key-123
Content-Type: application/json
```

### 4. Add Body (JSON):
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

## cURL Commands for Testing

### 1. Health Check
```bash
curl http://192.168.1.249:7000/health
```

### 2. Register Client (Admin Only)
```bash
curl -X POST http://192.168.1.249:7000/admin/register-client \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "super-secret-admin-key-12345",
    "clientName": "n8n Client",
    "clientApiKey": "n8n-client-key-123"
  }'
```

### 3. Test Chat Completion
```bash
curl -X POST http://192.168.1.249:7000/v1/chat/completions \
  -H "Authorization: Bearer n8n-client-key-123" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "Hello from cURL!"
      }
    ]
  }'
```

### 4. Delete Client (Admin Only)
```bash
curl -X DELETE "http://192.168.1.249:7000/admin/client/n8n-client-key-123?adminKey=super-secret-admin-key-12345"
```

## Troubleshooting n8n Connection Issues

### 1. Firewall Settings
Make sure Windows Firewall allows connections on port 7000:
- Open Windows Defender Firewall
- Click "Advanced settings"
- Create a new "Inbound Rule" for port 7000
- Allow the connection

### 2. Network Binding
By default, the server listens on all interfaces (0.0.0.0), which should work for your local network.

### 3. Test Connectivity
From another device on the same network:
```bash
ping 192.168.1.249
```

### 4. Port Availability
Verify the server is listening:
```bash
netstat -an | findstr 7000
```

## Example n8n Workflow

Here's a complete example of an n8n workflow that uses your proxy server:

1. **Start node**: Manual trigger
2. **HTTP Request node**: 
   - Method: POST
   - URL: `http://192.168.1.249:7000/v1/chat/completions`
   - Headers:
     - Authorization: Bearer n8n-client-key-123
     - Content-Type: application/json
   - Body:
     ```json
     {
       "model": "gpt-4o",
       "messages": [
         {
           "role": "user",
           "content": "What are the benefits of using a proxy server for API access?"
         }
       ]
     }
     ```
3. **Output node**: Display the response

## Security Considerations

1. **API Key Management**: 
   - Generate unique API keys for each n8n workflow
   - Store API keys securely in n8n credentials

2. **Network Security**:
   - Only expose the server on trusted networks
   - Consider using VPN for remote access

3. **Rate Limiting**:
   - Implement rate limiting to prevent abuse
   - Monitor API usage per client

## Advanced n8n Integration

### Using n8n Credentials
1. In n8n, go to "Credentials" > "HTTP Basic Auth"
2. Create a new credential with:
   - User: (leave empty)
   - Password: n8n-client-key-123
3. In your HTTP Request node, select this credential
4. Set the Authorization header to use the credential

### Dynamic Message Content
You can pass dynamic content from previous nodes:
```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "user",
      "content": "={{ $json.inputText }}"
    }
  ]
}
```

## Monitoring and Logging

To monitor requests from n8n:
1. Check server console output
2. Add logging to the proxy server
3. Implement request tracking per client

## Support

If you encounter issues:
1. Verify the proxy server is running
2. Check network connectivity to 192.168.1.249:7000
3. Confirm API key is valid
4. Review firewall settings