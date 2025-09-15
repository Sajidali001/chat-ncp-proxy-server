const axios = require('axios');

async function testProxyServer() {
  try {
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:7000/health');
    console.log('Health check response:', healthResponse.data);
    
    // Register a client (admin only)
    console.log('\nRegistering a test client...');
    const registerResponse = await axios.post('http://localhost:7000/admin/register-client', {
      adminKey: 'super-secret-admin-key-12345',
      clientName: 'Test Client',
      clientApiKey: 'test-client-key-123'
    });
    console.log('Client registration response:', registerResponse.data);
    
    console.log('\nProxy server is ready to use!');
    console.log('Clients can now make requests using their API key.');
    
  } catch (error) {
    console.error('Error testing proxy server:', error.message);
  }
}

testProxyServer();