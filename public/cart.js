// BRISC Streetwear - Simple Demo Cart System
class BriscoCart {
  constructor() {
    this.items = [];
    this.init();
  }

  init() {
    console.log('Initializing simple cart system');
    this.bindEvents();
    this.updateCartUI();
  }

  addItem(product) {
    console.log('Adding item to cart:', product);
    
    // Create unique identifier including size
    const itemKey = `${product.id}-${product.size || 'no-size'}`;
    const existingItem = this.items.find(item => item.itemKey === itemKey);
    
    if (existingItem) {
      existingItem.quantity += 1;
      console.log('Updated existing item:', existingItem);
    } else {
      const newItem = {
        id: product.id,
        itemKey: itemKey,
        name: product.name,
        price: product.price,
        frontImg: product.frontImg,
        size: product.size || null,
        quantity: 1
      };
      this.items.push(newItem);
      console.log('Added new item:', newItem);
    }

    this.updateCartUI();
    this.showToast("Thank you, sincerely, Family.");
  }

  removeItem(itemKey) {
    const itemIndex = this.items.findIndex(item => item.itemKey === itemKey);
    
    if (itemIndex > -1) {
      const removedItem = this.items[itemIndex];
      this.items.splice(itemIndex, 1);
      this.updateCartUI();
      this.showToast(`${removedItem.name}${removedItem.size ? ` (${removedItem.size})` : ''} removed from cart`);
    }
  }

  updateQuantity(itemKey, newQuantity) {
    const item = this.items.find(item => item.itemKey === itemKey);
    
    if (item) {
      if (newQuantity <= 0) {
        this.removeItem(itemKey);
      } else {
        item.quantity = newQuantity;
        this.updateCartUI();
      }
    }
  }

  getTotal() {
    return this.calculateTotalWithDeals();
  }

  // Automatic pricing algorithm - applies deals without visual indication
  calculateTotalWithDeals() {
    const totalQuantity = this.getItemCount();
    const effectivePrice = this.getEffectivePrice();
    
    // Simple calculation: total quantity × effective price per item
    return totalQuantity * effectivePrice;
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  // Calculate effective price per item based on quantity tiers
  getEffectivePrice() {
    const totalQuantity = this.getItemCount();
    
    if (totalQuantity >= 4) {
      return 50; // $50 per shirt for 4+ shirts
    } else if (totalQuantity >= 2) {
      return 55; // $55 per shirt for 2-3 shirts
    } else {
      return 65; // $65 per shirt for 1 shirt
    }
  }

  updateCartUI() {
    this.updateCartIcon();
    this.updateCartDrawer();
  }

  updateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    
    if (cartIcon && cartCount) {
      const itemCount = this.getItemCount();
      cartCount.textContent = itemCount;
      
      if (itemCount > 0) {
        cartCount.classList.add('show');
        cartIcon.classList.add('has-items');
      } else {
        cartCount.classList.remove('show');
        cartIcon.classList.remove('has-items');
      }
    }
  }

  updatePricingInfo() {
    const totalQuantity = this.getItemCount();
    const effectivePrice = this.getEffectivePrice();
    
    // Find or create pricing info element
    let pricingInfo = document.getElementById('pricing-info');
    if (!pricingInfo) {
      pricingInfo = document.createElement('div');
      pricingInfo.id = 'pricing-info';
      pricingInfo.className = 'pricing-info';
      
      // Insert before cart total
      const cartFooter = document.querySelector('.cart-footer');
      const cartTotal = document.querySelector('.cart-total');
      if (cartFooter && cartTotal) {
        cartFooter.insertBefore(pricingInfo, cartTotal);
      }
    }
    
    if (totalQuantity === 0) {
      pricingInfo.style.display = 'none';
      return;
    }
    
    pricingInfo.style.display = 'block';
    
    let pricingText = '';
    if (totalQuantity >= 4) {
      pricingText = `🔥 4+ shirts: $50 each`;
    } else if (totalQuantity >= 2) {
      pricingText = `💫 2+ shirts: $55 each`;
    } else {
      pricingText = `Single shirt: $65`;
    }
    
    pricingInfo.innerHTML = `
      <div class="pricing-tier">${pricingText}</div>
      <div class="pricing-savings">${totalQuantity} × $${effectivePrice} = $${(totalQuantity * effectivePrice).toFixed(2)}</div>
    `;
  }

  updateCartDrawer() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    console.log('Updating cart drawer. Items count:', this.items.length);
    
    if (!cartItems || !cartTotal) {
      console.error('Cart elements not found!');
      return;
    }
    
    // Update total
    cartTotal.textContent = this.getTotal().toFixed(2);
    
    // Add pricing tier info
    this.updatePricingInfo();
    
    // Clear current items
    cartItems.innerHTML = '';
    
