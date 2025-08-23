# Brisco Streetwear - Deployment Guide

## 🚀 Quick Deployment

### Option 1: Netlify (Recommended)

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub/GitLab repo

2. **Build Settings** (Auto-configured via `netlify.toml`)
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Deploy**
   - Site will auto-deploy on every push to main branch
   - Custom domain can be added in site settings

### Option 2: Vercel

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect your repository

2. **Configuration** (Auto-configured via `vercel.json`)
   - Framework preset: Astro
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Deploy**
   - Automatic deployments on git push
   - Preview deployments for pull requests

### Option 3: Manual Deployment

```bash
# Build the project
npm run build

# The 'dist' folder contains your static site
# Upload the contents to your hosting provider
```

## 🔧 Environment Setup

### Required Environment Variables (Future)

For GoHighLevel integration, add these to your deployment platform:

```env
# GoHighLevel API
GHL_API_KEY=your_ghl_api_key
GHL_LOCATION_ID=your_location_id

# Stripe (via GHL)
GHL_STRIPE_ACCOUNT_ID=your_stripe_account

# Email Marketing
MAILCHIMP_API_KEY=your_mailchimp_key (if not using GHL)
```

## 📊 Analytics Setup

### Google Analytics 4

Add to `src/pages/index.astro` before closing `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Facebook Pixel

```html
<!-- Facebook Pixel -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
```

## 🔒 Security Checklist

- [x] Security headers configured (CSP, HSTS, etc.)
- [x] HTTPS enforced through hosting platform
- [x] Input validation on email signup
- [x] XSS protection in place
- [ ] Rate limiting (implement if adding API endpoints)

## ⚡ Performance Optimization

### Already Implemented
- [x] Static site generation (Astro)
- [x] Image lazy loading
- [x] Critical resource preloading
- [x] CSS/JS minification
- [x] Gzip compression

### Additional Optimizations
- [ ] WebP image format conversion
- [ ] Service worker for caching
- [ ] CDN setup for images

## 🛒 E-commerce Integration

### Current State
- ✅ Shopping cart UI
- ✅ localStorage persistence
- ✅ Product management system
- ⏳ Payment processing (GHL integration needed)

### GoHighLevel Setup

1. **Create GHL Sub-account**
   - Set up Stripe integration
   - Configure product catalog
   - Set up automation workflows

2. **API Integration**
   - Replace cart checkout with GHL API calls
   - Update product management to sync with GHL
   - Connect email signup to GHL campaigns

3. **Testing**
   - Test payment flow
   - Verify email automation
   - Check order management

## 📱 Mobile Testing

Test on these devices/viewports:
- iPhone 12/13/14 (390px)
- Samsung Galaxy S21 (360px)
- iPad (768px)
- Desktop (1200px+)

## 🔍 SEO Checklist

- [x] Meta titles and descriptions
- [x] Open Graph tags
- [x] Twitter Cards
- [x] Schema.org markup
- [x] Semantic HTML structure
- [x] Alt text for images
- [ ] XML sitemap submission
- [ ] Google Search Console setup

## 📈 Launch Checklist

### Pre-Launch
- [ ] Content review and approval
- [ ] Image optimization and compression
- [ ] Cross-browser testing
- [ ] Mobile responsiveness check
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit
- [ ] SEO audit

### Launch Day
- [ ] DNS configuration
- [ ] SSL certificate verification
- [ ] Analytics setup
- [ ] Social media setup
- [ ] Email marketing integration
- [ ] Payment processing test

### Post-Launch
- [ ] Monitor error logs
- [ ] Check analytics data
- [ ] Social media promotion
- [ ] Email announcement
- [ ] Performance monitoring

## 🆘 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Image Issues
- Ensure images are in `public/images/`
- Check file extensions match code references
- Verify image file sizes (optimize if > 1MB)

### Cart Issues
- Check browser localStorage support
- Verify JavaScript is enabled
- Test in incognito mode to rule out extensions

## 📞 Support

For technical issues:
1. Check browser console for errors
2. Test in different browsers
3. Clear cache and cookies
4. Check network connectivity

---

**Ready to launch? 🚀**

Your Brisco streetwear site is production-ready with:
- ✅ Gothic luxury design
- ✅ Mobile-first responsive layout
- ✅ Shopping cart functionality
- ✅ SEO optimization
- ✅ Performance optimization
- ✅ Security headers
- ✅ Deployment configurations

*Be the risk. Be your own light.* 🔥
