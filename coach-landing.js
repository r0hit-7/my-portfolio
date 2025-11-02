// ========================================
// NAVIGATION FUNCTIONALITY
// ========================================

const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// ========================================
// FORM HANDLING
// ========================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData);
  
  // Simulate form submission
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitButton.disabled = true;
  
  // Simulate API call
  setTimeout(() => {
    // Show success message
    showNotification('Thank you! We\'ll contact you within 24 hours.', 'success');
    
    // Reset form
    contactForm.reset();
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
    
    // In a real application, you would send the data to your server here
    console.log('Form data:', data);
  }, 2000);
});

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(message, type = 'info') {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#3a86ff'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    max-width: 400px;
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .notification-content {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .notification-content i {
      font-size: 1.2rem;
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.service-card, .testimonial-card, .pricing-card, .about-feature').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer.observe(el);
});

// ========================================
// STATISTICS COUNTER ANIMATION
// ========================================

function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = formatNumber(target);
      clearInterval(timer);
    } else {
      element.textContent = formatNumber(Math.floor(current));
    }
  }, 16);
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M+';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K+';
  }
  return num.toString();
}

// Animate stats when hero section is visible
const heroStats = document.querySelectorAll('.stat-number');
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      const text = entry.target.textContent;
      const number = parseInt(text.replace(/[^0-9]/g, ''));
      if (number) {
        entry.target.dataset.animated = 'true';
        entry.target.textContent = '0';
        animateCounter(entry.target, number);
      }
    }
  });
}, { threshold: 0.5 });

heroStats.forEach(stat => {
  if (stat.textContent.includes('+') || stat.textContent.includes('%')) {
    heroObserver.observe(stat);
  }
});

// ========================================
// DYNAMIC FORM VALIDATION
// ========================================

const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea, .contact-form select');

formInputs.forEach(input => {
  input.addEventListener('blur', () => {
    validateInput(input);
  });
  
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) {
      validateInput(input);
    }
  });
});

function validateInput(input) {
  const value = input.value.trim();
  let isValid = true;
  let errorMessage = '';
  
  // Remove previous error styling
  input.classList.remove('error');
  const existingError = input.parentElement.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Validation rules
  if (input.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  } else if (input.type === 'email' && value && !isValidEmail(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid email address';
  } else if (input.placeholder.includes('Instagram') && value && !value.startsWith('@')) {
    isValid = false;
    errorMessage = 'Instagram handle must start with @';
  }
  
  // Show error if invalid
  if (!isValid) {
    input.classList.add('error');
    input.style.borderColor = '#ef4444';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = 'color: #ef4444; font-size: 0.85rem; margin-top: 5px;';
    errorDiv.textContent = errorMessage;
    input.parentElement.appendChild(errorDiv);
  } else {
    input.style.borderColor = '';
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ========================================
// PARALLAX EFFECT FOR HERO SECTION
// ========================================

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  if (hero) {
    const rate = scrolled * 0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// ========================================
// TYPING EFFECT FOR HERO TITLE (Optional Enhancement)
// ========================================

function typeWriter(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Uncomment to enable typing effect
// window.addEventListener('load', () => {
//   const gradientText = document.querySelector('.gradient-text');
//   if (gradientText) {
//     const originalText = gradientText.textContent;
//     typeWriter(gradientText, originalText, 50);
//   }
// });

