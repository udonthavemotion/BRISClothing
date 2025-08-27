#!/usr/bin/env node

// BRISCO Backup System Setup Script
// Run this once to initialize the order backup system

import { mkdir, writeFile, access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';

async function setupBackupSystem() {
  console.log('🔥 Setting up BRISCO Order Backup System...\n');

  const backupDir = path.join(process.cwd(), 'order-backups');
  const dailyDir = path.join(backupDir, 'daily');
  const ordersFile = path.join(backupDir, 'orders.json');
  const readmeFile = path.join(backupDir, 'README.md');

  try {
    // Create backup directories
    console.log('📁 Creating backup directories...');
    await mkdir(backupDir, { recursive: true });
    await mkdir(dailyDir, { recursive: true });
    console.log('✅ Directories created successfully');

    // Create orders.json if it doesn't exist
    console.log('📄 Initializing orders file...');
    try {
      await access(ordersFile, constants.F_OK);
      console.log('✅ Orders file already exists');
    } catch {
      await writeFile(ordersFile, JSON.stringify([], null, 2));
      console.log('✅ Orders file created');
    }

    // Create README
    console.log('📝 Creating README...');
    const readmeContent = `# BRISCO Order Backups

This directory contains local backups of all BRISCO orders.

## Files:
- \`orders.json\` - Master file with all orders
- \`daily/\` - Daily backup files (orders-YYYY-MM-DD.json)

## Access:
- Admin Dashboard: https://www.brisclothing.com/admin/orders
- API: /api/orders-viewer
- Documentation: docs/ORDER-BACKUP-SYSTEM.md

## Last Updated: ${new Date().toISOString()}
`;

    await writeFile(readmeFile, readmeContent);
    console.log('✅ README created');

    // Test the backup system
    console.log('\n🧪 Testing backup system...');
    
    // Import and test the backup system
    const { default: backupSystem } = await import('../api/order-backup.js');
    
    // Test order data
    const testOrder = {
      sessionId: 'test_session_' + Date.now(),
      customerEmail: 'test@brisclothing.com',
      items: [{ name: 'Test Item', size: 'M', quantity: 1 }],
      totalAmount: 65.00,
      timestamp: new Date().toISOString(),
      source: 'setup_test'
    };

    await backupSystem.saveOrder(testOrder);
    console.log('✅ Backup system test successful');

    // Verify we can read orders
    const orders = await backupSystem.getAllOrders();
    console.log(`✅ Can read orders (${orders.length} total)`);

    console.log('\n🎉 Backup system setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Deploy your updated code to Vercel');
    console.log('2. Test an order to verify backups work');
    console.log('3. Visit /admin/orders to view the dashboard');
    console.log('4. Check order-backups/ directory for files');

    console.log('\n🔗 Useful links:');
    console.log('- Admin Dashboard: /admin/orders');
    console.log('- API Endpoint: /api/orders-viewer');
    console.log('- Documentation: docs/ORDER-BACKUP-SYSTEM.md');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run setup
setupBackupSystem();
