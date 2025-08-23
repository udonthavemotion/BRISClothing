// Debug Supabase insertion directly
import { createClient } from '@supabase/supabase-js';

// Test direct Supabase insertion
async function testSupabaseInsertion() {
  console.log('🔍 Testing direct Supabase insertion...\n');
  
  // Use your actual credentials
  const supabaseUrl = 'https://qqsnuetbxnwqobiomaas.supabase.co';
  const supabaseKey = process.env.SUPABASE_KEY; // You'll need to set this locally
  
  if (!supabaseKey) {
    console.error('❌ SUPABASE_KEY not found in environment variables');
    console.log('💡 Set it with: export SUPABASE_KEY=your_key_here');
    return;
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const testEmail = `debug-test-${Date.now()}@example.com`;
  
  try {
    console.log(`📧 Testing insertion with email: ${testEmail}`);
    
    // First, let's check if the table exists and what columns it has
    console.log('\n🔍 Checking table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('leads')
      .select('*')
      .limit(1);
      
    if (tableError) {
      console.error('❌ Table access error:', tableError);
      return;
    }
    
    console.log('✅ Table accessible, sample structure:', tableInfo);
    
    // Now try to insert
    console.log('\n📝 Attempting to insert lead...');
    const leadData = {
      email: testEmail,
      source: 'debug_test',
      ip: '127.0.0.1'
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('leads')
      .insert([leadData])
      .select();
      
    if (insertError) {
      console.error('❌ Insert error:', insertError);
      console.error('❌ Error details:', JSON.stringify(insertError, null, 2));
      
      // Check if it's an RLS issue
      if (insertError.code === '42501') {
        console.log('\n🚨 This looks like a Row Level Security (RLS) issue!');
        console.log('💡 Try disabling RLS temporarily with: ALTER TABLE leads DISABLE ROW LEVEL SECURITY;');
      }
    } else {
      console.log('✅ Insert successful!', insertResult);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSupabaseInsertion();
