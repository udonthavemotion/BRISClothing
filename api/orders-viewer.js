// BRISCO ORDER VIEWER API - View backed up orders
// Simple API to view local order backups for Khalil

export default async function handler(req, res) {
  // CORS headers for admin access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const { default: backupSystem } = await import('./order-backup.js');
    const { action, date, search, orderNumber } = req.query;

    switch (action) {
      case 'all':
        const allOrders = await backupSystem.getAllOrders();
        return res.status(200).json({
          success: true,
          orders: allOrders.map(order => backupSystem.formatOrderForKhalil(order)),
          total: allOrders.length
        });

      case 'today':
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = await backupSystem.getOrdersByDate(today);
        return res.status(200).json({
          success: true,
          orders: todayOrders.map(order => backupSystem.formatOrderForKhalil(order)),
          date: today,
          total: todayOrders.length
        });

      case 'date':
        if (!date) {
          return res.status(400).json({ success: false, error: 'Date parameter required' });
        }
        const dateOrders = await backupSystem.getOrdersByDate(date);
        return res.status(200).json({
          success: true,
          orders: dateOrders.map(order => backupSystem.formatOrderForKhalil(order)),
          date: date,
          total: dateOrders.length
        });

      case 'search':
        if (!search) {
          return res.status(400).json({ success: false, error: 'Search parameter required' });
        }
        const searchResults = await backupSystem.searchOrders(search);
        return res.status(200).json({
          success: true,
          orders: searchResults.map(order => backupSystem.formatOrderForKhalil(order)),
          searchTerm: search,
          total: searchResults.length
        });

      case 'stats':
        const stats = await getOrderStats(backupSystem);
        return res.status(200).json({
          success: true,
          stats: stats
        });

      default:
        // Default: return recent orders (last 7 days)
        const recentOrders = await getRecentOrders(backupSystem, 7);
        return res.status(200).json({
          success: true,
          orders: recentOrders.map(order => backupSystem.formatOrderForKhalil(order)),
          period: 'Last 7 days',
          total: recentOrders.length
        });
    }

  } catch (error) {
    console.error('[ORDERS VIEWER] Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve orders',
      details: error.message
    });
  }
}

// Helper function to get recent orders
async function getRecentOrders(backupSystem, days = 7) {
  const allOrders = await backupSystem.getAllOrders();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return allOrders.filter(order => {
    const orderDate = new Date(order.timestamp);
    return orderDate >= cutoffDate;
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

// Helper function to get order statistics
async function getOrderStats(backupSystem) {
  const allOrders = await backupSystem.getAllOrders();
  
  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  
  // Orders by status
  const statusCounts = allOrders.reduce((counts, order) => {
    const status = order.fulfillmentStatus || 'pending';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});

  // Orders by date (last 30 days)
  const last30Days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayOrders = allOrders.filter(order => 
      order.timestamp && order.timestamp.startsWith(dateStr)
    );
    
    last30Days.push({
      date: dateStr,
      orders: dayOrders.length,
      revenue: dayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    });
  }

  // Most popular items
  const itemCounts = {};
  allOrders.forEach(order => {
    if (order.items) {
      order.items.forEach(item => {
        const key = `${item.name} (${item.size || 'N/A'})`;
        itemCounts[key] = (itemCounts[key] || 0) + item.quantity;
      });
    }
  });

  const popularItems = Object.entries(itemCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([item, count]) => ({ item, count }));

  return {
    totalOrders,
    totalRevenue: totalRevenue.toFixed(2),
    averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00',
    statusBreakdown: statusCounts,
    last30Days,
    popularItems,
    lastUpdated: new Date().toISOString()
  };
}
