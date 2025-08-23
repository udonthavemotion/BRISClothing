// Test script to verify client emails are working correctly
import https from 'https';

async function testClientEmail(clientEmail) {
  console.log(`🧪 Testing email delivery to client: ${clientEmail}`);
  console.log('================================================\n');
  
  const apiUrl = 'https://www.brisclothing.com/api/send-access-email';
  const postData = JSON.stringify({ email: clientEmail });
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'www.brisclothing.com',
      port: 443,
      path: '/api/send-access-email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          console.log(`📧 Email to ${clientEmail}:`);
          console.log(`   Status: ${res.statusCode}`);
          console.log(`   Response:`, response);
          
          if (res.statusCode === 200) {
            console.log('✅ Email sent successfully!');
            console.log(`📬 Client should receive email at: ${clientEmail}`);
            console.log(`🔑 Access code: light2025`);
          } else {
            console.log('❌ Email failed to send');
            if (response.error) {
              console.log(`💡 Error: ${response.error}`);
              
              if (response.error.includes('testing mode')) {
                console.log('🚨 ISSUE: Resend account is in sandbox mode');
                console.log('🔧 SOLUTION: Upgrade Resend account to production');
              } else if (response.error.includes('domain')) {
                console.log('🚨 ISSUE: Domain verification needed');
                console.log('🔧 SOLUTION: Verify brisclothing.com in Resend dashboard');
              }
            }
          }
          
          resolve(res.statusCode === 200);
        } catch (error) {
          console.error('❌ Failed to parse response:', error.message);
          console.log('Raw response:', data);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// Test with multiple email addresses
async function runTests() {
  console.log('🚀 BRISC Client Email Delivery Test');
  console.log('===================================\n');
  
  const testEmails = [
    'test.client@gmail.com',
    'another.client@yahoo.com',
    'client@outlook.com'
  ];
  
  console.log('📋 Testing email delivery to various client addresses...');
  console.log('This will help verify that emails go to clients, not your personal email\n');
  
  let successCount = 0;
  
  for (const email of testEmails) {
    const success = await testClientEmail(email);
    if (success) successCount++;
    console.log(''); // Add spacing between tests
  }
  
  console.log('📊 Test Results:');
  console.log(`   Successful: ${successCount}/${testEmails.length}`);
  console.log(`   Failed: ${testEmails.length - successCount}/${testEmails.length}`);
  
  if (successCount === testEmails.length) {
    console.log('🎉 All tests passed! Email routing is working correctly.');
    console.log('✅ Clients will receive emails at their own addresses.');
  } else if (successCount === 0) {
    console.log('❌ All tests failed. Check your Resend configuration.');
    console.log('🔧 Run: node diagnose-resend-config.js for detailed diagnosis');
  } else {
    console.log('⚠️ Some tests failed. This might indicate account limitations.');
    console.log('💡 Check the error messages above for specific issues.');
  }
  
  console.log('\n🏁 Test complete!');
}

// Run the tests
runTests().catch(console.error);
