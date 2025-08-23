// Test script for BRISC Go High Level webhook integration
import https from 'https';
import { URL } from 'url';

// Your GHL webhook URL (updated)
const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/9Ax53jRuv9z4JsRTJ60V/webhook-trigger/901f9ecd-0af6-4b78-8353-8678f0510286';

async function testGHLWebhook(testEmail = 'test@example.com') {
  console.log('🚀 Testing BRISC Go High Level Webhook Integration');
  console.log('================================================\n');
  
  console.log(`📧 Test email: ${testEmail}`);
  console.log(`🔗 Webhook URL: ${GHL_WEBHOOK_URL}\n`);
  
  // Prepare the webhook payload
  const webhookPayload = {
    email: testEmail,
    accessCode: 'light2025',
    timestamp: new Date().toISOString(),
    source: 'brisc_website',
    campaign: 'access_code_delivery',
    clientName: 'Test Client',
    websiteUrl: 'https://brisclothing.com'
  };
  
  console.log('📦 Webhook payload:');
  console.log(JSON.stringify(webhookPayload, null, 2));
  console.log('');
  
  return new Promise((resolve) => {
    const url = new URL(GHL_WEBHOOK_URL);
    const postData = JSON.stringify(webhookPayload);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'BRISC-Webhook-Test/1.0'
      }
    };

    console.log('🔄 Sending webhook request...');
    
    const req = https.request(options, (res) => {
      let data = '';
      
      console.log(`📊 Response Status: ${res.statusCode}`);
      console.log(`📋 Response Headers:`, res.headers);
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('\n📥 Response Body:');
        try {
          const response = JSON.parse(data);
          console.log(JSON.stringify(response, null, 2));
        } catch (error) {
          console.log(data);
        }
        
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('\n✅ Webhook triggered successfully!');
          console.log('🎯 Your GHL automation should now send the email');
          console.log(`📬 Check the inbox for: ${testEmail}`);
          resolve(true);
        } else {
          console.log('\n❌ Webhook request failed');
          console.log('🔧 Check your GHL automation configuration');
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error('\n❌ Request failed:', error.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// Test with multiple scenarios
async function runTests() {
  console.log('🧪 Running GHL Webhook Tests\n');
  
  const testCases = [
    { email: 'godspeedbulldogs@gmail.com', description: 'Your verified email' },
    { email: 'client@example.com', description: 'Test client email' },
    { email: 'another.client@gmail.com', description: 'Another client email' }
  ];
  
  let successCount = 0;
  
  for (const testCase of testCases) {
    console.log(`\n🎯 Test Case: ${testCase.description}`);
    console.log('─'.repeat(50));
    
    const success = await testGHLWebhook(testCase.email);
    if (success) successCount++;
    
    // Wait between tests
    if (testCase !== testCases[testCases.length - 1]) {
      console.log('\n⏳ Waiting 3 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('========================');
  console.log(`✅ Successful: ${successCount}/${testCases.length}`);
  console.log(`❌ Failed: ${testCases.length - successCount}/${testCases.length}`);
  
  if (successCount > 0) {
    console.log('\n🎉 GHL webhook is working!');
    console.log('📧 Emails should be delivered to client addresses');
    console.log('🚀 Ready to deploy with GHL integration');
  } else {
    console.log('\n🔧 Webhook needs configuration');
    console.log('💡 Check your GHL automation setup');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Verify emails were received');
  console.log('2. Add webhook URL to Vercel environment variables');
  console.log('3. Deploy the updated API');
  console.log('4. Test the full integration');
}

// Run the tests
runTests().catch(console.error);
