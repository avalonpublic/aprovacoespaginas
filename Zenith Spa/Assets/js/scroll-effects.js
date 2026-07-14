/* ===== SCROLL REVEALS & PARALLAX CONTROLLER ===== */

/* --- GENERAL ELEMENT FADE-IN (Scroll Reveal) --- */
function initReveal() {
  const options = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px" // triggers slightly before elements enter view
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // check only once
      }
    });
  }, options);

  // Bind to all elements with class .reveal
  document.querySelectorAll('.spa-section.active .reveal, #page-load.loaded ~ .reveal').forEach(el => {
    el.classList.remove('visible'); // resets state
    observer.observe(el);
  });
}


/* --- TIMELINE BADGE PREFILL TRIGGER --- */
function handleTimelineFiller() {
  const items = document.querySelectorAll('.timeline-item');
  if (items.length === 0) return;
  
  items.forEach(item => {
    const badge = item.querySelector('.timeline-badge');
    if (!badge) return;
    
    const rect = item.getBoundingClientRect();
    
    // Fill the bubble if scrolled past 75% height of the screen
    if (rect.top < window.innerHeight * 0.75) {
      badge.classList.add('filled');
    } else {
      badge.classList.remove('filled');
    }
  });
}

window.addEventListener('scroll', handleTimelineFiller);


/* --- PARALLAX SPLIT COLUMNS (Section Home Season) --- */
function handleParallaxColumns() {
  const section = document.querySelector('.home-season');
  if (!section) return;

  const rect = section.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // Verify if section is in viewport
  if (rect.top <= windowHeight && rect.bottom >= 0) {
    let progress = (windowHeight - rect.top) / (rect.height + windowHeight);
    progress = Math.max(0, Math.min(1, progress));

    const gap = 32;

    // Left column items
    const leftTop = document.querySelector('.left-col .parallax-down');
    const leftBottom = document.querySelector('.left-col .parallax-up');

    if (leftTop && leftBottom) {
      const moveLeftTop = (leftBottom.offsetHeight + gap) * 0.35; // slowed down to 35% for maximum elegance
      const moveLeftBottom = (leftTop.offsetHeight + gap) * 0.35;

      leftTop.style.transform = `translateY(${progress * moveLeftTop}px)`;
      leftBottom.style.transform = `translateY(-${progress * moveLeftBottom}px)`;
    }

    // Right column items
    const rightTop = document.querySelector('.right-col .parallax-down');
    const rightBottom = document.querySelector('.right-col .parallax-up');

    if (rightTop && rightBottom) {
      const moveRightTop = (rightBottom.offsetHeight + gap) * 0.35;
      const moveRightBottom = (rightTop.offsetHeight + gap) * 0.35;

      rightTop.style.transform = `translateY(${progress * moveRightTop}px)`;
      rightBottom.style.transform = `translateY(-${progress * moveRightBottom}px)`;
    }
  }
}

window.addEventListener('scroll', handleParallaxColumns);


/* --- FLOATING NAVIGATION HEADER BLEND STATE --- */
window.addEventListener('scroll', () => {
  const mainHeader = document.querySelector('.main-header');
  if (!mainHeader) return;

  // Add scroll class if scrolled past 50px
  if (window.scrollY > 50) {
    mainHeader.classList.add('scrolled');
  } else {
    // Only remove on home view, other active sections should keep background color
    const activeSection = document.querySelector('.spa-section.active');
    if (activeSection && activeSection.id === 'home') {
      mainHeader.classList.remove('scrolled');
    }
  }
});


/* --- STICKY STEPS CONTROLLER (Seção de Tratamentos) --- */
function isMobileLayout() {
  return window.matchMedia('(max-width: 1024px)').matches;
}

