// Test script for local BRISC API webhook integration
import fetch from 'node-fetch';

const LOCAL_API_URL = 'http://localhost:4321/api/send-access-email';

async function testLocalWebhook(testEmail = 'godspeedbulldogs@gmail.com') {
  console.log('🚀 Testing Local BRISC API Webhook Integration');
  console.log('===============================================\n');
  
  console.log(`📧 Test email: ${testEmail}`);
  console.log(`🔗 Local API URL: ${LOCAL_API_URL}\n`);
  
  const payload = {
    email: testEmail
  };
  
  console.log('📦 Request payload:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('');
  
  try {
    console.log('🔄 Sending request to local API...');
    
    const response = await fetch(LOCAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📋 Response Headers:`, Object.fromEntries(response.headers));
    
    const responseData = await response.json();
    
    console.log('\n📥 Response Body:');
    console.log(JSON.stringify(responseData, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Local API request successful!');
      
      if (responseData.emailSent) {
        console.log('🎯 GHL webhook was triggered successfully');
        console.log(`📬 Check the inbox for: ${testEmail}`);
        console.log(`🔗 Provider: ${responseData.provider}`);
        console.log(`📝 Message ID: ${responseData.messageId}`);
      } else {
        console.log('⚠️ API succeeded but email was not sent');
        console.log(`❓ Reason: ${responseData.emailError || 'Unknown'}`);
        console.log(`💡 User message: ${responseData.userMessage}`);
      }
      
      return true;
    } else {
      console.log('\n❌ Local API request failed');
      console.log('🔧 Check your local server and webhook configuration');
      return false;
    }
    
  } catch (error) {
    console.error('\n❌ Request failed:', error.message);
    console.log('🔧 Make sure your local server is running on port 4321');
    return false;
  }
}

// Test with multiple scenarios
async function runLocalTests() {
  console.log('🧪 Running Local API Webhook Tests\n');
  
  const testCases = [
    { email: 'godspeedbulldogs@gmail.com', description: 'Your verified email' },
    { email: 'test@example.com', description: 'Test client email' }
  ];
  
  let successCount = 0;
  
  for (const testCase of testCases) {
    console.log(`\n🎯 Test Case: ${testCase.description}`);
    console.log('─'.repeat(50));
    
    const success = await testLocalWebhook(testCase.email);
    if (success) successCount++;
    
    // Wait between tests
    if (testCase !== testCases[testCases.length - 1]) {
      console.log('\n⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`✅ Successful: ${successCount}/${testCases.length}`);
  console.log(`❌ Failed: ${testCases.length - successCount}/${testCases.length}`);
  
  if (successCount > 0) {
    console.log('\n🎉 Local webhook integration is working!');
    console.log('📧 Emails should be delivered via GHL');
    console.log('🚀 Ready to deploy to production');
  } else {
    console.log('\n🔧 Local integration needs attention');
    console.log('💡 Check your local server and GHL webhook setup');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Verify emails were received in your inbox');
  console.log('2. If working, add GHL_WEBHOOK_URL to Vercel environment variables');
  console.log('3. Deploy the updated code');
  console.log('4. Test the production integration');
}

// Run the tests
runLocalTests().catch(console.error);
