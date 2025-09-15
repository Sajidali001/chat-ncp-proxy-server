const axios = require('axios');

// Client example - how your clients would use the proxy server
async function clientExample() {
  try {
    console.log('Client making a request to the proxy server...');
    
    // Client makes a request to the proxy server using their API key
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
        'Authorization': 'Bearer test-client-key-123',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response from proxy server:', response.data);
    
  } catch (error) {
    if (error.response) {
      console.error('Error response from proxy server:', error.response.data);
      console.error('Status code:', error.response.status);
    } else {
      console.error('Network error:', error.message);
    }
  }
}

clientExample();