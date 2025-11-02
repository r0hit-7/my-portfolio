// ========================================
// THEME TOGGLE
// ========================================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector('i');
  icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ========================================
// NAVIGATION FUNCTIONALITY
// ========================================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Navbar scroll effect
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile menu toggle
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}

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

// Active nav link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// ========================================
// TYPING ANIMATION
// ========================================

const typingTexts = ['CSE Student', 'Web Developer', 'Freelancer', 'Problem Solver'];
let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

function typeText() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;

  const currentText = typingTexts[currentTextIndex];
  
  if (isDeleting) {
    typingElement.textContent = currentText.substring(0, currentCharIndex - 1);
    currentCharIndex--;
  } else {
    typingElement.textContent = currentText.substring(0, currentCharIndex + 1);
    currentCharIndex++;
  }

  if (!isDeleting && currentCharIndex === currentText.length) {
    isDeleting = true;
    setTimeout(typeText, 2000);
  } else if (isDeleting && currentCharIndex === 0) {
    isDeleting = false;
    currentTextIndex = (currentTextIndex + 1) % typingTexts.length;
    setTimeout(typeText, 500);
  } else {
    const speed = isDeleting ? 50 : 100;
    setTimeout(typeText, speed);
  }
}

// Start typing animation after page load
window.addEventListener('load', () => {
  setTimeout(typeText, 1000);
});

// ========================================
// SKILL LEVEL ANIMATION
// ========================================

function animateSkills() {
  const skillLevels = document.querySelectorAll('.skill-level');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const level = entry.target;
        const width = level.getAttribute('data-level');
        level.style.setProperty('--skill-width', `${width}%`);
        level.classList.add('animated');
        observer.unobserve(level);
      }
    });
  }, { threshold: 0.5 });

  skillLevels.forEach(level => {
    observer.observe(level);
  });
}

// Initialize skill animations
animateSkills();

// ========================================
// SCROLL ANIMATIONS
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
document.querySelectorAll('.project-card, .detail-card, .contact-card, .skill-category').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  observer.observe(el);
});

// ========================================
// CONTACT FORM HANDLING
// ========================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
      showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
      contactForm.reset();
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }, 2000);
  });
}

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
  if (num >= 100) {
    return num + '+';
  }
  return num.toString();
}

// Animate stats when about section is visible
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
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

statNumbers.forEach(stat => {
  statsObserver.observe(stat);
});

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(message, type = 'info') {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    info: '#3b82f6'
  };
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    info: 'fa-info-circle'
  };
  
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${colors[type] || colors.info};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    max-width: 400px;
  `;
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <i class="fas ${icons[type] || icons.info}"></i>
      <span>${message}</span>
    </div>
  `;
  
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
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
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease-out reverse';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

// ========================================
// SCROLL TO TOP FUNCTIONALITY
// ========================================

// Add scroll indicator click functionality
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth'
  });
});

// ========================================
// FORM VALIDATION
// ========================================

const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');

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
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio loaded successfully!');
});
