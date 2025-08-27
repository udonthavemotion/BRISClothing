// BRISCO ORDER BACKUP SYSTEM - Local File Storage
// Stores all order data locally as backup in case Stripe goes down

import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

class OrderBackupSystem {
  constructor() {
    this.backupDir = path.join(process.cwd(), 'order-backups');
    this.ordersFile = path.join(this.backupDir, 'orders.json');
    this.dailyDir = path.join(this.backupDir, 'daily');
    this.init();
  }

  async init() {
    try {
      // Create backup directories if they don't exist
      if (!existsSync(this.backupDir)) {
        await mkdir(this.backupDir, { recursive: true });
      }
      if (!existsSync(this.dailyDir)) {
        await mkdir(this.dailyDir, { recursive: true });
      }
      
      // Create orders.json if it doesn't exist
      if (!existsSync(this.ordersFile)) {
        await writeFile(this.ordersFile, JSON.stringify([], null, 2));
      }
    } catch (error) {
      console.error('[BACKUP] Failed to initialize backup system:', error);
    }
  }

  async saveOrder(orderData) {
    try {
      const timestamp = new Date().toISOString();
      const orderWithBackupInfo = {
        ...orderData,
        backupTimestamp: timestamp,
        backupVersion: '1.0'
      };

      // Save to main orders file
      await this.appendToMainFile(orderWithBackupInfo);
      
      // Save daily backup
      await this.saveDailyBackup(orderWithBackupInfo);
      
      console.log(`[BACKUP] Order ${orderData.sessionId} backed up successfully`);
      return true;
    } catch (error) {
      console.error('[BACKUP] Failed to save order:', error);
      return false;
    }
  }

  async appendToMainFile(orderData) {
    try {
      // Read existing orders
      const existingData = await readFile(this.ordersFile, 'utf8');
      const orders = JSON.parse(existingData);
      
      // Add new order
      orders.push(orderData);
      
      // Write back to file
      await writeFile(this.ordersFile, JSON.stringify(orders, null, 2));
    } catch (error) {
      console.error('[BACKUP] Failed to append to main file:', error);
      throw error;
    }
  }

  async saveDailyBackup(orderData) {
    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const dailyFile = path.join(this.dailyDir, `orders-${today}.json`);
      
      let dailyOrders = [];
      
      // Read existing daily file if it exists
      if (existsSync(dailyFile)) {
        const existingData = await readFile(dailyFile, 'utf8');
        dailyOrders = JSON.parse(existingData);
      }
      
      // Add new order
      dailyOrders.push(orderData);
      
      // Write daily backup
      await writeFile(dailyFile, JSON.stringify(dailyOrders, null, 2));
    } catch (error) {
      console.error('[BACKUP] Failed to save daily backup:', error);
      throw error;
    }
  }

  async getAllOrders() {
    try {
      const data = await readFile(this.ordersFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('[BACKUP] Failed to read orders:', error);
      return [];
    }
  }

  async getOrdersByDate(date) {
    try {
      const dailyFile = path.join(this.dailyDir, `orders-${date}.json`);
      if (!existsSync(dailyFile)) {
        return [];
      }
      
      const data = await readFile(dailyFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('[BACKUP] Failed to read daily orders:', error);
      return [];
    }
  }

  async searchOrders(searchTerm) {
    try {
      const allOrders = await this.getAllOrders();
      const searchLower = searchTerm.toLowerCase();
      
      return allOrders.filter(order => 
        order.customerEmail?.toLowerCase().includes(searchLower) ||
        order.sessionId?.toLowerCase().includes(searchLower) ||
        order.customerName?.toLowerCase().includes(searchLower) ||
        JSON.stringify(order.items).toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('[BACKUP] Failed to search orders:', error);
      return [];
    }
  }

  formatOrderForKhalil(order) {
    const items = order.items || [];
    const itemsList = items.map(item => 
      `${item.name} (Size: ${item.size || 'N/A'}) x${item.quantity}`
    ).join(', ');

    return {
      orderNumber: order.sessionId,
      date: new Date(order.timestamp).toLocaleDateString(),
      customer: {
        name: order.customerName || 'N/A',
        email: order.customerEmail,
        phone: order.customerPhone || 'N/A'
      },
      items: itemsList,
      pricing: {
        subtotal: `$${order.subtotal || 0}`,
        shipping: `$${order.shippingCost || 0}`,
        total: `$${order.totalAmount || 0}`,
        savings: order.totalSavings ? `$${order.totalSavings}` : '$0'
      },
      shipping: {
        method: order.shippingMethod || 'Standard',
        address: order.shippingAddress || 'Address will be in Stripe'
      },
      status: order.fulfillmentStatus || 'Pending',
      notes: order.notes || ''
    };
  }
}

// Export singleton instance
const backupSystem = new OrderBackupSystem();
export default backupSystem;

// Helper function to create complete order backup data
export function createOrderBackupData(stripeSession, requestData, additionalInfo = {}) {
  return {
    // Stripe Information
    sessionId: stripeSession.id,
    stripePaymentIntentId: stripeSession.payment_intent,
    stripeCustomerId: stripeSession.customer,
    
    // Customer Information
    customerEmail: stripeSession.customer_email,
    customerName: additionalInfo.customerName || 'N/A',
    customerPhone: additionalInfo.customerPhone || 'N/A',
    
    // Order Details
    items: requestData.items || [],
    totalQuantity: requestData.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    
    // Pricing Information
    subtotal: (stripeSession.amount_subtotal || 0) / 100,
    shippingCost: ((stripeSession.amount_total || 0) - (stripeSession.amount_subtotal || 0)) / 100,
    totalAmount: (stripeSession.amount_total || 0) / 100,
    currency: stripeSession.currency || 'usd',
    
    // Business Logic
    originalPrice: stripeSession.metadata?.originalPrice || '0',
    effectivePrice: stripeSession.metadata?.effectivePrice || '0',
    totalSavings: stripeSession.metadata?.totalSavings || '0',
    
    // Shipping Information
    shippingMethod: requestData.shippingOption || 'standard',
    shippingAddress: additionalInfo.shippingAddress || 'Will be collected by Stripe',
    
    // Order Management
    orderStatus: 'paid',
    fulfillmentStatus: 'pending',
    timestamp: new Date().toISOString(),
    source: 'brisco_website',
    
    // Technical Details
    stripeMode: stripeSession.mode,
    paymentMethodTypes: stripeSession.payment_method_types,
    
    // Metadata from Stripe
    stripeMetadata: stripeSession.metadata || {},
    
    // Additional tracking
    userAgent: additionalInfo.userAgent || 'N/A',
    ipAddress: additionalInfo.ipAddress || 'N/A',
    
    // Notes field for Khalil
    notes: '',
    internalOrderId: `BRISCO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  };
}
