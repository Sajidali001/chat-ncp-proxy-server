const axios = require('axios');

async function testApi() {
  try {
    console.log('Testing API connection...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://192.168.1.249:7000/health');
    console.log('Health check:', healthResponse.data);
    
    // Test client stats endpoint
    const statsResponse = await axios.get('http://192.168.1.249:7000/client/stats', {
      headers: {
        'Authorization': 'Bearer n8n-client-key-123'
      }
    });
    console.log('Client stats:', statsResponse.data);
    
    console.log('API connection test completed successfully!');
  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
  }
}

testApi();