/* ===== INITIALIZERS & CORE INTERACTIVE COMPONENT BEHAVIOR ===== */

// Preloader & delay transitions
window.addEventListener('load', () => {
  setTimeout(() => {
    const pageLoad = document.getElementById('page-load');
    if (pageLoad) {
      pageLoad.classList.add('loaded');
      document.body.classList.add('page-ready');
    }
    
    // Re-run scroll animations
    if (typeof initReveal === 'function') {
      initReveal();
    }
  }, 900);
});

// Video intro delay and floating anchors trigger
window.addEventListener('DOMContentLoaded', () => {
  const heroVideo = document.getElementById('hero-video');
  const glassNav = document.querySelector('.glass-nav');
  const heroContent = document.querySelector('.hero-center-content');
  
  if (heroVideo) {
    heroVideo.addEventListener('play', () => {
      setTimeout(() => {
        document.body.classList.add('intro-played');
        const activeSection = document.querySelector('.spa-section.active');
        if (glassNav && activeSection && activeSection.id === 'home') {
          glassNav.classList.add('show-nav');
        }
        if (heroContent) {
          heroContent.classList.add('show-content');
        }
      }, 5000);
    }, { once: true });
  } else {
    // If no video found, show nav and content immediately
    setTimeout(() => {
      document.body.classList.add('intro-played');
      if (glassNav) glassNav.classList.add('show-nav');
      if (heroContent) heroContent.classList.add('show-content');
    }, 1000);
  }
});

// Audio Volume Toggle
function toggleAudio() {
  const audio = document.getElementById('ambient-audio');
  const btns = document.querySelectorAll('.audio-toggle');
  
  if (!audio || btns.length === 0) return;
  
  if (audio.paused) {
    audio.play();
    btns.forEach(btn => {
      btn.innerHTML = '<i data-lucide="volume-2"></i>';
      btn.classList.add('playing');
    });
  } else {
    audio.pause();
    btns.forEach(btn => {
      btn.innerHTML = '<i data-lucide="volume-x"></i>';
      btn.classList.remove('playing');
    });
  }
  
  // Re-initialize Lucide icons for the dynamically inserted icons
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

// FAQ Accordion Toggler
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    const icon = item.querySelector('.faq-icon');
    const isActive = item.classList.contains('active');

    // Close all other items
    document.querySelectorAll('.faq-item').forEach(faq => {
      faq.classList.remove('active');
      const fIcon = faq.querySelector('.faq-icon');
      if (fIcon) fIcon.textContent = '+';
    });

    // Toggle current item
    if (!isActive) {
      item.classList.add('active');
      if (icon) icon.textContent = '−';
    }
  });
});

// Custom cursor setup
const cursor = document.getElementById('custom-cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  if (cursor) {
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
  }
  requestAnimationFrame(animateCursor);
}
requestAnimationFrame(animateCursor);

// Add hover listeners to links and buttons for custom cursor expansions
function setupHoverCursor() {
  const cursorText = document.querySelector('#custom-cursor .cursor-text');

  document.querySelectorAll('a, button, [onclick], .shop-card, .carousel-item, .faq-question, .home-fixed-right-line-step').forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('hovering-link');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovering-link');
    });
  });

  // Track modern draggable carousel hover
  document.querySelectorAll('.modern-carousel-track').forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('hovering-carousel');
      if (cursorText) cursorText.textContent = 'arrastar';
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovering-carousel');
      if (cursorText) cursorText.textContent = '';
    });
  });
}

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  setupHoverCursor();
  if (typeof initReveal === 'function') {
    initReveal();
  }
});
