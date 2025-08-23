// Test script to verify live email functionality on Vercel
import https from 'https';

async function testLiveEmail() {
  console.log('🧪 Testing live email functionality...\n');
  
  const testEmail = 'godspeedbulldogs@gmail.com';
  const apiUrl = 'https://www.brisclothing.com/api/send-access-email';
  
  return new Promise((resolve) => {
    console.log(`📧 Sending test email to: ${testEmail}`);
    console.log(`🌐 Using API: ${apiUrl}`);
    
    const postData = JSON.stringify({ email: testEmail });
    
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
          
          if (res.statusCode === 200) {
            console.log('✅ Email sent successfully from live site!');
            console.log('📧 Response:', response);
            console.log('🎯 Check your inbox (and spam folder)');
            resolve(true);
          } else {
            console.error('❌ API request failed:', response);
            resolve(false);
          }
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

// Run the test
testLiveEmail().then(success => {
  if (success) {
    console.log('\n🎉 Live email test completed successfully!');
    console.log('✅ Your production deployment is working');
    console.log('📱 Ready to test on mobile');
  } else {
    console.log('\n❌ Live email test failed');
    console.log('🔧 Check your deployment and try again');
  }
  process.exit(success ? 0 : 1);
});