    if (this.items.length === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🔥</div>
          <p>Your cart is waiting. Take the next step — carry BRISCO with you.</p>
        </div>
      `;
      return;
    }
    
    // Populate cart items
    const effectivePrice = this.getEffectivePrice();
    
    this.items.forEach(item => {
      console.log('Creating cart item for:', item.name);
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.frontImg}" alt="${item.name}" class="cart-item-image" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}${item.size ? ` (${item.size})` : ''}</div>
          <div class="cart-item-price">$${effectivePrice}</div>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn" onclick="window.briscoCart.updateQuantity('${item.itemKey}', ${item.quantity - 1})">-</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="window.briscoCart.updateQuantity('${item.itemKey}', ${item.quantity + 1})">+</button>
        </div>
      `;
      cartItems.appendChild(cartItem);
    });
  }

  bindEvents() {
    // Cart icon click handler
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        console.log('Cart icon clicked');
        this.toggleCartDrawer();
      });
    }
    
    // Sticky cart scroll behavior for mobile
    this.initStickyCartBehavior();

    // Cart close button
    const cartClose = document.querySelector('.cart-close');
    if (cartClose) {
      cartClose.addEventListener('click', () => {
        this.closeCartDrawer();
      });
    }

    // Cart overlay click
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartOverlay) {
      cartOverlay.addEventListener('click', () => {
        this.closeCartDrawer();
      });
    }

    // Note: Add to cart is handled via direct onclick calls

    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCartDrawer();
      }
    });
  }

  toggleCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    
    if (drawer && overlay) {
      const isOpen = drawer.classList.contains('open');
      
      if (isOpen) {
        this.closeCartDrawer();
      } else {
        this.openCartDrawer();
      }
    }
  }

  openCartDrawer() {
    console.log('Opening cart drawer');
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
      
      // Update drawer content
      this.updateCartDrawer();
    }
  }

  closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  showToast(message) {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // Test function for debugging
  testAddItem() {
    const testProduct = {
      id: 999,
      name: 'Test Product',
      price: 65,
      frontImg: '/images/fatlil.2_1755650727_3702989146314406154_305151088.jpg'
    };
    console.log('Testing cart with product:', testProduct);
    this.addItem(testProduct);
    this.openCartDrawer();
  }

  // Sticky cart behavior for mobile scrolling
  initStickyCartBehavior() {
    const cartIcon = document.querySelector('.cart-icon.torch-cart');
    if (!cartIcon) return;
    
    let ticking = false;
    let lastScrollY = 0;
    
    const updateCartAppearance = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.8; // Approximate hero section height
      
      // Only apply sticky behavior on mobile/tablet
      const isMobile = window.innerWidth <= 768;
      
      if (isMobile && scrollY > heroHeight) {
        cartIcon.classList.add('scrolled');
      } else {
        cartIcon.classList.remove('scrolled');
      }
      
      lastScrollY = scrollY;
      ticking = false;
    };
    
    const requestTick = () => {
      if (!ticking) {
        requestAnimationFrame(updateCartAppearance);
        ticking = true;
      }
    };
    
    // Throttled scroll listener
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Handle resize to recalculate on orientation change
    window.addEventListener('resize', () => {
      setTimeout(updateCartAppearance, 100);
    }, { passive: true });
    
    // Initial check
    updateCartAppearance();
  }

  // Test pricing algorithm
  testPricingAlgorithm() {
    console.log('=== Testing Pricing Algorithm ===');
    
    // Test scenarios - simplified pricing
    const scenarios = [
      { qty: 1, expected: 65 },  // 1 × $65
      { qty: 2, expected: 110 }, // 2 × $55
      { qty: 3, expected: 165 }, // 3 × $55
      { qty: 4, expected: 200 }, // 4 × $50
      { qty: 5, expected: 250 }, // 5 × $50
      { qty: 6, expected: 300 }, // 6 × $50
      { qty: 7, expected: 350 }, // 7 × $50
      { qty: 8, expected: 400 }  // 8 × $50
    ];
    
    scenarios.forEach(scenario => {
      // Simulate cart with specific quantity
      this.items = [{
        id: 1,
        name: 'Test Shirt',
        price: 65,
        quantity: scenario.qty
      }];
      
      const calculatedTotal = this.calculateTotalWithDeals();
      const passed = calculatedTotal === scenario.expected;
      
      console.log(`Qty: ${scenario.qty} | Expected: $${scenario.expected} | Got: $${calculatedTotal} | ${passed ? '✅ PASS' : '❌ FAIL'}`);
    });
    
    // Reset cart
    this.items = [];
    console.log('=== Test Complete ===');
  }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing simple cart...');
  window.briscoCart = new BriscoCart();
  console.log('Cart ready!');
});