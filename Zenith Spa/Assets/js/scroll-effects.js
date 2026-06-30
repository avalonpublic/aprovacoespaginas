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
function handleStickySteps() {
  const section = document.querySelector('.home-2-fixed-section');
  if (!section) return;

  const rect = section.getBoundingClientRect();
  const steps = section.querySelectorAll('.home-2-step');
  const dots = section.querySelectorAll('.home-fixed-right-line-step');
  const scrollableHeight = rect.height - window.innerHeight;

  if (scrollableHeight <= 0) return;

  let progress = -rect.top / scrollableHeight;
  progress = Math.max(0, Math.min(1, progress));

  // Determine active step index (0 to 3)
  let activeIndex = Math.floor(progress * 4);
  activeIndex = Math.max(0, Math.min(3, activeIndex));

  // If section hasn't started yet, index is 0
  if (rect.top > 0) activeIndex = 0;
  // If section finished, index is 3
  if (rect.bottom < window.innerHeight) activeIndex = 3;

  steps.forEach((step, index) => {
    if (index === activeIndex) {
      step.classList.add('is-active');
    } else {
      step.classList.remove('is-active');
    }
  });

  dots.forEach((dot, index) => {
    if (index === activeIndex) {
      dot.classList.add('is-active');
    } else {
      dot.classList.remove('is-active');
    }
  });
}

// Click to navigate steps
function initStickyStepsNavigation() {
  const section = document.querySelector('.home-2-fixed-section');
  if (!section) return;

  const dots = section.querySelectorAll('.home-fixed-right-line-step');
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const rect = section.getBoundingClientRect();
      const sectionScrollTop = window.scrollY + rect.top;
      const scrollableHeight = rect.height - window.innerHeight;

      // target position: top of section + fraction of scrollable height
      const targetScroll = sectionScrollTop + (index / 3) * scrollableHeight;
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    });
  });
}

// Bind events
window.addEventListener('scroll', handleStickySteps);
window.addEventListener('resize', handleStickySteps);

// Initialize click navigation when document is loaded
document.addEventListener('DOMContentLoaded', () => {
  initStickyStepsNavigation();
  handleStickySteps();
});
