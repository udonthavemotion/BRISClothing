#!/usr/bin/env node

// Script to update email sender after domain verification
// Run: node scripts/update-email-sender.js

import { readFileSync, writeFileSync } from 'fs';

const API_FILE = 'api/send-access-email.js';

try {
  console.log('🔄 Updating email sender to verified domain...');
  
  let content = readFileSync(API_FILE, 'utf8');
  
  // Replace temporary sender with verified domain
  content = content.replace(
    'BRISC Access <onboarding@resend.dev>',
    'BRISC Access <access@brisclothing.com>'
  );
  
  // Update comment
  content = content.replace(
    '// Temporary - will switch to access@brisclothing.com after verification',
    '// Using verified domain'
  );
  
  writeFileSync(API_FILE, content);
  
  console.log('✅ Email sender updated to access@brisclothing.com');
  console.log('🚀 Ready to deploy with verified domain!');
  
} catch (error) {
  console.error('❌ Error updating email sender:', error.message);
  process.exit(1);
}
