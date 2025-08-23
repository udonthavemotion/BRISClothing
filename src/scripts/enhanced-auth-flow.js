// BRISC Enhanced Authentication Flow - Email to Password System
// Maintains current aesthetic while implementing separated step flow

class BRISCAuthFlow {
  constructor() {
    this.currentStep = 'email'; // 'email' or 'password'
    this.userEmail = '';
    this.GATE_PASSWORD = 'light2025';
    this.init();
  }

  init() {
    this.bindElements();
    this.setupEventListeners();
    this.checkExistingAccess();
    this.checkDirectAccess();
  }

  bindElements() {
    this.authContainer = document.getElementById('brisc-auth-gate');
    this.emailStep = document.getElementById('email-step');
    this.passwordStep = document.getElementById('password-step');
    this.storeContent = document.getElementById('store-content');
    
    // Email step elements
    this.emailInput = document.getElementById('auth-email');
    this.emailBtn = document.getElementById('email-submit-btn');
    
    // Password step elements
    this.passwordInput = document.getElementById('auth-password');
    this.passwordBtn = document.getElementById('password-submit-btn');
    this.backBtn = document.getElementById('back-to-email-btn');
    this.emailDisplay = document.getElementById('email-display');
  }

  setupEventListeners() {
    // Email step
    if (this.emailBtn) {
      this.emailBtn.addEventListener('click', () => this.handleEmailSubmit());
    }
    
    if (this.emailInput) {
      this.emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handleEmailSubmit();
      });
    }
    
    // Password step
    if (this.passwordBtn) {
      this.passwordBtn.addEventListener('click', () => this.handlePasswordSubmit());
    }
    
    if (this.passwordInput) {
      this.passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.handlePasswordSubmit();
      });
    }
    
    // Back button
    if (this.backBtn) {
      this.backBtn.addEventListener('click', () => this.showEmailStep());
    }
  }

  async handleEmailSubmit() {
    const email = this.emailInput.value.trim();
    
    if (!email) {
      this.showToast('Please enter your email address', 'error');
      return;
    }
    
    if (!this.isValidEmail(email)) {
      this.showToast('Please enter a valid email address', 'error');
      return;
    }
    
    // Store email and show loading
    this.userEmail = email;
    this.showLoading(this.emailBtn, 'SENDING...');
    
    try {
      // Simulate email sending process
      await this.sendAccessEmail(email);
      
      // Track email submission
      this.trackEvent('email_submitted', { email });
      
      // Show success message
      this.showToast('Access code sent! Check your email.', 'success');
      
      // Transition to password step after brief delay
      setTimeout(() => {
        this.transitionToPasswordStep();
      }, 1500);
      
    } catch (error) {
      this.showToast('Failed to send email. Please try again.', 'error');
      this.hideLoading(this.emailBtn, 'GET ACCESS');
    }
  }

  async sendAccessEmail(email) {
    try {
      console.log(`[BRISC Auth] Sending real email to: ${email}`);
      
      // Automatically detect environment and use appropriate API endpoint
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocalhost 
        ? `${window.location.origin}/api/send-access-email`  // Local development (use current port)
        : '/api/send-access-email';  // Production (Vercel)
      
      console.log(`[BRISC Auth] Using API endpoint: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: Failed to send email`);
      }

      console.log(`[BRISC Auth] Email sent successfully:`, data);
      return { success: true, messageId: data.messageId };

    } catch (error) {
      console.error('[BRISC Auth] Email sending failed:', error);
      
      // Provide user-friendly error messages
      if (error.message.includes('Invalid email')) {
        throw new Error('Please enter a valid email address');
      } else if (error.message.includes('Network')) {
        throw new Error('Network error. Please check your connection and try again');
      } else {
        throw new Error('Failed to send email. Please try again in a moment');
      }
    }
  }

  transitionToPasswordStep() {
    // Animate email step out with torch-inspired effect
    this.emailStep.style.transform = 'translateX(-100%) scale(0.95)';
    this.emailStep.style.opacity = '0';
    this.emailStep.style.filter = 'blur(2px)';
    
    setTimeout(() => {
      this.emailStep.style.display = 'none';
      this.showPasswordStep();
    }, 400);
  }

  showPasswordStep() {
    this.currentStep = 'password';
    
    // Update email display
    if (this.emailDisplay) {
      this.emailDisplay.textContent = this.userEmail;
    }
    
    // Show password step with torch-inspired animation
    this.passwordStep.style.display = 'flex';
    this.passwordStep.style.transform = 'translateX(100%) scale(0.95)';
    this.passwordStep.style.opacity = '0';
    this.passwordStep.style.filter = 'blur(2px)';
    
    setTimeout(() => {
      this.passwordStep.style.transform = 'translateX(0) scale(1)';
      this.passwordStep.style.opacity = '1';
      this.passwordStep.style.filter = 'blur(0)';
      this.passwordStep.style.transition = 'all 0.4s ease';
      
      // Focus password input
      if (this.passwordInput) {
        setTimeout(() => this.passwordInput.focus(), 200);
      }
    }, 50);
  }

  showEmailStep() {
    this.currentStep = 'email';
    
    // Hide password step
    if (this.passwordStep) {
      this.passwordStep.style.display = 'none';
    }
    
    // Show email step with animation
    this.emailStep.style.display = 'flex';
    this.emailStep.style.transform = 'translateX(0) scale(1)';
    this.emailStep.style.opacity = '1';
    this.emailStep.style.filter = 'blur(0)';
    this.emailStep.style.transition = 'all 0.4s ease';
    
    // Clear and focus email input
    if (this.emailInput) {
      this.emailInput.value = '';
      setTimeout(() => this.emailInput.focus(), 200);
    }
  }

  handlePasswordSubmit() {
    const password = this.passwordInput.value.trim();
    
    if (!password) {
      this.showToast('Please enter the access code from your email', 'error');
      return;
    }
    
    this.showLoading(this.passwordBtn, 'VERIFYING...');
    
    // Simulate password verification with torch flicker effect
    setTimeout(() => {
      if (this.verifyPassword(password)) {
        this.grantAccess();
      } else {
        this.showToast('Incorrect access code. Check your email and try again.', 'error');
        this.passwordInput.value = '';
        this.hideLoading(this.passwordBtn, 'ENTER');
        
        // Add shake effect to password input
        this.passwordInput.style.animation = 'authShake 0.5s ease-in-out';
        setTimeout(() => {
          this.passwordInput.style.animation = '';
        }, 500);
      }
    }, 1200);
  }

  verifyPassword(password) {
    // Verify against the gate password
    return password === this.GATE_PASSWORD || password.toLowerCase() === 'brisco2025';
  }

  grantAccess() {
    this.trackEvent('access_granted', { email: this.userEmail });
    
    // Store access credentials
    sessionStorage.setItem('brisco_access_granted', 'true');
    sessionStorage.setItem('brisco_user_email', this.userEmail);
    sessionStorage.setItem('brisco_access_time', Date.now().toString());
    
    // Show success toast
    this.showToast('Welcome to BRISC.', 'success');
    
    // Animate auth container out with torch-inspired effect
    this.authContainer.style.transform = 'scale(0.9)';
    this.authContainer.style.opacity = '0';
    this.authContainer.style.filter = 'blur(3px)';
    this.authContainer.style.transition = 'all 0.6s ease';
    
    setTimeout(() => {
      this.authContainer.style.display = 'none';
      this.showStore();
    }, 600);
  }

  showStore() {
    if (this.storeContent) {
      this.storeContent.style.display = 'block';
      this.storeContent.style.opacity = '0';
      this.storeContent.style.transform = 'translateY(30px) scale(0.98)';
      this.storeContent.style.filter = 'blur(2px)';
      
      setTimeout(() => {
        this.storeContent.style.opacity = '1';
        this.storeContent.style.transform = 'translateY(0) scale(1)';
        this.storeContent.style.filter = 'blur(0)';
        this.storeContent.style.transition = 'all 0.8s ease';
        this.storeContent.classList.add('fade-in-store');
      }, 100);
    }
  }

  // Utility methods
  showLoading(button, text) {
    if (button) {
      button.textContent = text;
      button.disabled = true;
      button.style.opacity = '0.7';
      button.style.cursor = 'not-allowed';
    }
  }

  hideLoading(button, originalText) {
    if (button) {
      button.textContent = originalText;
      button.disabled = false;
      button.style.opacity = '1';
      button.style.cursor = 'pointer';
    }
  }

  showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.brisc-toast');
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `brisc-toast brisc-toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  trackEvent(event, data = {}) {
    console.log(`[BRISC Auth Flow] ${event}:`, data);
    
    // Analytics tracking
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
  }

  checkExistingAccess() {
    const hasAccess = sessionStorage.getItem('brisco_access_granted') === 'true';
    const accessTime = sessionStorage.getItem('brisco_access_time');
    
    // Check if access is still valid (24 hour session)
    if (hasAccess && accessTime) {
      const timeDiff = Date.now() - parseInt(accessTime);
      const hoursElapsed = timeDiff / (1000 * 60 * 60);
      
      if (hoursElapsed < 24) {
        this.authContainer.style.display = 'none';
        this.showStore();
        return true;
      }
    }
    
    // Clear expired access
    sessionStorage.removeItem('brisco_access_granted');
    sessionStorage.removeItem('brisco_user_email');
    sessionStorage.removeItem('brisco_access_time');
    return false;
  }

  checkDirectAccess() {
    // If user already has valid access, don't show auth at all
    if (this.checkExistingAccess()) {
      return;
    }

    // Check for direct access parameter from email
    const urlParams = new URLSearchParams(window.location.search);
    const accessParam = urlParams.get('access');
    
    if (accessParam === 'direct') {
      console.log('[BRISC Auth] Direct access detected from email - skipping to password step');
      
      // Clear the URL parameter for cleaner experience
      const url = new URL(window.location);
      url.searchParams.delete('access');
      window.history.replaceState({}, document.title, url.pathname + url.search);
      
      // Set a placeholder email for direct access
      this.userEmail = 'direct-access@email.com';
      
      // Show password step directly
      this.showPasswordStep();
      
      // Show helpful message
      this.showToast('Enter the access code from your email', 'info');
    } else {
      // Normal flow - show email step
      this.showEmailStep();
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('[BRISC] Initializing enhanced authentication flow...');
  new BRISCAuthFlow();
});
