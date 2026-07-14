/* ===== SPA NAVIGATION & ROUTING ===== */

const sections = ['home', 'shop', 'lookbook', 'about'];

function ensureHomeActive() {
  const home = document.getElementById('home');
  if (!home) return;
  sections.forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.toggle('active', s === 'home');
  });
}

function scrollToTarget(target, behavior = 'smooth') {
  if (!target) return;
  const header = document.querySelector('.main-header');
  const headerOffset = header ? header.offsetHeight + 8 : 80;
  const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

function navigate(id) {
  closeMenu();

  // Top of page / home SPA view
  if (id === 'home') {
    ensureHomeActive();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    syncHeaderAfterNavigate('home');
    return;
  }

  // Known SPA route sections
  if (sections.includes(id)) {
    sections.forEach(s => {
      const el = document.getElementById(s);
      if (el) el.classList.toggle('active', s === id);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    syncHeaderAfterNavigate(id);
    return;
  }

  // In-page anchors (catalogo, a-essencia, faq, etc.)
  ensureHomeActive();
  const target = document.getElementById(id);
  if (target) {
    // Allow layout to settle if home was just re-activated
    requestAnimationFrame(() => scrollToTarget(target));
    syncHeaderAfterNavigate('home');
    return;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
  syncHeaderAfterNavigate('home');
}

function syncHeaderAfterNavigate(id) {
  setTimeout(() => {
    if (typeof initReveal === 'function') {
      initReveal();
    }

    const mainHeader = document.querySelector('.main-header');
    if (mainHeader) {
      if (id !== 'home') {
        mainHeader.classList.add('scrolled');
      } else if (window.scrollY < 50) {
        mainHeader.classList.remove('scrolled');
      }
    }

    const glassNav = document.querySelector('.glass-nav');
    if (glassNav) {
      if (id === 'home') {
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
  if (!menu) return;
  menu.classList.add('open');
  document.body.classList.add('menu-open');
}

function closeMenu() {
  const menu = document.getElementById('menu-overlay');
  if (!menu) return;
  menu.classList.remove('open');
  document.body.classList.remove('menu-open');
}

// Bind navigation keys
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMenu();
  }
});

// Smooth in-page hash links (footer, etc.)
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const hash = link.getAttribute('href');
  if (!hash || hash === '#') return;
  const id = hash.slice(1);
  const target = document.getElementById(id);
  if (!target) return;
  e.preventDefault();
  navigate(id);
});
