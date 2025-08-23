// BRISC Resend Configuration Diagnostic Tool
// This script helps identify why emails are going to your personal email instead of clients

import { Resend } from 'resend';

// Use your actual Resend API key
const RESEND_API_KEY = process.env.RESEND_API_KEY || 're_9FU9EPTH_JNAbw7xJ3gRb9spgmE6Lm1dt';

if (!RESEND_API_KEY) {
  console.error('❌ No Resend API key found');
  console.error('Set RESEND_API_KEY environment variable or update the script');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

async function diagnoseResendConfig() {
  console.log('🔍 BRISC Resend Configuration Diagnostic');
  console.log('=========================================\n');

  try {
    // 1. Check API key validity
    console.log('1️⃣ Testing API Key...');
    try {
      const domains = await resend.domains.list();
      console.log('✅ API key is valid');
      console.log(`📊 Found ${domains.data?.data?.length || 0} domains in account\n`);
    } catch (error) {
      console.error('❌ API key test failed:', error.message);
      return;
    }

    // 2. Check account status
    console.log('2️⃣ Checking Account Status...');
    try {
      // Try to get account info (this might not be available in all plans)
      const testEmail = {
        from: 'test@resend.dev',
        to: ['test@example.com'],
        subject: 'Test',
        text: 'Test'
      };
      
      // This will fail but give us info about account limitations
      await resend.emails.send(testEmail);
    } catch (error) {
      if (error.message.includes('You can only send testing emails to your own email address')) {
        console.log('🚨 FOUND THE ISSUE: Account is in SANDBOX/TESTING mode');
        console.log('📧 This means emails can only be sent to verified addresses in your account');
        console.log('🔧 SOLUTION: Upgrade your Resend account to production mode');
        console.log('💡 Visit: https://resend.com/settings/billing\n');
      } else if (error.message.includes('domain is not verified')) {
        console.log('🚨 FOUND THE ISSUE: Domain is not verified');
        console.log('📧 This means you can only use resend.dev sender addresses');
        console.log('🔧 SOLUTION: Verify your brisclothing.com domain');
        console.log('💡 Visit: https://resend.com/domains\n');
      } else {
        console.log('⚠️ Other limitation detected:', error.message, '\n');
      }
    }

    // 3. Check domains
    console.log('3️⃣ Checking Domain Configuration...');
    const domains = await resend.domains.list();
    
    if (domains.data?.data?.length > 0) {
      console.log('📋 Domains in your account:');
      domains.data.data.forEach(domain => {
        console.log(`  • ${domain.name}: ${domain.status}`);
        if (domain.name.includes('brisclothing')) {
          if (domain.status === 'verified') {
            console.log('    ✅ BRISC domain is verified - you can send from this domain');
          } else {
            console.log('    ⚠️ BRISC domain needs verification');
            console.log('    🔧 Complete DNS setup to verify this domain');
          }
        }
      });
    } else {
      console.log('⚠️ No custom domains found');
      console.log('💡 Add brisclothing.com domain at: https://resend.com/domains');
    }
    console.log('');

    // 4. Test email sending capability
    console.log('4️⃣ Testing Email Sending Capability...');
    try {
      const testResult = await resend.emails.send({
        from: 'BRISC Test <onboarding@resend.dev>',
        to: ['godspeedbulldogs@gmail.com'], // Your verified email
        subject: '🧪 BRISC Email System Test',
        text: 'This is a test email to verify the system is working. If you receive this, the API is functional.'
      });
      
      console.log('✅ Test email sent successfully');
      console.log(`📧 Message ID: ${testResult.data?.id}`);
      console.log('📬 Check your email to confirm delivery\n');
    } catch (error) {
      console.error('❌ Test email failed:', error.message, '\n');
    }

    // 5. Recommendations
    console.log('5️⃣ Recommendations to Fix Email Routing:');
    console.log('==========================================');
    
    const hasVerifiedDomain = domains.data?.data?.some(d => 
      d.name.includes('brisclothing') && d.status === 'verified'
    );
    
    if (!hasVerifiedDomain) {
      console.log('🎯 PRIORITY 1: Verify your brisclothing.com domain');
      console.log('   • Go to https://resend.com/domains');
      console.log('   • Add brisclothing.com');
      console.log('   • Complete DNS verification');
      console.log('   • This allows sending from access@brisclothing.com\n');
    }
    
    console.log('🎯 PRIORITY 2: Upgrade to production mode (if in sandbox)');
    console.log('   • Go to https://resend.com/settings/billing');
    console.log('   • Upgrade from free/sandbox to paid plan');
    console.log('   • This removes the restriction to send only to your email\n');
    
    console.log('🎯 PRIORITY 3: Test with a different email address');
    console.log('   • Try sending to a colleague\'s email');
    console.log('   • If it works, the issue is resolved');
    console.log('   • If not, check the error messages for more clues\n');

  } catch (error) {
    console.error('❌ Diagnostic failed:', error.message);
  }
}

// Run the diagnostic
diagnoseResendConfig().then(() => {
  console.log('🏁 Diagnostic complete!');
  console.log('📧 The most likely cause is that your Resend account is in sandbox mode');
  console.log('🔧 Upgrade to production to send emails to any address');
}).catch(console.error);
