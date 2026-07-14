/* ===== INITIALIZERS & CORE INTERACTIVE COMPONENT BEHAVIOR ===== */

// Preloader & delay transitions with safety fallback
function hidePreloader() {
  const pageLoad = document.getElementById('page-load');
  if (pageLoad && !pageLoad.classList.contains('loaded')) {
    pageLoad.classList.add('loaded');
    document.body.classList.add('page-ready');
    // Re-run scroll animations
    if (typeof initReveal === 'function') {
      initReveal();
    }
  }
}

window.addEventListener('load', () => {
  setTimeout(hidePreloader, 900);
});

// Force preloader to hide after 3 seconds in case window load is delayed
setTimeout(hidePreloader, 3000);

// Video intro delay and floating anchors trigger with safety fallback
window.addEventListener('DOMContentLoaded', () => {
  const heroVideo = document.getElementById('hero-video');
  const glassNav = document.querySelector('.glass-nav');
  const heroContent = document.querySelector('.hero-center-content');
  let introTriggered = false;

  function triggerIntroPlayed() {
    if (introTriggered) return;
    introTriggered = true;
    document.body.classList.add('intro-played');
    const activeSection = document.querySelector('.spa-section.active');
    if (glassNav && activeSection && activeSection.id === 'home') {
      glassNav.classList.add('show-nav');
    }
    if (heroContent) {
      heroContent.classList.add('show-content');
    }
  }

  if (heroVideo) {
    heroVideo.addEventListener('play', () => {
      setTimeout(triggerIntroPlayed, 5000);
    }, { once: true });

    // Safety fallback: if video play is blocked or takes too long, trigger intro after 4.5s
    setTimeout(triggerIntroPlayed, 4500);
  } else {
    // If no video found, show nav and content immediately
    setTimeout(triggerIntroPlayed, 1000);
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
let cursorSpeed = 0.12; // Default tracking physics speed

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * cursorSpeed;
  cursorY += (mouseY - cursorY) * cursorSpeed;
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

  // Modern physics attenuation and custom expansion for specific luxury elements (CTA & Audio toggle)
  document.querySelectorAll('.btn-blob, .audio-toggle').forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('hovering-attenuated');
      cursorSpeed = 0.05; // Make the cursor lag smoothly behind the mouse (attenuated physics)
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovering-attenuated');
      cursorSpeed = 0.12; // Reset to normal physics speed
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
