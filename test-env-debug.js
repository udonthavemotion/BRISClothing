// Debug script to test environment variable access
import fetch from 'node-fetch';

async function testEnvDebug() {
  console.log('🔍 Testing Environment Variable Access in API');
  console.log('==============================================\n');
  
  // Create a simple test payload
  const payload = {
    email: 'debug@test.com'
  };
  
  try {
    console.log('🔄 Making request to debug API endpoint...');
    
    const response = await fetch('http://localhost:4321/api/send-access-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    console.log(`📊 Response Status: ${response.status}`);
    
    const responseText = await response.text();
    console.log('\n📥 Raw Response:');
    console.log(responseText);
    
    try {
      const responseData = JSON.parse(responseText);
      console.log('\n📦 Parsed Response:');
      console.log(JSON.stringify(responseData, null, 2));
    } catch (parseError) {
      console.log('\n❌ Failed to parse response as JSON');
      console.log('Raw response length:', responseText.length);
    }
    
  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
  }
}

testEnvDebug().catch(console.error);
