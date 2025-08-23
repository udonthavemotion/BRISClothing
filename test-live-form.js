// Test the live form submission to see detailed response
import fetch from 'node-fetch';

async function testLiveForm() {
  console.log('🔍 Testing live form submission with detailed logging...\n');
  
  const testEmail = `live-test-${Date.now()}@example.com`;
  
  try {
    console.log(`📧 Submitting form with email: ${testEmail}`);
    
    const response = await fetch('https://www.brisclothing.com/api/send-access-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({ email: testEmail })
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📊 Raw Response Body:', responseText);
    
    if (responseText) {
      try {
        const responseJson = JSON.parse(responseText);
        console.log('\n📊 Parsed Response:');
        console.log(JSON.stringify(responseJson, null, 2));
        
        // Analyze the response in detail
        if (responseJson.success) {
          console.log('\n✅ API Call Successful!');
          console.log(`📧 Email sent: ${responseJson.messageId ? '✅' : '❌'}`);
          console.log(`🗄️ Lead captured: ${responseJson.leadCaptured ? '✅' : '❌'}`);
          console.log(`⚙️ Supabase configured: ${responseJson.supabaseConfigured ? '✅' : '❌'}`);
          
          if (!responseJson.leadCaptured) {
            console.log('\n🚨 Lead was NOT captured - this is the issue!');
          }
        } else {
          console.log('\n❌ API Call Failed');
          console.log(`Error: ${responseJson.error}`);
          if (responseJson.details) {
            console.log(`Details: ${responseJson.details}`);
          }
          if (responseJson.resendError) {
            console.log(`Resend Error: ${responseJson.resendError}`);
          }
        }
        
      } catch (e) {
        console.log('❌ Response is not valid JSON:', e.message);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLiveForm();
