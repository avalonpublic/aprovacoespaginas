/* ===== CAROUSEL & INTERACTION CONTROLLER ===== */

/* --- SMOOTH HORIZONTAL CAROUSEL (Lerp Animation) --- */
let currentProgress = 0;
let targetProgress = 0;

function smoothCarouselScroll() {
  const section = document.getElementById('scroll-carousel');
  const track = document.getElementById('carousel-track');
  const items = document.querySelectorAll('.carousel-item');

  if (section && track && items.length > 0) {
    // Lerp smoothing formula: current += (target - current) * factor
    currentProgress += (targetProgress - currentProgress) * 0.08;
    
    const itemWidth = items[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 0;
    const maxTranslate = (itemWidth + gap) * (items.length - 1);

    // Apply smooth horizontal transform translation
    track.style.transform = `translateX(-${currentProgress * maxTranslate}px)`;

    // Zoom-in active slide, fade out others
    const activeIndex = Math.round(currentProgress * (items.length - 1));
    items.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
  
  requestAnimationFrame(smoothCarouselScroll);
}

// Request the smooth loop
requestAnimationFrame(smoothCarouselScroll);

// Scroll listener to update scroll targets
window.addEventListener('scroll', () => {
  const section = document.getElementById('scroll-carousel');
  const sideText = document.querySelector('.carousel-side-text');
  if (!section) return;

  const sectionTop = section.offsetTop;
  const sectionHeight = section.offsetHeight;
  const windowHeight = window.innerHeight;
  const scrollY = window.scrollY;

  // Verify boundaries
  if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight - windowHeight) {
    targetProgress = (scrollY - sectionTop) / (sectionHeight - windowHeight);
    
    // Hide side text when slide show starts
    if (sideText) {
      sideText.style.opacity = targetProgress > 0.1 ? "0" : "1";
    }
  } else if (scrollY < sectionTop) {
    targetProgress = 0;
    if (sideText) sideText.style.opacity = "1";
  } else if (scrollY > sectionTop + sectionHeight - windowHeight) {
    targetProgress = 1;
    if (sideText) sideText.style.opacity = "0";
  }
});


/* --- DAILY SKINCARE HORIZONTAL SECTION SCROLL --- */
window.addEventListener('scroll', () => {
  const hzSection = document.getElementById('daily-skincare-section');
  if (!hzSection) return;

  const track = document.getElementById('hz-track');
  const items = document.querySelectorAll('#hz-list .hz-product-item');
  
  const sectionTop = hzSection.offsetTop;
  const sectionHeight = hzSection.offsetHeight;
  const windowHeight = window.innerHeight;
  const scrollY = window.scrollY;

  if (scrollY >= sectionTop && scrollY <= sectionTop + sectionHeight - windowHeight) {
    const progress = (scrollY - sectionTop) / (sectionHeight - windowHeight);
    const activeIndex = Math.min(2, Math.floor(progress * 3));

    // Shift left side track (55vw width per item)
    if (track) {
      track.style.transform = `translateX(-${activeIndex * 55}vw)`;
    }

    // Highlight text link item on the right
    items.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
});


/* --- TESTIMONIALS AUTO-SLIDER --- */
(function autoSlideTestimonials() {
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('.indicator-dot');
  const slider = track ? track.closest('.testimonials-slider') : null;
  if (!track || !slider || dots.length === 0) return;

  let index = 0;
  let autoTimer;

  function getMaxTranslate() {
    return Math.max(0, track.scrollWidth - slider.clientWidth);
  }

  function goToTestimonial(nextIndex) {
    index = nextIndex;
    const maxTranslate = getMaxTranslate();
    const progress = dots.length > 1 ? index / (dots.length - 1) : 0;

    track.style.transform = `translateX(-${maxTranslate * progress}px)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function startAutoSlide() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      goToTestimonial((index + 1) % dots.length);
    }, 4000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToTestimonial(i);
      startAutoSlide();
    });
  });

  window.addEventListener('resize', () => goToTestimonial(index));

  goToTestimonial(0);
  startAutoSlide();
})();


/* --- SHOP PRODUCT FILTER ACTION --- */
document.querySelectorAll('.shop-filter-item').forEach(el => {
  el.addEventListener('click', function() {
    // Toggle active state
    document.querySelectorAll('.shop-filter-item').forEach(f => f.classList.remove('active'));
    this.classList.add('active');
    
    const category = this.textContent.trim().toLowerCase();
    
    // Hide/Show products
    document.querySelectorAll('.shop-card').forEach(card => {
      const sub = card.querySelector('.shop-card-sub').textContent.trim().toLowerCase();
      
      // Check Portuguese and English categories
      const isAll = (category === 'all' || category === 'todos');
      const isMoisturizer = (category === 'moisturizers' || category === 'hidratantes') && sub.includes('moisturizer');
      const isMask = (category === 'masks' || category === 'máscaras') && sub.includes('mask');
      const isCleanser = (category === 'cleansers' || category === 'limpeza') && (sub.includes('cleanse') || sub.includes('exfoliant'));
      const isSerum = (category === 'serums' || category === 'séruns') && sub.includes('serum');

      if (isAll || isMoisturizer || isMask || isCleanser || isSerum) {
        card.style.display = 'block';
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
      }
    });
  });
});

/* --- MODERN DRAGGABLE CAROUSEL LOGIC --- */
document.addEventListener('DOMContentLoaded', () => {
  const mTrack = document.getElementById('modern-track');
  const mPrevBtn = document.querySelector('.prev-btn');
  const mNextBtn = document.querySelector('.next-btn');

  if (mTrack) {
    let isDown = false;
    let startX;
    let scrollLeft;

    mTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      mTrack.style.scrollBehavior = 'auto'; // Disable smooth scroll to allow instant drag tracking
      startX = e.pageX - mTrack.offsetLeft;
      scrollLeft = mTrack.scrollLeft;
    });

    mTrack.addEventListener('mouseleave', () => {
      isDown = false;
    });

    mTrack.addEventListener('mouseup', () => {
      isDown = false;
    });

    mTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - mTrack.offsetLeft;
      const walk = (x - startX) * 1.5; // multiplier for drag sensitivity
      mTrack.scrollLeft = scrollLeft - walk;
    });

    // Arrow navigation
    if (mPrevBtn && mNextBtn) {
      mPrevBtn.addEventListener('click', () => {
        mTrack.style.scrollBehavior = 'smooth';
        mTrack.scrollBy({ left: -340, behavior: 'smooth' });
      });
      mNextBtn.addEventListener('click', () => {
        mTrack.style.scrollBehavior = 'smooth';
        mTrack.scrollBy({ left: 340, behavior: 'smooth' });
      });
    }
  }
});

