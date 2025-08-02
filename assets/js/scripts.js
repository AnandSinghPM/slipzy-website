/**
 * SLIPZY LANDING PAGE JAVASCRIPT
 * Professional, Performance-Optimized, Accessible
 * Fixed CDN-based Lucide icons integration
 */

// Configuration
const CONFIG = {
  ANDROID_STORE_URL: 'https://play.google.com/store/apps/details?id=com.slipzy.app',
  DEMO_VIDEO_URL: '#demo-modal', // Replace with actual demo URL
  ANALYTICS_ID: 'GA_TRACKING_ID', // Replace with your Google Analytics ID
  
  // Animation settings
  SCROLL_THRESHOLD: 50,
  STATS_ANIMATION_DURATION: 2000,
  RIPPLE_DURATION: 600,
  
  // Performance settings
  DEBOUNCE_DELAY: 16, // ~60fps
  INTERSECTION_THRESHOLD: 0.1
};

// State management
const AppState = {
  isMenuOpen: false,
  isScrolled: false,
  animatedStats: new Set(),
  observers: new Map()
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Safe console logging
 */
function log(message, data = null) {
  if (typeof console !== 'undefined' && console.log) {
    console.log(`[Slipzy] ${message}`, data || '');
  }
}

/**
 * Error handling wrapper
 */
function safeExecute(func, errorMessage = 'An error occurred') {
  try {
    return func();
  } catch (error) {
    log(`Error: ${errorMessage}`, error);
    return null;
  }
}

// ============================================
// ICON MANAGEMENT
// ============================================

/**
 * Initialize Lucide icons with error handling
 */
function initializeIcons() {
  return safeExecute(() => {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
      log('✓ Lucide icons initialized successfully');
      return true;
    } else {
      log('⚠ Lucide library not loaded, icons may not display');
      return false;
    }
  }, 'Failed to initialize icons');
}

/**
 * Reinitialize icons after dynamic content changes
 */
function refreshIcons() {
  setTimeout(() => initializeIcons(), 100);
}

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

/**
 * Mobile menu toggle with animation
 */
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobileMenu');
  const menuIcon = document.querySelector('.menu-icon');
  const closeIcon = document.querySelector('.close-icon');
  
  if (!mobileMenu || !menuIcon || !closeIcon) {
    log('⚠ Mobile menu elements not found');
    return;
  }

  AppState.isMenuOpen = !AppState.isMenuOpen;

  if (AppState.isMenuOpen) {
    mobileMenu.classList.remove('hidden');
    menuIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = 'hidden';
  } else {
    mobileMenu.classList.add('hidden');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    
    // Restore body scroll
    document.body.style.overflow = '';
  }
  
  // Re-initialize icons after DOM changes
  refreshIcons();
}

/**
 * Close mobile menu when clicking on links
 */
function closeMobileMenuOnLinkClick() {
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (AppState.isMenuOpen) {
        toggleMobileMenu();
      }
    });
  });
}

/**
 * Navbar scroll effect with performance optimization
 */
function updateNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const currentScrollY = window.scrollY;
  const shouldBeScrolled = currentScrollY > CONFIG.SCROLL_THRESHOLD;

  if (shouldBeScrolled !== AppState.isScrolled) {
    AppState.isScrolled = shouldBeScrolled;
    
    if (shouldBeScrolled) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
}

// ============================================
// SMOOTH SCROLLING
// ============================================

/**
 * Enhanced smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Handle empty hash
      if (targetId === '#' || targetId === '#!') {
        e.preventDefault();
        return;
      }
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
        
        if ('scrollBehavior' in document.documentElement.style) {
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        } else {
          // Fallback for browsers without smooth scrolling
          window.scrollTo(0, offsetTop);
        }
        
        // Close mobile menu if open
        if (AppState.isMenuOpen) {
          toggleMobileMenu();
        }
      }
    });
  });
}

// ============================================
// QR CODE GENERATION
// ============================================

/**
 * Generate realistic QR code pattern
 */
