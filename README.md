# Chat NCP Proxy Server

This is a proxy server that allows you to sell access to the upstream API service to different clients. Clients will send requests to your server, which will forward them to the upstream API and return the responses.

## Features

- Client authentication with API keys
- Dynamic request forwarding to upstream API endpoints
- Response forwarding back to clients
- Admin endpoint for registering new clients
- Health check endpoint
- Support for all upstream API endpoints and models dynamically

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```

3. Configure the environment variables in the `.env` file:
   - `PORT`: The port your proxy server will run on (default: 7000)
   - `ADMIN_KEY`: A secret key for registering new clients
   - `A4F_API_KEY`: Your upstream API key (keep the variable name as A4F_API_KEY for compatibility)
   - `A4F_BASE_URL`: Base URL for upstream API (keep the variable name as A4F_BASE_URL for compatibility)

4. Start the server:
   ```
   npm start
   ```

   Or for development with auto-restart:
   ```
   npm run dev
   ```

## Deployment

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

### Quick Deployment Options:

1. **Manual Deployment**: Copy files to your VPS and run with Node.js
2. **Docker Deployment**: Use the provided Dockerfile and docker-compose.yml
3. **PM2 Process Management**: Use the ecosystem.config.js for production deployment

## Usage

### Registering a New Client (Admin Only)

To register a new client, send a POST request to `/admin/register-client`:

```bash
curl -X POST http://localhost:7000/admin/register-client \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "your-admin-key-here",
    "clientName": "Client Name",
    "clientApiKey": "client-generated-api-key"
  }'
```

### Making Requests to the Proxy

Clients can make requests to any upstream API endpoint through the proxy server:

```bash
# Chat completions
curl -X POST http://localhost:7000/v1/chat/completions \
  -H "Authorization: Bearer CLIENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "provider-3/gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "Hello!"
      }
    ]
  }'

# Embeddings
curl -X POST http://localhost:7000/v1/embeddings \
  -H "Authorization: Bearer CLIENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "provider-3/text-embedding-ada-002",
    "input": "Hello world"
  }'
```

### Dynamic Model Support

The proxy server automatically supports all models available through the upstream service. When new models are added, they will be immediately available through this proxy without any code changes.

### Dynamic Endpoint Support

The proxy server automatically supports all upstream API endpoints. When new endpoints are added, they will be immediately available through this proxy without any code changes.

## Endpoints

- `POST /admin/register-client` - Register a new client (admin only)
- `ANY /v1/*` - Generic proxy endpoint for all upstream API endpoints
- `GET /health` - Health check endpoint

## Security Notes

- Change the `ADMIN_KEY` in production
- Use HTTPS in production
- Store API keys securely
- Implement rate limiting for production use

## Additional Documentation

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [DOCUMENTATION.md](DOCUMENTATION.md) - Comprehensive guide
- [CLIENT_INTEGRATION.md](CLIENT_INTEGRATION.md) - Client integration guide
- [N8N_INTEGRATION.md](N8N_INTEGRATION.md) - n8n integration guide
- [CLIENT_ONBOARDING.md](CLIENT_ONBOARDING.md) - Client onboarding workflow