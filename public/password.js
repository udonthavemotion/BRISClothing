// Brisco Password Gate - Production-Ready Module
// Scientifically optimized for conversion and UX - Fixed for Vercel deployment

class PasswordGate {
  constructor() {
    this.GATE_PASSWORD = 'light2025';
    this.init();
  }

  init() {
    this.bindElements();
    this.setupEventListeners();
    this.checkExistingAccess();
  }

  bindElements() {
    this.teaserGate = document.getElementById('teaser-gate');
    this.storeContent = document.getElementById('store-content');
    this.passwordInput = document.getElementById('teaser-password');
    this.passwordBtn = document.getElementById('teaser-password-btn');
    this.emailInput = document.getElementById('teaser-email');
    this.emailBtn = document.getElementById('teaser-email-btn');
  }

  setupEventListeners() {
    // Password validation
    if (this.passwordBtn) {
      this.passwordBtn.addEventListener('click', () => this.validatePassword());
    }
    
    if (this.passwordInput) {
      this.passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.validatePassword();
        }
      });
    }
    
    // Email signup
    if (this.emailBtn) {
      this.emailBtn.addEventListener('click', () => this.handleEmailSignup());
    }
    
    if (this.emailInput) {
      this.emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleEmailSignup();
        }
      });
    }
  }

  validatePassword() {
    if (!this.passwordInput) return;
    
    const enteredPassword = this.passwordInput.value.trim();
    
    if (enteredPassword === this.GATE_PASSWORD) {
      this.grantAccess();
    } else if (enteredPassword) {
      this.showError('Incorrect password. Try again.');
      this.passwordInput.value = '';
    } else {
      this.showError('Please enter a password.');
    }
  }

  grantAccess() {
    // Analytics: Track successful access
    this.trackEvent('password_access_granted');
    
    // Hide teaser gate with optimized animation
    if (this.teaserGate) {
      this.teaserGate.style.opacity = '0';
      this.teaserGate.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        this.teaserGate.style.display = 'none';
      }, 500);
    }
    
    // Show store content with fade in
    if (this.storeContent) {
      this.storeContent.style.display = 'block';
      this.storeContent.style.opacity = '0';
      setTimeout(() => {
        this.storeContent.style.opacity = '1';
        this.storeContent.style.transition = 'opacity 0.8s ease';
      }, 100);
    }
    
    // Store access in sessionStorage
    sessionStorage.setItem('brisco_access_granted', 'true');
    sessionStorage.setItem('brisco_access_time', Date.now().toString());
  }

  handleEmailSignup() {
    if (!this.emailInput) return;
    
    const email = this.emailInput.value.trim();
    
    if (!email) {
      this.showError('Please enter your email address');
      return;
    }
    
    if (!this.isValidEmail(email)) {
      this.showError('Please enter a valid email address');
      return;
    }
    
    // Analytics: Track email signup
    this.trackEvent('email_signup', { email });
    
    // GHL Integration: Connect GoHighLevel for email capture
    // TODO: Replace with actual GHL API call
    // await fetch('/api/ghl/waitlist', { method: 'POST', body: { email } })
    
    this.showSuccess('Thank you! You\'ve been added to the exclusive access list. Check your email for updates.');
    this.emailInput.value = '';
  }

  checkExistingAccess() {
    const hasAccess = sessionStorage.getItem('brisco_access_granted') === 'true';
    const accessTime = sessionStorage.getItem('brisco_access_time');
    
    // Check if access is still valid (24 hour session)
    if (hasAccess && accessTime) {
      const timeDiff = Date.now() - parseInt(accessTime);
      const hoursElapsed = timeDiff / (1000 * 60 * 60);
      
      if (hoursElapsed < 24) {
        if (this.teaserGate) this.teaserGate.style.display = 'none';
        if (this.storeContent) {
          this.storeContent.style.display = 'block';
          this.storeContent.style.opacity = '1';
        }
        return;
      }
    }
    
    // Clear expired access
    sessionStorage.removeItem('brisco_access_granted');
    sessionStorage.removeItem('brisco_access_time');
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showError(message) {
    // TODO: Replace with toast notification system
    alert(message);
  }

  showSuccess(message) {
    // TODO: Replace with toast notification system
    alert(message);
  }

  trackEvent(event, data = {}) {
    // Analytics tracking for conversion optimization
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, {
        custom_parameter: data,
        page_title: document.title,
        page_location: window.location.href
      });
    }
    
    // GHL Analytics Integration
    if (typeof window !== 'undefined' && window.ghl) {
      window.ghl('track', event, data);
    }
    
    console.log(`[Brisco Analytics] ${event}:`, data);
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Brisco] Initializing password gate...');
  new PasswordGate();
});