function generateQRPattern() {
  const qrGrid = document.getElementById('qr-grid');
  if (!qrGrid) return;

  // Clear existing pattern
  qrGrid.innerHTML = '';

  // Generate 64 cells (8x8 grid) with realistic QR pattern
  const qrPattern = [
    1,1,1,1,1,1,1,0,1,0,1,1,0,0,1,1,
    1,0,0,0,0,0,1,0,1,1,0,1,1,0,0,1,
    1,0,1,1,1,0,1,0,0,1,1,0,1,1,0,0,
    1,0,1,1,1,0,1,0,1,0,1,1,0,1,1,1,
    1,0,1,1,1,0,1,0,1,1,0,0,1,0,1,0,
    1,0,0,0,0,0,1,0,0,1,1,1,0,1,0,1,
    1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,
    0,0,0,0,0,0,0,0,1,1,0,1,0,1,1,1
  ];

  for (let i = 0; i < 64; i++) {
    const cell = document.createElement('div');
    cell.className = 'qr-cell';
    cell.style.backgroundColor = qrPattern[i] ? '#000' : '#fff';
    cell.style.borderRadius = '1px';
    qrGrid.appendChild(cell);
  }
  
  log('✓ QR code pattern generated');
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

/**
 * Initialize intersection observer for scroll animations
 */
function initializeScrollAnimations() {
  if (prefersReducedMotion()) {
    log('Reduced motion preferred - skipping scroll animations');
    return;
  }

  const observerOptions = {
    threshold: CONFIG.INTERSECTION_THRESHOLD,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      }
    });
  }, observerOptions);

  // Observe elements for scroll animations
  const animateElements = document.querySelectorAll(
    '.problem-card, .step-card, .feature-item-large, .security-card'
  );
  
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
  });

  AppState.observers.set('scrollAnimations', observer);
  log(`✓ Scroll animations initialized for ${animateElements.length} elements`);
}

/**
 * Animate statistics counters
 */
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const targetValue = stat.getAttribute('data-value');
    const displayValue = stat.textContent;
    
    // Skip if already animated
    if (AppState.animatedStats.has(stat)) return;
    AppState.animatedStats.add(stat);
    
    const numericValue = parseFloat(targetValue);
    if (!numericValue) return;

    let currentValue = 0;
    const increment = numericValue / 50;
    const duration = CONFIG.STATS_ANIMATION_DURATION;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
      currentValue += increment;
      
      if (currentValue >= numericValue) {
        stat.textContent = displayValue; // Use original display value
        clearInterval(timer);
      } else {
        // Format the current value based on the original format
        if (displayValue.includes('K+')) {
          stat.textContent = Math.floor(currentValue / 1000) + 'K+';
        } else if (displayValue.includes('★')) {
          stat.textContent = currentValue.toFixed(1) + '★';
        } else if (displayValue.includes('%')) {
          stat.textContent = currentValue.toFixed(1) + '%';
        } else {
          stat.textContent = Math.floor(currentValue);
        }
      }
    }, stepTime);
  });
  
  log('✓ Statistics animation started');
}

/**
 * Initialize stats animation observer
 */
function initializeStatsAnimation() {
  const downloadSection = document.querySelector('.download-section');
  if (!downloadSection) return;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statsObserver.observe(downloadSection);
  AppState.observers.set('statsAnimation', statsObserver);
}

// ============================================
// BUTTON INTERACTIONS
// ============================================

/**
 * Create ripple effect on button click
 */
function createRipple(event) {
  const button = event.currentTarget;
  const circle = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add('ripple');

  const ripple = button.getElementsByClassName('ripple')[0];
  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
  
  // Clean up ripple after animation
  setTimeout(() => {
    if (circle.parentNode) {
      circle.remove();
    }
  }, CONFIG.RIPPLE_DURATION);
}

/**
 * Add loading state to button
 */
function addLoadingState(button, duration = 2000) {
  if (button.classList.contains('loading')) return;
  
  const originalHTML = button.innerHTML;
  button.classList.add('loading');
  button.disabled = true;
  
  button.innerHTML = `
    <div class="loading-spinner" style="width: 1rem; height: 1rem; border: 2px solid currentColor; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
    <span>Loading...</span>
  `;

  setTimeout(() => {
    button.innerHTML = originalHTML;
    button.classList.remove('loading');
    button.disabled = false;
    refreshIcons();
  }, duration);
}

/**
 * Handle download button clicks
 */
function handleDownloadClick(event) {
  const button = event.currentTarget;
  
  // Add ripple effect
  createRipple(event);
  
  // Add loading state
  addLoadingState(button, 1500);
  
  // Track analytics event
  trackEvent('click', 'download', 'android_app');
  
  // Open store after short delay
  setTimeout(() => {
    window.open(CONFIG.ANDROID_STORE_URL, '_blank', 'noopener,noreferrer');
  }, 500);
  
  log('Download button clicked - redirecting to Play Store');
}

