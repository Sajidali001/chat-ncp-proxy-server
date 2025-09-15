# Chat NCP Proxy Server - Complete Guide

## Overview

This proxy server acts as an intermediary between your clients and the upstream API service. It allows you to:
1. Sell API access to different clients
2. Manage client API keys
3. Monitor and control usage
4. Add additional features like rate limiting, logging, etc.

## Architecture

```
[Client] --> [Your Proxy Server] --> [Upstream API]
   ^              ^                     ^
   |              |                     |
Sends          Forwards             Returns
requests       requests             responses
with           to upstream          to your
client         with your            proxy
API key        API key              server
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Edit the `.env` file:
   - `PORT`: Server port (default: 7000)
   - `ADMIN_KEY`: Secret key for client management
   - `A4F_API_KEY`: Your upstream API key (keep the variable name as A4F_API_KEY for compatibility)
   - `A4F_BASE_URL`: Base URL for upstream API (keep the variable name as A4F_BASE_URL for compatibility)

3. **Start the Server**
   ```bash
   npm start
   ```
   
   Or for development:
   ```bash
   npm run dev
   ```

## API Endpoints

### Health Check
- **Endpoint**: `GET /health`
- **Purpose**: Verify server is running
- **Response**: 
  ```json
  {
    "status": "OK",
    "message": "Proxy server is running"
  }
  ```

### Client Registration (Admin Only)
- **Endpoint**: `POST /admin/register-client`
- **Purpose**: Register new clients
- **Request Body**:
  ```json
  {
    "adminKey": "your-admin-key",
    "clientName": "Client Name",
    "clientApiKey": "client-generated-api-key"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Client {name} registered successfully.",
    "clientApiKey": "{api-key}"
  }
  ```

### Client Deletion (Admin Only)
- **Endpoint**: `DELETE /admin/client/{clientApiKey}?adminKey={adminKey}`
- **Purpose**: Delete existing clients
- **URL Parameters**:
  - `clientApiKey`: The API key of the client to delete
  - `adminKey`: The admin key for authentication (as a query parameter)
- **Response**:
  ```json
  {
    "message": "Client {name} deleted successfully."
  }
  ```

### Generic Proxy Endpoint
- **Endpoint**: `ANY /v1/*`
- **Purpose**: Forward all requests to corresponding upstream API endpoints
- **Authentication**: Required Bearer token (client API key)
- **Request Body**: Same as upstream API
- **Response**: Same as upstream API

## Client Usage Examples

### Registering a Client (Admin)
```javascript
const axios = require('axios');

async function registerClient() {
  try {
    const response = await axios.post('http://localhost:7000/admin/register-client', {
      adminKey: 'your-admin-key',
      clientName: 'ACME Corp',
      clientApiKey: 'acme-corp-api-key-123'
    });
    
    console.log('Client registered:', response.data);
  } catch (error) {
    console.error('Registration error:', error.response.data);
  }
}
```

### Making a Chat Request (Client)
```javascript
const axios = require('axios');

async function makeChatRequest() {
  try {
    const response = await axios.post('http://localhost:7000/v1/chat/completions', {
      model: 'provider-3/gpt-4o',
      messages: [
        {
          role: 'user',
          content: 'Hello, how are you?'
        }
      ]
    }, {
      headers: {
        'Authorization': 'Bearer acme-corp-api-key-123',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Chat response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
  }
}
```

### Making an Embeddings Request (Client)
```javascript
const axios = require('axios');

async function makeEmbeddingsRequest() {
  try {
    const response = await axios.post('http://localhost:7000/v1/embeddings', {
      model: 'provider-3/text-embedding-ada-002',
      input: 'The food was delicious and the waiter was very friendly'
    }, {
      headers: {
        'Authorization': 'Bearer acme-corp-api-key-123',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Embeddings response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
  }
}
```

## Dynamic Model Support

The proxy server dynamically supports all models available through the upstream API service. When new models are added, they will automatically be available through this proxy without any code changes.

To see available models, clients can query the models endpoint:
```bash
curl -X GET http://localhost:7000/v1/models \
  -H "Authorization: Bearer CLIENT_API_KEY"
```

## Dynamic Endpoint Support

The proxy server supports all upstream API endpoints dynamically. When new endpoints are added, they will automatically be available through this proxy without any code changes.

Supported endpoint patterns:
- `/v1/chat/completions`
- `/v1/completions`
- `/v1/embeddings`
- `/v1/models`
- `/v1/moderations`
- And any other endpoints the upstream service may add in the future

## Security Considerations

1. **Change the Admin Key**: Update the `ADMIN_KEY` in `.env` with a strong, unique key
2. **Use HTTPS**: In production, always use HTTPS to encrypt traffic
3. **API Key Storage**: Store client API keys securely (consider using a database)
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Logging**: Add request logging for monitoring and debugging

## Production Deployment

1. **Environment Configuration**:
   - Set `NODE_ENV=production`
   - Use a process manager like PM2
   - Configure a reverse proxy (nginx) for HTTPS

2. **Database Integration**:
   - Replace the in-memory Map with a persistent database
   - Add client usage tracking and billing features

3. **Monitoring**:
   - Add health check endpoints
   - Implement logging and error tracking
   - Set up alerts for server issues

## Extending Functionality

You can extend this proxy server with additional features:

1. **Rate Limiting**: Add per-client request limits
2. **Billing Integration**: Track usage and generate invoices
3. **Analytics**: Log requests for usage analysis
4. **Caching**: Cache frequent responses to reduce API calls
5. **Load Balancing**: Distribute requests across multiple instances

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   - Change the PORT in `.env` to an available port
   - Check with `netstat -an | findstr LISTENING`

2. **Authentication Errors**:
   - Verify the client API key is registered
   - Check that the Authorization header is properly formatted

3. **Upstream API Errors**:
   - Verify your API key is correct
   - Check the upstream API status

### Testing

Use the provided test scripts:
- `test-server.js`: Tests server functionality
- `client-example.js`: Demonstrates client usage

Run tests with:
```bash
node test-server.js
node client-example.js
```

## Support

For issues with this proxy server, please check:
1. Server logs for error messages
2. Network connectivity to upstream API
3. Validity of API keys