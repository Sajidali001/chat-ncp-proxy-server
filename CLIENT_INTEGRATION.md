# Client Integration Guide

This guide shows how your clients can integrate with your TypeGPT proxy server.

## Installation

Clients need to install the required dependencies:

```bash
npm install axios
```

## Basic Usage

### 1. Making a Chat Request

```javascript
const axios = require('axios');

async function chatWithLLM() {
  try {
    const response = await axios.post('http://YOUR_SERVER_IP:7000/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: 'Hello, how are you?'
        }
      ]
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_CLIENT_API_KEY',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
  }
}

chatWithLLM();
```

### 2. Using with Python

```python
import requests
import json

def chat_with_llm():
    url = "http://YOUR_SERVER_IP:7000/v1/chat/completions"
    headers = {
        "Authorization": "Bearer YOUR_CLIENT_API_KEY",
        "Content-Type": "application/json"
    }
    data = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": "Hello, how are you?"
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        print("Response:", response.json())
    except requests.exceptions.RequestException as e:
        print("Error:", e)

chat_with_llm()
```

### 3. Using with cURL

```bash
curl -X POST http://YOUR_SERVER_IP:7000/v1/chat/completions \
  -H "Authorization: Bearer YOUR_CLIENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ]
  }'
```

## Available Models

Your proxy server supports these models:
- gpt-4o
- o3-mini
- gpt-4.1
- o3
- gpt-5-chat
- gpt-5-model-router
- gpt-5
- gpt-5-mini

## Error Handling

Clients should handle these common error responses:

1. **401 Unauthorized**: Missing or invalid API key
2. **403 Forbidden**: Invalid API key
3. **429 Too Many Requests**: Rate limit exceeded (if implemented)
4. **500 Internal Server Error**: Server or TypeGPT API error

Example error response:
```json
{
  "error": {
    "message": "Invalid API key",
    "type": "authentication_error",
    "code": 403
  }
}
```

## Best Practices

1. **Store API Keys Securely**: Never hardcode API keys in client-side code
2. **Handle Errors Gracefully**: Implement proper error handling
3. **Respect Rate Limits**: Implement retry logic with exponential backoff
4. **Validate Responses**: Check response structure before processing
5. **Use HTTPS**: In production, always use HTTPS for secure communication

## Support

For issues with the proxy server, contact your service provider. For integration issues, refer to this guide and the documentation provided.