/**
 * Handle demo button clicks
 */
function handleDemoClick(event) {
  const button = event.currentTarget;
  
  // Add ripple effect
  createRipple(event);
  
  // Track analytics event
  trackEvent('click', 'demo', 'watch_video');
  
  // TODO: Replace with actual demo implementation
  alert('Demo video coming soon! 🎬\n\nSlipzy transforms receipts into PDFs in just 3 steps:\n1. Snap 📸\n2. Scan 🔍\n3. Save 💾');
  
  log('Demo button clicked');
}

/**
 * Initialize button event listeners
 */
function initializeButtonListeners() {
  // Download buttons
  const downloadButtons = document.querySelectorAll('#nav-download-btn, #mobile-download-btn, #hero-download-btn, #final-download-btn');
  downloadButtons.forEach(button => {
    button.addEventListener('click', handleDownloadClick);
  });

  // Demo buttons
  const demoButtons = document.querySelectorAll('#watch-demo-btn');
  demoButtons.forEach(button => {
    button.addEventListener('click', handleDemoClick);
  });

  // Add ripple effect to all buttons
  const allButtons = document.querySelectorAll('.btn');
  allButtons.forEach(button => {
    button.addEventListener('click', createRipple);
  });

  log(`✓ Button listeners initialized: ${downloadButtons.length} download, ${demoButtons.length} demo, ${allButtons.length} total`);
}

// ============================================
// PARALLAX EFFECTS
// ============================================

/**
 * Parallax effect for hero background circles
 */
function handleParallaxScroll() {
  if (prefersReducedMotion()) return;
  
  const scrolled = window.pageYOffset;
  const parallaxElements = document.querySelectorAll('.bg-circle');

  parallaxElements.forEach((element, index) => {
    const speed = 0.3 + (index * 0.1); // Reduced for subtlety
    const transform = `translateY(${scrolled * speed}px)`;
    element.style.transform = transform;
  });
}

// ============================================
// CARD HOVER EFFECTS
// ============================================

/**
 * Add enhanced hover effects to cards
 */
function initializeCardHoverEffects() {
  const cards = document.querySelectorAll('.problem-card, .step-content, .security-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      if (!prefersReducedMotion()) {
        this.style.transform = 'translateY(-8px)';
        this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
      }
    });

    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  log(`✓ Hover effects initialized for ${cards.length} cards`);
}

// ============================================
// ANALYTICS
// ============================================

/**
 * Track events for analytics
 */
function trackEvent(action, category, label, value = null) {
  // Google Analytics 4 tracking
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
  
  // Fallback to dataLayer
  if (typeof window.dataLayer !== 'undefined') {
    window.dataLayer.push({
      event: action,
      event_category: category,
      event_label: label,
      event_value: value
    });
  }
  
  log(`Analytics: ${action} - ${category} - ${label}`);
}

/**
 * Initialize Google Analytics
 */
function initializeAnalytics() {
  if (CONFIG.ANALYTICS_ID !== 'GA_TRACKING_ID') {
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    
    function gtag() {
      window.dataLayer.push(arguments);
    }
    
    gtag('js', new Date());
    gtag('config', CONFIG.ANALYTICS_ID);
    
    log('✓ Analytics initialized');
  }
}

// ============================================
// PERFORMANCE MONITORING
// ============================================

/**
 * Monitor performance metrics
 */
function monitorPerformance() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.fetchStart;
        
        log(`Page load performance: ${Math.round(loadTime)}ms`);
        
        // Track performance in analytics
        trackEvent('performance', 'page_load', 'load_time', Math.round(loadTime));
      }, 0);
    });
  }
}

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

/**
 * Enhance keyboard navigation
 */
function enhanceKeyboardNavigation() {
  // Handle escape key for mobile menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && AppState.isMenuOpen) {
      toggleMobileMenu();
    }
  });
  
  // Focus management for mobile menu
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMobileMenu();
      }
    });
  }
  
  log('✓ Keyboard navigation enhanced');
}

/**
 * Add ARIA labels for better accessibility
 */