function handleStickySteps() {
  const section = document.querySelector('.home-2-fixed-section');
  if (!section) return;

  const steps = section.querySelectorAll('.home-2-step');
  const dots = section.querySelectorAll('.home-fixed-right-line-step');
  const total = steps.length;
  if (total === 0) return;

  // On mobile the steps are stacked — keep all visible, no scroll hijack
  if (isMobileLayout()) {
    steps.forEach(step => step.classList.add('is-active'));
    return;
  }

  const rect = section.getBoundingClientRect();
  const scrollableHeight = rect.height - window.innerHeight;
  if (scrollableHeight <= 0) return;

  let progress = -rect.top / scrollableHeight;
  progress = Math.max(0, Math.min(1, progress));

  let activeIndex = Math.floor(progress * total);
  activeIndex = Math.max(0, Math.min(total - 1, activeIndex));

  if (rect.top > 0) activeIndex = 0;
  if (rect.bottom < window.innerHeight) activeIndex = total - 1;

  steps.forEach((step, index) => {
    step.classList.toggle('is-active', index === activeIndex);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle('is-active', index === activeIndex);
  });
}

// Click to navigate steps
function initStickyStepsNavigation() {
  const section = document.querySelector('.home-2-fixed-section');
  if (!section) return;

  const dots = section.querySelectorAll('.home-fixed-right-line-step');
  const total = Math.max(section.querySelectorAll('.home-2-step').length, 1);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (isMobileLayout()) return;
      const rect = section.getBoundingClientRect();
      const sectionScrollTop = window.scrollY + rect.top;
      const scrollableHeight = rect.height - window.innerHeight;
      const last = Math.max(total - 1, 1);
      const targetScroll = sectionScrollTop + (index / last) * scrollableHeight;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    });
  });
}

// Bind events
window.addEventListener('scroll', () => {
  handleStickySteps();
  handlePremiumBanners();
});
window.addEventListener('resize', () => {
  handleStickySteps();
  handlePremiumBanners();
});

// Initialize click navigation when document is loaded
document.addEventListener('DOMContentLoaded', () => {
  initStickyStepsNavigation();
  handleStickySteps();
  
  initPremiumBannersNavigation();
  handlePremiumBanners();
});

/* --- PREMIUM STICKY BANNERS CONTROLLER --- */
function handlePremiumBanners() {
  const section = document.querySelector('.premium-sticky-section');
  if (!section) return;

  const steps = section.querySelectorAll('.premium-banner-step');
  const dots = section.querySelectorAll('.pb-dot');
  const total = steps.length;
  if (total === 0) return;

  // On mobile banners are stacked — show all
  if (isMobileLayout()) {
    steps.forEach(step => step.classList.add('is-active'));
    return;
  }

  const rect = section.getBoundingClientRect();
  const scrollableHeight = rect.height - window.innerHeight;
  if (scrollableHeight <= 0) return;

  let progress = -rect.top / scrollableHeight;
  progress = Math.max(0, Math.min(1, progress));

  let activeIndex = Math.floor(progress * total);
  activeIndex = Math.max(0, Math.min(total - 1, activeIndex));

  if (rect.top > 0) activeIndex = 0;
  if (rect.bottom < window.innerHeight) activeIndex = total - 1;

  steps.forEach((step, index) => {
    step.classList.toggle('is-active', index === activeIndex);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle('is-active', index === activeIndex);
  });
}

// Click to navigate premium banners
function initPremiumBannersNavigation() {
  const section = document.querySelector('.premium-sticky-section');
  if (!section) return;

  const dots = section.querySelectorAll('.pb-dot');
  const total = Math.max(section.querySelectorAll('.premium-banner-step').length, 1);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (isMobileLayout()) return;
      const rect = section.getBoundingClientRect();
      const sectionScrollTop = window.scrollY + rect.top;
      const scrollableHeight = rect.height - window.innerHeight;
      const last = Math.max(total - 1, 1);
      const targetScroll = sectionScrollTop + (index / last) * scrollableHeight;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    });
  });
}
