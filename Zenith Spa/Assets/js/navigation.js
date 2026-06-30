/* ===== SPA NAVIGATION & ROUTING ===== */

const sections = ['home', 'shop', 'lookbook', 'about'];

function navigate(id) {
  sections.forEach(s => {
    const el = document.getElementById(s);
    if (el) {
      el.classList.toggle('active', s === id);
    }
  });
  
  // Smooth scroll to top when changing views
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMenu();
  
  // Dispatch a custom event to re-trigger reveals on navigate
  setTimeout(() => {
    if (typeof initReveal === 'function') {
      initReveal();
    }
    // Toggle main navigation header text color or background based on page view
    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) {
      if (id !== 'home') {
        mainHeader.classList.add('scrolled');
      } else {
        // If scrolled past threshold, keep scrolled
        if (window.scrollY < 50) {
          mainHeader.classList.remove('scrolled');
        }
      }
    }
    // Control floating anchor nav visibility (only on home page)
    const glassNav = document.querySelector('.glass-nav');
    if (glassNav) {
      if (id === 'home') {
        // Show after 5 seconds or immediately if video has played already
        if (document.body.classList.contains('intro-played')) {
          glassNav.classList.add('show-nav');
        }
      } else {
        glassNav.classList.remove('show-nav');
      }
    }
  }, 100);
}

function openMenu() {
  const menu = document.getElementById('menu-overlay');
  if (menu) {
    menu.classList.add('open');
  }
}

function closeMenu() {
  const menu = document.getElementById('menu-overlay');
  if (menu) {
    menu.classList.remove('open');
  }
}

// Bind navigation keys
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
  }
});