function enhanceAccessibility() {
  // Add ARIA labels to interactive elements
  const downloadBtns = document.querySelectorAll('[id*="download-btn"]');
  downloadBtns.forEach(btn => {
    if (!btn.getAttribute('aria-label')) {
      btn.setAttribute('aria-label', 'Download Slipzy app for Android');
    }
  });
  
  // Add ARIA labels to navigation
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const targetId = href.substring(1);
      link.setAttribute('aria-label', `Navigate to ${targetId.replace('-', ' ')} section`);
    }
  });
  
  log('✓ Accessibility enhancements applied');
}

// ============================================
// SCROLL INDICATOR
// ============================================

/**
 * Scroll indicator click handler
 */
function initializeScrollIndicator() {
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (!scrollIndicator) return;
  
  scrollIndicator.addEventListener('click', () => {
    const problemSection = document.querySelector('.problem-section');
    if (problemSection) {
      problemSection.scrollIntoView({ behavior: 'smooth' });
      trackEvent('click', 'navigation', 'scroll_indicator');
    }
  });
  
  // Hide scroll indicator when user scrolls
  const hideScrollIndicator = throttle(() => {
    if (window.scrollY > 100) {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    } else {
      scrollIndicator.style.opacity = '1';
      scrollIndicator.style.pointerEvents = 'auto';
    }
  }, 100);
  
  window.addEventListener('scroll', hideScrollIndicator);
  
  log('✓ Scroll indicator initialized');
}

// ============================================
// MAIN INITIALIZATION
// ============================================

/**
 * Initialize all functionality when DOM is ready
 */
function initializeApp() {
  log('🚀 Initializing Slipzy Landing Page...');
  
  // Core functionality
  initializeIcons();
  initializeSmoothScrolling();
  initializeButtonListeners();
  closeMobileMenuOnLinkClick();
  
  // Visual enhancements
  generateQRPattern();
  initializeScrollAnimations();
  initializeStatsAnimation();
  initializeCardHoverEffects();
  initializeScrollIndicator();
  
  // Accessibility
  enhanceKeyboardNavigation();
  enhanceAccessibility();
  
  // Analytics
  initializeAnalytics();
  monitorPerformance();
  
  // Mobile menu event listener
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  log('✅ Slipzy Landing Page initialized successfully');
  
  // Welcome message
  console.log('%cWelcome to Slipzy! 📱', 'color: #F08E34; font-size: 20px; font-weight: bold;');
  console.log('%cSlips into Slipzy - so easy! 🎯', 'color: #666; font-size: 14px;');
}

/**
 * Optimized scroll handler
 */
const optimizedScrollHandler = throttle(() => {
  updateNavbar();
  handleParallaxScroll();
}, CONFIG.DEBOUNCE_DELAY);

// ============================================
// EVENT LISTENERS
// ============================================

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Scroll events
window.addEventListener('scroll', optimizedScrollHandler);

// Resize events (for responsive adjustments)
window.addEventListener('resize', debounce(() => {
  // Recalculate any size-dependent elements
  log('Window resized - recalculating layouts');
}, 250));

// Page visibility (for performance optimization)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    log('Page hidden - pausing animations');
  } else {
    log('Page visible - resuming animations');
    refreshIcons();
  }
});

// ============================================
// SERVICE WORKER (Optional)
// ============================================

/**
 * Register service worker for offline functionality
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          log('✓ ServiceWorker registration successful');
        })
        .catch(err => {
          log('ServiceWorker registration failed', err);
        });
    });
  }
}

// Uncomment to enable service worker
// registerServiceWorker();

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Global error handler
 */
window.addEventListener('error', (event) => {
  log('Global error caught', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno
  });
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', (event) => {
  log('Unhandled promise rejection', event.reason);
});

// ============================================
// CLEANUP
// ============================================

/**
 * Cleanup function for page unload
 */
function cleanup() {
  // Remove event listeners
  window.removeEventListener('scroll', optimizedScrollHandler);
  
  // Disconnect observers
  AppState.observers.forEach(observer => {
    if (observer && observer.disconnect) {
      observer.disconnect();
    }
  });
  
  // Clear any running timers
  AppState.animatedStats.clear();
  
  log('✓ Cleanup completed');
}

// Page unload cleanup
window.addEventListener('beforeunload', cleanup);

// ============================================
// DEVELOPMENT HELPERS
// ============================================

/**
 * Development mode helpers (remove in production)
 */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // Add development helpers
  window.SlipzyDebug = {
    state: AppState,
    config: CONFIG,
    toggleMobileMenu,
    animateStats,
    refreshIcons,
    trackEvent
  };
  
  log('🔧 Development mode enabled');
}
