// Brisco Streetwear - Cart Management System
class BriscoCart {
  constructor() {
    this.items = this.loadCart();
    this.init();
  }

  init() {
    this.updateCartUI();
    this.bindEvents();
    
    // Listen for add to cart events from product cards
    document.addEventListener('addToCart', (e) => {
      this.addItem(e.detail);
    });
  }

  loadCart() {
    try {
      const saved = localStorage.getItem('brisco-cart');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('brisco-cart', JSON.stringify(this.items));
    } catch (error) {
      console.error('Error saving cart:', error);
      this.showToast('Error saving cart', 'error');
    }
  }

  addItem(product) {
    console.log('Adding item to cart:', product);
    const existingItem = this.items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
      console.log('Updated existing item quantity:', existingItem);
    } else {
      const newItem = {
        ...product,
        quantity: 1,
        addedAt: Date.now()
      };
      this.items.push(newItem);
      console.log('Added new item:', newItem);
    }

    this.saveCart();
    this.updateCartUI();
    console.log('Cart items after update:', this.items);
    this.showToast(`${product.name} added to cart!`);
    
    // Torch ignite animation
    this.triggerIgniteAnimation(product);
    
    // Analytics event (placeholder for future implementation)
    this.trackEvent('add_to_cart', {
      item_id: product.id,
      item_name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  triggerIgniteAnimation(product) {
    // Find the product card and trigger ignite animation
    const productCard = document.querySelector(`[data-product-id="${product.id}"]`);
    if (productCard) {
      productCard.classList.add('ignite');
      setTimeout(() => {
        productCard.classList.remove('ignite');
      }, 600);
    }
  }

  removeItem(productId) {
    const itemIndex = this.items.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
      const removedItem = this.items[itemIndex];
      this.items.splice(itemIndex, 1);
      this.saveCart();
      this.updateCartUI();
      this.showToast(`${removedItem.name} removed from cart`);
      
      this.trackEvent('remove_from_cart', {
        item_id: removedItem.id,
        item_name: removedItem.name
      });
    }
  }

  updateQuantity(productId, newQuantity) {
    const item = this.items.find(item => item.id === productId);
    
    if (item) {
      if (newQuantity <= 0) {
        this.removeItem(productId);
      } else {
        item.quantity = newQuantity;
        this.saveCart();
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
    const basePrice = 65; // Base price per shirt
    
    // Apply quantity-based pricing tiers automatically
    if (totalQuantity >= 4) {
      // 4+ shirts: $200 for every 4, plus remaining at $65 each
      const groupsOfFour = Math.floor(totalQuantity / 4);
      const remainder = totalQuantity % 4;
      return (groupsOfFour * 200) + (remainder * basePrice);
    } else if (totalQuantity >= 2) {
      // 2-3 shirts: $110 for every 2, plus remaining at $65 each
      const groupsOfTwo = Math.floor(totalQuantity / 2);
      const remainder = totalQuantity % 2;
      return (groupsOfTwo * 110) + (remainder * basePrice);
    } else {
      // 1 shirt: regular price $65
      return totalQuantity * basePrice;
    }
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  updateCartUI() {
    this.updateCartIcon();
    this.updateCartModal();
  }

  updateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartCount = document.querySelector('.cart-count');
    
    if (cartIcon && cartCount) {
      const itemCount = this.getItemCount();
      cartCount.textContent = itemCount;
      
      // Show/hide count badge
      if (itemCount > 0) {
        cartCount.classList.add('show');
        cartIcon.classList.add('has-items');
      } else {
        cartCount.classList.remove('show');
        cartIcon.classList.remove('has-items');
      }
    }
  }

  updateCartModal() {
    this.updateCartDrawer();
  }

  updateCartDrawer() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    console.log('Updating cart drawer. Items:', this.items);
    console.log('Cart items element:', cartItems);
    console.log('Cart total element:', cartTotal);
    
    if (!cartItems || !cartTotal) {
      console.error('Cart elements not found!');
      return;
    }
    
    // Update total
    cartTotal.textContent = this.getTotal().toFixed(2);
    
    // Clear current items
    cartItems.innerHTML = '';
    
    if (this.items.length === 0) {
      cartItems.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🔥</div>
          <p>Your cart is empty</p>
          <p style="font-size: 0.8rem; margin-top: 0.5rem;">Add some fire to your collection</p>
        </div>
      `;
      console.log('Cart is empty, showing empty state');
      return;
    }
    
    // Populate cart items
    console.log('Populating cart items. Count:', this.items.length);
    this.items.forEach(item => {
      console.log('Creating cart item for:', item);
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <img src="${item.frontImg}" alt="" class="cart-item-image" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price}</div>
        </div>
        <div class="cart-item-controls">
          <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
        </div>
      `;
      cartItems.appendChild(cartItem);
      console.log('Cart item appended to container');
    });
    
    // Bind quantity controls
    cartItems.querySelectorAll('.quantity-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        const productId = parseInt(e.target.getAttribute('data-id'));
        const currentItem = this.items.find(item => item.id === productId);
        
        if (!currentItem) return;
        
        if (action === 'increase') {
          this.updateQuantity(productId, currentItem.quantity + 1);
        } else if (action === 'decrease') {
          this.updateQuantity(productId, currentItem.quantity - 1);
        }
      });
    });
  }

  bindEvents() {
    // Cart icon click handler
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
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

    // Cart checkout button
    const checkoutBtn = document.getElementById('cart-checkout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.openCheckout();
      });
    }

    // Keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeCartDrawer();
      }
    });
  }

  openCheckout() {
    if (this.items.length === 0) {
      this.showToast('Your cart is empty', 'info');
      return;
    }

    // GHL Stripe Integration: Connect to GoHighLevel sub-account for payments
    // Add products via GHL funnels, use GHL API for checkout session creation instead of native Stripe
    // This would redirect to GHL checkout or open embedded checkout
    
    // For now, show cart summary
    this.showCartSummary();
  }

  showCartSummary() {
    const summary = this.items.map(item => 
      `${item.name} (${item.quantity}x) - $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const total = this.getTotal().toFixed(2);
    const message = `Cart Summary:\n\n${summary}\n\nTotal: $${total}\n\nCheckout integration coming soon!`;
    
    alert(message);
    
    // Track checkout initiation
    this.trackEvent('begin_checkout', {
      value: this.getTotal(),
      currency: 'USD',
      items: this.items
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

  clearCart() {
    this.items = [];
    this.saveCart();
    this.updateCartUI();
    this.showToast('Cart cleared');
    
    this.trackEvent('clear_cart');
  }

  showToast(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  trackEvent(eventName, params = {}) {
    // Analytics tracking placeholder
    // This would integrate with Google Analytics, Facebook Pixel, etc.
    console.log('Analytics Event:', eventName, params);
    
    // Example: Google Analytics 4
    // gtag('event', eventName, params);
    
    // Example: Facebook Pixel
    // fbq('track', eventName, params);
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

  // Utility methods for future enhancements
  exportCart() {
    return {
      items: this.items,
      total: this.getTotal(),
      itemCount: this.getItemCount(),
      exportedAt: new Date().toISOString()
    };
  }

  importCart(cartData) {
    if (cartData && Array.isArray(cartData.items)) {
      this.items = cartData.items;
      this.saveCart();
      this.updateCartUI();
      this.showToast('Cart imported successfully');
    }
  }

  // Wishlist functionality (future enhancement)
  addToWishlist(product) {
    // Implementation for wishlist feature
    console.log('Add to wishlist:', product);
  }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.briscoCart = new BriscoCart();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BriscoCart;
}
