// --- STICKY HEADER & SMOOTH SCROLLING ---
(function () {
  const header = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  // Sticky style on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
  // Hamburger mobile nav
  if(hamburger && navMenu) {
    hamburger.addEventListener('click', function(){
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.classList.toggle('active');
      this.setAttribute('aria-expanded', !expanded);
      navMenu.classList.toggle('active');
    });
    navLinks.forEach(link => link.addEventListener('click', ()=> {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', false);
      navMenu.classList.remove('active');
    }));
  }
  // Smooth scroll
  navLinks.forEach(link => link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
        window.scrollTo({top,behavior:'smooth'});
      }
    }
  }));
  // Highlight current section in nav
  const sectionMap = Array.from(navLinks)
    .map(n => {
      const sel = n.getAttribute('href');
      const el = sel && sel.startsWith("#") ? document.querySelector(sel) : null;
      return [n, el];
    })
    .filter(([,el])=>el);
  function highlightNavOnScroll() {
    let current = null;
    sectionMap.forEach(([link, s]) => {
      const y = s.getBoundingClientRect().top - header.offsetHeight - 10;
      if (y < 1) current = link;
    });
    navLinks.forEach(n=>n.classList.remove('active'));
    if (current) current.classList.add('active');
  }
  window.addEventListener('scroll', highlightNavOnScroll);
  window.addEventListener('resize', highlightNavOnScroll);
  highlightNavOnScroll();
})();

// --- MODAL ORDER SYSTEM ---
(function(){
  const modalOverlay = document.getElementById('orderModalOverlay');
  const orderModal = document.getElementById('orderModal');
  const orderForm = document.getElementById('orderForm');
  const orderBtns = document.querySelectorAll('.order-btn');
  const closeBtns = orderModal.querySelectorAll('.close-modal');
  function openOrderModal(itemName) {
    document.getElementById('orderItem').value = itemName;
    modalOverlay.style.display = 'flex';
    modalOverlay.setAttribute('aria-hidden', 'false');
    orderModal.focus();
  }
  function closeOrderModal() {
    modalOverlay.style.display = 'none';
    modalOverlay.setAttribute('aria-hidden', 'true');
    orderForm.reset();
  }
  orderBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      const name = btn.getAttribute('data-item');
      openOrderModal(name);
    });
  });
  closeBtns.forEach(btn=>btn.addEventListener('click',closeOrderModal));
  modalOverlay.addEventListener('click', function(e){
    if(e.target===modalOverlay) closeOrderModal();
  });
  document.addEventListener('keydown', function(e){
    if(modalOverlay.style.display==='flex' && e.key==='Escape') closeOrderModal();
  });
  orderForm.addEventListener('submit', function(e){
    e.preventDefault();
    closeOrderModal();
    showCafeNotification('Thank you for your order! We look forward to serving you.','success');
  });
})();

// --- NEWSLETTER SUBMISSION ---
(function(){
  const newsForm = document.getElementById('newsletterForm');
  if(!newsForm) return;
  newsForm.addEventListener('submit', function(e){
    e.preventDefault();
    showCafeNotification('Thank you for subscribing for special offers!','success');
    const btn = newsForm.querySelector('button');
    const input = newsForm.querySelector('input[type=email]');
    btn.disabled = true; input.disabled = true;
    setTimeout(()=>{ btn.disabled=false; input.disabled=false; newsForm.reset(); },1800);
  });
})();

// --- BOOKING/CONTACT FORM ---
(function(){
  const bookForm = document.getElementById('bookingForm');
  if(!bookForm) return;
  bookForm.addEventListener('submit', function(e){
    e.preventDefault();
    showCafeNotification('Your request has been received! We will contact you soon.','success');
    bookForm.reset();
  });
})();

// --- DUMMY FOOTER LINK MODAL ---
(function(){
  document.querySelectorAll('footer a[href="#"]').forEach(link=>{
    link.addEventListener('click', function(e){
      e.preventDefault();
      showCafeNotification('More coming soon! For info, visit us or contact by phone/email.','info');
    });
  });
})();

// --- NOTIFICATION/TOAST SYSTEM ---
function showCafeNotification(message, type) {
  // Remove any existing
  const old = document.querySelector('.cafe-toast');
  if(old) old.remove();
  // Colors
  const color = type==='success' ? '#10b981' : type==='error' ? '#ef4444' : '#3a5335';
  const icon = type==='success' ? 'fa-check-circle' : type==='error' ? 'fa-exclamation-circle' : 'fa-info-circle';
  // Create
  const div = document.createElement('div');
  div.className = 'cafe-toast';
  div.style.cssText = 'position:fixed;z-index:10090;top:100px;right:22px;background:'+color+';color:#fff;padding:1rem 1.6rem;border-radius:12px;max-width:370px;box-shadow:0 4px 32px #0002;display:flex;align-items:center;gap:12px;font-size:1.1rem;animation:fadeInRight .18s ease;';
  div.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
  document.body.appendChild(div);
  setTimeout(()=>{
    div.style.animation = 'fadeInRight 0.13s ease reverse';
    setTimeout(()=>div.remove(),200);
  },2900);
  if(!document.getElementById('cafe-toast-style')) {
    const style = document.createElement('style');
    style.id = 'cafe-toast-style';
    style.textContent = `@keyframes fadeInRight{from{transform:translateX(70px);opacity:0;}to{transform:translateX(0);opacity:1}}`;
    document.head.appendChild(style);
  }
}
