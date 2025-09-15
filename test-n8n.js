// Test script for n8n integration
const axios = require('axios');

async function testN8nIntegration() {
  try {
    console.log('Testing n8n integration with TypeGPT proxy server...');
    
    // Test 1: Health check
    console.log('\n1. Testing health check...');
    const healthResponse = await axios.get('http://192.168.1.249:7000/health');
    console.log('Health check response:', healthResponse.data);
    
    // Test 2: Register client for n8n
    console.log('\n2. Registering client for n8n...');
    const registerResponse = await axios.post('http://192.168.1.249:7000/admin/register-client', {
      adminKey: 'super-secret-admin-key-12345',
      clientName: 'n8n Client',
      clientApiKey: 'n8n-client-key-123'
    });
    console.log('Client registration response:', registerResponse.data);
    
    // Test 3: Test chat completion (similar to how n8n would call it)
    console.log('\n3. Testing chat completion (n8n style)...');
    const chatResponse = await axios.post('http://192.168.1.249:7000/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: 'Hello from n8n test script!'
        }
      ]
    }, {
      headers: {
        'Authorization': 'Bearer n8n-client-key-123',
        'Content-Type': 'application/json'
      }
    });
    console.log('Chat completion response:', JSON.stringify(chatResponse.data, null, 2));
    
    console.log('\n✅ All tests passed! Your proxy server is ready for n8n integration.');
    console.log('\n📝 Next steps:');
    console.log('1. Open n8n');
    console.log('2. Create a new HTTP Request node');
    console.log('3. Configure with the settings from N8N_INTEGRATION.md');
    console.log('4. Use API key: n8n-client-key-123');
    
  } catch (error) {
    console.error('❌ Error testing n8n integration:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status code:', error.response.status);
    }
  }
}

testN8nIntegration();