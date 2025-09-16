const axios = require('axios');

async function registerClient() {
  try {
    const response = await axios.post('http://192.168.1.249:7000/admin/register-client', {
      adminKey: 'super-secret-admin-key-12345',
      clientName: 'n8n Client',
      clientApiKey: 'n8n-client-key-123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Client registered successfully:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error registering client:', error.response.data);
    } else {
      console.error('Network error:', error.message);
    }
  }
}

registerClient();