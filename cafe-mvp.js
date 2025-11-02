// ========================================
// MOUNTAIN VIEW CAFE - MVP JS
// Dynamic hours, scroll tracking, performance
// ========================================

// ========================================
// DYNAMIC HOURS - Show "Open NOW" or "Closed"
// ========================================

function updateHours() {
  const now = new Date();
  const currentHour = now.getHours();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Hours: 8 AM - 8 PM (20:00) daily
  const openHour = 8;
  const closeHour = 20;
  
  const isOpen = currentHour >= openHour && currentHour < closeHour;
  
  // Update status indicator
  const statusElement = document.getElementById('hours-status');
  const todayHoursElement = document.getElementById('today-hours');
  const openNowElement = document.getElementById('open-now-status');
  
  if (statusElement) {
    statusElement.textContent = isOpen ? 
      'Open Now • 8 AM - 8 PM' : 
      'Closed • Opens tomorrow at 8 AM';
  }
  
  if (todayHoursElement) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    todayHoursElement.innerHTML = `
      <strong>${dayNames[dayOfWeek]}</strong><br>
      8:00 AM - 8:00 PM
    `;
  }
  
  if (openNowElement) {
    if (isOpen) {
      openNowElement.innerHTML = '<span class="bg-green-500 w-3 h-3 rounded-full inline-block pulse mr-2"></span>We\'re open now!';
      openNowElement.className = 'text-green-600 font-bold text-sm';
    } else {
      openNowElement.innerHTML = '<span class="bg-red-500 w-3 h-3 rounded-full inline-block mr-2"></span>Closed for today';
      openNowElement.className = 'text-red-600 font-bold text-sm';
    }
  }
}

// Update hours on page load
updateHours();

// Update every minute (in case page stays open)
setInterval(updateHours, 60000);

// ========================================
// SCROLL DEPTH TRACKING (50% goal: >65%)
// ========================================

let scrollDepth = {
  '25': false,
  '50': false,
  '75': false,
  '100': false
};

function trackScrollDepth() {
  const windowHeight = window.innerHeight;
  const docHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollPercent = (scrollTop / (docHeight - windowHeight)) * 100;
  
  // Track milestone percentages
  if (scrollPercent >= 25 && !scrollDepth['25']) {
    scrollDepth['25'] = true;
    console.log('[Analytics] Scroll depth: 25%');
    // In production: send to analytics (e.g., Google Analytics, custom endpoint)
  }
  
  if (scrollPercent >= 50 && !scrollDepth['50']) {
    scrollDepth['50'] = true;
    console.log('[Analytics] Scroll depth: 50% ✓ KPI Goal');
    // In production: send to analytics
  }
  
  if (scrollPercent >= 75 && !scrollDepth['75']) {
    scrollDepth['75'] = true;
    console.log('[Analytics] Scroll depth: 75%');
  }
  
  if (scrollPercent >= 100 && !scrollDepth['100']) {
    scrollDepth['100'] = true;
    console.log('[Analytics] Scroll depth: 100%');
  }
}

window.addEventListener('scroll', trackScrollDepth);

// ========================================
// CLICK-TO-MAP TRACKING (KPI goal: 7-12%)
// ========================================

function trackCTAClicks() {
  document.querySelectorAll('a[href*="maps"], a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const ctaType = e.target.closest('a').getAttribute('href').includes('maps') ? 
        'Get Directions' : 'Call to Reserve';
      
      console.log(`[Analytics] CTA Clicked: ${ctaType}`);
      // In production: send to analytics
      
      // Optional: track conversion goal
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          'event_category': 'CTA',
          'event_label': ctaType,
          'value': 1
        });
      }
    });
  });
}

trackCTAClicks();

// ========================================
// PERFORMANCE MONITORING
// ========================================

window.addEventListener('load', () => {
  // Track performance metrics
  if ('performance' in window && 'timing' in window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const firstPaint = perfData.responseEnd - perfData.navigationStart;
    
    console.log(`[Performance] Page Load: ${pageLoadTime}ms`);
    console.log(`[Performance] First Paint: ${firstPaint}ms`);
    
    // Check FCP goal (< 2.5s)
    if (firstPaint < 2500) {
      console.log('[Performance] ✓ First Contentful Paint under 2.5s');
    } else {
      console.warn('[Performance] ⚠ First Contentful Paint over 2.5s');
    }
  }
  
  // Modern Performance API (if available)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            console.log(`[Performance] FCP: ${entry.startTime.toFixed(0)}ms`);
          }
        }
      });
      observer.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.log('[Performance] PerformanceObserver not fully supported');
    }
  }
});

// ========================================
// LAZY LOAD IMAGES (if adding real images later)
// ========================================

function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Run lazy loading if images exist
if (document.querySelectorAll('img[data-src]').length > 0) {
  lazyLoadImages();
}

// ========================================
// SMOOTH SCROLL for anchor links
// ========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ========================================
// CONSOLE WELCOME MESSAGE
// ========================================

console.log('%c☕ Mountain View Café', 'font-size: 24px; font-weight: bold; color: #d97706;');
console.log('%ccoffee + view — you only need the drive', 'font-size: 14px; color: #6b7280;');
console.log('Performance optimized for travelers. KPIs: <2.5s FCP, >65% scroll depth, 7-12% CTA clicks.');

